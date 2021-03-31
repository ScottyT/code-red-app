<template>
  <div>
    <span v-if="!authUser">
      <LazyLoginForm /></span>
    <div v-else>
      <LazyDailyTechnicianForm />
    </div>
  </div>
</template>
<script>
  import {
    mapGetters, mapActions
  } from 'vuex';
  export default {
    head() {
      return {
        title: "Daily Technician Form"
      }
    },
    data() {
        return {
            authUser: false
        }
    },
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
    mounted() {
        this.$nextTick(() => {
            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    },
  }
</script>