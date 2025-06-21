import React from 'react'
import { useUserQuery } from 'src/gql/generated'
import { UserLink } from 'src/Link/User'

export type ActivityMessageProps = {
  userId: string
}

export const ActivityUser: React.FC<ActivityMessageProps> = ({ userId }) => {
  const response = useUserQuery({
    variables: {
      where: {
        id: userId,
      },
    },
  })

  const user = response.data?.object

  return <>{user && <UserLink user={user} />}</>
}
