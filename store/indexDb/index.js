import { set, values, del } from 'idb-keyval';

export const state = () => ({
    reports: [],
    error:"",
    success:""
})
export const mutations = {
    setReport: (state, payload) => {
        state.reports = payload
    },
    addRep: (state, newReport) => {
        state.reports.push(newReport)
    },
    deleteRep: (state, reportIndex) => {
        state.reports.splice(reportIndex, 1)
    },
    setError: (state, error) => {
        state.error = error
    },
    setSuccess: (state, success) => {
        state.success = success
    }
};
export const actions = {
    addReport({ commit, dispatch }, newReport) {        
        dispatch('saveReports', newReport)
    },
    addCreditCard({commit, dispatch}, newReport) {
        dispatch('saveCreditCard', newReport)
    },
    deleteReport({ commit }, reportInfo, reportIndex) {
        console.log(reportIndex)
        commit('deleteRep', reportIndex)
        if (reportInfo.ReportType === 'credit-card') {
            del(reportInfo.cardNumber)
            return;
        }
        del(reportInfo.JobId)
    },
    async checkStorage({ state, commit }) {
        await values().then((values) => {
            
            commit('setReport', values)
        }).catch((err) => {
            commit('setReport', [])
            commit("setError", err)
        })
    },
    async saveReports({ state, commit }, newReport) {
        await set(newReport.JobId, newReport).then(() => commit('addRep', newReport))
            .catch((err) => commit("setError", err))
    },
    async saveCreditCard({ state, commit }, newReport) {
        await set(newReport.cardNumber, newReport).then(() => commit('addRep', newReport))
            .catch((err) => commit("setError", err))
    }
}