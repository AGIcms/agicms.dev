import styled from 'styled-components'

export const AiChatInputStyled = styled.textarea`
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  min-height: 150px;
  height: 30%;
  resize: vertical;
  border: none;
  background: none;
`

export const AiChatSubmitStyled = styled.button`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-color: #4285f4;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  position: relative;
  overflow: hidden;
  font-size: 0;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#4285f4' : '#3367d6')};
    transform: ${(props) => (props.disabled ? 'none' : 'scale(1.05)')};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'scale(0.95)')};
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    display: ${(props) => (props.disabled ? 'block' : 'none')};
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    from {
      left: -100%;
    }
    to {
      left: 100%;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    display: block;
  }
`

export const ChatMessageFormStyled = styled.form`
  display: flex;
  align-items: center;
  background-color: rgb(238, 238, 238);

  ${AiChatInputStyled} {
    flex: 1;
  }
`
