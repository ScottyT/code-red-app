<template>
  <div>
    <lazy-slices-block :slices="slices" />
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
  }
}
</script>