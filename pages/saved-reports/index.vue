<template>
    <div class="pa-6 reports-wrapper">
        <div class="block-group">
            <h3>Saved Reports</h3>
            <div class="block-group--grid">
                <div class="reports-wrapper__data block-group__col" v-for="(item, i) in $store.state.logreports" :key="`item-${i}`">
                    <nuxt-link :to="`/saved-reports/${item.formType}/${item.JobId}`">
                        <p>{{item.JobId}}</p>
                        <p>{{item.formType}}</p>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    name: "SavedReports",
    computed: {
        ...mapGetters({
            getSavedReports: 'indexDb/getSavedReports'
        })
    }
    /* async asyncData({$axios, params, store}) {
        try {
            let employee = store.state.user
            let reports = await $axios.$get(`/api/logs/${employee.id}`);
            return {
                reports
            }
        } catch (e) {
            console.error(e)
        }
    } */
}
</script>