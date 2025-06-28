import jwt from 'jsonwebtoken'
import { context, PrismaContext } from '../nexus/context'
import { AuthTokenData } from './types/User/interfaces'
import { pubsub } from '../PubSub'

// Функция для получения контекста запроса
export async function createApolloContext({
  req,
  type: _type,
  currentUser = null,
}: {
  req?: PrismaContext['req']
  type: 'ws' | 'other' | 'ai'
  currentUser?: PrismaContext['currentUser']
}): Promise<PrismaContext> {
  let ContextToken: PrismaContext['Token'] = null

  // if (process.env.NODE_ENV === 'development') {
  //   if (type === 'ws') {
  //     // eslint-disable-next-line no-console
  //     console.log('req?.headers.authorization', req?.headers.authorization)
  //   }
  // }

  if (req?.headers.authorization) {
    try {
      const token = req.headers.authorization.replace('Bearer ', '')
      const tokenData = jwt.verify(
        token,
        context.APP_SECRET,
      ) as AuthTokenData | null

      if (tokenData?.tokenId) {
        const Token = await context.prisma.token.findUnique({
          where: {
            id: tokenData.tokenId,
          },
          select: {
            id: true,
            expiredAt: true,
            createdAt: true,
            userId: true,
            User: true,
          },
        })

        if (
          Token &&
          (!Token.expiredAt || new Date(Token.expiredAt) > new Date())
        ) {
          currentUser = Token.User

          ContextToken = Token
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // if (process.env.NODE_ENV === 'development') {
  //   if (type === 'ws') {
  //     // eslint-disable-next-line no-console
  //     console.log('createApolloContext currentUser', type, currentUser)
  //   }
  // }

  return {
    ...context,
    req,
    currentUser,
    Token: ContextToken,
    pubsub,
  }
}
