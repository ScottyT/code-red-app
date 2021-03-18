import axios from 'axios'
export const state = () => ({
  user: null,
  authUser: null,
  error: null,
  isAdmin: null,
  employees: [],
  reports: [],
  creditCards:[]
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
    commit('setReports', reports)
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
      await dispatch('signout')
      return
    }
    
    if (authUser && authUser.getIdToken) {
      try {
        await axios.get(`http://localhost:8080/api/employee/${authUser.email}`).then((res) => {
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
  async signout({ commit }) {
    await this.$fire.auth.signOut().then(() => {
      commit('setUser', {
        email: null,
        id: null,
        role: null,
        name: null
      })
    })
  },
  async fetchUser({ commit }, context) {
    const userData = []
    if (context == null) return
    // Might use this way when i get cloud run deploy fixed
    /* await this.$axios.$get(`/getuser/${context}`).then((res) => {
      userData.push(res)
      commit("setUser", userData)
    }).catch((error) => {
      commit('setError', error)
    }) */
    
    /* await this.$fire.auth.currentUser
      .getIdTokenResult()
      .then((idTokenResult) => {
        commit('setAdmin', idTokenResult.claims.admin)
      })
      .catch((error) => {
        console.log(error)
      }) */
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
