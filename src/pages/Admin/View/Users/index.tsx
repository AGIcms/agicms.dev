import { NextSeo } from 'next-seo'
import React from 'react'
import { SortOrder, useUsersConnectionQuery } from 'src/gql/generated'
import { usePage, usePagination } from 'src/hooks/usePagination'
import { AsminUsersViewTable } from './styles'
import { GridCell, GridRow } from 'src/Grid/styles'
import { UserLink } from 'src/Link/User'
import { MarkdownField } from 'src/MarkdownField'

export const AsminUsersView: React.FC = () => {
  const limit = 10

  const { page, skip } = usePage({ limit })

  const response = useUsersConnectionQuery({
    variables: {
      where: {
        intro: {
          not: {
            equals: '',
          },
        },
      },
      first: limit,
      orderBy: {
        createdAt: SortOrder.DESC,
      },
      skip,
    },
  })

  const { pagination } = usePagination({
    total: response.data?.usersCount,
    limit,
    page,
  })

  return (
    <>
      <NextSeo title="Пользователи" />

      <AsminUsersViewTable>
        {response.data?.users.map((n) => (
          <GridRow key={n.id}>
            <GridCell>
              <UserLink user={n} />
            </GridCell>

            <GridCell>{n.username}</GridCell>

            <GridCell>{n.fullname}</GridCell>
            <GridCell>
              {' '}
              <MarkdownField>{n.intro}</MarkdownField>
            </GridCell>
            <GridCell>
              {' '}
              <MarkdownField>{n.content}</MarkdownField>
            </GridCell>
            <GridCell>{null}</GridCell>
          </GridRow>
        ))}
      </AsminUsersViewTable>

      {pagination}
    </>
  )
}
