// import { Prisma } from '@prisma/client'
// import { objectType, extendType, inputObjectType, arg } from 'nexus'
// import { singleUploadResolver } from './resolvers/singleUpload'

import {
  arg,
  extendType,
  inputObjectType,
  list,
  nonNull,
  objectType,
} from 'nexus'
import { singleUploadResolver } from './resolvers/singleUpload'
import { multipleUploadResolver } from './resolvers/multipleUpload'

export const File = objectType({
  name: 'File',
  description: 'Файл',
  // sourceType: {
  //   module: '@prisma/client',
  //   export: 'File',
  // },
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.date('createdAt', {
      description: 'Когда создан',
    })
    t.date('updatedAt', {
      description: 'Когда обновлен',
    })
    t.nonNull.string('path', {
      description: 'Путь к файлу',
    })
    t.string('filename', {
      description: 'Имя файла',
    })
    t.string('name', {
      description: 'Пользовательское имя файла',
    })
    t.nonNull.string('mimetype', {
      description: 'Миме-тип',
    })
    t.string('encoding', {
      description: 'Кодировка',
    })
    t.int('size', {
      description: 'Размер в байтах',
    })
    // t.int('rank', {
    //   description: 'Очередность',
    // })
    t.id('createdById')
  },
})

export const FileExtendsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('files', {
      type: 'File',
      resolve(_, __, { prisma }) {
        return prisma.file.findMany({})
      },
    })

    // t.nonNull.int('filesCount', {
    //   description: 'Количество файлов',
    //   args: {
    //     where: 'FileWhereInput',
    //   },
    //   resolve(_, args, ctx) {
    //     return ctx.prisma.file.count({
    //       where: args.where as Prisma.FileCountArgs['where'],
    //     })
    //   },
    // })

    t.field('file', {
      type: 'File',
      args: {
        where: nonNull('FileWhereUniqueInput'),
      },
      resolve(_, { where }, { prisma }) {
        const { id } = where

        return prisma.file.findUnique({
          where: {
            id: id ?? undefined,
          },
        })
      },
    })
  },
})

export const FileExtendsMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('singleUpload', {
      description: 'Загрузка файла',
      type: 'File',
      args: {
        file: arg({
          type: 'Upload',
          description: 'Устаревший параметр',
        }),
        data: 'SingleUploadInput',
      },
      resolve: singleUploadResolver,
    })
    t.list.nonNull.field('multipleUpload', {
      description: 'Загрузка файла',
      type: 'File',
      args: {
        files: list(
          arg({
            type: 'Upload',
            description: 'Устаревший параметр',
          }),
        ),
        data: 'SingleUploadInput',
      },
      resolve: multipleUploadResolver,
    })
  },
})

export const FileWhereUniqueInput = inputObjectType({
  name: 'FileWhereUniqueInput',
  definition(t) {
    t.string('id')
  },
})

export const SingleUploadInput = inputObjectType({
  name: 'SingleUploadInput',
  definition(t) {
    t.nonNull.field('file', {
      type: 'Upload',
    })
    t.string('name', {
      description: 'Пользовательское имя файла',
    })
    t.string('directory', {
      description: 'В какую директорю загружать файл',
    })
  },
})
