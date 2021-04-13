<template>
    <div class="pa-6 field-jacket-wrapper">
        <div class="block-group">
            <h3>Sketch Reports</h3>
            <div v-for="(item, i) in sketchReports" :key="`item-${i}`">
                <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.sketchType}/${item.JobId}`">
                    <p>{{item.JobId}}</p>
                    <p>{{item.sketchType}}</p>
                </nuxt-link>
            </div>
        </div>
        <div class="block-group">
            <h3>Log Reports</h3>
            <div v-for="(item, i) in logReports" :key="`logs-${i}`">
                <nuxt-link :to="`/field-jacket/${item.ReportType}/${item.logType}/${item.JobId}`">
                    <p>{{item.JobId}}</p>
                    <p>{{item.logType}}</p>
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
    display:flex;
    justify-content:flex-start;
    flex-direction:row;

    & > div {
        margin:10px;
        
        width:100%;
    }
}
</style>