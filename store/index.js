import axios from 'axios'
export const state = () => ({
  user: null,
  authUser: null,
  error: null,
  isAdmin: null,
  employees: [],
  reports: [],
  creditCards:[],
  jobids:[]
})

export const mutations = {
  setUser: (state, payload) => {
    state.user = payload
  },
  setError: (state, error) => {
    state.error = error
  },
  setAdmin: (state, payload) => {
    state.isAdmin = payload
  },
  setEmployees: (state, payload) => {
    state.employees = payload
  },
  setReports: (state, payload) => {
    state.reports = payload
  },
  setCreditCards: (state, payload) => {
    state.creditCards = payload
  },
  SET_USER: (state, authUser) => {
   // console.log("authUser:", authUser)
    state.user = {
      name: authUser.name,
      email: authUser.email,
      id: authUser.id,
      role: authUser.role
    }
  },
  setJobIds: (state, payload) => {
    state.jobids = payload
  }
}

export const actions = {
  async nuxtServerInit({ state, dispatch, commit }, { res, $axios, $fire }) {
    if ($fire.auth.currentUser) {
      const {...authUser } = $fire.auth.currentUser
      
      await dispatch('onAuthStateChangedAction', {
        authUser
      })
    }
    const employees = await $axios.$get("/api/employees")
    const reports = await $axios.$get("/api/reports")
    const creditcards = await $axios.$get("/api/credit-cards")
    let newArr = reports.reduce((unique, o) => {
      if (!unique.some(obj => obj.JobId === o.JobId && obj.ReportType === o.ReportType)) {
        unique.push(o)
      }
      return unique
    }, [])
    commit('setEmployees', employees)
    //commit('setReports', reports)
    await dispatch('fetchReports')
    commit('setCreditCards', creditcards)
    commit('setUser', {
      email: null,
      id: null,
      role: null,
      name: null
    })
  },
  async onAuthStateChangedAction({ commit, dispatch }, { authUser }) {
    if (!authUser) {
      //await dispatch('signout')
      return
    }
    
    if (authUser && authUser.getIdToken) {
      try {
        await axios.get(`https://code-red-lm5dxmp3ka-uc.a.run.app/api/employee/${authUser.email}`).then((res) => {
          commit('SET_USER', {
            email: res.data.email,
            id: res.data.id,
            role: res.data.role,
            name: res.data.name
          })
        })       
      } catch (e) {
        console.error(e)
      }
    }
  },
  async fetchReports({ commit }) {
    await this.$axios.$get("/api/reports").then((res) => {
      commit('setReports', res)
    }).catch((err) => {
      commit('setError', err)
    })
  },
  async signout({ commit }) {
    await this.$fire.auth.signOut().then(() => {
      this.$router.push("/login")
      commit('setUser', {
        email: null,
        id: null,
        role: null,
        name: null
      })
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
    const jobids = state.reports.map((v) => { return v.JobId })
    commit('setJobIds', jobids)
  }
}
export const getters = {
  getEmployees: (state) => {
    return state.employees
  },
  getUser: (state) => {
    return state.user
  },
  getReports: (state) => {
    return state.reports
  },
  getCards: (state) => {
    return state.creditCards
  },
  getFolders: (state) => {
    return state.folders
  },
  getSubfolders: (state) => {
    return state.subfolders
  },
  isLoggedIn: (state) => {
    try {
      return state.user.email !== null
    } catch {
      return false
    }
  }
}
