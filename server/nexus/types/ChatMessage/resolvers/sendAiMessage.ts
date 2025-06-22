import { FieldResolver } from 'nexus'
import { ChatCompletionMessageParam } from 'openai/resources/index'
import { getAiUser } from '../../../../openaiClient/helpers/getAiUser'
import { sendAiMessage } from '../helpers/sendAiMessage'
import { createMessage } from '../helpers/createMessage'
import { createToken } from '../../User/resolvers/helpers'

export const sendAiMessageResolver: FieldResolver<
  'Mutation',
  'sendAiMessage'
> = async (_, args, ctx) => {
  const { id, text, withHistory } = args.data

  const { currentUser, prisma } = ctx

  let fromUser = currentUser

  let token: string | undefined = undefined

  if (!fromUser) {
    const count = await prisma.user.count({
      where: {
        type: 'Human',
      },
    })

    let sudo = false

    if (count === 0) {
      sudo = true
    }

    fromUser = await prisma.user.create({
      data: {
        sudo,
      },
    })

    token = await createToken(fromUser, ctx)
  }

  const toUser = await getAiUser({ ctx })

  const message = await createMessage({
    ctx,
    fromUser,
    toUser,
    text,
    id: id ?? undefined,
    usage: undefined,
  })

  const messages: ChatCompletionMessageParam[] = []

  const aiMessage: ChatCompletionMessageParam = {
    role: 'user',
    content: message.text,
  }

  messages.push({
    role: 'system',
    content: `id сообщения пользователя (messageId): ${message.id}`,
  })

  messages.push(aiMessage)

  /**
   * Отправляем параллельно, чтобы не ждать ответа агента.
   * То отправит параллельно через веб-сокет
   */
  const chatMessage = await sendAiMessage({
    ctx,
    fromUser,
    withHistory,
    messages,
    toUser,
  })

  return {
    ChatMessage: chatMessage ?? undefined,
    token: token ?? undefined,
  }
}
