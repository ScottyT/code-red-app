import colors from 'vuetify/es5/util/colors'
import axios from 'axios'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  ssr: true,
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - Code Red Claims',
    title: process.env.npm_package_name || '',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  },
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0', // default: localhost,
    timing: false
  },
  loading: {
    color: '#2a73ae',
  },
  serverMiddleware: [
    { path: "/api", handler: "~/server/index.js" }
  ],
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/index.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {
      src: '~/plugins/mapbox.js',
      mode: 'client',
    },
    '~/plugins/vee-validate.js',
    '~/plugins/signature.js'
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/prismic',
    '@nuxtjs/axios',
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: "code-red-app.firebaseapp.com",
      databaseURL: "https://code-red-app.firebaseio.com",
      projectId: "code-red-app",
      storageBucket: "code-red-app.appspot.com"
    },
    onFirebaseHosting: false,
    services: {
      auth: { 
        ssr: true,
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChangedAction',
        },

      },
      storage: true,
    },
  },
  axios: {
    //baseURL: 'https://code-red-lm5dxmp3ka-uc.a.run.app'
    baseURL: 'http://localhost:8080'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  prismic: {
    endpoint: 'https://wateremergencyservices-pwa.cdn.prismic.io/api/v2',
    linkResolver: '@/plugins/link-resolver',
  },
  /*
   ** PWA settings
   */
  pwa: {
    manifest: {
      name: 'Code Red',
      short_name: 'Code Red Field Forms',
      lang: 'en',
    },
    meta: {
      mobileAppIOS: true,
      description: 'An app that the field teams fill out.',
      author: 'Scott Tucker',
      viewport: 'width=device-width, initial-scale=1',
    },
    workbox: {
      importScripts: ['/firebase-auth-sw.js'],
      dev: true,
      //enabled:false,
      //cachingExtensions: '@/plugins/workbox-sync.js',
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: "https://code-red-app.web.app",
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] }
          },

        },
        {
          urlPattern:
            'https://firebasestorage.googleapis.com/v0/b/code-red-app.appspot.com/o/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] },
            cacheName: 'storage-cache',
          },
          strategyPlugins: [
            {
              use: 'Expiration',
              config: {
                maxAgeSeconds: 7200,
              },
            },
          ],
        },
        {
          urlPattern: 'https://static.cdn.prismic.io/prismic.min.js',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern:
            'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern:
            'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: 'https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern:
            'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
  },
  vuetify: {
    customVariables: ['~/assets/scss/variables/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        }
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ['vee-validate/dist/rules'],
    extractCSS: false,
    optimization: {
      minimize: true,

      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      namedChunks: true,
    },
    extend(config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    },
  },
  render: {
    resourceHints: true,
    bundleRenderer: {
      shouldPreload: (file, type) => {
        if (type === 'script' || type === 'style') {
          return true
        }
      },
    },
  },
}