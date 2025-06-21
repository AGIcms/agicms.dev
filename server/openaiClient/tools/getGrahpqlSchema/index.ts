import { readFileSync } from 'fs'
import { BaseAiTool, toolName } from '../interfaces'
import { resolve } from 'path'

export interface GetUsersArgs {}
export type getGrahpQlSchema = BaseAiTool<
  typeof toolName.getGrahpQlSchema,
  GetUsersArgs
>

export const getGrahpQlSchemaTool: getGrahpQlSchema = {
  name: toolName.getGrahpQlSchema,
  definition: {
    type: 'function',
    function: {
      name: toolName.getGrahpQlSchema,
      description:
        'Получает схему для локального апи. Использователь можно только по прямому указанию суперпользователя',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  handler: async () => {
    return readFileSync(
      resolve(process.cwd(), 'server/nexus/generated/schema.graphql'),
    ).toString()
  },
}
