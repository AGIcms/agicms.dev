import { PrismaContext } from 'server/nexus/context'

import { sendOpenAiRequest } from './processOpenAIRequest'

import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { ChatMessage, User } from '@prisma/client'
import { AiAgentUserData } from './interfaces'

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

  const isFirstConversation = messages.length === 0

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

  if (isFirstConversation) {
    messages.push({
      role: 'system',
      content: `## Информация о пользователе:
      
${JSON.stringify(fromUser, null, 2)}`,
    })

    messages.push({
      role: 'assistant',
      content: `Мой ID пользователя (Agend user id): ${toUser.id}`,
    })

    /**
     * Получаем все текущие знания
     */
    await ctx.prisma.mindLog
      .findMany({
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          AND: [
            {
              createdById: toUser.id,
              type: 'Knowledge',
              quality: {
                gte: 0.5,
              },
            },
            {
              OR: [
                {
                  relatedToUserId: null,
                },
                {
                  relatedToUserId: fromUser.id,
                },
              ],
            },
          ],
        },
      })
      .then((r) => {
        if (r.length > 0) {
          messages.push({
            role: 'assistant',
            content: `## Мои текущие знания
        
          ${JSON.stringify(r, null, 2)}
`,
          })
        }
      })
      .catch(console.error)
  }

  messages.push({
    role: 'system',
    content: `Текущее системное время: ${new Date().toISOString()}`,
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
