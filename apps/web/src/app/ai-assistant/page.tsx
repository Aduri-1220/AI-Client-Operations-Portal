'use client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { aiService } from '@/services/ai';
import type { ChatMessage } from '@/types';

const SUGGESTED_PROMPTS = [
  'Summarize the E-Commerce Platform project',
  'Generate 5 user stories for the approval workflow',
  'Which tasks are overdue?',
  'Create a sprint plan for next 2 weeks',
  'Draft a status update email for Acme Corp',
  'Identify risks in the CRM Integration project',
];

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `I'm your AI assistant for the Client Operations Portal. I can help you:

- **Summarize projects** — get live status updates on any project
- **Generate user stories** — create Agile-ready stories from feature descriptions
- **Find overdue tasks** — identify bottlenecks across all projects
- **Plan sprints** — suggest sprint backlog based on team velocity
- **Draft emails** — compose professional client communications
- **Identify risks** — analyze project timelines and flag potential issues

What would you like help with today?`,
  timestamp: new Date().toISOString(),
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      // Send full conversation excluding the static welcome message
      const history = nextMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const data = await aiService.chat(history);

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '⚠️ Could not reach the AI service. Make sure the API server is running and ANTHROPIC_API_KEY is set.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="AI Assistant" />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'justify-end')}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={cn(
                  'max-w-2xl rounded-xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'assistant'
                    ? 'bg-white border border-gray-200 text-gray-800'
                    : 'bg-blue-600 text-white'
                )}>
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
                        li: ({ children }) => <li className="text-sm">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        h1: ({ children }) => <h1 className="text-base font-bold mb-1 mt-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-bold mb-1 mt-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-1">{children}</h3>,
                        code: ({ children }) => <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-xs">{children}</code>,
                        pre: ({ children }) => <pre className="bg-gray-100 rounded p-2 overflow-x-auto text-xs mb-2">{children}</pre>,
                        table: ({ children }) => <div className="overflow-x-auto mb-2"><table className="text-xs border-collapse w-full">{children}</table></div>,
                        th: ({ children }) => <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-semibold">{children}</th>,
                        td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-gray-300 pl-3 italic text-gray-600 mb-2">{children}</blockquote>,
                        hr: () => <hr className="my-2 border-gray-200" />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask anything about your clients, projects, or tasks..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="w-64 border-l border-gray-200 bg-gray-50 p-4 hidden xl:block">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700">Suggested Prompts</h3>
          </div>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map(prompt => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="w-full text-left text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-blue-300 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>

          <Card className="mt-6 p-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">AI Tools Available</p>
            <ul className="space-y-1">
              {['searchClients', 'getProjectDetails', 'createTask', 'getOverdueTasks'].map(tool => (
                <li key={tool} className="text-xs text-gray-500 font-mono bg-gray-50 rounded px-2 py-0.5">{tool}()</li>
              ))}
            </ul>
          </Card>

          <div className="mt-4 flex items-start gap-1.5 text-xs text-gray-400">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>Requires ANTHROPIC_API_KEY in API environment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
