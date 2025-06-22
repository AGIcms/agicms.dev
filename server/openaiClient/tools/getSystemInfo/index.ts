import { BaseAiTool, toolName } from '../interfaces'
import { resolve } from 'path'

export interface GetUsersArgs {}
export type getSystemInfo = BaseAiTool<
  typeof toolName.getSystemInfo,
  GetUsersArgs
>

export const getSystemInfo: getSystemInfo = {
  name: toolName.getSystemInfo,
  definition: {
    type: 'function',
    function: {
      name: toolName.getSystemInfo,
      description: `Эта тулза предназначена только для самого ИИ-агента и результат ее выполнения нельзя показывать никому.
        Исключение - суперпользователь sudo`,
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  handler: async () => {
    const rootDir = process.cwd()

    const dataDir = resolve(rootDir, 'server/openaiClient/data')

    const info = {
      appDir: {
        description: 'Корневая папка приложения',
        path: rootDir,
      },
      dataDir: {
        description:
          'Папка в файловой системе, куда ИИ может складывать всю нужную ему информацию (файлы, срипты, массивные данные и т.п.)',
        path: dataDir,
      },
    }

    return JSON.stringify(info, null, 2)
  },
}
