import React, { useEffect, useMemo, useState } from 'react'
import NextApp, { AppContext } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from 'styled-components'
import { theme } from 'src/theme'
import {
  AppInitialProps,
  PageProps,
  MainApp,
  NextPageContextCustom,
  AppProps,
} from './interfaces'

import { useApollo, initializeApollo } from 'src/gql/apolloClient'

import { Page401 } from '../_Error/401'
import { Page404 } from '../_Error/404'
import { ErrorPage } from '../_Error'
import { NextSeo, NextSeoProps } from 'next-seo'
import Head from 'next/head'

import { GlobalStyle } from 'src/theme/GlobalStyle'
import { Layout } from 'src/Layout'
import { useMeQuery } from 'src/gql/generated'
import { AppContextProvider } from 'src/AppContext'

const withWs = true

export const App: MainApp<AppProps> = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps.initialApolloState, withWs)

  const { data } = useMeQuery({
    client: apolloClient,
    ssr: false,
  })

  const user = data?.me

  const { statusCode } = pageProps

  const content = useMemo(() => {
    const meta: NextSeoProps = {}

    let content = null

    /**
     * Если получили серверную ошибку, выводим страницу ошибки
     */
    if (statusCode && statusCode !== 200) {
      switch (statusCode) {
        case 401:
        case 410:
          content = <Page401 />
          break
        case 404:
          content = <Page404 />
          break

        default:
          content = <ErrorPage statusCode={statusCode} />
      }
    } else {
      content = <Component {...pageProps} />
    }

    return (
      <>
        <NextSeo {...meta} />
        {content}
      </>
    )
  }, [statusCode, pageProps, Component])

  const template = (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>

      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ApolloProvider client={apolloClient}>
          <AppContextProvider user={user}>
            <Layout>{content}</Layout>
          </AppContextProvider>
        </ApolloProvider>
      </ThemeProvider>
    </>
  )

  const [inited, initedSetter] = useState(
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_SSR !== 'false'
      : true,
  )

  useEffect(() => {
    initedSetter(true)
  }, [inited])

  return inited ? template : null
}

App.getInitialProps = async (appContext: AppContext) => {
  /**
   * Для того, чтобы в итоге можно было собрать общий аполло-стейт
   * с приложения и далее выполняемый страниц и документа,
   * передаем аполло-клиент далее в контекст приложения.
   */
  const apolloClient = initializeApollo({
    withWs,
    appContext,
  })

  /**
   * Передаваемый далее в страницу контекст
   */
  const ctx: NextPageContextCustom = {
    ...appContext.ctx,
    apolloClient,
  }

  const newAppContext = {
    ...appContext,
    ctx,
  }

  /**
   * Здесь вызывается page.getInitialProps() и далее _document.getInitialProps()
   * Все собирается в конечный appProps
   */

  const { pageProps, ...otherProps } =
    await NextApp.getInitialProps(newAppContext)

  const { statusCode } = pageProps as PageProps

  /**
   * Если выполняется на серверной стороне
   */
  if (statusCode && newAppContext.ctx.res) {
    newAppContext.ctx.res.statusCode = statusCode
  }

  const newProps: AppInitialProps = {
    ...otherProps,
    pageProps: {
      ...pageProps,
      statusCode,
      initialApolloState: apolloClient.cache.extract(),
    },
  }

  return newProps
}
