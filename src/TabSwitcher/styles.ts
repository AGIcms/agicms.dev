import styled from 'styled-components'

type TabButtonStyledProps = {
  $active?: boolean
  $hasNewMessages?: boolean
}

export const TabButtonStyled = styled.button<TabButtonStyledProps>`
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: none;
  background-color: ${(props) => (props.$active ? '#f0f0f0' : '#fff')};
  color: ${(props) => (props.$active ? '#333' : '#777')};
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  /* Стили для индикатора новых сообщений */
  position: relative;

  &::after {
    content: '';
    display: ${(props) => (props.$hasNewMessages ? 'block' : 'none')};
    position: absolute;
    top: 8px;
    right: 8px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ff3b30; /* Яркий красный цвет для привлечения внимания */
    animation: pulse 1.5s infinite; /* Пульсирующая анимация */
  }

  /* Анимация пульсации */
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 5px rgba(255, 59, 48, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
    }
  }
`

export const TabSwitcherStyled = styled.div`
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #ddd;

  display: flex;
`
