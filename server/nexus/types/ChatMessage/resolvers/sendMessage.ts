import { FieldResolver } from 'nexus'
import { sendMessage } from '../helpers/sendMessage'
import { createToken } from '../../User/resolvers/helpers/createToken'

export const sendMessageResolver: FieldResolver<
  'Mutation',
  'sendMessage'
> = async (_, args, ctx) => {
  const { toUserId, text, withHistory } = args.data

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

  const chatMessage = await sendMessage({
    ctx,
    fromUser,
    text,
    toUserId,
    withHistory: withHistory ?? false,
  })

  return {
    ChatMessage: chatMessage ?? undefined,
    token: token ?? undefined,
  }
}
