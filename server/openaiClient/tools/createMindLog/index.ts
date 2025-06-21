import { MindLogType } from '@prisma/client'
import { BaseAiTool, toolName } from '../interfaces'
import { createActivity } from '../../../nexus/types/Activity/helpers/createActivity'
import { ActivityType } from '../../../nexus/types/Activity/interfaces'

export interface CreateMindLogArgs {
  type: MindLogType
  data: string
  quality: number
}

export type CreateMindLogTool = BaseAiTool<
  typeof toolName.createMindLog,
  CreateMindLogArgs
>

export const createMindLogTool: CreateMindLogTool = {
  name: toolName.createMindLog,
  definition: {
    type: 'function',
    function: {
      name: toolName.createMindLog,
      description:
        'Создает запись в лог мышления (MindLog) с определенным типом MindLogType и содержанием',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: Object.values(MindLogType),
            description: 'Тип записи в лог мышления',
          },
          data: {
            type: 'string',
            description: 'Содержание записи в лог мышления. Формат markdown',
          },
          quality: {
            type: 'number',
            description: 'Оценка качества мысли/действия/результата от 0 до 1',
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  handler: async (args, ctx, user) => {
    const { data, type, quality } = args

    return ctx.prisma.mindLog
      .create({
        data: {
          data,
          type,
          quality,
          createdById: user.id,
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

        return `Сделана запись с id "${mindLog.id}"`
      })
  },
}
