import React, { useCallback } from 'react'
import {
  LayoutContentStyled,
  LayoutContentWrappeStyled,
  LayoutStyled,
  LayoutMainContentStyled,
  ChatWrapperStyled,
  LayoutContentContainerStyled,
  ChatWrapperToggleVisibilityStyled,
} from './styles'
import TabSwitcher from 'src/TabSwitcher'
import { useAppTabSwitcher } from 'src/TabSwitcher/hooks/useAppTabSwitcher'
import dynamic from 'next/dynamic'
import { useAppContext } from 'src/AppContext'
import { AppActions } from 'src/AppContext/reducer/interfaces'

const AiChat = dynamic(() => import('src/Chat').then((r) => r.AiChat), {
  ssr: false,
})

type LayoutProps = React.PropsWithChildren

export const Layout: React.FC<LayoutProps> = ({ children, ...other }) => {
  const { activeTab } = useAppTabSwitcher()

  const { appState, appDispatch } = useAppContext()

  const { slidePosition } = appState

  const { chatTabOpened } = appState

  const toggleChatTabVisibility = useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      appDispatch({
        type: AppActions.ToggleChatTab,
      })
    },
    [appDispatch],
  )

  return (
    <>
      <LayoutStyled {...other}>
        <LayoutContentWrappeStyled>
          <LayoutContentContainerStyled
            $slidePosition={slidePosition}
            $chatTabOpened={chatTabOpened}
            // {...swipeHandlers}
          >
            <ChatWrapperStyled $activeTab={activeTab}>
              <ChatWrapperToggleVisibilityStyled
                onClick={toggleChatTabVisibility}
                type="button"
                aria-label={chatTabOpened ? 'Скрыть чат' : 'Показать чат'}
                data-opened={chatTabOpened}
              >
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path
                    d="M10 4L6 8L10 12"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </ChatWrapperToggleVisibilityStyled>

              <AiChat />
            </ChatWrapperStyled>

            <LayoutMainContentStyled $activeTab={activeTab}>
              <LayoutContentStyled>{children}</LayoutContentStyled>
            </LayoutMainContentStyled>
          </LayoutContentContainerStyled>
        </LayoutContentWrappeStyled>

        <TabSwitcher />
      </LayoutStyled>
    </>
  )
}
