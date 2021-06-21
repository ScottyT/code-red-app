import { computed, ref, useContext, useFetch, watch } from "@nuxtjs/composition-api";

export const userReports = () => {
    const reports = ref([])
    const loading = ref(false)
    const report = ref({})
    const { root, $fire, $axios, $nuxt } = useContext()
    async function fetchUserReports() {
        loading.value = true
        await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
            $axios.$get(`/api/employee/${$fire.auth.currentUser.email}/reports`, {headers: {authorization: `Bearer ${idToken}`}})
                .then((res) => {
                    reports.value = res
                    loading.value = false
                })
        })
    }
    async function fetchReport(path) {
        loading.value = true
        await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
            $axios.$get(`${process.env.serverUrl}/api/report/${path}`, {headers: {authorization: `Bearer ${idToken}`}})
                .then((res) => {
                    report.value = res
                    loading.value = false
                })
        })
    }
    return { reports, fetchUserReports, loading: computed(() => loading.value), fetchReport, report: computed(() => report.value) }
}