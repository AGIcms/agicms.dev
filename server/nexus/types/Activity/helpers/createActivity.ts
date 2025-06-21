import { ChatMessage, MindLog, User } from '@prisma/client'
import { PrismaContext } from '../../../context'
import { PUBSUB_TYPE } from '../../../../PubSub/interfaces'
import {
  NexusGenInterfaces,
  NexusGenRootTypes,
} from 'server/nexus/generated/nexus'
import { ActivityType } from '../interfaces'
import { generateId } from '../../../../helpers/generateId'

type createActivityProps = {
  ctx: PrismaContext
  userId: string
  payload:
    | {
        type: typeof ActivityType.UrlChanged
        url: string
      }
    | {
        type: typeof ActivityType.UserCreated
        user: User
      }
    | {
        type: typeof ActivityType.SendMessaged
        message: ChatMessage
      }
    | {
        type: typeof ActivityType.MindLog
        MindLog: MindLog
      }
    | ({
        type: typeof ActivityType.ToolCall
      } & Pick<NexusGenRootTypes['ActivityToolCall'], 'name' | 'args'>)
}

export function createActivity({
  ctx,
  userId,
  payload,
}: createActivityProps): void {
  let activity: NexusGenInterfaces['Activity']

  const commonFields = {
    type: payload.type,
    id: generateId(),
    userId,
    createdAt: new Date(),
  }

  switch (payload.type) {
    case ActivityType.UrlChanged:
      activity = {
        ...commonFields,
        url: '/???',
      }

      break

    case ActivityType.SendMessaged:
      activity = {
        ...commonFields,
        ChatMessage: payload.message,
      }

      break

    case ActivityType.UserCreated:
      activity = {
        ...commonFields,
        User: payload.user,
      }

      break

    case ActivityType.MindLog:
      activity = {
        ...commonFields,
        MindLog: payload.MindLog,
      }

      break

    case ActivityType.ToolCall:
      activity = {
        ...commonFields,
        ...payload,
      }

      break
  }

  ctx.pubsub.publish(PUBSUB_TYPE.ACTIVITY_ADDED, activity)
}
