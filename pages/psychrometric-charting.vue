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
                
                <ValidationProvider class="form__form-group" vid="chart" name="Chart" v-slot="{errors, ariaMsg}">
                    <input type="hidden" v-model="chartImg" />
                    <LazyChartPad ref="chartPad" @chartimage="getChart" />                       
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
import {mapGetters} from 'vuex';
import { uploadChart } from '~/server/controllers/formController';
export default {
    data() {
        return {
            authUser:false,
            submittedMessage: "",
            errorMessage: "",
            selectedJobId: "",
            chartImg: null,
            progress: null,
            uploadMessage: ""
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
            this.chartImg = value
        },
        encodeBase64(data) {
            var buffObj = Buffer.from(data, "base64")
            var base64data = buffObj.toString("base64")
            console.log(base64data)
        },
        onSubmit() {
           //Todo: Convert this to something else that is smaller so form won't error
            this.submittedMessage = ""
            /* const reports = this.getReports.filter((v) => {
                return v.ReportType = "sketch-report"
            })
            const chartReps = reports.filter((v) => {
                return v.formType = "psychrometric-chart"
            })
            if (chartReps.length > 0) {
                const jobids = reports.map((v) => {
                    return v.JobId
                })
            } */
            /* var buffObj = Buffer.from(this.chartImg.data, "base64")
            var base64data = buffObj.toString("base64") */
            const post = {
                JobId: this.selectedJobId,
                ReportType: "chart-report",
                sketchType: "psychrometric-chart",
                teamMember: this.getUser,
                chart: {
                    data: this.chartImg
                }
            }
            if (this.$nuxt.isOffline) {

            }
            if (this.$nuxt.isOnline) {
                this.$axios.$post("/api/chart/upload", post).then((res) => {
                    
                    if (res.errors) {
                        this.$refs.form.setErrors({
                            JobId: res.errors.find(obj => obj.param === 'JobId'),
                            chart: res.errors.find(obj => obj.param === 'chart')
                        })
                    }
                    this.submittedMessage = res.message
                    setTimeout(() => {
                        window.location = "/"
                    }, 2000)
                })
            }
        },
        uploadChart(chart) {
            var storageRef = this.$fire.storage.ref()
            var uploadTask = storageRef.child(`${this.selectedJobId}/chart.png`).put(chart)
            var jobIdRef = storageRef.child(this.selectedJobId);
            uploadTask.on('state_changed', 
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.progress = progress
                switch(snapshot.state) {
                    case this.$fireModule.storage.TaskState.PAUSED:
                        this.uploadMessage = "Upload is paused"
                        break;
                    case this.$fireModule.storage.TaskState.RUNNING:
                        this.uploadMessage = "Upload is running"
                        break;
                }
            }, (error) => {
                console.log(error.message)
            }, () => {
                this.uploadMessage = "Upload is complete"
            })
        }
    },
    mounted() {
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