import { MindLogType } from '@prisma/client'
import { BaseAiTool, toolName } from '../interfaces'
import { createMindLog } from './helpers/createMindLog'

export interface CreateMindLogArgs {
  type: MindLogType
  data: string
  quality: number
  relatedToUserId?: string
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
          relatedToUserId: {
            type: 'string',
            description:
              'ID пользователя, в отношении которого создается майндлог. Если не указан, то знание считается глобальным и касается всех пользователей. Если знание индивидуальное',
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  handler: async (args, ctx, user) => {
    const { data, type, quality, relatedToUserId } = args

    return createMindLog({
      data: {
        data,
        type,
        quality,
        relatedToUserId,
      },
      ctx,
      user,
    }).then((mindLog) => {
      return `Сделана запись с id "${mindLog.id}"`
    })
  },
}
