import { onMounted, ref, useAsync, useContext, useFetch } from "@nuxtjs/composition-api";

export default function useReports() {
    let reports = ref([])
    let report = ref({})
    const { $axios, $fire } = useContext()
    
    function getReports() {
        const { fetch: fetchReports, fetchState } = useFetch(async () => {
            await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
                $axios.$get(`/api/reports`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    reports.value = res
                })
            })
        })
        return { fetchReports, reports, fetch, fetchState }
    }

    const getReport = (path) => {       
        const { fetch: fetchReport, fetchState } = useFetch(async () => {
            await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
                $axios.$get(`${process.env.serverUrl}/api/report/${path}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    report.value = res
                })
            })
        })
        return { fetchReport, report, fetchState }
    }
    return { getReports, reports, report, getReport }
}