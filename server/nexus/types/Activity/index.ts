import { enumType, extendType, interfaceType, nonNull, objectType } from 'nexus'
import { PUBSUB_TYPE } from '../../../PubSub/interfaces'
import { NexusGenInterfaces } from 'server/nexus/generated/nexus'
import { ActivityType } from './interfaces'

export const Activity = interfaceType({
  name: 'Activity',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.date('createdAt')
    t.nonNull.id('userId')
    t.id('toUserId')
    t.field('data', {
      type: 'JSON',
    })
    t.nonNull.field('type', {
      type: 'ActivityType',
    })
  },
  resolveType(object) {
    switch (object.type) {
      case 'MindLog':
        return 'ActivityMindLog'
      case 'SendMessage':
        return 'ActivityMessage'
      case 'ToolCall':
        return 'ActivityToolCall'
      case 'UrlChanged':
        return 'ActivityUrl'
      case 'SuggestUrl':
        return 'ActivitySuggestUrl'
      case 'UserCreated':
        return 'ActivityUser'
      case 'StdOut':
        return 'ActivityStdOut'
    }
  },
})

export const ActivityTypeEnum = enumType({
  name: 'ActivityType',
  members: Object.values(ActivityType),
})

export const ActivityMessage = objectType({
  name: 'ActivityMessage',
  definition(t) {
    t.implements('Activity')
    t.nonNull.field('ChatMessage', {
      type: 'ChatMessage',
    })
  },
})

export const ActivityUser = objectType({
  name: 'ActivityUser',
  definition(t) {
    t.implements('Activity')
    t.nonNull.field('User', {
      type: 'User',
    })
  },
})

export const ActivityMindLog = objectType({
  name: 'ActivityMindLog',
  definition(t) {
    t.implements('Activity')
    t.nonNull.field('MindLog', {
      type: 'MindLog',
    })
  },
})

export const ActivityUrl = objectType({
  name: 'ActivityUrl',
  definition(t) {
    t.implements('Activity')
    t.nonNull.string('url')
  },
})

export const ActivitySuggestUrl = objectType({
  name: 'ActivitySuggestUrl',
  definition(t) {
    t.implements('Activity')
    t.nonNull.string('url')
  },
})

export const ActivityToolCall = objectType({
  name: 'ActivityToolCall',
  definition(t) {
    t.implements('Activity')
    t.nonNull.string('name')
    t.field('args', {
      type: 'JSON',
    })
  },
})

export const ActivityStdOut = objectType({
  name: 'ActivityStdOut',
  definition(t) {
    t.implements('Activity')
    t.nonNull.string('StdOut')
  },
})

export const ActivityExtendsSubscription = extendType({
  type: 'Subscription',
  definition(t) {
    t.field('activity', {
      type: 'Activity',
      args: {
        // Хак. Видеть события по всем пользователям
        globalEvents: nonNull('Boolean'),
      },
      subscribe: (_, { globalEvents }, ctx) => {
        const asyncIter = ctx.pubsub.asyncIterableIterator<
          NexusGenInterfaces['Activity']
        >([PUBSUB_TYPE.ACTIVITY_ADDED])

        const filterFn = (payload: NexusGenInterfaces['Activity']) => {
          const { currentUser } = ctx

          if (!currentUser) {
            return false
          }

          const { id: userId, sudo } = currentUser

          if (sudo && globalEvents) {
            return true
          }

          switch (payload.type) {
            case 'SuggestUrl':
              if (payload.toUserId && payload.toUserId === userId) {
                return true
              }

              break

            default:
          }

          return false
        }

        return {
          async next() {
            // eslint-disable-next-line no-constant-condition
            while (true) {
              const { value, done } = await asyncIter.next()
              if (done) return { value, done }
              if (filterFn(value)) return { value, done: false }
            }
          },
          return() {
            return (
              asyncIter.return?.() ??
              Promise.resolve({ value: undefined, done: true })
            )
          },
          throw(error) {
            return asyncIter.throw?.(error) ?? Promise.reject(error)
          },
          [Symbol.asyncIterator]() {
            return this
          },
        }
      },
      resolve(source) {
        // TODO Надо будет прописать условия

        return source
      },
    })
  },
})
