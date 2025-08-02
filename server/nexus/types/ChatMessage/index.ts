import { extendType, inputObjectType, nonNull, objectType } from 'nexus'
import { sendAiMessageResolver } from './resolvers/sendAiMessage'
import { sendMessageResolver } from './resolvers/sendMessage'

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

    t.field('usage', {
      type: 'JSON',
    })

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
    t.field('chatMessage', {
      type: 'ChatMessage',
      args: {
        where: nonNull('ChatMessageWhereUniqueInput'),
      },
    })
  },
})

export const ChatMessageWhereUniqueInput = inputObjectType({
  name: 'ChatMessageWhereUniqueInput',
  definition(t) {
    t.nonNull.id('id')
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
    t.nonNull.field('sendMessage', {
      type: 'ChatMessageResponse',
      args: {
        data: nonNull('SendChatMessageInput'),
      },
      resolve: sendMessageResolver,
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
    t.string('currentUrl', {
      description: 'Текущий УРЛ страницы, откуда отправляется запрос',
    })
    t.list.nonNull.id('filesIds', {
      description: 'Массив айдишников загруженных файлов',
    })
  },
})

export const SendChatMessageInput = inputObjectType({
  name: 'SendChatMessageInput',
  definition(t) {
    t.nonNull.string('text')
    t.nonNull.id('toUserId')
    t.boolean('withHistory')
  },
})
