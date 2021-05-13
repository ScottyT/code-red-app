<template>
    <div class="form-wrapper">
        <h1 class="text-center">{{company}}</h1>
        <h2 class="text-center">Psychrometric Charting</h2>
        <ValidationObserver ref="form" v-slot="{passes}">
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <h3 class="alert alert--error">{{errorMessage}}</h3>
            <form class="form" @submit.prevent="passes(onSubmit)">
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
                
                <ValidationProvider class="form__form-group" vid="chart" name="Chart" v-slot="{errors, ariaMsg}">
                    <input type="hidden" v-model="chartImg" />
                    <LazyUiChartPad ref="chartPad" @chartimage="getChart" />                       
                    <span class="form__input--error" v-bind="ariaMsg">{{ errors.msg }}</span>
                </ValidationProvider>
                <v-btn class="button--normal" type="submit">Submit</v-btn>
                <span class="progress">{{progress}}</span>
                <span>{{uploadMessage}}</span>
            </form>            
        </ValidationObserver>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
export default {
    name: "PsychrometricCharting",
    data() {
        return {
            authUser:false,
            submittedMessage: "",
            errorMessage: "",
            selectedJobId: "",
            chartImg: null,
            progress: null,
            uploadMessage: "",
            submitted: false
        }
    },
    props: ["company", "abbreviation"],
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
        ...mapActions({
            addReport: 'indexDb/addReport'
        }),
        getChart(value) {
            this.chartImg = value
        },
        onSubmit() {
            this.submittedMessage = ""
            const reports = this.getReports.filter((v) => {
                return v.ReportType === "chart-report"
            })
            const chartReps = reports.filter((v) => {
                return v.formType === "psychrometric-chart"
            })
            const jobids = chartReps.map((v) => {
                return v.JobId
            })

            const post = {
                JobId: this.selectedJobId,
                ReportType: "chart-report",
                formType: "psychrometric-chart",
                teamMember: this.getUser,
                chart: this.chartImg
            }
            if (this.$nuxt.isOffline) {
                if (!jobids.includes(this.selectedJobId)) {
                    this.addReport(post).then(() => {
                        this.submittedMessage = "Chart was saved for submission later"
                        this.errorMessage = ""
                        this.submitted = true
                        setTimeout(() => {
                            this.submittedMessage = ""
                            this.errorMessage = ""
                        }, 2000)
                    })
                } else {
                    this.errorMessage = "Duplicate Job id exists"
                    return;
                }
            }
            if (this.$nuxt.isOnline) {
                this.$axios.$post("/api/chart-report/new", post).then((res) => {
                    if (res.errors) {
                        this.$refs.form.setErrors({
                            JobId: res.errors.find(obj => obj.param === 'JobId'),
                            chart: res.errors.find(obj => obj.param === 'chart')
                        })
                        return;
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
        console.log(this.$refs)
        this.$nextTick(() => {
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