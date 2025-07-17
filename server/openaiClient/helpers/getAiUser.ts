import { User } from '@prisma/client'
import { PrismaContext } from '../../nexus/context'
import { AiAgents } from '../interfaces'
import { createAiUser } from './createAiUser'

type getAiUserProps = {
  ctx: PrismaContext
}

export async function getAiUser({ ctx }: getAiUserProps): Promise<User> {
  const aiAgent = AiAgents.at(0)

  if (!aiAgent) {
    throw new Error('Can not get aiAgent')
  }

  return createAiUser({
    data: {
      username: aiAgent.username,
      model: aiAgent.model,
      allowTools: aiAgent.allowTools,
      maxTokens: aiAgent.maxTokens,
    },
    ctx,
  })
}
