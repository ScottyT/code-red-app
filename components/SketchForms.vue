<template>
    <div class="form-wrapper">
        <h1>{{formname}}</h1>
        <h2>{{submittedMessage}}</h2>
        <p class="alert alert--error">{{errorMessage}}</p>
        <ValidationObserver ref="form" v-slot="{passes}">
            <form class="form" @submit.prevent="passes(onSubmit)">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" name="Job ID" v-slot="{errors}" class="form__input--input-group-simple">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID: </label>
                        <select class="form__select" v-model="selectedJobId">
                            <option disabled value="">Please select a Job id</option>
                            <option v-for="(item, i) in $store.state.jobids" :key="`jobid-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>                   
                </div>
                <div class="form__form-group">
                    <ValidationProvider v-slot="{errors}" vid="sketch" name="Sketch" class="form__input">
                        <input type="hidden" v-model="sketchData.data" />
                        <VueSignaturePad width="100%" height="600px" id="sketchPad" ref="sketchRef" :options="{ onBegin }" />
                        <div class="form__button-wrapper">
                            <button type="button" class="button button--normal" @click="clear">Clear</button>
                            <button type="button" @click="save" :class="`button ${sketchData.isEmpty ? 'button--disabled':''}`">
                                {{sketchData.data !== '' ? 'Saved' : 'Save'}}
                            </button>
                        </div>
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>
                </div>
                <button type="submit" class="button button--normal">Submit</button>
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: "SketchForms",
    props: ['formname'],
    data() {
        return {
            sketchData: {
                data: '',
                isEmpty: true
            },
            selectedJobId: "",
            submittedMessage: "",
            errorMessage: ""
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
            const userNameObj = {
                first: this.getUser.name.split(" ")[0],
                last: this.getUser.name.split(" ")[1]
            }
            const sketchReps = this.getReports.filter((v) => {
                return v.ReportType === 'sketch-report'
            })
            const sketchRepsIds = sketchReps.map((v) => {
                return v.JobId
            })
            const sketchTypes = sketchReps.map((v) => {
                return v.formType
            })
            const post = {
                JobId: this.selectedJobId,
                teamMember: userNameObj,
                formType: this.$route.params.uid,
                sketch: this.sketchData.data,
                ReportType: 'sketch-report',
                sketchType: this.$route.params.uid
            };
            if (this.$nuxt.isOffline) {
                if (!sketchRepsIds.includes(this.selectedJobId) && sketchTypes.includes(this.$route.params.uid)) {
                    this.addReport(post).then(() => {
                        this.submittedMessage = "Form was saved successfully"
                        this.errorMessage = ""
                        setTimeout(() => {
                            this.submittedMessage = ""
                            this.errorMessage = ""
                        }, 5000)
                    })
                } else {
                    this.errorMessage = "Job ID already exists for this sketch type"
                }
            } 
            if (this.$nuxt.isOnline) {
                this.$axios.$post(`/api/sketch-report/new`, post).then((res) => {
                    if (res.errors) {
                        this.$refs.form.setErrors({                       
                            JobId: res.errors.find(obj => obj.param === 'JobId'),
                            sketch: res.errors.find(obj => obj.param === 'sketch'),
                        })
                    }
                    this.submittedMessage = res.message
                    setTimeout(() => {
                        window.location = "/"
                    }, 2000)
                })
            }
        }
    },
    mounted() {
        this.mappingJobIds()
        this.checkStorage()
    }
}
</script>                                                                                                                                       