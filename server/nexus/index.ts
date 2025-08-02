import { makeSchema } from 'nexus'
import { applyMiddleware } from 'graphql-middleware'

import * as types from './types'
import { permissions } from '../graphqlServer/permissions'

const schemaBase = makeSchema({
  plugins: [],
  types: {
    ...types,
  },
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'PrismaContext',
  },
  sourceTypes: {
    debug: process.env.NODE_ENV === 'development',
    modules: [],
  },
  prettierConfig:
    process.env.NODE_ENV === 'development'
      ? require.resolve(process.cwd() + '/.prettierrc')
      : undefined,
})

export const schema = applyMiddleware(schemaBase, permissions)
