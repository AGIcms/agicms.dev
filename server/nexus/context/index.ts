import { User, PrismaClient, Token } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4'
import { pubsub, PubSubInterface } from '../../PubSub'
import { prismaClient } from '../../prismaClient'

export interface PrismaContext {
  prisma: PrismaClient
  req:
    | ExpressContextFunctionArgument['req']
    | { headers: { authorization: string | undefined } }
    | undefined
  mailSender: string
  APP_SECRET: string
  pubsub: PubSub<PubSubInterface>

  // Authorized user
  currentUser: User | null

  /**
   * Токен авторизации
   */
  Token: (Token & { User: User | null }) | null
}

if (!process.env.APP_SECRET) {
  throw new Error('APP_SECRET env is not defined')
}

const APP_SECRET = process.env.APP_SECRET

// TODO Move to createContext
export const context: PrismaContext = {
  prisma: prismaClient,
  mailSender: process.env.SendmailSender ?? 'no-reply@localhost',
  APP_SECRET,
  currentUser: null,
  Token: null,
  req: undefined,
  pubsub,
}
