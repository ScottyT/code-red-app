<template>
    <div class="field-jacket-wrapper">
        <LazyBreadcrumbs page="field-jacket" />
        
        <div class="block-group">
            <h1 class="text-capitalize">{{apiname}} report</h1>
            <div class="block-group__col" v-for="(item, i) in data" :key="`item-${i}`">
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
    name:"formtype",
    async asyncData({$axios, params}) {
        var reportType = params.id;
        var apiname = ""
        var formType = ""
        
        try {
            switch (reportType) {
                case "sketch-report":
                    apiname = "sketch"
                    break;
                case "logs-report":
                    apiname = "logs"
            }
            let data = await $axios.$get(`/api/${apiname}`);
            return {
                data,
                reportType,
                apiname
            }
        } catch (e) {
            console.error(e)
        }
    }
}
</script>