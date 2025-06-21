import { NextSeo } from 'next-seo'
import { Page } from '../_App/interfaces'
import { useAppContext } from 'src/AppContext'
import { AdminView } from './View'

export const AdminPage: Page = () => {
  const { user } = useAppContext()

  return (
    <>
      <NextSeo title="Admin" noindex nofollow />

      {user?.sudo && <AdminView />}
    </>
  )
}
