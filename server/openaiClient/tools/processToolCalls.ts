import {
  ChatCompletionMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources/chat'
import { handleToolCall } from './handleToolCall'
import { PrismaContext } from '../../nexus/context'
import { ToolCall, User } from '../interfaces'

type processToolCallsProps = {
  context: PrismaContext
  toolCalls: ToolCall[]
  messages: ChatCompletionMessageParam[]

  user: User
}

export async function processToolCalls({
  user,
  context,
  messages,
  toolCalls,
}: processToolCallsProps) {
  for (const toolCall of toolCalls) {
    const result: ChatCompletionToolMessageParam = await handleToolCall({
      toolCall,
      ctx: context,
      user,
      messages,
    })
      .then((r) => {
        return {
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: r ?? '',
        }
      })
      .catch((error) => {
        console.error(error)

        let errorMessage = 'Неизвестная ошибка'

        if (error instanceof Error) {
          errorMessage = error.message || errorMessage

          if (error.stack) {
            errorMessage = errorMessage + `\n\n## Stack ${error.stack}`
          }
        }

        return {
          role: 'tool' as const,
          tool_call_id: toolCall.id,
          content: `Во время выполнения возникла ошибка: ${errorMessage}`,
        }
      })

    messages.push(result)
  }
}
