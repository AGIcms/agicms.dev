import { shield } from 'graphql-shield'
import { Rule, RuleOr } from 'graphql-shield/typings/rules'
import { NexusGenFieldTypes } from '../../nexus/generated/nexus'
// import { isAuthenticated } from './rules/isAuthenticated'
// import { isSudo } from './rules/isSudo'
// import { isAi } from './rules/isAi'

type RuleTree<K extends NexusGenFieldTypes> = {
  // TODO Fix types
  // @ts-expect-error types
  [P in keyof K]?: RuleTreeRule<K[P]> | Rule | RuleOr
}

// https://github.com/microsoft/TypeScript/issues/15300
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RuleTreeRule<K extends Record<string, any>> = {
  [P in keyof K]?: Rule | RuleOr
}

const ruleTree: RuleTree<NexusGenFieldTypes> = {
  // Query: {
  //   chatMessage: or(isAi, isSudo),
  //   chatMessages: or(isAi, isSudo),
  //   mindLogs: or(isAi, isSudo),
  // },
  // Mutation: {
  //   createOneGeoObject: or(isAi, isSudo),
  //   updateGeoObject: or(isAi, isSudo),
  // },
}

export const permissions = shield(ruleTree, {
  /**
   * Allow use new Error() in resolvers
   */
  allowExternalErrors: true,
})
