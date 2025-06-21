import React from 'react'

import Link from 'next/link'

import URI from 'urijs'
import { useRouter } from 'next/router'
import { PaginationStyled } from './styles'

type PaginationProps = {
  pagevariable?: string

  page: number

  limit: number | null | undefined

  total: number

  rowProps?: any

  style?: any
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  // static contextType = Context

  // static defaultProps = {
  //   pagevariable: 'page',
  // }

  const router = useRouter()

  const { limit, total, rowProps, pagevariable = 'page', ...other } = props

  const getNewLocation = (page: number) => {
    const asPath = router.asPath

    const uri = new URI(asPath)

    const query = uri.query(true)

    Object.assign(query, {
      [pagevariable]: page > 1 ? page : undefined,
    })

    uri.query(query)

    return uri.resource()
  }

  const getPage = () => {
    const {
      // pagevariable,
      page,
    } = props

    // const page = props[pagevariable];

    return page || 1
  }

  const page = getPage()

  if (!page || !limit || !total) {
    return null
  }

  const pages = Math.ceil(total / limit)

  if (pages < 2) {
    return null
  }

  const rows = []

  if (page > 1) {
    // var href = getNewLocation(1);

    const href = getNewLocation(page - 1)

    rows.push(
      <li key="page-1-0" className={'controlClass'}>
        <Link href={href} className={'linkClass'}>
          «
        </Link>
      </li>,
    )
  }

  let lstr = false
  let rstr = false
  for (let i = 1; i <= pages; i++) {
    if (
      (page > 2 && i < page - 1 && i > 1) ||
      (pages - page > 3 && i > page + 1 && i < pages - 1)
    ) {
      if (!lstr && i > 1 && i < page) {
        rows.push(
          <li key={i} className={'controlClass'}>
            <span>...</span>
          </li>,
        )
        lstr = true
      }
      if (!rstr && i > page && i < pages) {
        rows.push(
          <li key={i} className={'controlClass'}>
            <span>...</span>
          </li>,
        )
        rstr = true
      }
    } else {
      const href = getNewLocation(i)

      rows.push(
        <li key={i} className={'controlClass'}>
          <Link
            href={href}
            className={['linkClass', i === page ? 'activeClass' : null].join(
              ' ',
            )}
          >
            {i}
          </Link>
        </li>,
      )
    }
  }
  if (page < pages) {
    const href = getNewLocation(page + 1)

    rows.push(
      <li key={'page-' + pages + '-0'} className={'controlClass'}>
        <Link href={href} className={'linkClass'}>
          »
        </Link>
      </li>,
    )
  }

  return (
    <PaginationStyled {...other}>
      <ul className={'rowClass'} {...rowProps}>
        {rows}
      </ul>
    </PaginationStyled>
  )
}
