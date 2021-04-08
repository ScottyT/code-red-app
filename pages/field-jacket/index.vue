<template>
    <div class="pa-6 field-jacket-wrapper">
        <div v-for="(item, i) in sketchReports" :key="`item-${i}`">
            <nuxt-link :to="`/field-jacket/${item.ReportType}/${[item.ReportType === 'sketch-report' ? item.sketchType+'/'+item.JobId : item.JobId]}`">
                <p>{{item.JobId}}</p>
                <p>{{item.sketchType}}</p>
            </nuxt-link>
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
            sketchReports:[]
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
            return {
                sketchReports: sketchData
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
        max-width:200px;
        width:100%;
    }
}
</style>