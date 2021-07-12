import axios from 'axios'
const state = () => ({
    user: null,
    employees: [],
    avatarurl:{},
    error: null,
    loading: true
})
const mutations = {
    setUser: (state, payload) => {
        state.user = payload
    },
    setEmployees: (state, payload) => {
        state.employees = payload
    },
    SET_USER: (state, authuser) => {
        state.user = authuser
    },
    setAvatar: (state, payload) => {
        state.avatarurl = payload
    },
    setError: (state, error) => {
        state.error = error
    },
    setLoading: (state, payload) => {
        state.loading = payload
    }
}
const actions = {
    async onAuthStateChangedAction({ commit, dispatch }, { authUser, claims }) {
        if (!authUser) {
          //await dispatch('signout')
          claims = null
          return
        }
        
        this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
            commit('setLoading', true)
            axios.get(`${process.env.serverUrl}/api/employee/${authUser.email}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                commit('SET_USER', {
                    email: res.data.email,
                    id: res.data.id,
                    role: res.data.role,
                    name: res.data.fname + ' ' + res.data.lname,
                    token: idToken
                })
                commit('setLoading', false)
            })
        })
    },
    async signout({ commit }) {
        await this.$fire.auth.signOut().then(() => {
            window.location.href = "/"
            commit('SET_USER', {
                email: null,
                id: null,
                role: null,
                name: null,
                avatarUrl: null,
                token: null
            })
        })
    },
    fetchAvatar({ commit, dispatch }) {
        /* await this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
            axios.get(`${process.env.serverUrl}/api/employee/${user.email}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                dispatch('settingAvatar', res.data.avatar)
            }).catch((err) => {
                commit('setError', err)
            }) 
        })          */
        var photoUrl = this.$fire.auth.currentUser.photoURL
        commit('setAvatar', photoUrl)
    }
}
const getters = {
    getEmployees: (state) => {
        return state.employees
    },
    getUser: (state) => {
        var user = {
            email: state.user.email,
            id: state.user.id,
            role: state.user.role,
            name: state.user.name
        }
        return user
    },
    isLoggedIn: (state) => {
        try {
            return state.user.email !== null
        } catch {
            return false
        }
    },
    getAvatar: (state) => {
        return state.avatarurl
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}