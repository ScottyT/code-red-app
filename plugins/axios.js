export default function ({ $axios, error: nuxtError, store, redirect, $fire }, inject) {
    //const token = $fireModule.auth.currentUser.getIdToken()
    /* $axios.onError(error => {
        if (error.response && error.response.status === 500) {
            redirect('/login')
        }
    }) */
    $axios.onError(error => {
        nuxtError({
          statusCode: error.response.status,
          message: error.message,
        });
        return Promise.resolve(false);
      })
      console.log(store.state)
    const token = '123'
    const api = $axios.create({
        headers: {
            Authorization: `token ${token}`
        }
    })
    //api.setToken(token, 'Bearer')
    api.setBaseURL(`${process.env.serverUrl}/api`)

    api.onResponse((response) => {
        if (response.status === 404) {
            console.log("Oh no it returned 404")
        }
    })

    inject('api', api)
}