import { createToken } from '../../../nexus/types/User/resolvers/helpers/createToken'
import { BaseAiTool, toolName } from '../interfaces'

export interface GetUsersArgs {}

export type createUserToken = BaseAiTool<
  typeof toolName.createUserToken,
  GetUsersArgs
>

export const createUserTokenTool: createUserToken = {
  name: toolName.createUserToken,
  definition: {
    type: 'function',
    function: {
      name: toolName.createUserToken,
      description:
        'Создает токен доступа для текущего пользователя. Разрешено создавать только по прямому запросу авторизованного пользователя',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  handler: async (_args, ctx) => {
    const { currentUser } = ctx

    if (!currentUser) {
      throw new Error('Пользователь не авторизован')
    }

    return createToken(currentUser, ctx)
  },
}
