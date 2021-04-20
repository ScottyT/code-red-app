<template>
    <LazyLoginForm v-if="!authUser" />
    <div class="form-wrapper" v-else>
        <h1 class="text-center">Water Emergency Services Incorporated</h1>
        <h2 class="text-center">ATMOSPHERIC READINGS</h2>
        <ValidationObserver ref="form" v-slot="{passes}">
            <!-- <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h2 class="form__input--error">{{ error[0] }}</h2>
                    </div>
                </div>
            </v-dialog> -->
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <h3 class="alert alert--error">{{errorMessage}}</h3>
            <form ref="form" class="form" @submit.prevent="passes(onSubmit)" v-if="!submitted">
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
                    <ValidationProvider vid="startDate" rules="required" v-slot="{errors, ariaMsg}" name="Initial Starting Date" class="form__input--input-group">
                        <label id="initDate" class="form__label">Initial Starting Date:</label>
                        <input type="hidden" v-model="initDate" />
                        <v-dialog ref="initDateDialog" v-model="initDateModal" :return-value.sync="initDate" persistent width="400px">
                            <template v-slot:activator="{on, attrs}">
                                <input id="initDate" v-model="initDateFormatted" v-bind="attrs" class="form__input" v-on="on" @blur="initDate = parseDate(initDateFormatted)" />
                            </template>
                            <v-date-picker v-model="initDate" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="#fff" @click="initDateModal = false">Cancel</v-btn>
                                <v-btn text color="#fff" @click="$refs.initDateDialog.save(initDate)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="endDate" rules="required" v-slot="{errors, ariaMsg}" name="End Date" class="form__input--input-group">
                        <label id="enddate" class="form__label">End Date:</label>
                        <input type="hidden" v-model="endDate" />
                        <v-dialog ref="endDateDialog" v-model="endDateModal" :return-value.sync="endDate" persistent width="400px">
                            <template v-slot:activator="{on, attrs}">
                                <input id="enddate" v-model="endDateFormatted" v-bind="attrs" class="form__input" v-on="on"  />
                            </template>
                            <v-date-picker v-model="endDate" scrollable :min="initDate">
                                <v-spacer></v-spacer>
                                <v-btn text color="#fff" @click="endDateModal = false">Cancel</v-btn>
                                <v-btn text color="#fff" @click="$refs.endDateDialog.save(endDate)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form__table reading-logs">
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <div>Description</div>
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <div>Day {{n}}</div>
                        </div>
                    </div>
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <div>Tech ID #</div>
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <input type="text" class="form__input" readonly v-model="getUser.id" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in readingsArr" :key="`row-${i}`">
                        <div class="form__table--cols">
                            <div>{{row.text}}</div>
                        </div>
                        <div class="form__table--cols" v-for="(item, j) in row.day" :key="`col-${j}`">
                            <input type="text" v-model="item.value" class="form__input" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <div>Loss Classification</div>
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <div>4</div>
                        </div>
                    </div>
                    <div class="form__table--rows form__table" v-for="(row, i) in lossArr" :key="`lossrow-${i}`">
                        <div class="form__table--cols">
                            <div>{{row.text}}</div>
                        </div>
                        <div class="form__table--cols" v-for="(item, j) in row.day" :key="`col-${j}`">
                            <input type="numeric" v-model="item.value" class="form__input" />
                        </div>
                    </div>
                </div>
                <div class="form__form-group">
                    <ValidationProvider vid="notes" name="Notes" v-slot="{errors, ariaMsg}" class="form__input-text-area">
                        <label class="form__label" for="notes">Notes:</label>
                        <textarea id="notes" v-model="notes" class="form__input form__input--textarea"></textarea>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form__button-wrapper"><button class="button form__button-wrapper--submit" type="submit">{{ submitting ? 'Submitting' : 'Submit' }}</button></div>
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import goTo from 'vuetify/es5/services/goto'
export default {
    data: (vm) => ({
        readingsArr:[           
            {text: "Affected Temperature", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Comparative Temperature", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Elevated Moisture %", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Comparative Moisture %", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Elevated Humidity", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Comparative Humidity", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Affected GPP", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Exterior RH", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Exterior Temperature", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Contributing Event", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Precipitation (inches)", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Wind (mph)", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},  
        ],
        lossArr: [
                {text: "One", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
                {text: "Two", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
                {text: "Three", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
                {text: "Four", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]}
        ],
        errorDialog: false,
        submittedMessage: "",
        submitting: false,
        errorMessage: "",
        selectedJobId: "",
        initDate: new Date().toISOString().substr(0, 10),
        initDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        endDate: vm.addDays(new Date(), 7).toISOString().substr(0, 10),
        endDateFormatted: vm.formatDate(vm.addDays(new Date(), 7).toISOString().substr(0, 10)),
        initDateModal: false,
        endDateModal: false,
        notes: "",
        submitted: false,
        authUser: false
    }),
    head() {
        return {
            title: "Atmospheric Readings"
        }
    },
    /* async middleware({$fire, redirect}) {
        if ($fire.auth.currentUser === null) {
            return redirect("/")
        }
    }, */
    watch: {
        initDate(val) {
            this.initDateFormatted = this.formatDate(val)
            this.endDateFormatted = this.formatDate(this.addDays(val, 7).toISOString().substr(0, 10))
        },
        endDate(val) {
            this.endDateFormatted = this.formatDate(val)
        }
    },
    computed: {
        ...mapGetters(['getReports', 'getUser'])
    },
    methods: {
        ...mapActions({
            mappingJobIds: 'mappingJobIds',
            addReport: 'indexDb/addReport',
            checkStorage: 'indexDb/checkStorage',
        }),
        addDays(d, days) {
            const date = new Date(d);
            date.setDate(date.getDate() + days);
            return date;
        },
        formatDate(dateReturned) {
            if (!dateReturned) return null
            const [year, month, day] = dateReturned.split('-')
            return `${month}/${day}/${year}`
        },
        parseDate(date) {
            if (!date) return null
            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        onSubmit() {
            this.submittedMessage = ""
            const reports = this.getReports.filter((v) => {
                return v.ReportType === 'atmospheric-readings'
            })
            const jobids = reports.map((v) => {
                return v.JobId
            })
            const post = {
                JobId: this.selectedJobId,
                ReportType: "logs-report",
                startDate: this.initDateFormatted,
                endDate: this.endDateFormatted,
                logType: "atmospheric-readings",
                readingsLog: this.readingsArr,
                lossClassification: this.lossArr,
                notes: this.notes,
                teamMember: this.getUser
            };
            if (this.$nuxt.isOffline)  {
                if (!jobids.includes(this.selectedJobId)) {
                    this.addReport(post).then(() => {
                        this.submittedMessage = "Form was successfully saved"
                        this.errorMessage = ""
                        this.submitted = true
                        setTimeout(() => {
                            this.submittedMessage = ""
                            this.errorMessage = ""
                        }, 5000)
                    })
                } else {
                    this.errorMessage = "Job ID of this report already exists"
                    return goTo(0)
                }
            } 
            if (this.$nuxt.isOnline) {
                /* this.addReport(post).then(() => {
                        this.submittedMessage = "Form was successfully saved"
                        this.errorMessage = ""
                        this.submitted = true
                        setTimeout(() => {
                            this.submittedMessage = ""
                            this.errorMessage = ""
                        }, 5000)
                    }) */
                this.$axios.$post(`/api/logs-report/new`, post).then((res) => {
                    if (res.errors) {
                        this.$refs.form.setErrors({
                            JobId: res.errors.find(obj => obj.param === 'JobId')
                        })
                        return goTo(0)
                    }
                    this.submittedMessage = res.message
                    this.submitted = true
                    setTimeout(() => {
                        window.location = "/"
                    }, 2000)
                })
            }
        }
    },
    mounted() {
        //this.checkStorage()
        //this.mappingJobIds()
        this.$nextTick(() => {
            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    }
}
</script>
<style lang="scss">
.reading-logs {
    grid-template-rows:60px repeat(18, 1fr);
}
</style>