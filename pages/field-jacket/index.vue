<template>
    <div class="pa-6 field-jacket-wrapper">
        <div class="block-group">
            <nuxt-link :to="`/field-jacket/sketch-report`">
                <h3>Sketch Reports</h3>
            </nuxt-link>
            <div v-for="(item, i) in sketchReports" :key="`item-${i}`">
                <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.formType}/${item.JobId}`">
                    <p>{{item.JobId}}</p>
                    <p>{{item.formType}}</p>
                </nuxt-link>
            </div>
        </div>
        <div class="block-group">
            <nuxt-link :to="`/field-jacket/logs-report`">
                <h3>Log Reports</h3>
            </nuxt-link>
            <div v-for="(item, i) in logReports" :key="`logs-${i}`">
                <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.formType}/${item.JobId}`">
                    <p>{{item.JobId}}</p>
                    <p>{{item.formType}}</p>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "FieldJacket",
    layout: "dashboard-layout",
    head() {
        return {
            title: "Field Jacket"
        }
    },
    data() {
        return {
            sketchReports:[],
            logReports:[]
        }
    },
    async middleware({store, redirect}) {
        if (store.state.user.role !== "admin") {
            return redirect("/")
        }
    },
    async asyncData({$axios, params}) {
        try {
            let sketchData = await $axios.$get("/api/sketch");
            let logsData = await $axios.$get("/api/logs");
            let data = sketchData.concat(logsData)
            return {
                sketchReports: sketchData,
                logReports: logsData
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    }
}
</script>
<style lang="scss">
.field-jacket-wrapper {
    display:grid;
    justify-content:flex-start;
    flex-direction:column;
    max-width:800px;
    margin:auto;
    grid-template-rows:80px 1fr;
    grid-template-columns:1fr 1fr;
    
    .breadcrumb-wrapper {
        grid-column: 2 span;
    }
}
</style>