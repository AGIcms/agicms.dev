import { createUploadLink } from 'apollo-upload-client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { OperationDefinitionNode } from 'graphql'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  from,
  split,
} from '@apollo/client'

import { typePolicies } from './typePolicies'
import { createApolloClientProps } from './interfaces'
import { IncomingHttpHeaders } from 'http'

export * from './interfaces'

let wsLink: GraphQLWsLink | undefined

function getEndpoint() {
  let endpoint
  const origin = global.location?.origin

  if (origin && process.env.NODE_ENV !== 'test') {
    endpoint = `${origin}/api/`
  } else {
    // eslint-disable-next-line no-restricted-modules
    const os = require('os')
    const hostname = os.hostname()
    const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
    endpoint = `http://${hostname}:${PORT}/api/`
  }

  return endpoint
}

/**
 * Создает и возвращает WebSocket клиент для GraphQL
 */
export function getWsClient(withWs: boolean) {
  if (typeof window === 'undefined' || !withWs) {
    return undefined
  }

  const endpoint = getEndpoint()
  const wsUri = new URL(endpoint)

  let protocol = wsUri.protocol
  switch (protocol) {
    case 'http:':
      protocol = 'ws:'
      break
    case 'https:':
    default:
      protocol = 'wss:'
      break
  }

  wsUri.protocol = protocol

  return createClient({
    url: wsUri.toString(),
    connectionParams: async () => {
      const params: { Authorization?: string } = {}

      if (localStorage && localStorage.token) {
        params.Authorization = localStorage.token
      }

      return params
    },
  })
}

/**
 * Функция для получения WebSocket соединения.
 * Используется для GraphQL подписок.
 */
export function getWsLink(withWs: boolean) {
  /**
   * На стороне сервера нам не нужна поддержка веб-сокетов.
   * Подключаем вебсокеты только на стороне браузера.
   */
  if (typeof window === 'undefined') {
    return
  }

  /**
   * Если клиент уже существует, возвращаем его
   */
  if (wsLink) {
    return wsLink
  }

  const wsClient = getWsClient(withWs)

  if (wsClient) {
    wsLink = new GraphQLWsLink(wsClient)
  }

  return wsLink
}

function createApolloClient({ withWs, appContext }: createApolloClientProps) {
  const endpoint = getEndpoint()

  const errorLink = onError((error) => {
    const { graphQLErrors, networkError } = error

    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      )

    if (networkError) {
      console.error(`[Network error]: ${networkError}`)
    }
  })

  const uploadLink = createUploadLink({
    uri: endpoint,
  })

  const secureUploadLink = setContext((operation, prevContext) => {
    const headers = {
      ...prevContext.headers,
      'x-apollo-operation-name': operation.operationName || 'Unknown',
      'apollo-require-preflight': 'true',
    }

    return {
      headers,
    }
  }).concat(uploadLink)

  const httpLink = secureUploadLink

  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: { headers?: IncomingHttpHeaders }) => {
      if (!headers && appContext?.ctx.req?.headers) {
        headers = { ...appContext?.ctx.req?.headers }
      }

      const authorization =
        (global.localStorage && global.localStorage.getItem('token')) || null

      if (authorization) {
        headers = {
          ...headers,
          authorization,
        }
      }

      return {
        headers,
      }
    })

    return forward(operation)
  })

  let wsHttpLink: ApolloLink = httpLink

  const wsLink = withWs ? getWsLink(withWs) : undefined

  if (wsLink) {
    wsHttpLink = split(
      (request) => {
        const { query } = request

        const { kind, operation } = getMainDefinition(
          query,
        ) as OperationDefinitionNode
        return kind === 'OperationDefinition' && operation === 'subscription'
      },
      wsLink,
      httpLink,
    )
  }

  // const link = concat(authMiddleware, httpLink)
  const link = errorLink.concat(wsHttpLink)

  const client = new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([authMiddleware, link]),
    cache: new InMemoryCache({
      /**
       * Здесь можно прописать логику для отдельных полей объектов,
       * к примеру, объединение данных при выполнении подгрузки.
       */
      typePolicies,

      // https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually
      possibleTypes: {
        ResourceInterface: ['Activity'],
      },
    }),
  })

  return client
}

export default createApolloClient
