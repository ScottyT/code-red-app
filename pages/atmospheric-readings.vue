<template>
    <div class="form-wrapper">
        <h1>Water Emergency Services Incorporated</h1>
        <h2>ATMOSPHERIC READINGS</h2>
        <ValidationObserver ref="form" v-slot="{errors}">
            <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h2 class="form__input--error">{{ error[0] }}</h2>
                    </div>
                </div>
            </v-dialog>
            <form ref="form" class="form">
                
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
export default {
    data: (vm) => ({
        errorDialog: false,
        selectedJobId: "",
        initDate: new Date().toISOString().substr(0, 10),
        initDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        endDate: new Date().toISOString().substr(0, 10),
        endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10))
    }),
    methods: {
        formatDate(dateReturned) {
            if (!dateReturned) return null
            const [year, month, day] = dateReturned.split('-')
            return `${month}/${day}/${year}`
        },
    }
}
</script>