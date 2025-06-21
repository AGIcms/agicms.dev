import { useReducer } from 'react'
import { AppActions, AppReducer, AppState } from './interfaces'
import { MainLayoutTabs } from 'src/TabSwitcher/interfaces'

const reducer: AppReducer = (state, action) => {
  switch (action.type) {
    case AppActions.ChatAddMessage:
      {
        /**
         * У нас по вебсокету могут прилететь сообщения, которые уже есть в стейте. Пропускаем их
         */
        if (
          state.chatMessages.findIndex((n) => n.id === action.message.id) === -1
        ) {
          state = {
            ...state,
            chatMessages: [...state.chatMessages, action.message],
            // При отправке сообщения автоматически переключаемся на чат
            activeTab: 'chat',
            chatTabOpened: true,
            slidePosition: MainLayoutTabs.chat.position,
          }
        }
      }
      break

    case AppActions.ChatSetInRequest:
      {
        state = {
          ...state,
          chatInRequest: action.chatInRequest,
        }
      }
      break
    case AppActions.ToggleChatTab:
      state = {
        ...state,
        chatTabOpened: !state.chatTabOpened,
      }
      break
    case AppActions.ChangeTab:
      state = {
        ...state,
        activeTab: action.tab,
        slidePosition: MainLayoutTabs[action.tab].position,
      }
      break
    case AppActions.SetSlidePosition:
      state = {
        ...state,
        slidePosition: action.position,
      }
      break
  }

  return state
}

const initialState: AppState = {
  chatMessages: [],
  chatInRequest: false,
  activeTab: 'site',
  chatTabOpened: true,
  slidePosition: MainLayoutTabs.site.position,
}

export function useAppReducer() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return { state, dispatch }
}
