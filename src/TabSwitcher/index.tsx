import React, { useMemo } from 'react'
import { TabButtonStyled, TabSwitcherStyled } from './styles'
import { MainLayoutTabs } from './interfaces'
import { useAppTabSwitcher } from './hooks/useAppTabSwitcher'

interface TabSwitcherProps {
  hasNewMessages?: boolean // Флаг наличия новых сообщений
}

/**
 * Компонент для переключения между чатом и сайтом на мобильных устройствах
 */
const TabSwitcher: React.FC<TabSwitcherProps> = ({
  // TODO Надо будет доработать. Стили есть, надо только пробростиь флаг
  hasNewMessages: _hasNewMessages = false,
  ...other
}) => {
  const { handleTabChange, activeTab } = useAppTabSwitcher()

  const onClickTab = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      const value = event.currentTarget.value

      if (value in MainLayoutTabs) {
        handleTabChange(value as keyof typeof MainLayoutTabs)
      }
    },
    [handleTabChange],
  )

  const tabs = useMemo(() => {
    return Object.keys(MainLayoutTabs).map((n) => {
      const key = n as keyof typeof MainLayoutTabs

      return (
        <TabButtonStyled
          key={key}
          value={key}
          $active={activeTab === key}
          onClick={onClickTab}
        >
          {MainLayoutTabs[key].title}
        </TabButtonStyled>
      )
    })
  }, [activeTab, onClickTab])

  return <TabSwitcherStyled {...other}>{tabs}</TabSwitcherStyled>
}

export default TabSwitcher
