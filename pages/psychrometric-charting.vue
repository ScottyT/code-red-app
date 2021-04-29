<template>
    <LazyLoginForm v-if="!authUser" />
    <div class="form-wrapper" v-else>
        <h1 class="text-center">Water Emergency Services Incorporated</h1>
        <h2 class="text-center">Psychrometric Charting</h2>
        <ValidationObserver v-slot="{passes}">
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <h3 class="alert alert--error">{{errorMessage}}</h3>
            <form ref="form" class="form" @submit.prevent="passes(onSubmit)">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" v-slot="{errors, ariaMsg}" name="Job ID" class="form__input--input-group">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID:</label>
                        <select class="form__select" v-model="selectedJobId">
                            <option disabled value="">Please select a Job ID</option>
                            <option v-for="(item, i) in $store.state.jobids" :key="`jobids-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors.msg }}</span>
                    </ValidationProvider>
                </div>
                
                <ValidationProvider class="form__form-group" vid="sketch" name="Chart" v-slot="{errors, ariaMsg}">
                    <input type="hidden" v-model="chartSketch.data" />
                    <LazyChartPad ref="chartPad" @chartimage="getChart" />                       
                    <span class="form__input--error" v-bind="ariaMsg">{{ errors.msg }}</span>
                </ValidationProvider>
                <v-btn class="button--normal" type="submit">Submit</v-btn>
                          
            </form>            
        </ValidationObserver>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            authUser:false,
            submittedMessage: "",
            errorMessage: "",
            selectedJobId: "",
            chartSketch: {
                isEmpty: true,
                data: ""
            },
            bgimage: "https://images.prismic.io/wateremergencyservices-pwa/f4073fed-21fa-41f6-9bfe-4a37485a97cb_PsychrometricChartImage-1200x675.png?auto=compress,format"
        }
    },
    head() {
        return {
            title: "Psychrometric Charting"
        }
    },
    computed: {
        ...mapGetters({
            getUser: 'getUser',
            getReports: 'getReports'
        })
    },
    methods: {
        getChart(value) {
            this.chartSketch.data = value
        },
        onSubmit() {
            const data = this.$refs.chartPad.storedimage.data
            this.submittedMessage = ""
            const reports = this.getReports.filter((v) => {
                return v.ReportType = "sketch-report"
            })
            const chartReps = reports.filter((v) => {
                return v.formType = "psychrometric-chart"
            })
            if (chartReps.length > 0) {
                const jobids = reports.map((v) => {
                    return v.JobId
                })
            }         
            const post = {
                JobId: this.selectedJobId,
                ReportType: "sketch-report",
                sketchType: "psychrometric-chart",
                teamMember: this.getUser,
                sketch: data
            }
            if (this.$nuxt.isOffline) {

            }
            if (this.$nuxt.isOnline) {
                this.$axios.$post("/api/sketch-report/new", post).then((res) => {
                    if (res.errors) {
                        this.$refs.form.setErrors({
                            JobId: res.errors.find(obj => obj.param === 'JobId'),
                            sketch: res.errors.find(obj => obj.param === 'sketch')
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
        
        //this.$refs.chartPad.addImages(this.bgimage[0])
        this.$nextTick(() => {
            
            /* var signaturePad = new SignaturePad(document.getElementById('chart'), {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                penColor: 'rgb(0, 0, 0)'
            }); */

            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    }
}
</script>
<style lang="scss">
.chart {
    //max-width:1200px;
}
</style>