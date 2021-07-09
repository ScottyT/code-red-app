import { onMounted, ref, useAsync, useContext, useFetch } from "@nuxtjs/composition-api";

export default function useReports() {
    let reports = ref([])
    let report = ref({})
    let error = ref(false)
    const { $axios, $fire } = useContext()
    
    function getReports() {
        const { fetch: fetchReports, fetchState } = useFetch(async () => {
            await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
                $axios.$get(`/api/reports`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    reports.value = res.data
                    error.value = res.error
                })
            })
        })
        return { fetchReports, reports, error, fetch, fetchState }
    }

    const getReport = (path) => {       
        const { fetch: fetchReport, fetchState } = useFetch(async () => {
            await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
                $axios.$get(`${process.env.serverUrl}/api/report/${path}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    report.value = res.data
                    error.value = res.error
                })
            })
        })
        return { fetchReport, report, fetchState, error }
    }
    return { getReports, reports, report, error, getReport }
}