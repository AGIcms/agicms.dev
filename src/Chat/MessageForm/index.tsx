import React, { useCallback, useRef } from 'react'
import {
  ChatMessageFormStyled,
  AiChatSubmitStyled,
  AiChatInputStyled,
} from './styles'
// import { useChat } from '../hooks/useChat'
import { useAppContext } from 'src/AppContext'
// import { AppActions } from 'src/AppContext/reducer/interfaces'
import { useChat } from '../hooks/useChat'

export const ChatMessageForm: React.FC = ({ ...other }) => {
  // const { text, textSetter, onSubmit, loading: inRequest } = useChat()

  const { appState } = useAppContext()

  const { chatInRequest } = appState

  const { text, textSetter, sendChatMessage } = useChat()

  const inRequest = chatInRequest

  // const textSetter = useCallback(
  //   (text: string) => {
  //     appDispatch({
  //       type: AppActions.SetChatText,
  //       text,
  //     })
  //   },
  //   [appDispatch]
  // )

  const onSubmit = useCallback<React.FormEventHandler>(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      // appDispatch({
      //   type: AppActions.SendChatMessage,
      //   text,
      // })

      sendChatMessage()
    },
    [sendChatMessage],
  )

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      textSetter(event.currentTarget.value)
    },
    [textSetter],
  )

  const submitRef = useRef<HTMLButtonElement | null>(null)

  // Обработчик нажатия Ctrl+Enter для отправки сообщения
  const handleKeyDown = useCallback<React.KeyboardEventHandler>((event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      event.stopPropagation()
      submitRef.current?.click()
    }
  }, [])

  return (
    <ChatMessageFormStyled onSubmit={onSubmit} {...other}>
      <AiChatInputStyled
        value={text}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type message"
      />
      <AiChatSubmitStyled type="submit" disabled={inRequest} ref={submitRef}>
        {inRequest ? (
          <span className="loading-icon">...</span>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 12l7.5 7.5 2.5-2.5-3.5-3.5H22v-3H8.5L12 7l-2.5-2.5L2 12z"
              fill="currentColor"
              transform="rotate(180 12 12)"
            />
          </svg>
        )}
      </AiChatSubmitStyled>
    </ChatMessageFormStyled>
  )
}
