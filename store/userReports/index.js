import { computed, ref, reactive, readonly } from "@nuxtjs/composition-api"
import { userReports, fetchUserReports } from "~/composable/userReports"

const state = () => reactive({
    all: []
})

const methods = {
    setReports(reports) {
        state.all = reports
    },
    loadReports(email) {
        const { reports, fetchUserReports } = userReports(email)
        console.log(reports)
        this.setReports(reports)
    }
}

const getReports = computed(() => state.all)
/* function setReports(reports) {
    state.all = reports
}
function loadReports(email) {
    
    const { reports, fetchUserReports } = userReports(email)
    console.log(reports)
    setReports(reports)
} */
//const getReports = computed(() => state.all)

export default {
    state,
    methods,
    getReports
}
/* export const useReports = (email) => {
    const loading = ref(false)
    const items = ref([])
    const { fetchUserReports, reports } = userReports(email)
    const data = computed(() => reports.value)
    function fetchReports(user) {
        loading.value = true
        const { fetchUserReports, reports } = userReports(user)
        items.value = reports.value
        console.log(reports)
        loading.value = false
    }
    console.log(data)
    return {
        loading: computed(() => loading.value),
        reports: data,
        //fetchReports
    }
} */