import { extendType, objectType } from 'nexus'
import { myMindLogsResolver } from './resolvers/myMindLogs'

/**
 * Модель лога мышления агента
 */
export const MindLog = objectType({
  name: 'MindLog',
  description: 'Запись в логе мышления агента',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.field('createdAt', {
      type: 'DateTime',
    })
    t.nonNull.field('updatedAt', {
      type: 'DateTime',
    })
    t.nonNull.field('type', { type: 'MindLogType' })
    t.nonNull.string('data')
    t.float('quality')
    t.nonNull.id('createdById')
    t.field('CreatedBy', { type: 'User' })
  },
})

export const MindLogExtendsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.mindLogs({
      description: 'Доступно только админу',
      filtering: true,
      ordering: true,
    })

    t.crud.mindLogs({
      alias: 'myMindLogs',
      description: 'Возвращает свои данные',
      filtering: true,
      ordering: true,
      resolve: myMindLogsResolver,
    })
  },
})
