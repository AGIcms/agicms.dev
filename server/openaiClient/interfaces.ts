import { User as PrismaUser } from '@prisma/client'

export type AiAgentUserData = {
  model: string
  endpoint: string
  systemPrompt?: string
}

export type User = PrismaUser

interface ToolCallFunction {
  name: string
  arguments: string
}

export interface ToolCall {
  id: string
  type: 'function'
  function: ToolCallFunction
}

export type AiAgentData = {
  username: string
  model: string
  allowTools: boolean | null | undefined
  maxTokens: number | null | undefined
}

export const AiAgents: AiAgentData[] = [
  {
    username: 'ai-main--gpt-4.1-2025-04-14',
    model: 'gpt-4.1-2025-04-14',
    allowTools: true,
    maxTokens: 20000,
  },
]
