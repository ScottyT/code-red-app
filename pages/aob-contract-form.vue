<template>
    <div>
        <span v-if="!authUser"><LazyLoginForm /></span>
        <LazyAOBContractForm v-else company="Water Emergency Services Incorporated" abbreviation="WESI" />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            authUser: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    },
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
}
</script>