import { rule } from 'graphql-shield'
import { PrismaContext } from '../../../nexus/context'

export const isAi = rule()((_parent, _args, ctx: PrismaContext) => {
  return ctx.currentUser?.type === 'AI'
})
