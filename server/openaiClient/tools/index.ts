import { createMindLogTool } from './createMindLog'
import { sendMessageTool } from './sendMessage'
import { GetCurrentUserTool } from './GetCurrentUser'
import { summarizeContextTool } from './summarizeContext'
import { updateSystemPromptTool } from './updateSystemPrompt'
import { getGrahpQlSchemaTool } from './getGrahpqlSchema'
import { execGrahpqlQueryTool } from './execGrahpqlQuery'

export const tools = {
  [createMindLogTool.name]: createMindLogTool,
  [sendMessageTool.name]: sendMessageTool,
  [GetCurrentUserTool.name]: GetCurrentUserTool,
  [summarizeContextTool.name]: summarizeContextTool,
  [updateSystemPromptTool.name]: updateSystemPromptTool,
  [getGrahpQlSchemaTool.name]: getGrahpQlSchemaTool,
  [execGrahpqlQueryTool.name]: execGrahpqlQueryTool,
} as const
