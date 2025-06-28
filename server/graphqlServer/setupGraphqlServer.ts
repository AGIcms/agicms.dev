import express from 'express'
import { createServer } from 'http'
import { ApolloServer } from '@apollo/server'
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs'
import { expressMiddleware } from '@apollo/server/express4'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'

import { schema } from '../nexus'
import { createApolloContext } from '../nexus/createApolloContext'
import { PrismaContext } from '../nexus/context'

/**
 * Поднимаем граф-сервер на отдельном порту с вебсокетом.
 * На отдельном, потому что бага в нексте не дает нормально использовать еще
 * один вебсокетный сервер, ломается и его hmr, и наш веб-сокет
 */
export async function setupGraphqlServer(): Promise<{ port: number }> {
  const apolloServer = new ApolloServer<PrismaContext>({
    // schema: applyMiddleware(schema, permissions),
    schema,
    introspection: true,
    includeStacktraceInErrorResponses: process.env.NODE_ENV === 'development',
    plugins: [],
    formatError: (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('GraphQL Error', error)
        // return new Error('Internal server error')
      }

      return error
    },
  })

  // Запускаем отдельный сервер для подписок GraphQL
  const port = parseInt(process.env.GRAPHQL_WS_PORT || '4000', 10)

  const app = express()

  app.use(express.json())

  // Важно: middleware для обработки файлов должен быть добавлен до использования Apollo
  app.use(graphqlUploadExpress({ maxFileSize: 50_000_000, maxFiles: 10 }))

  const httpServer = createServer(app)

  // Настраиваем WebSocket сервер для подписок
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/api',
  })

  // Настраиваем WebSocket для GraphQL подписок
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const tokenRaw =
          typeof ctx.connectionParams?.Authorization === 'string'
            ? ctx.connectionParams?.Authorization
            : undefined

        return createApolloContext({
          req: {
            headers: {
              authorization: tokenRaw,
            },
          },
          type: 'ws',
        })
      },
      // onConnect: () => {
      //   if (process.env.NODE_ENV === 'development') {
      //     // eslint-disable-next-line no-console
      //     console.log('🔌 WS connected')
      //   }
      // },
      onError: async (_ctx, message, errors) => {
        console.error('ws onError', message, errors)

        return errors
      },
    },
    wsServer,
  )

  // Добавляем плагин для корректного завершения работы HTTP сервера
  apolloServer.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer }))

  // Добавляем плагин для корректного завершения работы WebSocket сервера
  apolloServer.addPlugin({
    async serverWillStart() {
      return {
        async drainServer() {
          await serverCleanup.dispose()
        },
      }
    },
  })

  await apolloServer.start()

  app.use(
    '/api',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(apolloServer, {
      context: ({ req }) => createApolloContext({ req, type: 'other' }),
    }),
  )

  httpServer.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 GraphQL server ready at http://localhost:${port}/api`)
    // eslint-disable-next-line no-console
    console.log(`🚀 WebSocket endpoint ready at ws://localhost:${port}/api`)
  })

  return { port }
}
