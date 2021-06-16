import { ref, useContext, useFetch } from "@nuxtjs/composition-api";

export const userReports = (email) => {
    const reports = ref([])
    const { root, $fire, $axios } = useContext()
    const { fetch: fetchUserReports } = useFetch(async () => {
        await $fire.auth.currentUser.getIdToken(true).then((idToken) => {
            $axios.$get(`/api/employee/${email}/reports`, {headers: {authorization: `Bearer ${idToken}`}})
                .then((res) => {
                    reports.value = res
                }).catch((err) => {
                    console.log(err)
                })
        })
    })
    return { reports, fetchUserReports }
}