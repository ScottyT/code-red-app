import { ref } from "@vue/composition-api";
import axios from 'axios';
export default function useUsers() {
    let user = ref({})
    let avatar = ref({})
    function fetchUser(userEmail) {
        fetch(`${process.env.serverUrl}/api/employee/${userEmail}`)
            .then(res => res.json())
            .then(data => (user.value = data));
    }
    function fetchAvatar(userEmail) {
        fetch(`${process.env.serverUrl}/api/employee/${userEmail}/avatar`)
            .then(res => res.json())
            .then((data) => {
                if (data === null) {
                    return
                }
                var buff = Buffer.from(data.img.data).toString('base64')
                var type = data.img.contentType
                avatar.value = { img: buff, contentType: type }
            })
            .catch(err => console.log(err))
            /* axios.get(`${process.env.serverUrl}/api/employee/${userEmail}/avatar`)
                .then((res) => {
                    var data = res.json()
                    return data
                }).catch((err) => {
                    return
                }) */
    }
    
    /* .then((res) => {
        var data = res.json()
        if (data.error !== '') {
            return
        }
        var buff = Buffer.from(data.img.data).toString('base64')
        var type = data.img.contentType
        avatar.value = { img: buff, contentType: type }
    }) */
    return { fetchUser, fetchAvatar, user, avatar }
}