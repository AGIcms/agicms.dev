import { FieldResolver } from 'nexus'
import { getAiUser } from '../../../../openaiClient/helpers/getAiUser'
import { createToken } from '../../User/resolvers/helpers/createToken'
import { sendMessage } from '../helpers/sendMessage'

export const sendAiMessageResolver: FieldResolver<
  'Mutation',
  'sendAiMessage'
> = async (_, args, ctx) => {
  const { id, text, withHistory, currentUrl } = args.data

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

  const chatMessage = await sendMessage({
    id,
    ctx,
    fromUser,
    text,
    toUserId: toUser.id,
    withHistory,
    currentUrl,
  })

  return {
    ChatMessage: chatMessage ?? undefined,
    token: token ?? undefined,
  }
}
