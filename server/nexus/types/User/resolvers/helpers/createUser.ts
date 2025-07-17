import { Prisma } from '@prisma/client'
import { PrismaContext } from 'server/nexus/context'
import { createToken } from '../helpers/createToken'
import { createActivity } from '../../../Activity/helpers/createActivity'
import { ActivityType } from '../../../Activity/interfaces'

export async function createUser(
  data: Prisma.UserCreateInput,
  ctx: PrismaContext,
) {
  const createData: Prisma.UserCreateInput = {
    ...data,
  }

  const user = await ctx.prisma.user.create({
    data: createData,
  })

  let token: string | undefined

  if (user) {
    token = await createToken(user, ctx)

    createActivity({
      ctx,
      userId: user.id,
      payload: {
        type: ActivityType.UserCreated,
        user,
        toUserId: ctx.currentUser?.id ?? null,
      },
    })
  }

  return {
    success: !!user,
    errors: [],
    data: user,
    token,
  }
}
