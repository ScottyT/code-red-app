export default function ({ $axios, store, redirect, $fireModule }, inject) {
    //const token = $fireModule.auth.currentUser.getIdToken()
    $axios.onError(error => {
        if (error.response && error.response.status === 500) {
            redirect('/login')
        }
    })

    /* const api = $axios.create({
        headers: {
            authorization: `Bearer ${token}`
        }
    })

    inject('axios', api) */
}