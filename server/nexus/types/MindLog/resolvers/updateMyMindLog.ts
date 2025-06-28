import { Prisma } from '@prisma/client'
import { FieldResolver } from 'nexus'

export const updateMyMindLogResolver: FieldResolver<
  'Mutation',
  'updateMyMindLog'
> = async (_, args, ctx) => {
  const { currentUser, prisma } = ctx

  if (!currentUser) {
    throw new Error('Now authorized')
  }

  const where = args.where as Prisma.MindLogWhereUniqueInput
  const data = args.data as Prisma.MindLogUpdateInput

  const mindLog = await prisma.mindLog.findUnique({
    where,
  })

  if (!mindLog) {
    throw new Error('Не был получен объект')
  }

  if (mindLog.createdById !== currentUser.id) {
    throw new Error('Нельзя редактировать чужой объект')
  }

  return prisma.mindLog.update({
    where,
    data: data,
  })
}
