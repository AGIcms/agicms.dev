import { Prisma } from '@prisma/client'
import { FieldResolver } from 'nexus'

export const updateCurrentUser: FieldResolver<
  'Mutation',
  'updateCurrentUser'
> = async (_, args, ctx) => {
  const { currentUser } = ctx

  const { ...data } = args.data

  if (!currentUser) {
    throw new Error('Необходимо авторизоваться')
  }

  const updateData: Prisma.UserUpdateArgs['data'] = data

  return ctx.prisma.user.update({
    data: updateData,
    where: {
      id: currentUser.id,
    },
  })
}
