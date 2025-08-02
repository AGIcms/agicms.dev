// import { Prisma } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { objectType, extendType, enumType, arg, inputObjectType } from 'nexus'
import { UserStatus, userType } from 'nexus-prisma'

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
    t.field('data', {
      type: 'JSON',
    })

    t.string('intro')
    t.string('content')
    t.field('type', {
      type: 'userType',
    })
  },
})

export const UserStatusEnum = enumType(UserStatus)
export const userTypeEnum = enumType(userType)

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: User,
      description: 'Пользователь',
      args: {
        where: arg({ type: 'UserWhereUniqueInput' }),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.user.findUnique({
          where: {
            id: args.where?.id ?? undefined,
          },
        })
      },
    })

    t.nonNull.list.nonNull.field('users', {
      type: User,
      description: 'Список пользователей',
      args: {
        where: arg({ type: 'UserWhereInput' }),
        // orderBy: arg({ type: 'UserOrderByWithRelationInput' }),
        // cursor: arg({ type: 'UserWhereUniqueInput' }),
        take: arg({ type: 'Int' }),
        skip: arg({ type: 'Int' }),
      },
      resolve(_, args, ctx) {
        return ctx.prisma.user.findMany({
          where: args.where as Prisma.UserWhereUniqueInput,
          // orderBy: args.orderBy || undefined,
          // cursor: args.cursor ? { id: args.cursor.id } : undefined,
          take: args.take || undefined,
          skip: args.skip || undefined,
        })
      },
    })

    t.nonNull.int('usersCount', {
      description: 'Количество пользователей',
      args: {
        where: arg({ type: 'UserWhereInput' }),
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

export const UserWhereUniqueInput = inputObjectType({
  name: 'UserWhereUniqueInput',
  definition(t) {
    t.id('id')
  },
})

export const UserWhereInput = inputObjectType({
  name: 'UserWhereInput',
  definition(t) {
    t.id('id')
  },
})
