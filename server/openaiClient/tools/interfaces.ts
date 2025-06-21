import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat'
import { PrismaContext } from '../../nexus/context'
import { User } from '../interfaces'

export enum toolName {
  createMindLog = 'createMindLog',
  sendMessage = 'sendMessage',
  GetCurrentUser = 'GetCurrentUser',
  getUserMessages = 'getUserMessages',
  summarizeContext = 'summarizeContext',
  updateSystemPrompt = 'updateSystemPrompt',
  getGrahpQlSchema = 'getGrahpQlSchema',
  execGrahpqlQuery = 'execGrahpqlQuery',
}

export type ToolHandler<T> = (
  args: T,
  ctx: PrismaContext,
  user: User,
  messages: ChatCompletionMessageParam[],
) => Promise<string | undefined>

export interface BaseAiTool<N extends keyof typeof toolName, A = unknown> {
  name: N
  definition: ChatCompletionTool & {
    function: ChatCompletionTool['function'] & {
      name: N
      description: string
      parameters: {
        type: string
        properties: Record<keyof A, unknown>
        required: Array<keyof A>
      }
    }
  }
  handler: ToolHandler<A>
}
