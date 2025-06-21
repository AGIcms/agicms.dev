/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react'
import { SendAiMessageInput, useSendAiMessageMutation } from 'src/gql/generated'
import { AppActions } from 'src/AppContext/reducer/interfaces'
import { useAppContext } from 'src/AppContext'
import { createId } from 'src/helpers/createId'
import { useApolloClient } from '@apollo/client'

export function useChat() {
  const { user: currentUser, appState, appDispatch } = useAppContext()

  const { chatMessages } = appState

  const [text, textSetter] = useState('')

  const [sendMessageMutation, { loading }] = useSendAiMessageMutation()

  const client = useApolloClient()

  useEffect(() => {
    console.log('useEffect client', client)
  }, [client])

  const sendChatMessage = useCallback(() => {
    // if (!currentUser) {
    //   console.error('Не был получен пользователь')
    //   return
    // }

    textSetter((text) => {
      // Проверяем, что текст не пустой
      if (text) {
        const messageId = createId()

        const data: SendAiMessageInput = {
          text,
          withHistory: true,
          id: messageId,
        }

        appDispatch({
          type: AppActions.ChatAddMessage,
          message: {
            ...data,
            id: messageId,
            createdBy: currentUser?.id,
            createdAt: new Date(),
          },
        })

        appDispatch({
          type: AppActions.ChatSetInRequest,
          chatInRequest: true,
        })

        // Делаем запрос на сервер
        sendMessageMutation({
          variables: {
            data,
          },
        })
          .then(async (r) => {
            const { sendAiMessage } = r.data || {}

            if (sendAiMessage) {
              const { token, ChatMessage } = sendAiMessage

              if (token) {
                localStorage?.setItem('token', token)

                await client.resetStore().catch(console.error)
              }

              if (ChatMessage) {
                // Отправляем сообщение (пока без ответа)
                appDispatch({
                  type: AppActions.ChatAddMessage,
                  message: ChatMessage,
                })
              }
            }
          })
          .catch((error) => {
            console.error('Error sending message:', error)
            // TODO Fix alert
            alert((error as Error)?.message || 'Unknown error')
          })
          .finally(() => {
            appDispatch({
              type: AppActions.ChatSetInRequest,
              chatInRequest: false,
            })
          })
      }

      return ''
    })
  }, [appDispatch, sendMessageMutation, currentUser, client])

  return {
    messages: chatMessages,
    loading,
    text,
    textSetter,
    sendChatMessage,
  }
}
