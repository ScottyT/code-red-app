<template>
    <LazyLoginForm />
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    computed: {
        ...mapGetters(["getUser", "isLoggedIn"])
    },
}
</script>