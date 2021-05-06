<template>
    <LazyFormsLogin />
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    head() {
        return {
            title: "Login"
        }
    },
    computed: {
        ...mapGetters(["getUser", "isLoggedIn"])
    },
}
</script>