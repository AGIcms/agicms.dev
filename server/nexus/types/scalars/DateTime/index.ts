import { Kind } from 'graphql'
import { scalarType } from 'nexus'

export const DateTimeScalar = scalarType({
  name: 'DateTime',
  description: 'DateTime scalar in ISO 8601 format',
  asNexusMethod: 'date',

  // Преобразует значение при отправке клиенту
  serialize(value: unknown): string | null {
    if (value instanceof Date) {
      return value.toISOString()
    }
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date.toISOString()
      }
    }
    return null
  },

  // Преобразует значение от клиента (например, из переменных)
  parseValue(value: unknown): Date | null {
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value)
      return isNaN(date.getTime()) ? null : date
    }
    return null
  },

  // Преобразует значение из AST (inline-параметры в запросе)
  parseLiteral(ast): Date | null {
    if (ast.kind === Kind.STRING || ast.kind === Kind.INT) {
      const date = new Date(ast.value)
      return isNaN(date.getTime()) ? null : date
    }
    return null
  },
})
