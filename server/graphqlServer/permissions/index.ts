import { shield } from 'graphql-shield'
import { Rule } from 'graphql-shield/typings/rules'
import { NexusGenFieldTypes } from '../../nexus/generated/nexus'
// import { isAuthenticated } from './rules/isAuthenticated'
import { isSudo } from './rules/isSudo'
import { isAi } from './rules/isAi'

type RuleTree<K extends NexusGenFieldTypes> = {
  // TODO Fix types
  // @ts-expect-error types
  [P in keyof K]?: RuleTreeRule<K[P]> | Rule
}

// https://github.com/microsoft/TypeScript/issues/15300
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RuleTreeRule<K extends Record<string, any>> = {
  [P in keyof K]?: Rule
}

const ruleTree: RuleTree<NexusGenFieldTypes> = {
  Query: {
    chatMessage: isAi,
    chatMessages: isAi,
    mindLogs: isSudo,
  },
}

export const permissions = shield(ruleTree, {
  /**
   * Allow use new Error() in resolvers
   */
  allowExternalErrors: true,
})
