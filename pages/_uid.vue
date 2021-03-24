<template>
  <div>
    <span v-if="!authUser"><LazyLoginForm /></span>
    <div v-else><slices-block :slices="slices" /></div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import SlicesBlock from '~/components/SlicesBlock.vue'
export default {
  name: 'Page',
  components: {
    SlicesBlock,
  },
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