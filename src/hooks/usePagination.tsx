import { useRouter } from 'next/router'
import { Pagination } from 'src/Pagination'

type usePageProps = {
  limit?: number
}

export function usePage({ limit = 10 }: usePageProps = {}) {
  const { query } = useRouter()

  const page =
    (query.page && typeof query.page === 'string' && parseInt(query.page)) || 0

  let skip: number | undefined

  if (page > 1) {
    skip = (page - 1) * limit
  }

  return { page, skip }
}

type usePaginationProps = {
  page: number
  total: number | undefined
  limit?: number
}

export function usePagination({
  limit = 10,
  total = 0,
  page,
}: usePaginationProps) {
  return {
    first: limit,
    page,
    pagination: <Pagination limit={limit} page={page} total={total} />,
  }
}
