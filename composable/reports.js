import { onMounted, ref, useAsync, useContext, useFetch } from "@nuxtjs/composition-api";

export default function useReports() {   
    let reports = ref([])
    let report = ref({})
    const { $axios } = useContext()
    
    function getReports(authUser) {
        const { fetch: fetchReports, fetchState } = useFetch(async () => {
            await authUser.getIdToken(true).then((idToken) => {
                $axios.$get(`${process.env.serverUrl}/api/reports`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    reports.value = res
                })
            })
        })
        return { fetchReports, reports, fetchState }
    }

    function getUserReports(email, authUser) {
        const { fetch: fetchUserReports, fetchState } = useFetch(async () => {
            await authUser.getIdToken(true).then((idToken) => {
                $axios.$get(`/api/employee/${email}/reports`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    reports.value = res
                })
            })
        })
        return { fetchUserReports, reports, fetchState }
    }

    function getReport(path, authUser) {       
        const { fetch: fetchReport, fetchState } = useFetch(async () => {
            await authUser.getIdToken(true).then((idToken) => {
                $axios.$get(`${process.env.serverUrl}/api/report/${path}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    report.value = res
                })
            })
        })
        return { fetchReport, report, fetch, fetchState }
    }
    return { getReports, reports, report, getReport, getUserReports }
}