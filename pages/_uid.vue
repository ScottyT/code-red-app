<template>
  <div>
    <span v-if="!isLoggedIn"><login-form /></span>
    <div v-else><slices-block :slices="slices" /></div>
    <v-flex class="text-center"> </v-flex>
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
      authUser: null
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