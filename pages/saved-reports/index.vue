<template>
    <div class="pa-6 reports-wrapper">
        <div class="block-group">
            <h3>Saved Reports</h3>
        </div>
        <LazyReports :reports="reports" />
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
export default {
    name: "SavedReports",
    computed: {
        ...mapGetters({
            getSavedReports: 'indexDb/getSavedReports'
        })
    },
    data() {
        return {
            selectedJob: "",
            reports: []
        }
    },
    async middleware({$fire, redirect}) {
        if ($fire.auth.currentUser == null) {
            return redirect("/")
        }
    },
    async asyncData({$axios, params, store}) {
        try {
            let employee = store.state.user
            let data = await $axios.$get(`/api/employee/${employee.email}`).then(res => res.savedreports);
            return {
                reports: data
            }
        } catch (e) {
            console.error(e)
        }
    },
    methods: {
        ...mapActions({
            fetchLogs: 'fetchLogs'
        })
    },
    mounted() {
        
    }
}
</script>