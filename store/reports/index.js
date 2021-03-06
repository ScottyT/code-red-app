import { ref } from "@nuxtjs/composition-api"
import { userReports } from "~/composable/userReports"

const state = () => ({
    error: null,
    all: [],
    report: {},
    creditCards:[],
    jobids:null,
    logreports: []
})
const getters = {
    getReports: (state) => {
        return state.all
    },
    getUserReports: (state) => {
      return state.userreports
    },
    getCards: (state) => {
        return state.creditCards
    },
    getFolders: (state) => {
        return state.folders
    },
    getSubfolders: (state) => {
        return state.subfolders
    }
}
const mutations = {
    setLogReports: (state, payload) => {
        state.logreports = payload
    },
    setError: (state, error) => {
        state.error = error
    },      
    setReports: (state, payload) => {
        state.all = payload
    },
    setReport: (state, payload) => {
      state.report = payload
    },
    setCreditCards: (state, payload) => {
        state.creditCards = payload
    },     
    setJobIds: (state, payload) => {
        state.jobids = payload
    }
}
const actions = {
    async fetchLogs({ commit, state }, authUser) {
      if (authUser) {
        await this.$axios.$get(`/api/logs/${authUser.email}`).then((res) => {
          let copyArr = JSON.parse(JSON.stringify(res));
          commit('setLogReports', res)
        }).catch((err) => {
          commit('setError', err)
        })
      }   
    },
    async fetchReports({ commit, dispatch }, authUser) {
      if (authUser) {
        await authUser.getIdToken(true).then((idToken) => {
          this.$axios.$get("/api/reports", {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
            commit('setReports', res)
            dispatch('mappingJobIds')
          })
        }).catch((err) => {
          commit('setError', err)
        })
      }
    },
    async fetchReport({ commit }, report) {
      console.log(report)
      await this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
        this.$axios.$get(`/api/reports/${report.value.ReportType}/${report.value.formType}/${report.value.JobId}`, 
          {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
            commit('setReport', res)
        })
      }).catch((err) => {
        commit('setError', err)
      })
    },
    sortReports({ commit, state }, sortDirection) {
      state.reports.sort((r1, r2) => {
        let modifier = 1
        if (sortDirection === 'info-bar__sort--desc') modifier = -1;
        if (r1[this.sortBy] < r2[this.sortBy]) return -1 * modifier;
        if (r1[this.sortBy] > r2[this.sortBy]) return 1 * modifier;     
      })
    },
    mappingJobIds({commit, state}) {
      const jobids = [...new Set(state.all.map((v) => { return v.JobId }))]
      commit('setJobIds', ...jobids)
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}