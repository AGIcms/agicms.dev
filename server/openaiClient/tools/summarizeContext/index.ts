import { BaseAiTool, toolName } from '../interfaces'

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

    /**
     * Важно! Не удаляем последнее сообщение, потому что в нем указано какая тулза
     * выполняется и важно его оставлять, иначе все сломается.
     */
    for (let i = messages.length - 2; i >= 0; i--) {
      const msg = messages[i]

      if (
        msg.role === 'tool' ||
        msg.role === 'function' ||
        (msg.role === 'assistant' && msg.tool_calls)
      ) {
        messages.splice(i, 1)
      }
    }

    return summary
  },
}
