import { PrismaContext } from '../../nexus/context'
import { toolName } from './interfaces'
import { tools } from '.'
import { ToolCall, User } from '../interfaces'
import { MindLogType } from '@prisma/client'
import { createActivity } from '../../nexus/types/Activity/helpers/createActivity'
import { ChatCompletionMessageParam } from 'openai/resources'
import { ActivityType } from '../../nexus/types/Activity/interfaces'

type handleToolCallProps = {
  ctx: PrismaContext
  user: User
  toolCall: ToolCall
  messages: ChatCompletionMessageParam[]
}

export async function handleToolCall({
  user,
  ctx,
  toolCall,
  messages,
}: handleToolCallProps): Promise<string | undefined> {
  const { name, arguments: argsString } = toolCall.function
  const args = JSON.parse(argsString)

  createActivity({
    ctx,
    userId: user.id,
    payload: {
      type: ActivityType.ToolCall,
      name,
      args,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('handleToolCall', name, JSON.stringify(args, null, 2))
  }

  try {
    const tool = tools[name as keyof typeof tools]

    if (tool) {
      return await tool.handler(args, ctx, user, messages)
    }

    if (Object.values<string>(MindLogType).includes(name)) {
      throw new Error(
        `Ошибка вызова несуществующего тулза ${name}. Если вы хотели записать MindLog, то следует вызывать тулзу ${toolName.createMindLog}`,
      )
    } else {
      throw new Error(`Ошибка: Неизвестный инструмент: ${name}`)
    }
  } catch (error) {
    throw new Error(
      `Ошибка: ${(error as Error | undefined)?.message || 'Неизвестная ошибка'}`,
    )
  }
}
