<template>
    <p v-if="$fetchState.pending">Fetching reports...</p>
    <div class="pa-6 reports-wrapper" v-else>
        <button class="button--normal" type="button" @click="$fetch">Refresh</button>
        <div class="block-group" v-if="sketchReports.length > 0">
            <h3 class="reports-wrapper__heading">
                Sketch Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="sketchReports" theme="light" v-else />
        </div>
        <div class="block-group" v-if="logReports.length > 0">
            <h3 class="reports-wrapper__heading">
                Log Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="logReports" theme="light" v-else />
        </div>
        <div class="block-group" v-if="chartData.length > 0">
            <h3 class="reports-wrapper__heading">Charts</h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="chartData" theme="light" v-else />
        </div>
        <div class="block-group" v-if="defaultData.length > 0">
            <h3 class="reports-wrapper__heading">
                Dispatch and Rapid Response Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="defaultData" theme="light" v-else />
        </div>
        <div class="block-group" v-if="caseFileData.length > 0">
            <h3 class="reports-wrapper__heading">
                Daily Containment and Tech Reports
            </h3>
            <p v-if="$fetchState.pending">Fetching reports...</p>
            <LayoutReports :reports="caseFileData" theme="light" v-else />
        </div>
    </div>
    
</template>
<script>
import { defineComponent, ref, useFetch, useStore, computed, watch, onMounted } from '@nuxtjs/composition-api';
export default defineComponent({
    layout: 'dashboard-layout',
    setup(props, {root}) {
        const store = useStore()
        //const reports = computed(() => store.getters['reports/getReports'])
        const isOnline = computed(() => root.$nuxt.isOnline)
        async function checkStorage() { store.dispatch('indexDb/checkStorage') }
       
        let authUser = root.$fire.auth.currentUser
        const [ defaultData, caseFileData, chartData, logReports, sketchReports ] = [ref([]), ref([]), ref([]), ref([]), ref([])]

        const { fetch, fetchState } = useFetch(async () => {
            if (root.$nuxt.isOnline) {
                await authUser.getIdToken(true).then((idToken) => {
                    root.$axios.$get(`${process.env.serverUrl}/api/reports`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                        defaultData.value = res.filter(v => v.ReportType === 'dispatch' || v.ReportType == 'rapid-response')
                        chartData.value = res.filter(v => v.formType === 'chart-report')
                        caseFileData.value = res.filter(v => v.formType === 'case-report')
                        logReports.value = res.filter(v => v.formType === 'logs-report')
                        sketchReports.value = res.filter(v => v.formType === 'sketch-report')
                    })
                })
            } else {
                defaultData.value = reports.filter(v => v.ReportType === 'dispatch' || v.ReportType == 'rapid-response')
                chartData.value = reports.filter(v => v.formType === 'chart-report')
                caseFileData.value = reports.filter(v => v.formType === 'case-report')
                logReports.value = reports.filter(v => v.formType === 'logs-report')
                sketchReports.value = reports.filter(v => v.formType === 'sketch-report')
            }
        })

        fetch()
        fetchState
        watch(isOnline, fetch)
        onMounted(checkStorage)

        return { defaultData, chartData, caseFileData, logReports, sketchReports, isOnline }
    }
})
</script>