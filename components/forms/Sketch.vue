<template>
    <span><UiBreadcrumbs page="Sketches" />
    <div class="form-wrapper">
        <h1>{{formname}}</h1>
        <h2>{{submittedMessage}}</h2>
        <ValidationObserver ref="form" v-slot="{errors}">
            <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h3 class="form__input--error">{{ error[0] }}</h3>
                    </div>
                </div>
            </v-dialog>
            <form class="form" @submit.prevent="onSubmit">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" name="Job ID" v-slot="{errors}" rules="required" class="form__input-group form__input-group--normal">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID: </label>
                        <i class="form__select--icon icon--angle-down mdi" aria-label="icon"></i>
                        <select class="form__input" v-model="selectedJobId">
                            <option disabled value="">Please select a Job id</option>
                            <option v-for="(item, i) in $store.state.reports.jobids" :key="`jobid-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error">{{ errors[0] }}</span>
                    </ValidationProvider>                   
                </div>
                <div class="form__form-group">
                    <ValidationProvider v-slot="{errors}" vid="sketch" rules="required" name="Sketch" class="form__input">
                        <input type="hidden" v-model="sketchData.data" />
                        <VueSignaturePad width="100%" height="600px" id="sketchPad" ref="sketchRef" :options="{ onBegin }" />
                        <div class="form__button-wrapper">
                            <button type="button" class="button button--normal" @click="clear">Clear</button>
                            <button type="button" @click="save" :class="`button ${sketchData.isEmpty ? 'button--disabled':''}`">
                                {{sketchData.data !== undefined ? 'Saved' : 'Save'}}
                            </button>
                        </div>
                        <span class="form__input--error">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <button type="submit" class="button button--normal">{{ submitting ? 'Submitting' : 'Submit' }}</button>
            </form>
        </ValidationObserver>
    </div>
    </span>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { defineComponent, useStore, computed, ref, onMounted } from '@nuxtjs/composition-api'
export default defineComponent({
    props: ['formname'],
    setup(props, {root}) {
        const store = useStore()
        const sketchRef = ref(null)
        const user = computed(() => store.getters['users/getUser']); const getReports = computed(() => store.getters['reports/getReports']);
        function checkStorage() { store.dispatch('indexDb/checkStorage') }
        
        const sketchData = ref({}); const sketchFormData = ref(null); const selectedJobId = ref(""); const submittedMessage = ref("");
        const errorDialog = ref(false); const submitting = ref(false);
        onMounted(checkStorage)
        function clear() {
            sketchRef.value.clearSignature();
            sketchData.value.data = null; sketchData.value.isEmpty = true
        }
        function save() {
            const { data, isEmpty } = sketchRef.value.saveSignature();
            sketchData.value = { data, isEmpty }
        }
        function onBegin() {
            const { isEmpty } = sketchRef.value.saveSignature()
            sketchData.value = { isEmpty }
        }
        const addReport = (item) => {
            submitting.value = true
            root.$store.dispatch('indexDb/addReport', item).then(() => {
                submittedMessage.value = "Form was saved successfully"
                submitting.value = false
                errorMessage.value = ""
                setTimeout(() => {
                    submittedMessage.value = ""
                    errorMessage.value = ""
                }, 5000)
            })
        }
        return {
            addReport,
            sketchRef,
            clear, save, onBegin,
            sketchData,
            sketchFormData,
            selectedJobId,
            submittedMessage,
            errorDialog,
            submitting,
            user, getReports
        }
    },
    methods: {
        onSubmit() {           
            this.submittedMessage = ""
            
            const sketchReps = this.getReports.filter((v) => {
                return v.ReportType === this.$route.params.uid
            })
            const sketchRepsIds = sketchReps.map((v) => {
                return v.JobId
            })
            const post = {
                JobId: this.selectedJobId,
                user: this.user,
                sketch: this.sketchData.data,
                ReportType: this.$route.params.uid,
                formType: 'sketch-report'
            };
            this.$refs.form.validate().then(success => {
                if (!success) {
                    this.submitting = false
                    this.errorDialog = true
                    return;
                }
                if (this.$nuxt.isOffline) {
                    if (!sketchRepsIds.includes(this.selectedJobId)) {
                        this.addReport(post)
                    } else {
                        this.errorDialog = true
                        this.submitting = false
                        this.$refs.form.setErrors({
                            JobId: ['Job ID already exists for this sketch type']
                        })
                    }
                }
                if (this.$nuxt.isOnline) {
                    this.submitting = true
                    this.$axios.$post(`/api/sketch-report/new`, post).then((res) => {
                        if (res.errors) {
                            this.errorDialog = true
                            this.submitting = false
                            this.$refs.form.setErrors({
                                JobId: res.errors.filter(obj => obj.param === 'JobId').map(v => v.msg),
                                sketch: res.errors.filter(obj => obj.param === 'sketch').map(v => v.msg),
                            })
                            return
                        }
                        this.submittedMessage = res.message
                        this.submitting = false
                        setTimeout(() => {
                            window.location = "/"
                        }, 2000)
                    })
                }
            })
        }
    }
})
</script>
<style lang="scss">
#sketchPad {
  max-width:1200px;
  height:600px;
}
</style>