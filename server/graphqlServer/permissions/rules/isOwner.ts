import { rule } from 'graphql-shield'
import { PrismaContext } from '../../../nexus/context'
import { NexusGenScalars } from '../../../nexus/generated/nexus'

type WithCreatedBy = { createdById: NexusGenScalars['ID'] }

/**
 * Пользователь является владельцем объекта
 */
export const isOwner = <T extends WithCreatedBy>() => {
  return rule()((_parent: T, _args, _ctx: PrismaContext) => {
    return false
  })
}
