import { MindLog } from '@prisma/client'

export async function formatMindLog(mindLog: MindLog) {
  const { id, createdAt, type, quality, data } = mindLog

  return {
    id,
    createdAt,
    type,
    quality,
    data,
  }
}
