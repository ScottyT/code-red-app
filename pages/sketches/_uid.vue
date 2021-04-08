<template>
    <div>
        <span v-if="!authUser"><LazyLoginForm /></span>
        <LazySketchForms v-else :formname="formName" />
    </div>
</template>
<script>
export default {
    head() {
        return {
            title: "Sketch"
        }
    },
    data() {
        return {
            authUser: false
        }
    },
    /* async middleware({store, redirect}) {
        if (store.state.user.email == null) {
            return redirect("/")
        }
    }, */
    async asyncData({$axios, params}) {
        try {
            var formName = ""
            switch (params.uid) {
                case "moisture-sketch":
                    formName = "Moisture Mapping Location and Sketch"
                    break;
                case "measurements-sketch":
                    formName = "Measurements and Sketch"
                    break;
                case "equipment-location-sketch":
                    formName = "Equipment Location and Sketch"
                    break;
                default:
                    formName = "Sketch Form"
            }
            return { formName }
        } catch(e) {

        }
    },
    mounted() {
        this.$nextTick(() => {
            this.authUser = this.$fire.auth.currentUser
        })
    }
}
</script>