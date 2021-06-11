import { onMounted, ref, useAsync, useContext, useFetch } from "@nuxtjs/composition-api";

export default function useReports() {
    let reports = ref([])
    let report = ref({})
    const { $axios, $fire } = useContext()
    
    function getReports(authUser) {
        const { fetch: fetchReports, fetchState } = useFetch(async () => {
            await authUser.getIdToken(true).then((idToken) => {
                fetch(`${process.env.serverUrl}/api/reports`, {headers: {authorization: `Bearer ${idToken}`}})
                    .then(res => res.json())
                    .then(json => reports.value = json)
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