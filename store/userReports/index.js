import { computed, ref, reactive, readonly } from "@nuxtjs/composition-api"
import { userReports } from "~/composable/userReports"

const state = () => reactive({
    all: [],
    loading: false
})

const methods = {
    setReports(reports) {
        state.loading = true
        state.all = reports
        state.loading = false
    },
    setLoading(loadState) {
        console.log(loadState)
        state.loading = loadState
    },
    async loadReports() {
        const { reports, fetchUserReports, loading } = userReports()
        console.log(loading)
        await fetchUserReports().then(() => {
            console.log('success')
            this.setReports(reports)
            
        })
        console.log(loading)
    }
}

const getters = {
    getReports() {
        return state.all
    }
}
//const getReports = () => { return state.all }
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
    getters
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