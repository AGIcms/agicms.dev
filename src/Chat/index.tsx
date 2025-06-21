import React, { useEffect, useRef } from 'react'
import { AiChatContentWrapperStyled, AiChatStyled } from './styles'
import { AiMessageItem } from './Message'
import { ChatMessageForm } from './MessageForm'
import { useAppContext } from 'src/AppContext'

type AiChatProps = {
  //
}

export const AiChat: React.FC<AiChatProps> = ({ ...other }) => {
  const {
    appState: { chatMessages: messages },
    user,
  } = useAppContext()

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = messagesContainerRef.current

    if (!container) {
      return
    }

    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      })
    }, 100)
  }, [messages])

  return (
    <AiChatStyled {...other}>
      <AiChatContentWrapperStyled ref={messagesContainerRef}>
        {messages.map((n) => (
          <AiMessageItem
            key={n.id}
            message={n}
            currentUser={user ?? undefined}
          />
        ))}
      </AiChatContentWrapperStyled>

      <ChatMessageForm />
    </AiChatStyled>
  )
}
