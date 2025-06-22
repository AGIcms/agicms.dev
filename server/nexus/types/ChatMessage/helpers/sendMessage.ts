import { User } from '@prisma/client'
import { PrismaContext } from 'server/nexus/context'
import { createMessage } from './createMessage'

type sendMessageProps = {
  ctx: PrismaContext
  fromUser: User
  toUserId: string
  text: string
}

export async function sendMessage({
  ctx,
  fromUser,
  toUserId,
  text,
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
    usage: undefined,
  })

  return message
}
