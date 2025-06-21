import { useEffect } from 'react'
import {
  ActivityDocument,
  ActivityFragment,
  ActivitySubscription,
  ActivitySubscriptionVariables,
  UserFragment,
} from 'src/gql/generated'
import { ApolloClientNormolized } from 'src/pages/_App/interfaces'

export type useActivitiesSubscriptionProps = {
  currentUser: UserFragment | undefined | null
  client: ApolloClientNormolized
  variables: ActivitySubscriptionVariables
  onData?: (activity: ActivityFragment) => void
}

export function useActivitiesSubscription({
  currentUser,
  client,
  variables,
  onData,
}: useActivitiesSubscriptionProps) {
  const { globalEvents } = variables

  useEffect(() => {
    if (!currentUser) {
      return
    }

    const observable = client.subscribe<
      ActivitySubscription,
      ActivitySubscriptionVariables
    >({
      query: ActivityDocument,
      variables: {
        globalEvents,
      },
    })

    const subscription = observable.subscribe({
      next({ data }) {
        const activity = data?.activity

        if (activity) {
          onData?.(activity)
        }
      },
      error(err) {
        console.error('Subscription error:', err)
      },
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [globalEvents, client, currentUser, onData])
}
