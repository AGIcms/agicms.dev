import { useApolloClient } from '@apollo/client'
import React, { Dispatch, useCallback, useMemo } from 'react'

import { MeQuery } from 'src/gql/generated'
import { ApolloClientNormolized } from 'src/pages/_App/interfaces'

import { useAppReducer } from './reducer'
import { AppAction, AppActions, AppState } from './reducer/interfaces'
import {
  useActivitiesSubscription,
  useActivitiesSubscriptionProps,
} from './hooks/useActivitiesSubscription'

export type AppContextValue = {
  user: MeQuery['me']

  appDispatch: Dispatch<AppAction>
  appState: AppState
}

export const Context = React.createContext<AppContextValue | null>(null)

type AppContextProviderProps = React.PropsWithChildren<{
  user: AppContextValue['user']
}>

/**
 * Вообще есть более глобальный контекст, но этот мне тоже нужен
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  user,
  children,
}) => {
  const apolloClient = useApolloClient()

  const { state: appState, dispatch: appDispatch } = useAppReducer()

  const onData = useCallback<
    NonNullable<useActivitiesSubscriptionProps['onData']>
  >(
    (activity) => {
      switch (activity.__typename) {
        case 'ActivityMessage':
          appDispatch({
            type: AppActions.ChatAddMessage,
            message: activity.ChatMessage,
          })
          break
      }
    },
    [appDispatch],
  )

  useActivitiesSubscription({
    currentUser: user,
    client: apolloClient as ApolloClientNormolized,
    variables: {
      globalEvents: false,
    },
    onData,
  })

  const context = useMemo<AppContextValue>(() => {
    return {
      user,
      appDispatch,
      appState,
    }
  }, [appDispatch, appState, user])

  return <Context.Provider value={context}>{children}</Context.Provider>
}

export const useAppContext = () => {
  const context = React.useContext(Context)

  if (!context) {
    throw new Error('Please, provide AppContextProvider')
  }

  return context
}
