import { User } from '@prisma/client'
import { PrismaContext } from 'server/nexus/context'
import { createMessage } from './createMessage'
import { sendAiMessage } from '../../../../openaiClient/sendAiMessage'
import { ChatCompletionMessageParam } from 'openai/resources'

type sendMessageProps = {
  ctx: PrismaContext
  fromUser: User
  toUserId: string
  text: string
  withHistory: boolean | undefined
  id?: string | null
  currentUrl?: string | null
  filesIds?: string[] | null
}

export async function sendMessage({
  ctx,
  fromUser,
  toUserId,
  text,
  withHistory,
  id,
  currentUrl,
  filesIds,
}: sendMessageProps) {
  const { prisma } = ctx

  const toUser = await prisma.user.findUnique({
    where: {
      id: toUserId,
    },
  })

  if (!toUser) {
    throw new Error('Can not get target user')
  }

  const message = await createMessage({
    ctx,
    fromUser,
    toUser,
    text,
    id: id ?? undefined,
    usage: undefined,
  })

  if (toUser.type === 'AI') {
    const messages: ChatCompletionMessageParam[] = []

    const aiMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: message.text,
    }

    messages.push({
      role: 'system',
      content: `id сообщения пользователя (messageId): ${message.id}`,
    })

    if (currentUrl) {
      messages.push({
        role: 'system',
        content: `Текущий УРЛ страницы пользователя: ${currentUrl}`,
      })
    }

    if (filesIds?.length) {
      messages.push({
        role: 'system',
        content: `Пользователем были загружены файлы с этими ID: ${filesIds.join(
          ', ',
        )}`,
      })
    }

    messages.push(aiMessage)

    return sendAiMessage({
      ctx,
      fromUser,
      withHistory: withHistory ?? false,
      messages,
      toUser,
    })
  }

  return message
}
