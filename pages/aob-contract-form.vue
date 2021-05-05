<template>
    <div>
        <FormsAOBContract company="Water Emergency Services Incorporated" abbreviation="WESI" />
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    head() {
        return {
            title: "AOB & Mitigation Contract"
        }
    },
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
}
</script>