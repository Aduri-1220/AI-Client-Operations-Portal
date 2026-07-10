import { Injectable, Logger } from '@nestjs/common';

/**
 * WorkflowsService — emits domain events to n8n webhook workflows.
 *
 * Design decisions (be ready to explain these in the interview):
 * 1. FIRE-AND-FORGET: emit() is intentionally not awaited by callers.
 *    A slow or down n8n must never delay or fail an API response —
 *    workflow automation is a side effect, not part of the transaction.
 * 2. TIMEOUT: every attempt is capped with AbortSignal.timeout so a
 *    hung n8n can't leak sockets or pile up pending promises.
 * 3. RETRY WITH BACKOFF + JITTER: transient failures (n8n restarting,
 *    network blip) are retried a bounded number of times. Jitter avoids
 *    thundering-herd retries if many events fail at once.
 * 4. NEVER THROWS: failures are logged, not propagated. Upgrade path:
 *    push events onto a BullMQ queue instead, so delivery survives API
 *    restarts and gets a dead-letter queue (at-least-once delivery).
 */
@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  // In docker-compose the n8n container is reachable at http://n8n:5678.
  // n8n exposes each Webhook node at /webhook/<path>.
  private readonly baseUrl =
    process.env.N8N_WEBHOOK_BASE_URL || 'http://n8n:5678/webhook';

  private readonly maxAttempts = 3;
  private readonly timeoutMs = 5_000;

  /**
   * Emit a domain event to the matching n8n workflow.
   * @param event   webhook path of the n8n Webhook node, e.g. 'client-created'
   * @param payload JSON body the workflow will receive as $json
   */
  emit(event: string, payload: Record<string, unknown>): void {
    // Deliberately not awaited by callers — run in the background.
    void this.deliver(event, payload).catch(() => {
      /* deliver() already logs; swallow to guarantee no unhandled rejection */
    });
  }

  private async deliver(event: string, payload: Record<string, unknown>) {
    const url = `${this.baseUrl}/${event}`;

    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(this.timeoutMs),
        });

        if (res.ok) {
          this.logger.log(`Workflow event '${event}' delivered (attempt ${attempt})`);
          return;
        }

        // 4xx = our payload/config is wrong — retrying won't help.
        if (res.status >= 400 && res.status < 500) {
          this.logger.error(
            `Workflow event '${event}' rejected with ${res.status} — not retrying`,
          );
          return;
        }

        this.logger.warn(
          `Workflow event '${event}' got ${res.status} (attempt ${attempt}/${this.maxAttempts})`,
        );
      } catch (err) {
        this.logger.warn(
          `Workflow event '${event}' failed (attempt ${attempt}/${this.maxAttempts}): ${
            (err as Error).message
          }`,
        );
      }

      if (attempt < this.maxAttempts) {
        // Exponential backoff with jitter: ~500ms, ~1s, (capped growth)
        const backoff = 2 ** (attempt - 1) * 500 + Math.random() * 250;
        await new Promise((r) => setTimeout(r, backoff));
      }
    }

    this.logger.error(
      `Workflow event '${event}' dropped after ${this.maxAttempts} attempts. ` +
        `Payload: ${JSON.stringify(payload).slice(0, 300)}`,
    );
  }
}
