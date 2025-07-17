import { User } from '@prisma/client'
import { PrismaContext } from '../../nexus/context'
import { AiAgentData, AiAgentUserData } from '../interfaces'

const OPENAI_API_BASE_URL =
  process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1'

const OPENAI_DEFAULT_MODEL = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4.1-mini'

type createAiUserProps = {
  data: AiAgentData & {
    endpoint?: string
    systemPrompt?: string
  }
  ctx: PrismaContext
}

export async function createAiUser({
  data: { username, model, endpoint, systemPrompt, ...other },
  ctx,
}: createAiUserProps): Promise<User> {
  const { prisma } = ctx

  let aiUser = await prisma.user.findFirst({
    where: {
      username,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (aiUser) {
    if (aiUser.type !== 'AI') {
      throw new Error(
        'Пользователь уже существует, но он не является ИИ агентом',
      )
    }

    if (!aiUser.active) {
      throw new Error('Пользователь уже существует, но он неактивен')
    }
  }

  if (!aiUser) {
    const aiAgentData: AiAgentUserData = {
      ...other,
      model: model || OPENAI_DEFAULT_MODEL,
      endpoint: endpoint || OPENAI_API_BASE_URL,
      systemPrompt,
    }

    aiUser = await prisma.user.create({
      data: {
        type: 'AI',
        username,
        data: aiAgentData,
        active: true,
      },
    })
  }

  if (!aiUser) {
    throw new Error('Can not get AI user')
  }

  return aiUser
}
