import { PrismaContext } from 'server/nexus/context'

import { sendOpenAiRequest } from '../../../../openaiClient/processOpenAIRequest'

import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { ChatMessage, User } from '@prisma/client'
import { AiAgentUserData } from '../../../../openaiClient/interfaces'

/**
 * Временное решение для сохранения текущей истории сообщений между пользователями и ИИ
 */
export const messagesHistory = new Map<string, ChatCompletionMessageParam[]>()

type sendAiMessageProps = {
  ctx: PrismaContext
  messages: ChatCompletionMessageParam[]
  withHistory: boolean
  fromUser: User
  toUser: User
}

export const sendAiMessage = async ({
  ctx,
  messages: messagesProps,
  withHistory,
  fromUser,
  toUser,
}: sendAiMessageProps): Promise<ChatMessage | null> => {
  const historyKey = [fromUser.id, toUser.id].join(',')

  const aiUserData = toUser.data as AiAgentUserData | undefined

  const messages = (withHistory && messagesHistory.get(historyKey)) || []

  if (!messagesHistory.has(historyKey) && withHistory) {
    messagesHistory.set(historyKey, messages)
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('sendMessage messagesHistory.size', messagesHistory.size)
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('sendMessage userMessagesHistory.length', messages.length)
  }

  const systemPrompt = aiUserData?.systemPrompt

  if (systemPrompt) {
    const firstMessage = messages.at(0)

    if (firstMessage?.role !== 'system') {
      messages.unshift({ role: 'system', content: systemPrompt })
    } else {
      firstMessage.content = systemPrompt
    }
  }

  messages.push({
    role: 'system',
    content: `ID пользователя (userId): ${fromUser.id}`,
  })

  messages.push(...messagesProps)

  const aiAgentResponse = await sendOpenAiRequest({
    ctx,
    fromUser,
    toUser,
    messages,
  })

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('messages', messages)
  }

  return aiAgentResponse ?? null
}
