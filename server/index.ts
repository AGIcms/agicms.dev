import express from 'express'
import next from 'next'

import './config'

import { imageResizerMiddleware } from './middleware/imageResizer'
import { setupGraphqlServer } from './graphqlServer/setupGraphqlServer'
import { createProxyMiddleware } from 'http-proxy-middleware'

const cwd = process.cwd()

const port = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use('/images/', imageResizerMiddleware)

  server.use(express.static(cwd + '/shared'))

  server.use('/uploads', (req, res) => {
    res.sendFile(
      cwd + '/uploads/' + decodeURI(req.url),
      (error: Error & { status?: number; statusCode?: number }) => {
        if (error) {
          console.error('server /uploads', error)
          res.status(error.status || 404).end()
        }
      },
    )
  })

  server.use('/assets', (req, res) => {
    res.sendFile(
      cwd + '/uploads/' + decodeURI(req.url),
      (error: Error & { status?: number; statusCode?: number }) => {
        if (error) {
          console.error('server /uploads', error)
          res.status(error.status || 404).end()
        }
      },
    )
  })

  server.use(express.static(cwd + '/.next/public'))

  return setupGraphqlServer().then(({ port: graphqlPort }) => {
    const proxy = createProxyMiddleware('/api', {
      target: `http://localhost:${graphqlPort}`,
      changeOrigin: true,
      ws: false, // отключаем автоматическое ws-проксирование
    })

    server.use(proxy)

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err?: Error) => {
      if (err) throw err
      // eslint-disable-next-line no-console
      console.info(`> Ready on http://localhost:${port}`)
      // eslint-disable-next-line no-console
      console.info(`> API proxied to http://localhost:${graphqlPort}/api`)
    })
  })
})
