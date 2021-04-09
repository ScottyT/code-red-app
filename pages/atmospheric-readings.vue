<template>
    <div class="form-wrapper">
        <h1 class="text-center">Water Emergency Services Incorporated</h1>
        <h2 class="text-center">ATMOSPHERIC READINGS</h2>
        <ValidationObserver ref="form" v-slot="{errors}">
            <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h2 class="form__input--error">{{ error[0] }}</h2>
                    </div>
                </div>
            </v-dialog>
            <form ref="form" class="form">
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
                <div class="form__table reading-logs">
                    <div class="form__table form__table--rows">
                        <v-col>
                            <div>Description</div>
                        </v-col>
                        <v-col v-for="n in 7" :key="n">
                            <div>Day {{n}}</div>
                        </v-col>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in readingsArr" :key="`row-${i}`">
                        <v-col>
                            <div>{{row.text}}</div>
                        </v-col>
                        <v-col v-for="(item, j) in readingsArr[i].inputsArr" :key="`col-${j}`">
                            <!-- <input type="text" v-model="item[j][i]" /> -->                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          .value" />
                        </v-col>
                    </div>
                </div>
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
export default {
    data: (vm) => ({
        readingsArr:[
            {day1: "Day1", inputsArr: [
                {text: "Tech ID #", value: ""},
                {text: "Affected Temperature", value: ""},
                {text: "Comparative Temperature", value: ""},
                {text: "Elevated Moisture %", value: ""},
                {text: "Comparative Moisture %", value: ""},
                {text: "Elevated Humidity", value: ""},
                {text: "Comparative Humidity", value: ""},
                {text: "Affected GPP", value: ""},
                {text: "Exterior RH", value: ""},
                {text: "Exterior Temperature", value: ""},
                {text: "Contributing Event", value: ""},
                {text: "Precipitation (inches)", value: ""},
                {text: "Wind (mph)", value: ""}
            ], lossArr: [
                {text: "One", value: ""},
                {text: "Two", value: ""},
                {text: "Three", value: ""},
                {text: "Four", value: ""}
            ]}, 
            {day2: "Day2", inputsArr: [
                {text: "Tech ID #", value: ""},
                {text: "Affected Temperature", value: ""},
                {text: "Comparative Temperature", value: ""},
                {text: "Elevated Moisture %", value: ""},
                {text: "Comparative Moisture %", value: ""},
                {text: "Elevated Humidity", value: ""},
                {text: "Comparative Humidity", value: ""},
                {text: "Affected GPP", value: ""},
                {text: "Exterior RH", value: ""},
                {text: "Exterior Temperature", value: ""},
                {text: "Contributing Event", value: ""},
                {text: "Precipitation (inches)", value: ""},
                {text: "Wind (mph)", value: ""}
            ], lossArr: [
                {text: "One", value: ""},
                {text: "Two", value: ""},
                {text: "Three", value: ""},
                {text: "Four", value: ""}
            ]}
        ],
        errorDialog: false,
        submittedMessage: "",
        errorMessage: [],
        selectedJobId: "",
        initDate: new Date().toISOString().substr(0, 10),
        initDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        endDate: vm.addDays(new Date(), 7).toISOString().substr(0, 10),
        endDateFormatted: vm.formatDate(vm.addDays(new Date(), 7).toISOString().substr(0, 10)),
        initDateModal: false,
        endDateModal: false
    }),
    computed: {
        labelsArr() {
            return this.readingsArr.map((v) => {
                return v.inputsArr
            })
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
    },
    mounted() {
        this.checkStorage()
        this.mappingJobIds()
    }
}
</script>
<style lang="scss">
.reading-logs {
    grid-template-rows:60px repeat(18, 1fr);
}
</style>