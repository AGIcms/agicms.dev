import { NextSeo } from 'next-seo'

export const Page401: React.FC = () => {
  return (
    <>
      <NextSeo noindex nofollow title="Access denied" />
      <h2>Access denied</h2>
    </>
  )
}
