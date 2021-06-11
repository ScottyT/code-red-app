export const actions = {
  async nuxtServerInit({ state, dispatch, commit }, { res, $axios, $fire }) {
    if ($fire.auth.currentUser) {
      const { allClaims: claims, idToken: token, ...authUser } = $fire.auth.currentUser
      await dispatch('users/onAuthStateChangedAction', {
        authUser,
        claims
      })
    }
    const employees = await $axios.$get("/api/employees")    
    const creditcards = await $axios.$get("/api/credit-cards")   
    commit('users/setEmployees', employees)    
    commit('reports/setCreditCards', creditcards)
    commit('users/SET_USER', {
      email: null,
      id: null,
      role: null,
      name: null,
      token: null
    })
  },
}
