export default function ({ $axios, store, redirect }) {
    $axios.onError(error => {
        if (error.response && error.response.status === 500) {
            redirect('/login')
        }
    })
}