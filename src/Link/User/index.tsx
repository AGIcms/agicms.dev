import Link, { LinkProps } from 'next/link'
import React from 'react'
import { UserNoNestingFragment } from 'src/gql/generated'

export function createUserLink(user: UserNoNestingFragment): string {
  const { id } = user

  return `/users/${id}`
}

type UserLinkProps = React.PropsWithChildren<
  Omit<LinkProps, 'href'> & {
    user: UserNoNestingFragment
  }
>

export const UserLink: React.FC<UserLinkProps> = ({
  user,
  children,
  ...other
}) => {
  const { id, username, fullname } = user

  const name = fullname || username

  const href = createUserLink(user)

  return (
    <Link key={id} {...other} title={name || undefined} href={href}>
      {children ?? name}
    </Link>
  )
}
