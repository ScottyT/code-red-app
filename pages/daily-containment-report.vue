<template>
    <div>
        <FormsDailyContainment />
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
    computed: {
        ...mapGetters(["isLoggedIn"])
    }
}
</script>