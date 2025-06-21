import styled from 'styled-components'
import { ChatMessageFormStyled } from './MessageForm/styles'

export const AiChatContentWrapperStyled = styled.div`
  padding: 30px 10px;
  display: flex;
  flex-direction: column;
  gap: 30px;
`

export const AiChatStyled = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;

  ${AiChatContentWrapperStyled} {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  ${ChatMessageFormStyled} {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    background-color: #eee;
    flex-shrink: 0;
  }
`
