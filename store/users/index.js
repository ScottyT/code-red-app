import axios from 'axios'
const state = () => ({
    user: null,
    employees: [],
    avatarurl:{}
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
            axios.get(`${process.env.serverUrl}/api/employee/${authUser.email}`, {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                commit('SET_USER', {
                    email: res.data.email,
                    id: res.data.id,
                    role: res.data.role,
                    name: res.data.fname + ' ' + res.data.lname,
                    token: idToken
                })
                if ('avatar' in res.data) {
                    dispatch('settingAvatar', res.data.avatar)
                }
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
    async fetchAvatar({ commit, dispatch }, user) {
        await axios.get(`${process.env.serverUrl}/api/employee/${user}`).then((res) => {
            dispatch('settingAvatar', res.data.avatar)
        }).catch((err) => {
            commit('setError', err)
        })   
    },
    settingAvatar({ commit }, response) {
        if (response.image.data.length > 1) {
            let buff = Buffer.from(response.image).toString('base64')
            let imageUrl = "data:"+response.contentType+";base64,"+buff
            commit('setAvatar', {
                image: imageUrl
            })
        } else {
            commit('setAvatar', {})
        }
    },
}
const getters = {
    getEmployees: (state) => {
        return state.employees
    },
    getUser: (state) => {
        return state.user
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