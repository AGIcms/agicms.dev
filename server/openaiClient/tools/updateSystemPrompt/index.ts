import { BaseAiTool, toolName } from '../interfaces'
import { AiAgentUserData } from 'server/openaiClient/interfaces'

export interface updateSystemPromptArgs {
  prompt: string
}

export type updateSystemPromptTool = BaseAiTool<
  typeof toolName.updateSystemPrompt,
  updateSystemPromptArgs
>

export const updateSystemPromptTool: updateSystemPromptTool = {
  name: toolName.updateSystemPrompt,
  definition: {
    type: 'function',
    function: {
      name: toolName.updateSystemPrompt,
      description:
        'Обновляет твой системный промпт. Функция доступна только суперпользователю',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description:
              'Системный промпт на замену текущему, в формате маркдаун, но оптимизированный под ИИ',
          },
        },
        required: ['prompt'],
      },
    },
  },
  handler: async (args, ctx, user, messages) => {
    const { currentUser, prisma } = ctx

    if (!currentUser?.sudo) {
      throw new Error('Ошибка доступа')
    }

    if (user.type !== 'AI') {
      throw new Error('Промпт можно менять только у ИИ агента')
    }

    const { prompt } = args

    const data = user.data as Partial<AiAgentUserData> | undefined

    const { endpoint, model, ...other } = data || {}

    if (!endpoint || !model) {
      throw new Error('Некорректные текущие данные пользователя')
    }

    const userData: AiAgentUserData = {
      ...other,
      endpoint,
      model,
      systemPrompt: prompt,
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        data: userData,
      },
    })

    const systemMessage = messages.at(0)

    if (systemMessage?.role === 'system') {
      systemMessage.content = prompt
    }

    return `Системный промпт успешно обновлен.
    
${prompt}`
  },
}
