<template>
  <div>
      <FormsDailyTechnician />
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
    computed: {
        ...mapGetters(["isLoggedIn"])
    }
  }
</script>