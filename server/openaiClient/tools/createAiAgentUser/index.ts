import { BaseAiTool, toolName } from '../interfaces'
import { createAiUser } from '../../helpers/createAiUser'
import { AiAgentData } from 'server/openaiClient/interfaces'

export type createAiAgentUserArgs = AiAgentData

export type createAiAgentUserTool = BaseAiTool<
  typeof toolName.createAiAgentUser,
  createAiAgentUserArgs
>

export const createAiAgentUserTool: createAiAgentUserTool = {
  name: toolName.createAiAgentUser,
  definition: {
    type: 'function',
    function: {
      name: toolName.createAiAgentUser,
      description: `Тулза для создания ИИ пользователя. Доступна только суперпользователю`,
      parameters: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: '',
          },
          model: {
            type: 'string',
            description: 'Название модели',
          },
          allowTools: {
            type: 'boolean',
            description:
              'Флаг можно ли модели использовать тулзы. Можно устанавливать только тем моделям, которые умеют работать с тулзами',
          },
          maxTokens: {
            type: 'number',
            description:
              'Какой разрешенный лимит токенов при выполнении. Не должно превышать пределов, допустимых в самой модели',
          },
        },
        required: ['username', 'model'],
      },
    },
  },
  handler: async (args, ctx) => {
    const { currentUser } = ctx

    if (!currentUser?.sudo) {
      return 'У пользователя нет доступа к этой функции'
    }

    const { model, username, allowTools, maxTokens } = args

    const user = await createAiUser({
      data: {
        model,
        username,
        allowTools,
        maxTokens,
      },
      ctx,
    })

    return JSON.stringify(user, null, 2)
  },
}
