import { ChatCompletionMessageParam } from 'openai/resources/chat'
import { PrismaContext } from '../../nexus/context'
import { tools } from '../tools'
import { processToolCalls } from '../tools/processToolCalls'

import { User } from '../interfaces'
import { openaiClient } from '..'
import { createMessage } from '../../nexus/types/ChatMessage/helpers/createMessage'
import { ChatMessage } from '@prisma/client'

const openAiTools = Object.values(tools).map((n) => n.definition)

export interface OpenAIRequestResponse {
  message: string
  quality: number
  history?: ChatCompletionMessageParam[] // Добавляем историю для отладки
}

type sendOpenAiRequestProps = {
  ctx: PrismaContext
  messages: ChatCompletionMessageParam[]

  fromUser: User
  toUser: User
}

export async function sendOpenAiRequest({
  ctx,
  fromUser,
  toUser,
  messages,
}: sendOpenAiRequestProps): Promise<ChatMessage | undefined> {
  let model: string | undefined = undefined

  if (
    toUser.data &&
    typeof toUser.data === 'object' &&
    'model' in toUser.data &&
    typeof toUser.data.model === 'string'
  ) {
    model = toUser.data.model
  }

  if (!model) {
    throw new Error('model is empty')
  }

  // if (process.env.NODE_ENV === 'development') {
  //   // eslint-disable-next-line no-console
  //   console.log('sendOpenAiRequest messages', JSON.stringify(messages, null, 2))
  // }

  try {
    // Отправляем запрос к OpenAI
    const completion = await openaiClient.chat.completions.create({
      model,
      messages,
      tools: openAiTools,
      tool_choice: 'auto',
      parallel_tool_calls: true,
      max_completion_tokens: 20000,
    })

    const responseMessage = completion.choices[0].message

    const usage = completion.usage

    messages.push(responseMessage)

    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      await processToolCalls({
        context: ctx,
        user: toUser,
        toolCalls: responseMessage.tool_calls,
        messages,
      })

      return sendOpenAiRequest({
        ctx,
        messages,
        fromUser,
        toUser,
      })
    }

    const content = responseMessage.content || undefined

    if (content) {
      return await createMessage({
        ctx,
        text: content,
        /**
         * Тут меняем отправителя и получателя, так как ответ идет от агента к пользователю
         */
        fromUser: toUser,
        toUser: fromUser,
        usage,
      })
    }

    return undefined
  } catch (error) {
    console.error(error)

    const errorMessage = error instanceof Error ? error.message : String(error)

    throw new Error(`Произошла ошибка при обработке: ${errorMessage}`)
  }
}
