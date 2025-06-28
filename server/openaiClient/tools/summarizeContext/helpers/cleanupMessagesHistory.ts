import { ChatCompletionMessageParam } from 'openai/resources'

export function cleanupMessagesHistory(
  messages: ChatCompletionMessageParam[],
  /**
   * Важно! Если вызывается в тулзе, то не удаляем последнее сообщение, потому что в нем указано какая тулза
   * выполняется и важно его оставлять, иначе все сломается.
   */
  withLastMessage: boolean,

  /**
   * Отдельный массив автоматически вычищаемых сообщений
   */
  otherCleanupableMessages?: ChatCompletionMessageParam[],
) {
  for (let i = messages.length - (withLastMessage ? 1 : 2); i >= 0; i--) {
    const msg = messages[i]

    if (
      msg.role === 'tool' ||
      msg.role === 'function' ||
      (msg.role === 'assistant' && msg.tool_calls) ||
      (otherCleanupableMessages?.length &&
        otherCleanupableMessages.includes(msg))
    ) {
      messages.splice(i, 1)
    }
  }

  return messages
}
