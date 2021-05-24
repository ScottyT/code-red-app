import { ref } from "@vue/composition-api";

export default function useReports() {   
    let reports = ref([])

    function fetchReports() {
        fetch(`${process.env.serverUrl}/api/reports`)
            .then(res => res.json())
            .then(data => (reports.value = data))
    }
    return { fetchReports, reports }
}