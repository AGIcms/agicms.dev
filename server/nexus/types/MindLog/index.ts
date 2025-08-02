import { Prisma } from '@prisma/client'
import {
  extendType,
  objectType,
  // arg,
  // list,
  // nonNull,
  enumType,
  // inputObjectType,
  // queryType,
} from 'nexus'
import { MindLogType } from 'nexus-prisma'
import { myMindLogsResolver } from './resolvers/myMindLogs'
// import { updateMyMindLogResolver } from './resolvers/updateMyMindLog'
// import { deleteMyMindLogResolver } from './resolvers/deleteMyMindLog'

/**
 * Модель лога мышления агента
 */
export const MindLogModel = objectType({
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
    t.nonNull.id('createdById', {
      description: 'ID пользователя, от имени которого создай лог',
    })
    // t.field('CreatedBy', { type: 'User' })

    t.id('relatedToUserId', {
      description: 'ID пользователя, в отношении которого создай лог',
    })
  },
})

export const MindLogTypeModel = enumType(MindLogType)

export const MindLogExtendsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('mindLogs', {
      type: 'MindLog',
      description: 'Доступно только админу',
      args: {
        // where: arg({ type: 'MindLogWhereInput' }),
        // orderBy: arg({ type: list('MindLogOrderByWithRelationInput') }),
        // cursor: arg({ type: 'MindLogWhereUniqueInput' }),
        // take: arg({ type: 'Int' }),
        // skip: arg({ type: 'Int' }),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.mindLog.findMany({
          ...(args as Prisma.MindLogFindManyArgs),
        })
      },
    })

    t.nonNull.list.nonNull.field('myMindLogs', {
      type: 'MindLog',
      description: 'Возвращает свои данные',
      args: {
        // where: arg({ type: 'MindLogWhereInput' }),
        // orderBy: arg({ type: list('MindLogOrderByWithRelationInput') }),
        // cursor: arg({ type: 'MindLogWhereUniqueInput' }),
        // take: arg({ type: 'Int' }),
        // skip: arg({ type: 'Int' }),
      },
      resolve: myMindLogsResolver,
    })
  },
})

// export const MindLogWhereInput = inputObjectType({
//   name: "MindLogWhereInput",

// })

// export const MindLogExtendsMutation = extendType({
//   type: 'Mutation',
//   definition(t) {
//     // Заменяем t.crud на обычные мутации
//     t.field('updateMyMindLog', {
//       type: 'MindLog',
//       args: {
//         where: arg({ type: nonNull('MindLogWhereUniqueInput') }),
//         data: arg({ type: nonNull('MindLogUpdateInput') }),
//       },
//       resolve: updateMyMindLogResolver,
//     })

//     t.field('deleteMyMindLog', {
//       type: 'MindLog',
//       args: {
//         where: arg({ type: nonNull('MindLogWhereUniqueInput') }),
//       },
//       resolve: deleteMyMindLogResolver,
//     })
//   },
// })
