<template>
  <div>
    <span v-if="!authUser"><LazyLoginForm /></span>
    <lazy-slices-block v-else :slices="slices" />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Page',
  data() {
    return {
      authUser: false
    }
  },
  head() {
    return {
      title: this.title
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn'])
  },
  /* async middleware({$fire, redirect}) {
    if (!authUser) {
      return redirect("/login")
    }
  }, */
  async asyncData({ $prismic, error, params }) {
    const document = (await $prismic.api.getByUID('page', params.uid)).data
    if (document) {
      return {
        slices: document.body,
        title: document.page_title[0].text,
      }
    } else {
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.authUser = this.$fire.auth.currentUser ? true : false
    })
  },
}
</script>