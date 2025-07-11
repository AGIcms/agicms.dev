import { CompletionUsage } from 'openai/resources'
import { User } from '../../../../openaiClient/interfaces'
import { PrismaContext } from '../../../context'
import { createActivity } from '../../Activity/helpers/createActivity'
import { ActivityType } from '../../Activity/interfaces'
import { Prisma } from '@prisma/client'

type createMessageProps = {
  ctx: PrismaContext
  text: string
  fromUser: User
  toUser: User
  id?: string
  usage: CompletionUsage | undefined
}

export async function createMessage({
  ctx,
  text,
  fromUser,
  toUser,
  id,
  usage,
}: createMessageProps) {
  const { prisma } = ctx

  const message = await prisma.chatMessage.create({
    data: {
      id,
      text,
      createdBy: fromUser.id,
      toUserId: toUser.id,
      usage: usage as Prisma.InputJsonObject | undefined,
    },
  })

  createActivity({
    ctx,
    userId: fromUser.id,
    payload: {
      type: ActivityType.SendMessage,
      message,
    },
  })

  return message
}
