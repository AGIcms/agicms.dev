import styled from 'styled-components'
import { TabSwitcherStyled } from 'src/TabSwitcher/styles'
import { css } from 'styled-components'
import { AiChatStyled } from 'src/Chat/styles'
import { TabType } from 'src/TabSwitcher/interfaces'

export const LayoutContentStyled = styled.div`
  flex: 1;
`

export const LayoutContentWrappeStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`

type LayoutMainContentStyledProps = {
  $activeTab: TabType
}

export const LayoutMainContentStyled = styled.div<LayoutMainContentStyledProps>`
  display: flex;
  flex-direction: column;
  overflow: auto;
`

export const ChatWrapperToggleVisibilityStyled = styled.button`
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  padding: 8px;
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex: none;
  font-size: 0;
  z-index: 1;

  svg {
    transition: transform 0.3s ease;
    width: 24px;
    height: 24px;
  }

  &:hover {
    background-color: #e0e0e0;
  }

  &[data-opened='false'] svg {
    transform: scaleX(-1);
  }
`

type ChatWrapperStyledProps = { $activeTab: TabType }

export const ChatWrapperStyled = styled.div<ChatWrapperStyledProps>`
  display: flex;
  flex-direction: column;
  position: relative;
`

type LayoutContentContainerStyledProps = {
  $slidePosition: number
  $chatTabOpened: boolean
}

export const LayoutContentContainerStyled = styled.div<LayoutContentContainerStyledProps>`
  /* Mobile-first: базовые стили для мобильных устройств в портретной ориентации */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'chat content';
  width: 300%;
  flex: 1;
  overflow: hidden;
  position: relative;
  transform: translateX(${(props) => props.$slidePosition}%);
  transition: transform 0.3s ease;
  /* touch-action: pan-x; */

  > * {
    height: 100%;
    min-height: 0;
    min-width: 0;
  }

  /* Стили для дочерних элементов на мобильных устройствах */
  ${ChatWrapperStyled} {
    grid-area: chat;
  }

  ${LayoutMainContentStyled} {
    grid-area: content;
  }

  ${ChatWrapperToggleVisibilityStyled} {
    display: none;
  }

  /* в ландшафтной ориентации */
  @media (orientation: landscape) {
    width: 100%; /* Возвращаем нормальную ширину */
    grid-template-areas: 'chat content';
    grid-template-columns: 30% auto;
    transform: none; /* Отключаем трансформацию */
    /* touch-action: auto;  */
    /* Возвращаем стандартные жесты */

    ${ChatWrapperStyled} {
      border-right: 1px solid #ddd;
    }

    ${ChatWrapperToggleVisibilityStyled} {
      display: flex;
    }

    ${({ $chatTabOpened }) =>
      $chatTabOpened === false &&
      css`
        grid-template-columns: 40px auto;

        ${AiChatStyled} {
          display: none;
        }
      `}
  }
`

export const LayoutStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (orientation: landscape) {
    ${TabSwitcherStyled} {
      display: none;
    }
  }
`
// ${LayoutFooterStyled} {
//   display: none;
// }

// ${LayoutFooterStyled} {
//   display: flex;
// }
