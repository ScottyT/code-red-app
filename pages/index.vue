<template>
  <div>    
    <lazy-slices-block :slices="slices" />
    <v-flex xs12 sm8 md6>
      <div class="text-center"></div>
    </v-flex>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(["getUser", "isLoggedIn"])
  },
  async asyncData({ $prismic, error, $axios }) {
    try {
      const document = (await $prismic.api.getSingle('home')).data
      
      if (document) {
        return {
          title: document.title,
          slices: document.body
        }
      } else {
        error({ statusCode: 404, message: 'Page not found' })
      }
    } catch (e) {
      console.error("SOMETHING WENT WRONG: " + e)
    }
  },
  
  data() {
    return {
      authUser: null,
      submitted: false,
      submitting: false,
      message: '',
      idNumber: '',
      password: '',
      email: '',
      passwordVisibility: false,
      reports: []
    }
  },
  
  head() {
    return {
      title: 'Home',
    }
  }
}
</script>