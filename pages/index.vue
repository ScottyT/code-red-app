<template>
  <div>
    
    <span v-if="!authUser">
      <LazyLoginForm />
    </span>
    
    <div v-if="authUser"><lazy-slices-block :slices="slices" /></div>
    <v-flex xs12 sm8 md6>
      <div class="text-center"></div>
    </v-flex>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      authUser: null,
      submitted: false,
      submitting: false,
      message: '',
      idNumber: '',
      password: '',
      email: '',
      passwordVisibility: false
    }
  },
  computed: {
    ...mapGetters(["getUser", "isLoggedIn"])
  },
  /* async middleware({$fire, redirect}) {
    if ($fire.auth.currentUser === null) {
      return redirect("/login")
    }
  }, */
  async asyncData({ $prismic, error, $axios }) {
    try {
      const document = (await $prismic.api.getSingle('home')).data
      if (document) {
        return {
          title: document.title,
          slices: document.body,
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    } catch (e) {
      console.error("SOMETHING WENT WRONG: " + e)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.authUser = this.$fire.auth.currentUser ? true : false
    })
  },
  head() {
    return {
      title: 'Home',
    }
  }
}
</script>