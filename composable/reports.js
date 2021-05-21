import { ref } from "@vue/composition-api";

export default function useReports() {
    let user = ref({})
    let reports = ref([])

    function fetchReports() {
        fetch(`${process.env.serverUrl}/api/reports`)
            .then(res => res.json())
            .then(data => (reports.value = data))
    }

    function fetchUser(userEmail) {
        fetch(`${process.env.serverUrl}/api/employee/${userEmail}`)
            .then(res => res.json())
            .then(data => (user.value = data));
    }

    return { fetchUser, fetchReports, reports, user }
}