<template>
    <div class="user-page px-5">
        <h1>{{userEmail}}</h1>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
    async asyncData({params}) {
        var userEmail = params.uid
        return {
            userEmail
        }
    },
    computed: {
        ...mapGetters(['getReports']),
        getUserReports() {
            return this.getReports.filter((v) => {
                return v.teamMember.email === this.userEmail
            })
        }
    }
}
</script>
<style lang="scss">
.user-page {
    max-width:1200px;
    margin:auto;
}
</style>