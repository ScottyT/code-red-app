<template>
    <div>
        <span v-if="!isLoggedIn"><LazyLoginForm /></span>
        <div v-else-if="isLoggedIn">
            <LazyDailyContainmentForm />
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
}
</script>