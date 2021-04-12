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
    deleteRep: (state, report) => {
        for (var i = 0; i < state.reports.length; i++) {
            var obj = state.reports[i];
            if (report.key === obj.key) {
                state.reports.splice(i, 1)
                i--;
            }
        }
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
    deleteReport({commit}, reportInfo) {        
        commit('deleteRep', reportInfo)
        if (reportInfo.ReportType === 'credit-card') {
            del(reportInfo.cardNumber)
            return;
        }
        del(reportInfo.key)
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
        var keyname = ""
        if (newReport.CaseFileType === 'containment') {
            keyname = "containment-rep-"
        }
        if (newReport.CaseFileType === 'technician') {
            keyname = "technician-rep-"
        }
        if (newReport.ReportType === 'dispatch' || newReport.ReportType === 'rapid-response') {
            keyname = "report-"
        }
        if (newReport.ReportType === 'aob') {
            keyname = "aob-"
        }
        if (newReport.ReportType === 'coc') {
            keyname = "coc-"
        }
        if (newReport.ReportType === 'sketch-report') {
            keyname = newReport.sketchType
        }
        newReport.key = keyname + newReport.JobId
        await set(keyname + newReport.JobId, newReport).then(() => commit('addRep', newReport))
            .catch((err) => commit("setError", err))
    },
    async saveCreditCard({ state, commit }, newReport) {
        newReport.key = newReport.cardNumber
        await set(newReport.cardNumber, newReport).then(() => commit('addRep', newReport))
            .catch((err) => commit("setError", err))
    },
    async saveCaseFile({state, commit}, newReport) {
        await set(`case-file-${newReport.JobId}`, newReport).then(() => commit('addRep', newReport))
            .catch((err) => commit("setError", err))
    }
}
export const getters = {
    getSavedReports: (state) => {
        return state.reports
    }
}