<template>
  <div class="page-block--home">  
    <h1>Welcome to the Code Red App!</h1>
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
  async asyncData({ error, $axios }) {
    
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
<style lang="scss">
.page-block {
  /* &--home {
    background:$color-white;
    color:$color-black;
  } */
}
</style>