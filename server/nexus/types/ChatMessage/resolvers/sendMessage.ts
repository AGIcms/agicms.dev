import { FieldResolver } from 'nexus'
import { sendMessage } from '../helpers/sendMessage'

export const sendMessageResolver: FieldResolver<
  'Mutation',
  'sendMessage'
> = async (_, args, ctx) => {
  const { toUserId, text } = args.data

  const { currentUser } = ctx

  if (!currentUser) {
    throw new Error('Not authorized')
  }

  return sendMessage({
    ctx,
    fromUser: currentUser,
    text,
    toUserId,
    withHistory: undefined,
  })
}
