import { NextSeo } from 'next-seo'

export const Page404: React.FC = () => {
  return (
    <>
      <NextSeo noindex nofollow title="Page not found" />
      <h2>Page not found</h2>
    </>
  )
}
