import { Prisma } from '@prisma/client'
import { extendType, inputObjectType, nonNull, objectType } from 'nexus'
import { sendAiMessageResolver } from './resolvers/sendAiMessage'

export const ChatMessage = objectType({
  name: 'ChatMessage',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('text')
    t.nonNull.field('createdAt', {
      type: 'DateTime',
    })

    /**
     * Делаем это поле необязательным, так как с фронта возможна отправка
     * от анонима
     */
    t.id('createdBy')
    t.id('toUserId')

    t.nonNull.float('mood')
    t.nonNull.float('assertiveness')
    t.nonNull.float('intentTone')
    t.string('socialGoal')

    t.id('companyId')

    t.field('CreatedBy', {
      type: 'User',
    })

    t.field('ToUser', {
      type: 'User',
    })
  },
})

export const ChatMessageExtendsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.crud.chatMessage()
    t.crud.chatMessages({
      filtering: true,
      ordering: true,
      resolve(_, argsProps, ctx) {
        const args = argsProps as Prisma.ChatMessageFindManyArgs

        return ctx.prisma.chatMessage.findMany({
          ...args,
          include: {
            CreatedBy: true,
            ToUser: true,
          },
        })
      },
    })
  },
})

export const ChatMessageExtendsMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('sendAiMessage', {
      type: 'ChatMessageResponse',
      args: {
        data: nonNull('SendAiMessageInput'),
      },
      resolve: sendAiMessageResolver,
    })
  },
})

export const ChatMessageResponse = objectType({
  name: 'ChatMessageResponse',
  definition(t) {
    t.field('ChatMessage', {
      type: 'ChatMessage',
    })
    t.string('token')
  },
})

export const SendAiMessageInput = inputObjectType({
  name: 'SendAiMessageInput',
  definition(t) {
    t.id('id')
    t.nonNull.string('text')
    t.nonNull.boolean('withHistory')
  },
})

export const SendChatMessageInput = inputObjectType({
  name: 'ChatMessageCreateInput',
  definition(t) {
    t.nonNull.string('text')
    t.nonNull.id('toUserId')
    t.boolean('withHistory')
  },
})
