<template>
    <div>
        <span v-if="!authUser"><LazyLoginForm /></span>
        <LazyDailyContainmentForm v-else />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    head() {
        return {
            title: "Daily Containment Form"
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