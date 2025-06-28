import { BaseAiTool, toolName } from '../interfaces'
import { cleanupMessagesHistory } from './helpers/cleanupMessagesHistory'

export interface summarizeContextArgs {
  summary: string
}

export type summarizeContextTool = BaseAiTool<
  typeof toolName.summarizeContext,
  summarizeContextArgs
>

export const summarizeContextTool: summarizeContextTool = {
  name: toolName.summarizeContext,
  definition: {
    type: 'function',
    function: {
      name: toolName.summarizeContext,
      description: `Очищает историю переписки от устаревших данных инструментов. Используй, если в истории накопилось много вызовов тулзов с данными, которые уже не нужны. Передай краткое саммари, чтобы сохранить суть. История сообщений пользователя и ассистента сохраняется, только замещается устаревший технический контекст.
Важно! Эту тулзу нельзя вызывать одновременно с другими тулзами в массиве! Только отдельным запросом.`,
      parameters: {
        type: 'object',
        properties: {
          summary: {
            type: 'string',
            description:
              'Выжимка информации из удаляемых вызовов инструментов.',
          },
        },
        required: ['summary'],
      },
    },
  },
  handler: async (args, _ctx, _user, messages) => {
    const { summary } = args

    cleanupMessagesHistory(messages, false)

    return summary
  },
}
