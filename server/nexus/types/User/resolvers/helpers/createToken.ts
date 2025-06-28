import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { PrismaContext } from 'server/nexus/context'
import { AuthTokenData } from '../../interfaces'

/**
 * Записываем токен доступа в базу
 */
export const createToken = async (user: User, ctx: PrismaContext) => {
  const Token = await ctx.prisma.token.create({
    data: {
      User: {
        connect: {
          id: user.id,
        },
      },
    },
  })

  const tokenData: AuthTokenData = {
    tokenId: Token.id,
  }

  const token = jwt.sign(tokenData, ctx.APP_SECRET)

  return token
}
