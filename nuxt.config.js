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
    port: 3000,
    host: '0.0.0.0',
    timing: false
  },
  loading: {
    color: '#2a73ae',
  },
  serverMiddleware: [
    { path: "/api", handler: "~/server/index.js" }
  ],
  env: {
    mapboxKey: process.env.MAPBOX_API_KEY,
    serverUrl: process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : process.env.SERVER_URL
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/index.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    //'~/plugins/axios.js',
    {
      src: '~/plugins/mapbox.js',
      mode: 'client',
    },
    '~/plugins/imask.js',
    '~/plugins/vee-validate.js',
    '~/plugins/signature.js',
    { src: '@/plugins/vue-html2pdf.js', mode: 'client' },
    '~/plugins/mask.js',
    '~/plugins/composition-api.js',
    '~/plugins/directives.js'
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    {path: '~/components/forms/', prefix: 'forms'},
    {path: '~/components/ui/', prefix: 'ui'},
    {path: '~/components/pdf/', prefix: 'pdf'},
    {path: '~/components/templates/', prefix: 'layout'},
    '~/components'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    },
    onFirebaseHosting: false,
    services: {
      auth: { 
        ssr: true,
        initialize: {
          onAuthStateChangedAction: 'users/onAuthStateChangedAction',
        },
      },
      storage: true,
    },
  },
  axios: {
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost:8080' : process.env.SERVER_URL
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
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
      description: 'An app that the field teams fill out.',
      author: 'Scott Tucker',
      viewport: 'width=device-width, initial-scale=1',
      name: 'Code Red Claims',
      theme_color: '#2a73ae'
    },
    workbox: {
      importScripts: ['/firebase-auth-sw.js'],
      dev: process.env.NODE_ENV === 'development',
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
          urlPattern: "https://code-red-app-313517.web.app/*",
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] }
          },

        },
        {
          urlPatter: "http://localhost:8080/api/*",
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern:
            'https://firebasestorage.googleapis.com/v0/b/code-red-app-313517.appspot.com/o/.*',
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
          primary: colors.red.darken2,
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
    babel: {
      presets({ envName }) {
        const envTargets = {
          client: { browsers: ["last 2 versions"], ie: 11},
          server: { node: "current" }
        }
        return [
          ["@nuxt/babel-preset-app", {
            loose: true,
            targets: envTargets[envName]
          }]
        ]
      }
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
  generate: {
    fallback: '404.html',
    interval: 2000
  }
}