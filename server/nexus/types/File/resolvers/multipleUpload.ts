import { FieldResolver } from 'nexus'
import { NexusGenObjects } from 'server/nexus/generated/nexus'
import { processUpload } from './singleUpload'

export const multipleUploadResolver: FieldResolver<
  'Mutation',
  'multipleUpload'
> = async (_, args, ctx) => {
  const result: NexusGenObjects['File'][] = []

  const { files } = args

  if (files?.length) {
    /**
     * Делаю в таком цикле, потому что судя по всему
     * он не поддерживает более двух ожновременных файл-стримов
     */
    for await (const file of files) {
      await processUpload(
        {
          data: {
            file,
          },
        },
        ctx,
      ).then((r) => {
        result.push(r)
      })

      // TODO Add errors handler
      // .catch(console.error)
    }
  }

  return result
}
