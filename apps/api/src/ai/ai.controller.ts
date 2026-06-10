import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AiService } from './ai.service';

class ChatMessageDto {
  @ApiProperty({ enum: ['user', 'assistant'] }) @IsString() role: 'user' | 'assistant';
  @ApiProperty() @IsString() content: string;
}

class ChatDto {
  @ApiProperty({ type: [ChatMessageDto] }) @IsArray() messages: ChatMessageDto[];
}

class SummarizeProjectDto {
  @ApiProperty() @IsUUID() projectId: string;
}

class GenerateStoriesDto {
  @ApiProperty() @IsString() feature: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string;
}

class DraftEmailDto {
  @ApiProperty() @IsUUID() clientId: string;
  @ApiProperty() @IsString() subject: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tone?: string;
}

class SprintPlanDto {
  @ApiProperty() @IsUUID() projectId: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() velocity?: number;
}

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'AI chat with tool use — can query portal data' })
  chat(@Body() dto: ChatDto) {
    return this.service.chat(dto.messages);
  }

  @Post('summarize-project')
  @ApiOperation({ summary: 'Generate AI project summary' })
  summarize(@Body() dto: SummarizeProjectDto) {
    return this.service.summarizeProject(dto.projectId);
  }

  @Post('generate-user-stories')
  @ApiOperation({ summary: 'Generate Agile user stories from feature description' })
  generateStories(@Body() dto: GenerateStoriesDto) {
    return this.service.generateUserStories(dto.feature, dto.projectId);
  }

  @Post('draft-email')
  @ApiOperation({ summary: 'Draft a client email' })
  draftEmail(@Body() dto: DraftEmailDto) {
    return this.service.draftEmail(dto);
  }

  @Post('generate-sprint-plan')
  @ApiOperation({ summary: 'Generate a sprint plan from project backlog' })
  generateSprintPlan(@Body() dto: SprintPlanDto) {
    return this.service.generateSprintPlan(dto.projectId, dto.velocity);
  }
}
