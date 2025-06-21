import { makeSchema } from 'nexus'

import { nexusPrisma } from 'nexus-plugin-prisma'

import * as types from './types'
import { applyMiddleware } from 'graphql-middleware'
import { permissions } from '../graphqlServer/permissions'

const schemaBase = makeSchema({
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,

      paginationStrategy: 'prisma',

      outputs: {
        typegen: __dirname + '/generated/nexusPrisma.ts',
      },
    }),
  ],
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
