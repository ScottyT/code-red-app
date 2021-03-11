<template>
    <div>
        <span v-if="!isLoggedIn"><LazyLoginForm /></span>
        <LazyAOBContractForm company="Water Emergency Services Incorporated" abbreviation="WESI" />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {

    computed: {
        ...mapGetters(["isLoggedIn"])
    },
}
</script>