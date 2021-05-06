<template>
    <div class="form-wrapper">
        <h1 class="text-center">Water Emergency Services Incorporated</h1>
        <h2 class="text-center">UNIT QUANTITY AND EQUIPMENT INVENTORY</h2>
        <ValidationObserver ref="form" v-slot="{errors}">
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h2 class="form__input--error">{{ error[0] }}</h2>
                    </div>
                </div>
            </v-dialog>
            <form ref="form" class="form" @submit.prevent="onSubmit" v-if="!submitted">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" rules="required" v-slot="{errors, ariaMsg}" name="Job ID" class="form__input--input-group">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID:</label>
                        <select class="form__select" v-model="selectedJobId">
                            <option disabled value="">Please select a Job ID</option>
                            <option v-for="(item, i) in $store.state.jobids" :key="`jobids-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
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
                <div class="form__table inventory-logs">
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            
                        </div>
                        <div class="form__table--cols" v-for="n in 7" :key="n">
                            <div class="font-weight-bold">Day {{n}}</div>
                        </div>
                    </div>
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <div>Tech ID #</div>
                        </div>
                        <div class="form__table--cols" v-for="(item, i) in techIdArr[0].day" :key="`techid-${i}`">
                            <input class="form__input" type="text" readonly v-model="getUser.id" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in unitQuantityArr" :key="`unit-${i}`">
                        <div class="form__table--cols">
                            <label class="form__label">{{row.text}}</label>
                        </div>
                        <div class="form__table--cols" v-for="(col, j) in row.day" :key="`unit-col-${j}`">
                            <input type="number" class="form__input" v-model="col.value" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in checkBoxArr" :key="`checkbox-row-${i}`">
                        <div class="form__table--cols">
                            <label class="form__label">{{row.text}}</label>
                        </div>
                        <div class="form__table--cols" v-for="(col, j) in row.day" @click="parentClick" :key="`check-col-${j}`">
                            <input type="checkbox" :checked="false" v-model="col.value" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in serviceArr" :key="`service-${i}`">
                        <div class="form__table--cols">
                            <label class="form__label">{{row.text}}</label>
                        </div>
                        <div class="form__table--cols" v-for="(col, j) in row.day" @click="parentClick" :key="`service-col-${j}`">
                            <input type="checkbox" v-model="col.value" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in onSiteArr" :key="`on-site-${i}`">
                        <div class="form__table--cols">
                            <label class="form__label">{{row.text}}</label>
                        </div>
                        <div class="form__table--cols" v-for="(col, j) in row.day" :key="`col-on-site-${j}`">
                            <input type="number" class="form__input" v-model="col.value" />
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in catArr" :key="`row-cat-${i}`">
                        <div class="form__table--cols">
                            <label class="form__label">{{row.text}}</label>
                        </div>
                        <div class="form__table--cols" v-for="(col, j) in row.day" :key="`col-cat-${j}`">
                            <input type="text" class="form__input" v-model="col.value" />
                        </div>
                    </div>
                </div>
                <div class="form__button-wrapper"><button class="button form__button-wrapper--submit" type="submit">{{ submitting ? 'Submitting' : 'Submit' }}</button></div>
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import goTo from 'vuetify/es5/services/goto'
export default {
    data: (vm) => ({
        submittedMessage: "",
        submitting: false,
        submitted: false,
        errorDialog: false,
        selectedJobId: "",
        initDate: new Date().toISOString().substr(0, 10),
        initDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        endDate: vm.addDays(new Date(), 7).toISOString().substr(0, 10),
        endDateFormatted: vm.formatDate(vm.addDays(new Date(), 7).toISOString().substr(0, 10)),
        initDateModal: false,
        endDateModal: false,
        authUser: false,
        techIdArr: [
            {text: "Tech ID #",
            day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]}
        ],
        unitQuantityArr: [
            {text: "Air Mover", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Mini Air Mover", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Thermal Air Mover", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Dehumidifier LGR+", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Air Scrubber", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Negative Air Machine", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "HEPA VAC", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Containment Posts", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Generator", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "2'' Water Pump", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Water Extractor", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Truck Mount Extractor", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Containment Bags", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Truck load of debris", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Dumpster", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]}
        ],
        checkBoxArr: [
            {text: "Evaluation", day: [
                {text: "day1", value: false},
                {text: "day2",value: false},
                {text: "day3",value: false},
                {text: "day4",value: false},
                {text: "day5",value: false},
                {text: "day6",value: false},
                {text: "day7",value: false}
            ]},
            {text: "Containment", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Structural Drying", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Anti-Microbials", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Microbial - Sealants", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Structural Cleaning", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Quality Control", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Debris Removed", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Content Handling", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]}
        ],
        serviceArr: [
            {text: "Plumber", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "Electrician", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "HVAC Company", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]}
        ],
        onSiteArr: [
            {text: "(On-Site) Textile Bag #", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "(On-Site) Furniture #", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "(On-Site) Item Box #", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "(On-Site) Storage Unit #", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "(On-Site) Debris Bag #", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "(On-Site) Disposal Unit #", day: [
                {text: "day1", value: ""},
                {text: "day2",value: ""},
                {text: "day3",value: ""},
                {text: "day4",value: ""},
                {text: "day5",value: ""},
                {text: "day6",value: ""},
                {text: "day7",value: ""}
            ]},
            {text: "(On-Site) Moving Van #", day: [
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
        ]
    }),
    head() {
        return {
            title: "Unit Quantity and Equipment Inventory"
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
        ...mapGetters(['getReports', 'getUser'])
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
        parentClick(event) {
            var childArr = event.target.childNodes;
            childArr.forEach(child => {
                if (child.type === 'checkbox') {
                    child.checked = !child.checked
                }
            })
        },
        onSubmit() {
            this.submittedMessage = ""
            const reports = this.getReports.filter((v) => {
                return v.formType === 'quantity-inventory-logs'
            })
            const jobids = reports.map((v) => {
                return v.JobId
            })
            var numberInputs = this.unitQuantityArr.concat(this.onSiteArr)
            var checkboxInputs = this.checkBoxArr.concat(this.serviceArr)
            const post = {
                JobId: this.selectedJobId,
                ReportType: "logs-report",
                startDate: this.initDateFormatted,
                endDate: this.endDateFormatted,
                formType: "quantity-inventory-logs",
                quantityData: numberInputs,
                checkData: checkboxInputs,
                categoryData: this.catArr,
                teamMember: this.getUser
            };
            this.$refs.form.validate().then(success => {
                if (!success) {
                    this.submitted = false
                    this.errorDialog = true;
                    return goTo(0)
                }
                if (this.$nuxt.isOffline) {
                    if (!jobids.includes(this.selectedJobId)) {
                        this.addReport(post).then(() => {
                            this.submittedMessage = "Form was saved successfully"
                            this.submitting = false
                            this.submitted = true
                            setTimeout(() => {
                                this.submittedMessage = ""
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
        this.mappingJobIds()
        this.$nextTick(() => {
            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    }
}
</script>
<style lang="scss">
.inventory-logs {
    grid-template-rows:60px repeat(39, 1fr);
    /* input[type=checkbox] {
        width:100%;
    } */
}
</style>