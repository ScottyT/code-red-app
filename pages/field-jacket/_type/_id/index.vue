<template>
    
</template>
<script>
export default {
    layout: "dashboard-layout",
    head() {
        return {
            title: "Sketch -" + this.id
        }
    },
    data() {
        return {
            report: {}
        }
    },
    async middleware({store, redirect}) {
        if (store.state.user.role !== "admin") {
            return redirect("/")
        }
    },
    async asyncData({$axios, params}) {
        try {
            var slug = params.slug;
            var id = params.id;
            let data = await $axios.$get(`/api/sketch/${id}`);
            return {
                report: data,
                id
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    }
}
</script>