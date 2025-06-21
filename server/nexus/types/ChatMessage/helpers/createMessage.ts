import { User } from '../../../../openaiClient/interfaces'
import { PrismaContext } from '../../../context'
import { createActivity } from '../../Activity/helpers/createActivity'
import { ActivityType } from '../../Activity/interfaces'

type createMessageProps = {
  ctx: PrismaContext
  text: string
  fromUser: User
  toUser: User
  id?: string
}

export async function createMessage({
  ctx,
  text,
  fromUser,
  toUser,
  id,
}: createMessageProps) {
  const { prisma } = ctx

  const message = await prisma.chatMessage.create({
    data: {
      id,
      text,
      createdBy: fromUser.id,
      toUserId: toUser.id,
    },
  })

  createActivity({
    ctx,
    userId: fromUser.id,
    payload: {
      type: ActivityType.SendMessaged,
      message,
    },
  })

  return message
}
