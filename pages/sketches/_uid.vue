<template>
    <LazySketchForms :formname="formName" />
</template>
<script>
export default {
    head() {
        return {
            title: "Sketch"
        }
    },
    async middleware({store, redirect}) {
        if (store.state.user.email == null) {
            return redirect("/")
        }
    },
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
    }
}
</script>