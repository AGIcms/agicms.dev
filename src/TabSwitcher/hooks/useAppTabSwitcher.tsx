import React from 'react'
import { TabType } from '../interfaces'
import { useRouter } from 'next/router'
import { useAppContext } from 'src/AppContext'
import { AppActions } from 'src/AppContext/reducer/interfaces'

export function useAppTabSwitcher() {
  const router = useRouter()
  const { appState, appDispatch } = useAppContext()
  const { activeTab, slidePosition } = appState

  // При изменении URL переключаемся на сайт
  React.useEffect(() => {
    appDispatch({
      type: AppActions.ChangeTab,
      tab: 'site',
    })
  }, [router, appDispatch])

  const handleTabChange = React.useCallback(
    (tab: TabType) => {
      appDispatch({
        type: AppActions.ChangeTab,
        tab,
      })
    },
    [appDispatch],
  )

  return {
    handleTabChange,
    slidePosition,
    activeTab,
  }
}
