import { computed, ref, reactive, readonly } from "@nuxtjs/composition-api"
import { userReports } from "~/composable/userReports"
import axios from 'axios';
const state = () => reactive({
    all: [],
    loading: false,
    jobids: null,
})
const loading = computed(() => state.loading);
const methods = {
    setReports(reports) {
        state.loading = true
        state.all = reports
        state.loading = false
    },
    setLoading() {
        state.loading = !state.loading
    },
    setJobids(payload) {
        state.jobids = payload
    },
    async loadReports(authUser) {
        /* const { reports, fetchUserReports, loading } = userReports()
        console.log(loading)
        await fetchUserReports().then(() => {
            console.log('success')
            this.setReports(reports)
            
        })
        console.log(loading) */
        await authUser.getIdToken(true).then((idToken) => {
            axios.get(`${process.env.serverUrl}/api/employee/${authUser.email}/reports`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                this.setReports(res.data)
                this.mappingJobIds()
            })
        })
        
    },
    mappingJobIds() {
        const jobids = [...new Set(state.all.map((v) => { return v.JobId }))]
        this.setJobids(...jobids)
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
    getters,
    loading
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