<template>
    <div class="form-wrapper">
        <h1 class="text-center">{{company}}</h1>
        <h3 class="text-center">ATMOSPHERIC READINGS</h3>
        <ValidationObserver ref="form" v-slot="{errors}">
            <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h3 class="form__input--error">{{ error[0] }}</h3>
                    </div>
                </div>
            </v-dialog>
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <h3 class="alert alert--error">{{errorMessage}}</h3>
            <form ref="form" class="form" @submit.prevent="onSubmit" v-if="!submitted">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" v-slot="{errors, ariaMsg}" name="Job ID" class="form__input-group form__input-group--normal">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID:</label>
                        <i class="form__select--icon icon--angle-down mdi" aria-label="icon"></i>
                        <select class="form__input" v-model="selectedJobId">
                            <option disabled value="">Please select a Job ID</option>
                            <option v-for="(item, i) in $store.state.reports.jobids" :key="`jobids-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="startDate" rules="required" v-slot="{errors, ariaMsg}" name="Initial Starting Date" class="form__input-group form__input-group--short">
                        <label for="initDate" class="form__label">Initial Starting Date:</label>
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
                    <ValidationProvider vid="endDate" rules="required" v-slot="{errors, ariaMsg}" name="End Date" class="form__input-group form__input-group--short">
                        <label for="enddate" class="form__label">End Date:</label>
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
                            <div class="form__label">Description</div>
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <div>Day {{n}}</div>
                        </div>
                    </div>
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <div class="form__label">Tech ID #</div>
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <input type="text" class="form__input" readonly v-model="getUser.id" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in readingsArr" :key="`row-${i}`">
                        <div class="form__table--cols">
                            <div class="form__label">{{row.text}}</div>
                        </div>
                        <div class="form__table--cols" v-for="(item, j) in row.day" :key="`col-${j}`">
                            <input type="text" :tabindex="j" v-model="item.value" class="form__input" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <div class="form__label">Loss Classification</div>
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <div>4</div>
                        </div>
                    </div>
                    <div class="form__table--rows form__table" v-for="(row, i) in lossArr" :key="`lossrow-${i}`">
                        <div class="form__table--cols">
                            <div class="form__label">{{row.text}}</div>
                        </div>
                        <div class="form__table--cols" v-for="(item, j) in row.day" :key="`col-${j}`">
                            <input type="number" :tabindex="j" v-model="item.value" class="form__input" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows row-heading">
                        <div class="form__table--cols">
                            <h3>Water Category/Class</h3>
                        </div>                       
                    </div>
                    <div class="form__table--rows form__table" v-for="(row, i) in catArr" :key="`catrow-${i}`">
                        <div class="form__table--cols">
                            <div class="form__label">{{row.text}}</div>
                        </div>
                        <div class="form__table--cols" v-for="(item, j) in row.day" :key="`col-${j}`">
                            <input type="number" :tabindex="j" v-model="item.value" class="form__input" />
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
    name: "AtmosphericReadings",
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
        catArr: [
            {text: "Class/Category Water 1", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Class/Category Water 2", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Class/Category Water 3", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Class/Category Water 4", day: [
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
        submitted: false,
        errorMessage: "",
        selectedJobId: "",
        initDate: new Date().toISOString().substr(0, 10),
        initDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        endDate: vm.addDays(new Date(), 7).toISOString().substr(0, 10),
        endDateFormatted: vm.formatDate(vm.addDays(new Date(), 7).toISOString().substr(0, 10)),
        initDateModal: false,
        endDateModal: false,
        notes: ""
    }),
    props: ['company', 'abbreviation'],
    head() {
        return {
            title: "Atmospheric Readings"
        }
    },
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
        ...mapGetters({getReports: 'reports/getReports', getUser: 'users/getUser'})
    },
    methods: {
        ...mapActions({
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
            this.submitting = true
            const reports = this.getReports.filter((v) => {
                return v.ReportType === 'atmospheric-readings'
            })
            const jobids = reports.map((v) => {
                return v.JobId
            })
            const post = {
                JobId: this.selectedJobId,
                ReportType: "atmospheric-readings",
                startDate: this.initDateFormatted,
                endDate: this.endDateFormatted,
                formType: "logs-report",
                readingsLog: this.readingsArr,
                lossClassification: this.lossArr,
                categoryData: this.catArr,
                notes: this.notes,
                teamMember: this.getUser
            };
            this.$refs.form.validate().then(success => {
                if (!success) {
                    this.submitting = false
                    this.errorDialog = true
                    return goTo(0)
                }
                if (this.$nuxt.isOffline)  {
                    if (!jobids.includes(this.selectedJobId)) {
                        this.addReport(post).then(() => {
                            this.submittedMessage = "Form was successfully saved"
                            this.errorMessage = ""
                            this.submitting = false
                            this.submitted = true
                            setTimeout(() => {
                                this.submittedMessage = ""
                                this.errorMessage = ""
                            }, 2000)
                        })
                    } else {
                        this.$refs.form.setErrors({
                            JobId: ['Job ID of this report already exists']
                        })
                        return goTo(0)
                    }
                } 
                if (this.$nuxt.isOnline) {
                    this.$axios.$post(`/api/logs-report/new`, post).then((res) => {
                        if (res.errors) {
                            this.errorDialog = true
                            this.submitting = false
                            this.$refs.form.setErrors({
                                JobId: res.errors.filter(obj => obj.param === 'JobId').map(v => v.msg)
                            })
                            return goTo(0)
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
        this.checkStorage()
    }
}
</script>
<style lang="scss">
.reading-logs {
    grid-template-rows:60px repeat(18, 1fr);
}
</style>