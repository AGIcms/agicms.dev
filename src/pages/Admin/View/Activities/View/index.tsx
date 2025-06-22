import { useActivitiesSubscription } from 'src/AppContext/hooks/useActivitiesSubscription'
import { ActivitiesViewStyled, ActivitiesViewTable } from './styles'
import { useCallback, useState } from 'react'
import { useAppContext } from 'src/AppContext'
import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client'
import { ActivityFragment } from 'src/gql/generated'
import { ActivityMessage } from './Message'
import { GridCell, GridRow } from 'src/Grid/styles'
import { ActivityUser } from './User'

export const ActivitiesView: React.FC = () => {
  const { user } = useAppContext()

  const client = useApolloClient()

  const [activities, activitiesSetter] = useState<ActivityFragment[]>([])

  const onData = useCallback((activity: ActivityFragment) => {
    activitiesSetter((prev) => [...prev, activity])
  }, [])

  useActivitiesSubscription({
    currentUser: user,
    variables: {
      globalEvents: true,
    },
    onData,
    client: client as unknown as ApolloClient<NormalizedCacheObject>,
  })

  return (
    <ActivitiesViewStyled>
      <ActivitiesViewTable>
        {activities.map((n) => {
          let title: string
          let dataContent: React.ReactNode = null
          let additionalData: React.ReactNode = null

          switch (n.__typename) {
            case 'ActivityUser':
              title = 'Новый пользователь'
              break

            case 'ActivityUrl':
              title = 'Изменен УРЛ'
              break

            case 'ActivityMessage': {
              title = 'Сообщение'

              dataContent = <ActivityMessage message={n.ChatMessage} />

              additionalData = n.ChatMessage.usage ? (
                <pre>{JSON.stringify(n.ChatMessage.usage, null, 2)}</pre>
              ) : null

              break
            }

            case 'ActivityMindLog':
              title = 'MindLog'

              dataContent = (
                <>
                  <h3>{n.MindLog.type}</h3>

                  {n.MindLog.data}
                </>
              )

              break

            case 'ActivityToolCall':
              title = 'Tool call'

              dataContent = (
                <pre>
                  {JSON.stringify(
                    {
                      name: n.name,
                      args: n.args,
                    },
                    null,
                    2,
                  )}
                </pre>
              )

              break

            case 'ActivityStdOut':
              title = 'StdOut'

              dataContent = <pre>{n.StdOut}</pre>

              break

            default:
              title = 'Unknown'
              console.error('unknown type', n.__typename)
          }

          return (
            <GridRow key={n.id}>
              <GridCell>
                <ActivityUser userId={n.userId} /> <span>{n.userId}</span>
              </GridCell>
              <GridCell>{title}</GridCell>
              <GridCell>{n.createdAt.toString()}</GridCell>
              <GridCell>{dataContent}</GridCell>
              <GridCell>{additionalData}</GridCell>
            </GridRow>
          )
        })}
      </ActivitiesViewTable>
    </ActivitiesViewStyled>
  )
}
