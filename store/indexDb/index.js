import { set, values, del } from 'idb-keyval';
import reports from '../reports';

const state = () => ({
    reports: [],
    report: {},
    error:"",
    success:""
})
const mutations = {
    setReports: (state, payload) => {
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
    },
    setReport: (state, payload) => {
        /* let report = state.reports.find(
            item => item.ReportType === payload.reportType && item.JobId === payload.id
        )
        if (report) {
            state.report = report
        } else {

        } */
        state.report = payload
    },
    updateField: (state, payload) => {
        const { fieldArr, row, col, data } = {...payload}
        state.report[fieldArr][row].day[col].value = data
    }
};
const actions = {
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
    fetchReport({state, commit, rootState}, params) {
        let report = state.reports.find(
            item => item.ReportType === params.reportType && item.JobId === params.id
        )
        if (report) {
            console.log("things in report")
            commit('setReport', report)
        } else {
            /* await this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
                this.$axios.$get(`/api/reports/${params.reportType}/${params.formType}/${payload.JobId}`, 
                  {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    commit('setReport', res)
                })
              }) */
              console.log("not in report")
            commit('setReport', params)
        }
        
    },
    async checkStorage({ state, commit }) {
        await values().then((values) => {
            
            commit('setReports', values)
        }).catch((err) => {
            commit('setReports', [])
            commit("setError", err)
        })
    },
    async saveReports({ state, commit }, newReport) {
        var keyname = ""
        /* if (newReport.formType === 'containment') {
            keyname = "containment-rep-"
        }
        if (newReport.formType === 'technician') {
            keyname = "technician-rep-"
        } */
        /* if (newReport.ReportType === 'dispatch' || newReport.ReportType === 'rapid-response') {
            keyname = "report-"
        }
        if (newReport.ReportType === 'aob') {
            keyname = "aob-"
        }
        if (newReport.ReportType === 'coc') {
            keyname = "coc-"
        } */
        if (newReport.hasOwnProperty('ReportType')) {
            keyname = newReport.ReportType + "-"
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
const getters = {
    getSavedReports: (state) => {
        return state.reports
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}