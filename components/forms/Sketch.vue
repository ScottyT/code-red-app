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
                    <ValidationProvider vid="JobId" name="Job ID" v-slot="{errors}" rules="required" class="form__input--input-group-simple">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID: </label>
                        <select class="form__select" v-model="selectedJobId">
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
import { defineComponent, useStore, computed, ref, onMounted } from '~/node_modules/@nuxtjs/composition-api/dist/runtime'
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
        return {
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
            this.submitting = true
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
                        this.addReport(post).then(() => {
                            this.submittedMessage = "Form was saved successfully"
                            this.submitting = false
                            this.errorMessage = ""
                            setTimeout(() => {
                                this.submittedMessage = ""
                                this.errorMessage = ""
                            }, 5000)
                        })
                    } else {
                        this.errorDialog = true
                        this.submitting = false
                        this.$refs.form.setErrors({
                            JobId: ['Job ID already exists for this sketch type']
                        })
                    }
                }
                if (this.$nuxt.isOnline) {
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
/* export default {
    props: ['formname'],
    data() {
        return {
            sketchData: {
                data: '',
                isEmpty: true
            },
            sketchFormData: null,
            selectedJobId: "",
            submittedMessage: "",
            errorDialog: false,
            submitting: false
        }
    },
    computed: {
        ...mapGetters(['getUser', 'getReports'])
    },
    methods: {
        ...mapActions({
            mappingJobIds: 'mappingJobIds',
            checkStorage: 'indexDb/checkStorage',
            addReport: 'indexDb/addReport'
        }),
        clear() {
            this.$refs.sketchRef.clearSignature();
            this.sketchData.isEmpty = true
            this.sketchData.data = null
        },
        save() {
            const {
                data,
                isEmpty
            } = this.$refs.sketchRef.saveSignature();
            this.sketchData.data = data;
            this.sketchData.isEmpty = isEmpty

        },
        onBegin() {
            const {
                isEmpty
            } = this.$refs.sketchRef.saveSignature();
            this.sketchData.isEmpty = isEmpty
        },
        onSubmit() {           
            this.submittedMessage = ""
            this.submitting = true
            const sketchReps = this.getReports.filter((v) => {
                return v.formType === this.$route.params.uid
            })
            const sketchRepsIds = sketchReps.map((v) => {
                return v.JobId
            })
            const sketchTypes = sketchReps.map((v) => {
                return v.formType
            })
            const post = {
                JobId: this.selectedJobId,
                teamMember: this.getUser,
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
                        this.addReport(post).then(() => {
                            this.submittedMessage = "Form was saved successfully"
                            this.submitting = false
                            this.errorMessage = ""
                            setTimeout(() => {
                                this.submittedMessage = ""
                                this.errorMessage = ""
                            }, 5000)
                        })
                    } else {
                        this.errorDialog = true
                        this.submitting = false
                        this.$refs.form.setErrors({
                            JobId: ['Job ID already exists for this sketch type']
                        })
                    }
                }
                if (this.$nuxt.isOnline) {
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
    },
    mounted() {
        window.addEventListener("resize", this.$refs.sketchRef.resizeCanvas())
        this.checkStorage()
        this.$nextTick(() => {
            this.$refs.sketchRef.resizeCanvas()
        })
    }
} */
</script>
<style lang="scss">
#sketchPad {
  max-width:1200px;
  height:600px;
}
</style>