import { MindLogType, User } from '@prisma/client'
import { createActivity } from '../../../../nexus/types/Activity/helpers/createActivity'
import { ActivityType } from '../../../../nexus/types/Activity/interfaces'
import { PrismaContext } from 'server/nexus/context'
import { formatMindLog } from './formatMindLog'

type createMindLogProps = {
  data: {
    type: MindLogType
    data: string
    quality: number
    relatedToUserId?: string
  }
  ctx: PrismaContext
  user: User
}

export async function createMindLog({
  data: { data, type, quality, relatedToUserId },
  ctx,
  user,
}: createMindLogProps) {
  return ctx.prisma.mindLog
    .create({
      data: {
        data,
        type,
        quality,
        createdById: user.id,
        relatedToUserId,
      },
    })
    .then((mindLog) => {
      createActivity({
        ctx,
        userId: user.id,
        payload: {
          type: ActivityType.MindLog,
          MindLog: mindLog,
        },
      })

      return formatMindLog(mindLog)
    })
}
