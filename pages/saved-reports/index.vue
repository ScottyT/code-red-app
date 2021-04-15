<template>
    <div class="pa-6 reports-wrapper">
        <div class="block-group">
            <h3>Saved Reports</h3>
            <div class="block-group--grid">
                <div class="reports-wrapper__data block-group__col" v-for="(item, i) in reports" :key="`item-${i}`">
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
export default {
    name: "SavedReports",
    async asyncData({$axios, params}) {
        try {
            let reports = await $axios.$get("/api/logs");
            return {
                reports
            }
        } catch (e) {
            console.error(e)
        }
    }
}
</script>