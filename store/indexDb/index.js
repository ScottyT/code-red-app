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
        commit('addRep', newReport)
        dispatch('saveReports', newReport)
    },
    deleteReport({ commit }, reportInfo, reportIndex) {
        commit('deleteRep', reportIndex)
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
        await set(newReport.JobId, newReport).then(() => commit("setReport", newReport))
            .catch((err) => commit("setError", err))
    }
}