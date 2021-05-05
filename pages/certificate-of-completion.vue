<template>
    <div>
        <FormsCertificate company="Water Emergency Services Incorporated" abbreviation="WESI" />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    head() {
        return {
            title: "Certificate of Completion"
        }
    },
    computed: {
        ...mapGetters(["isLoggedIn"])
    }
}
</script>