import { BaseAiTool, toolName } from '../interfaces'
import { sendMessage } from '../../../nexus/types/ChatMessage/helpers/sendMessage'

export interface SendMessageArgs {
  userId: string
  messageText: string
}

export type SendMessageTool = BaseAiTool<
  typeof toolName.sendMessage,
  SendMessageArgs
>

export const sendMessageTool: SendMessageTool = {
  name: toolName.sendMessage,
  definition: {
    type: 'function',
    function: {
      name: toolName.sendMessage,
      description: 'Отправить сообщение пользователю.',
      parameters: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description:
              'ID пользователя. Это именно UUID/ID, а не имя или что-то такое. Если известно только имя, надо сначала отдельной тулзой найти этого пользователя',
          },
          messageText: {
            type: 'string',
            description: 'Текст сообщения',
          },
        },
        required: ['userId', 'messageText'],
      },
    },
  },
  handler: async (args, ctx, user) => {
    const { userId, messageText } = args

    return await sendMessage({
      text: messageText,
      fromUser: user,
      toUserId: userId,
      ctx,
      withHistory: false,
    }).then((r) => JSON.stringify(r, null, 2))
  },
}
