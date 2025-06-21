// @ts-check

const webpack = (config, options) => {
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config

  const MomentLocalesPlugin = require('moment-locales-webpack-plugin')

  /**
   * Fix locales issue
   * https://github.com/moment/moment/issues/2517#issuecomment-620674018
   */
  config.plugins.push(
    new MomentLocalesPlugin({
      localesToKeep: ['ru', 'en'],
    }),
  )

  config.module.rules.push({
    test: /\.pdf/,
    use: [
      options.defaultLoaders.babel,
      {
        loader: 'file-loader',
        options: {
          limit: 1000,
          name: '[name]_[hash].[ext]',
          publicPath: `/_next/static/pdf`,
          outputPath: 'static/pdf',
        },
      },
    ],
  })

  // https://github.com/vercel/next.js/issues/11164#issuecomment-602204795
  // config.module.rules.push({
  //   // test: /\.(png|jpe?g|gif)$/i,
  //   test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
  //   // loader: 'url-loader',
  //   // issuer: {
  //   //   // nextjs already handles url() in css/sass/scss files
  //   //   test: /\.\w+(?<!(s?c|sa)ss)$/i,
  //   // },
  //   use: [
  //     {
  //       loader: 'url-loader',
  //       options: {
  //         context: 'src',
  //         name() {
  //           if (process.env.NODE_ENV === 'development') {
  //             return '[path][name].[ext]'
  //           }

  //           return '[contenthash].[ext]'
  //         },
  //         publicPath: `/_next/static/media`,
  //         outputPath: 'static/media',
  //         limit: 1000,
  //       },
  //     },
  //   ],
  // })

  // Object.assign(config, {
  //   // https://nextjs.org/docs/api-reference/next.config.js/disabling-etag-generation
  //   generateEtags: false,
  // });

  config.resolve.fallback = {
    ...config.resolve.fallback,

    // https://freecode.academy/tasks/ckp9ahnondb4n0899d1cg5gwm
    os: require.resolve('os-browserify/browser'),
  }

  return config

  // Important: return the modified config
  // return {
  //   ...config,

  //   // https://nextjs.org/docs/api-reference/next.config.js/disabling-etag-generation
  //   generateEtags: false,
  // }
}

// module.exports = (phase, defaultConfig) => {
//   // Базовая конфигурация для runtime
//   const publicRuntimeConfig = {}

//   if (phase !== 'phase-production-server') {
//     const withBundleAnalyzer = require('@next/bundle-analyzer')({
//       enabled: process.env.ANALYZE === 'true',
//     })

//     const withPWA = require('next-pwa')

//     const withTM = require('next-transpile-modules')(['monaco-editor'])

//     const config = withBundleAnalyzer(
//       withTM(
//         withPWA({
//           pwa: {
//             dest: `.next/public`,
//             // TODO Пока не работает как хотелось бы
//             // fallbacks: {
//             //   // image: '/static/images/fallback.png',
//             //   // document: '/offline',  // if you want to fallback to a custom    page other than /_offline
//             //   // font: '/static/font/fallback.woff2',
//             //   // audio: ...,
//             //   // video: ...,
//             // },

//             disable:
//               process.env.PWA !== 'true' ||
//               process.env.NODE_ENV === 'development',
//           },
//           webpack,
//           publicRuntimeConfig,
//           // https://github.com/shadowwalker/next-pwa/issues/198#issuecomment-817205700
//           future: {
//             webpack5: true,
//           },
//         })
//       )
//     )
//     return config
//   }

//   // else
//   // return defaultConfig

//   return {
//     ...defaultConfig,
//     webpack,
//     generateEtags: false,
//     publicRuntimeConfig,
//   }
// }

/**
 *
 * @param {string} phase
 * @param {{defaultConfig: import('next').NextConfig}} context
 * @returns {import('next').NextConfig}
 */
module.exports = (phase, { defaultConfig }) => {
  const ignoreErrors = process.env.BUILD_IGNORE_ERRORS === 'true'

  defaultConfig = {
    ...defaultConfig,
    compiler: {
      styledComponents: {
        displayName: true,
      },
    },
    generateEtags: false,

    typescript: {
      ignoreBuildErrors: ignoreErrors,
    },
    eslint: {
      ignoreDuringBuilds: ignoreErrors,
    },
    env: {
      ...defaultConfig.env,
      TILE_SERVER_URL: process.env.TILE_SERVER_URL,
    },
  }

  if (phase !== 'phase-production-server') {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === 'true',
    })

    // const withTM = require('next-transpile-modules')(['monaco-editor'])

    const withPWA = require('next-pwa')

    /**
     * @type {import('next').NextConfig}
     */
    let config = withBundleAnalyzer(
      // withTM(
      withPWA({
        dest: `.next/public`,
        // TODO Пока не работает как хотелось бы
        // fallbacks: {
        //   // image: '/static/images/fallback.png',
        //   // document: '/offline',  // if you want to fallback to a custom    page other than /_offline
        //   // font: '/static/font/fallback.woff2',
        //   // audio: ...,
        //   // video: ...,
        // },

        disable:
          process.env.PWA !== 'true' || process.env.NODE_ENV === 'development',
      }),
      // )
    )

    /**
     * Github pages
     */
    if (
      process.env.GITHUB_REPOSITORY &&
      ['phase-production-build', 'phase-export'].includes(phase)
    ) {
      const repositoryName = process.env.GITHUB_REPOSITORY.split('/')[1]

      config = {
        ...config,
        assetPrefix: `/${repositoryName}/`,
        basePath: `/${repositoryName}`,
      }
    }

    config = { ...defaultConfig, ...config }

    return config
  }

  // else
  // return defaultConfig

  return {
    ...defaultConfig,
    webpack,
    generateEtags: false,
  }
}
