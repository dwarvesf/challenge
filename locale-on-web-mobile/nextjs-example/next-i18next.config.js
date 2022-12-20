// POSSIBILITY 1: locize live download usage on client side only
// next-i18next.config.js
const LocizeBackend = require('i18next-locize-backend/cjs')
const ChainedBackend= require('i18next-chained-backend').default
const LocalStorageBackend = require('i18next-localstorage-backend').default

const isBrowser = typeof window !== 'undefined'

// module.exports = {
//   debug: true,
//   i18n: {
//     locales: ['en-US', 'ar', 'vi'],
//     defaultLocale: 'en-US',
//   },
//   backend: {
//     backendOptions: [{
//       expirationTime: 1000 // 1 hour
//     }, {
//       projectId: '19a98752-6639-489e-9f92-ba09017a63a4',
//       version: 'latest'
//     }],
//     backends: isBrowser ? [LocalStorageBackend, LocizeBackend] : [],
//   },
//   serializeConfig: false,
//   use: isBrowser ? [ChainedBackend] : []
// }

// POSSIBILITY 2: config for locize live download usage
// module.exports = {
//   i18n: {
//     locales: ['en-US', 'ar', 'vi'],
//     defaultLocale: 'en-US',
//   },
//   // this will download the translations from locize directly, in client (browser) and server (node.js)
//   // DO NOT USE THIS if having a serverless environment => this will generate too much download requests
//   //   => https://github.com/locize/i18next-locize-backend#important-advice-for-serverless-environments---aws-lambda-google-cloud-functions-azure-functions-etc
//   backend: {
//     projectId: '19a98752-6639-489e-9f92-ba09017a63a4',
//     apiKey: '130988e1-5297-471e-88a0-975cb0bad252', // to not add the api-key in production, used for saveMissing feature
//     referenceLng: 'en-US'
//   },
//   use: [
//     require('i18next-locize-backend/cjs')
//   ],
//   ns: ['common'], // the namespaces needs to be listed here, to make sure they got preloaded
//   serializeConfig: false, // because of the custom use i18next plugin
//   // debug: true,
//   saveMissing: true, // do not saveMissing to true for production
// }

// POSSIBILITY 3: bundle translations with app
// for a serverless environment bundle the translations first. See downloadLocales script in package.json
// and configre this file like this:
module.exports = {
  i18n: {
    locales: ['en-US', 'ar', 'vi'],
    defaultLocale: 'en-US',
  },
}