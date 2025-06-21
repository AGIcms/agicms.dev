import { BaseAiTool, toolName } from '../interfaces'
import { execute, parse } from 'graphql'
import { schema } from '../../../nexus'
import { PrismaContext } from '../../../nexus/context'
import { createApolloContext } from '../../../nexus/createApolloContext'

enum execGrahpqlQueryExecutor {
  CurrentUser = 'CurrentUser',
  AiAgent = 'AiAgent',
}

export interface GetUsersArgs {
  query: string
  variables?: Record<string, unknown>
  executor: execGrahpqlQueryExecutor
}

export type execGrahpqlQuery = BaseAiTool<
  typeof toolName.execGrahpqlQuery,
  GetUsersArgs
>

export const execGrahpqlQueryTool: execGrahpqlQuery = {
  name: toolName.execGrahpqlQuery,
  definition: {
    type: 'function',
    function: {
      name: toolName.execGrahpqlQuery,
      description:
        'Выполняет запрос к локальному АПИ. Можно пользоваться при любом удобном случае. Выполняется от твоего имени, а не от имени пользователя. Вызов от имени пользователя будет реализован чуть позже.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            description: 'gql запрос',
            type: 'string',
          },
          variables: {
            description: 'Объект параметров запроса',
            type: 'object',
          },
          executor: {
            description: `От чьего имени выполняется запрос. По-умолчанию запросы должны выполняться от имени самого агента.
- ${execGrahpqlQueryExecutor.CurrentUser} - Текущий пользователь, взаимодействующий с агентом.
- ${execGrahpqlQueryExecutor.AiAgent} - сам ИИ-Агент.
            `,
            type: 'string',
            enum: Object.values(execGrahpqlQueryExecutor),
          },
        },
        required: ['query', 'executor'],
      },
    },
  },
  handler: async (args, ctx, user) => {
    const { query, variables, executor } = args

    let contextValue: PrismaContext

    if (executor === execGrahpqlQueryExecutor.AiAgent) {
      contextValue = await createApolloContext({
        type: 'ai',
        currentUser: user,
        req: undefined,
      })
    } else {
      contextValue = ctx
    }

    let result = execute({
      schema: schema,
      document: parse(query),
      variableValues: variables,
      contextValue,
    })

    if (result instanceof Promise) {
      result = await result.catch((error) => {
        console.error(error)

        return error
      })
    }

    return !result
      ? 'Не был получен результат'
      : typeof result === 'string'
        ? result
        : JSON.stringify(result, null, 2)
  },
}
