<template>
    <div>
        <span v-if="!authUser"><LazyLoginForm /></span>
        <LazyCertificateForm v-else company="Water Emergency Services Incorporated" abbreviation="WESI" />
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
    }
}
</script>