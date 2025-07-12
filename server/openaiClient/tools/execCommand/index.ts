import { exec } from 'child_process'
import { BaseAiTool, toolName } from '../interfaces'
import { createActivity } from '../../../nexus/types/Activity/helpers/createActivity'
import { ActivityType } from '../../../nexus/types/Activity/interfaces'

export interface GetUsersArgs {
  command: string
}

export type execCommand = BaseAiTool<typeof toolName.execCommand, GetUsersArgs>

export const execCommandTool: execCommand = {
  name: toolName.execCommand,
  definition: {
    type: 'function',
    function: {
      name: toolName.execCommand,
      description:
        'Выполняет любую доступную команду (программу) на уровне операционной системы',
      parameters: {
        type: 'object',
        properties: {
          command: {
            description: 'Инструкция на выполнение',
            type: 'string',
          },
        },
        required: ['command'],
      },
    },
  },
  handler: async (args, ctx, user) => {
    const { currentUser } = ctx

    if (!currentUser?.sudo) {
      throw new Error('Нет доступа')
    }

    const { command } = args

    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        let result: string

        if (error) {
          result = `Ошибка выполнения: ${error.message}`
        } else if (stderr) {
          return resolve(`Вывод stderr: ${stderr}`)
        } else {
          result = stdout || 'Команда выполнена успешно'
        }

        createActivity({
          ctx,
          userId: user.id,
          payload: {
            type: ActivityType.StdOut,
            StdOut: result,
            toUserId: null,
          },
        })

        resolve(result)
      })
    })
  },
}
