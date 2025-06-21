import React, { useMemo } from 'react'

import { Page } from '../_App/interfaces'
import { NextSeo } from 'next-seo'

export const MainPage: Page = () => {
  return useMemo(
    () => (
      <>
        <NextSeo title="agicms.dev" description="" />
      </>
    ),
    [],
  )
}
