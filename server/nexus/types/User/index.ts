import { Prisma } from '@prisma/client'
import { objectType, extendType } from 'nexus'

export const User = objectType({
  name: 'User',
  description: 'Пользователь',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.field('createdAt', {
      description: 'Когда создан',
      type: 'DateTime',
    })
    t.nonNull.field('updatedAt', {
      description: 'Когда обновлен',
      type: 'DateTime',
    })
    t.nonNull.field('status', {
      type: 'UserStatus',
    })
    t.string('username')
    t.boolean('sudo')
    t.string('image', {
      description: 'Avatar',
    })

    t.boolean('active', {
      description: 'Активирован ли пользователь',
    })

    t.string('fullname')
    t.string('address')

    t.nonNull.string('intro')
    t.nonNull.string('content')
  },
})

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.user({
      description: 'Пользователь',
    })

    t.crud.users({
      description: 'Список пользователей',
      filtering: true,
      ordering: true,
    })

    t.nonNull.int('usersCount', {
      description: 'Количество пользователей',
      args: {
        where: 'UserWhereInput',
      },
      resolve(_, args, ctx) {
        return ctx.prisma.user.count({
          where: args.where as Prisma.UserCountArgs['where'],
        })
      },
    })

    t.field('me', {
      type: 'User',
      resolve(_, _args, ctx) {
        return ctx.currentUser
      },
    })
  },
})
