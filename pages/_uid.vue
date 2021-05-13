<template>
  <div>
    <lazy-slices-block :slice="formType" :company="company" />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: 'Page',
  data() {
    return {
      authUser: false,
      // These would be different per company
      company: "Water Emergency Services Incorporated",
      abbreviation: "WESI"
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
  async asyncData({ error, params }) {
    var formType = params.uid
    var title = ""
    switch (formType) {
      case "dispatch-report":
        title = "Dispatch"
        break;
      case "rapid-response-form":
        title = "Rapid Response"
        break;
      case "daily-containment-report":
        title = "Daily Containment Report"
        break;
      case "daily-technician-report":
        title = "Daily Technician Report"
        break;
      case "aob-contract-form":
        title = "AOB & Mitigation Contract"
        break;
      case "certificate-of-completion":
        title = "Certificate of Completion"
        break;
      default:
        title = "Report Form"
    }
    return {
      formType,
      title
    }
  }
}
</script>