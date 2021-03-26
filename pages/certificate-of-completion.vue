<template>
    <div>
        <span v-if="!authUser"><LazyLoginForm /></span>
        <div class="form-wrapper">
            <h1 class="text-center">Water Emergency Services Incorporated</h1>
            <h2 class="text-center">Certificate of Completion</h2>
            <ValidationObserver ref="form" v-slot="{errors}">
                <v-dialog width="400px" v-model="errorDialog">
                    <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h2 class="form__input--error">{{ error[0] }}</h2>
                    </div>
                    </div>
                </v-dialog>
                <h2>{{message}}</h2>
                <h3 class="alert alert--error" v-for="(error, i) in errorMessage" :key="`server-errors-${i}`">{{error}}</h3>
                <form ref="form" class="form" @submit.prevent="submitForm" v-if="!submitted">
                    <fieldset v-if="currentStep === 1">
                        <div class="form__form-group">
                            <ValidationProvider name="Job Id" rules="required" v-slot="{errors}">
                                <input type="hidden" v-model="selectedJobId" />
                                <label for="selectJobId" class="form__label">Job ID</label>
                                <select class="form__select" v-model="selectedJobId">
                                    <option disabled value="">Please select a Job Id</option>
                                    <option v-for="(item, i) in $store.state.jobids" :key="`jobid-${i}`">{{item}}</option>
                                </select>
                                <span class="form__input--error">{{ errors[0] }}</span>
                                <!-- <div class="form__select" @click="selectActive = !selectActive" :class="{ open: selectActive }">
                                    <div class="info-bar__sort--trigger">
                                        <span>{{ selectedJobId.text }}</span>
                                        <v-icon size="30px" light>{{ selectActive ? 'mdi mdi-chevron-up' : 'mdi mdi-chevron-down'}}</v-icon>
                                    </div>
                                    <div class="info-bar__sort--options">
                                        <span class="info-bar__sort--option" v-for="(option, i) in jobIds" :key="`jobids-${i}`" @click="selectedJob(option)">
                                            {{option}}
                                        </span>
                                    </div>
                                </div> -->
                            </ValidationProvider>
                        </div>
                        <p>This Assignment of Claim Agreement (hereinafter referred to as “Assignment” and/or “Agreement”) and Mitigation

                            Contract (hereinafter referred to as “Contract”) is entered into by and between:
                            Water Emergency Services Incorporated (hereinafter referred to as “WESI” and/or “Insured”)

                            and

                            The Owner/Persons of legal authority (hereinafter referred to as “Property Representative”)
                            of the property more commonly known as and identified by the following address:
                        </p>
                        <ValidationProvider rules="required" class="form__form-group" v-slot="{ errors }" name="Subject property">
                            <input type="text" class="form__input" v-model="subjectProperty" /><br />
                            <p>(hereinafter referred to as “Subject Property”)</p>
                            <span class="form__input--error">{{ errors[0] }}</span>
                        </ValidationProvider>
                        <p><strong>Water Emergency Services Incorporated has completed the Assignment of Benefit Agreement and Mitigation Contract in full</strong></p>
                        <p>SHARE: Property Representative will send a copy of this Agreement, Contract, Certificate of Completion, Xactimate and
                            the WESI W9 to the insurance company, the insurance company’s representatives and mortgage institutions to allow WESI
                            to communicate, share and exchange through reasonable introduction and/or through means found proper in the daily course
                            of business information including but not limited to the services that WESI has provided, currently is providing and/or may
                            be required to provide in the future.
                        </p>
                        <p>
                            DIRECTION OF PAYMENT: Property Representative hereby authorizes and unequivocally instructs direct payment of
                            any benefits or proceeds for services rendered pursuant to the Assignment of Claim Agreement and Mitigation Contract and
                            that such payment be made payable directly and solely to WESI and sent exclusively to WESI from the insurance company
                            including but not limited to all invoices, tasks, billable hours and billable units partially and /or completely provided by
                            WESI.
                        </p>
                        <div class="form__form-group form__form-group--inline form__form-group--info-box">
                            <span>
                                <label for="InsuredDeductible" class="form__label">Insured Deductible:</label>
                                <span class="form__input--currency">$<input type="text" id="InsuredDeductible" class="form__input form__input--short" v-model="deductible" @keypress="currencyFormat" /></span>
                            </span>                        
                            <v-spacer></v-spacer>
                            <span>
                                <label for="InsuredEndDate" class="form__label">Insured: Agreed “Term” of Service Minimum End Date:</label>
                                <v-dialog ref="dialogEndDate" v-model="insuredEndDateModal" :return-value.sync="insuredEndDate"
                                    persistent width="400px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input id="InsuredEndDate" v-model="insuredEndDateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                            v-on="on" @blur="insuredEndDate = parseDate(insuredEndDateFormatted)
                                        " />
                                    </template>
                                    <v-date-picker v-model="insuredEndDate" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="#fff" @click="insuredEndDateModal = false">Cancel</v-btn>
                                        <v-btn text color="#fff" @click="$refs.dialogEndDate.save(insuredEndDate)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </span>
                            <span>
                                <div>
                                    <label for="insuredPayment1" class="form__label">Insured Payment 1) = ($500.00 or 50% of Deductible):</label>
                                    <span class="form__input--currency">
                                        $<input type="text" class="form__input form__input--short" v-model="insuredPay1" readonly />
                                    </span>
                                </div>
                                <div class="form__form-group--inline">
                                    <label for="insuredDay1" class="form__label">Day (1) Date:</label>
                                    <v-dialog ref="insuredPayDay1" v-model="insuredPayment.day1Modal" :return-value.sync="insuredPayment.day1Date" persistent width="400px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <input id="insuredDay1" v-model="insuredPayment.day1DateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                                v-on="on" @blur="insuredPayment.day1Date = parseDate(insuredPayment.day1DateFormatted)
                                            " />
                                        </template>
                                        <v-date-picker v-model="insuredPayment.day1Date" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="#fff" @click="insuredPayment.day1Modal = false">Cancel</v-btn>
                                            <v-btn text color="#fff" @click="$refs.insuredPayDay1.save(insuredPayment.day1Date)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </div>
                            </span>
                            <span>
                                <div>
                                    <label for="insuredPayment2" class="form__label">Insured Payment 2) = (Remaining 50% of Deductible):</label>
                                    <span class="form__input--currency">
                                        $<input id="insuredPayment2" type="text" class="form__input form__input--short" v-model="insuredPay2" readonly />
                                    </span>
                                </div>
                                <div class="form__form-group--inline">
                                    <label for="insuredDay5" class="form__label">Day (5) Date:</label>(upon pickup)
                                    <v-dialog ref="insuredPayDay5" v-model="insuredPayment.day5Modal" :return-value.sync="insuredPayment.day5Date" persistent width="400px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <input id="insuredDay5" v-model="insuredPayment.day5DateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                                v-on="on" @blur="insuredPayment.day5Date = parseDate(insuredPayment.day5DateFormatted)
                                            " />
                                        </template>
                                        <v-date-picker v-model="insuredPayment.day5Date" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="#fff" @click="insuredPayment.day5Modal = false">Cancel</v-btn>
                                            <v-btn text color="#fff" @click="$refs.insuredPayDay5.save(insuredPayment.day5Date)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </div>
                            </span>
                            <span>
                                <div>
                                    <label class="form__label">Insured Payment 3) = “Available Proceeds” Per terms of this agreement</label>
                                </div>
                            </span>
                            <v-spacer></v-spacer>
                            <span>
                                <label class="form__label">Insured Payment 4) = Succeeding Day of “Available Proceeds” for Remaining Balance</label>
                            </span>
                        </div>
                        <div class="form__form-group form__form-group--inline form__form-group--info-box">
                            <span>
                                <label for="NonInsuredEndDate" class="form__label">Non-Insured or Still Pending Coverage: Agreed “Term” of Service Minimum End Date:</label>
                                <v-dialog ref="dialognoninsuredEndDate" v-model="nonInsuredPayment.endDateModal" :return-value.sync="nonInsuredPayment.endDate"
                                    persistent width="400px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input id="NonInsuredEndDate" v-model="nonInsuredPayment.endDateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                            v-on="on" @blur="nonInsuredPayment.endDate = parseDate(nonInsuredPayment.endDateFormatted)
                                        " />
                                    </template>
                                    <v-date-picker v-model="nonInsuredPayment.endDate" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="#fff" @click="nonInsuredPayment.endDateModal = false">Cancel</v-btn>
                                        <v-btn text color="#fff" @click="$refs.dialognoninsuredEndDate.save(nonInsuredPayment.endDate)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </span>
                            <span>
                                <label for="NonInsuredDay1Date" class="form__label">Non-Insured or Still Pending Coverage: Payment 1) = $750.00 Day (1) Date:</label>
                                <v-dialog ref="nonInsuredDay1" v-model="nonInsuredPayment.day1Modal" :return-value.sync="nonInsuredPayment.day1Date"
                                    persistent width="400px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input id="NonInsuredDay1Date" v-model="nonInsuredPayment.day1DateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                            v-on="on" @blur="nonInsuredPayment.day1Date = parseDate(nonInsuredPayment.day1DateFormatted)
                                        " />
                                    </template>
                                    <v-date-picker v-model="nonInsuredPayment.day1Date" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="#fff" @click="nonInsuredPayment.day1Modal = false">Cancel</v-btn>
                                        <v-btn text color="#fff" @click="$refs.nonInsuredDay1.save(nonInsuredPayment.day1Date)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </span>
                            <span>
                                <label for="NonInsuredDay5Date" class="form__label">Non-Insured or Still Pending Coverage: Payment 2) = $750.00 Day (5) Date:</label>(upon pickup)
                                <v-dialog ref="nonInsuredDay5" v-model="nonInsuredPayment.day5Modal" :return-value.sync="nonInsuredPayment.day5Date"
                                    persistent width="400px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <input id="NonInsuredDay5Date" v-model="nonInsuredPayment.day5DateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                            v-on="on" @blur="nonInsuredPayment.day5Date = parseDate(nonInsuredPayment.day5DateFormatted)
                                        " />
                                    </template>
                                    <v-date-picker v-model="nonInsuredPayment.day5Date" scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="#fff" @click="nonInsuredPayment.day5Modal = false">Cancel</v-btn>
                                        <v-btn text color="#fff" @click="$refs.nonInsuredDay5.save(nonInsuredPayment.day5Date)">OK</v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </span>
                            <span>
                                <label for="NonInsuredDay5Date" class="form__label">Non-Insured or Still Pending Coverage: Payment 3) = Succeeding Day of the Term for Remaining Balance</label>                           
                            </span>
                        </div>
                        <ValidationProvider rules="required" name="Rating" v-slot="{errors}" class="form__form-group">
                            <p><strong>Please Circle: RATE YOUR EXPIERENCE WITH OUR SERVICES:</strong></p>
                            <ul class="form__form-group--inline">
                                <li v-for="(item, i) in ratings" :key="`ratings-${i}`" class="form__input--radio">
                                    <label :for="item">{{item}}</label>
                                    <input :id="item" type="radio" v-model="selectedRating" :value="item" />
                                </li>
                            </ul>
                            <span class="form__input--error">{{ errors[0] }}</span>
                        </ValidationProvider>
                        <p>I am satisfied with the completion of all mitigation services and all other related services performed on the Subject Property by Water Emergency Services Incorporated.</p>
                        <div class="form__form-group--inline form__form-group--info-box form__form-group--column">
                            <span>
                                <ValidationProvider rules="required" name="Representative" v-slot="{errors}" class="form__input--input-group">
                                    <label for="repPrint" class="form__label">Representative (Print):</label>
                                    <input id="repPrint" type="text" class="form__input form__input--long" v-model="repPrint" />
                                    <span class="form__input--error">{{ errors[0] }}</span>
                                </ValidationProvider>
                                <div class="form__input--input-group">
                                    <label for="timeRepPrint" class="form__label">Time</label>
                                    <v-dialog ref="timeRepDialog" v-model="repTimeModal" :return-value.sync="repPrintTime" persistent width="400px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <input id="NonInsuredDay5Date" v-model="repPrintTimeFormatted" v-bind="attrs" class="form__input form__input--short" v-on="on" readonly />
                                        </template>
                                        <v-time-picker v-model="repPrintTime" scrollable>
                                        <v-spacer></v-spacer>
                                            <v-btn text color="#fff" @click="repTimeModal = false">Cancel</v-btn>
                                            <v-btn text color="#fff" @click="$refs.timeRepDialog.save(repPrintTime)">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </div>
                            </span>                        
                            <span>
                                <div class="form__input--input-group">
                                    <label for="repSign" class="form__label">Representative (Sign)</label>
                                    <lazy-signature-pad-modal :sigData="repSign" sigRef="repSigPad" name="Representative Signature" />
                                </div>
                                <div class="form__input--input-group">
                                    <label for="dateRepSign" class="form__label">Date</label>
                                    <v-dialog ref="dialogRepSign" v-model="repSignModal" :return-value.sync="repSignDate" persistent width="400px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <input id="dateRepSign" v-model="repSignDateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                                v-on="on" @blur="repSignDate = parseDate(repSignDateFormatted)" />
                                        </template>
                                        <v-date-picker v-model="repSignDate" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="#fff" @click="repSignModal = false">Cancel</v-btn>
                                            <v-btn text color="#fff" @click="$refs.dialogRepSign.save(repSignDate)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </div>
                            </span>
                            <span>
                                <div class="form__input--input-group">
                                    <label for="teamSign" class="form__label">Team Member (Sign)</label>
                                    <lazy-signature-pad-modal :sigData="teamMemberSig" sigRef="teamMemberSigPad" name="Team Member Signature" />
                                </div>
                                <div class="form__input--input-group">
                                    <label for="dateTeamSign" class="form__label">Date</label>
                                    <v-dialog ref="dialogTeamSign" v-model="teamSignModal" :return-value.sync="teamSignDate" persistent width="400px">
                                        <template v-slot:activator="{ on, attrs }">
                                            <input id="dateTeamSign" v-model="teamSignDateFormatted" v-bind="attrs" class="form__input form__input--short" readonly
                                                v-on="on" @blur="teamSignDate = parseDate(teamSignDateFormatted)" />
                                        </template>
                                        <v-date-picker v-model="teamSignDate" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn text color="#fff" @click="teamSignModal = false">Cancel</v-btn>
                                            <v-btn text color="#fff" @click="$refs.dialogTeamSign.save(teamSignDate)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </div>
                            </span>
                            <div class="form__input--input-group">
                                <label for="testimonial" class="form__label">Would you care to give a Short Testimonial Note:</label>
                                <textarea v-model="testimonial" class="form__input--textbox form__input"></textarea>
                            </div>
                            <ValidationProvider name="Payment option" rules="required" v-slot="{errors}" class="form__input--input-group">
                                <p class="form__label">Which payment method will you use?</p>
                                <ul class="form__form-group--inline">
                                    <li v-for="(item, i) in paymentOptions" :key="`payment-${i}`" class="form__input--radio">
                                        <label :for="item">{{item}}</label>
                                        <input :id="item" type="radio" v-model="paymentOption" :value="item" />
                                    </li>
                                </ul><br/>
                                <span class="form__input--error">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                    </fieldset>
                    
                    <!-- <v-btn type="button" v-if="currentStep !== 1" @click="goToStep(currentStep - 1)">Previous</v-btn> -->
                    <v-btn type="submit" v-if="currentStep === 1 && paymentOption == 'Credit Card'">Next</v-btn>
                    <v-btn type="submit" :class="cardSubmitted || paymentOption !== 'Credit Card' ? 'button' : 'button--disabled'">Submit</v-btn>
                </form>
            </ValidationObserver>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import goTo from 'vuetify/es5/services/goto'
export default {
    data: (vm) => ({
        currentStep:1,
        message: '',
        errorMessage: [],
        submitted: false,
        subjectProperty: '',
        deductible: null,
        insuredEndDateModal: false,
        insuredEndDate: null,
        insuredEndDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        insuredPayment: {
            day1Modal: false,
            day5Modal: false,
            firstStep: null,
            day1Date: null,
            day1DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            day5Date: null,
            day5DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10))
        },
        nonInsuredPayment: {
            endDateModal: false,
            day1Modal: false,
            day5Modal: false,
            endDate: null,
            endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            day1Date: null,
            day1DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            day5Date: null,
            day5DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        },
        ratings: [
            "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-"
        ],
        selectedRating: "",
        repPrint: "",
        repSign: {
            data: '',
            isEmpty: true
        },
        repTimeModal: false,
        repPrintTime: null,
        repPrintTimeFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
        repSignModal: false,
        repSignDate: null,
        repSignDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        teamMemberSig: {
            data: '',
            isEmpty: true
        },
        teamSignModal: false,
        teamSignDate: null,
        teamSignDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        testimonial:"",
        usingCreditCard: false,
        cardholderName: {
            first: "",
            middle: "",
            last: "",
            email: "",
            phoneNumber: ""
        },
        billingAddress: {
            address1: "",
            address2: "",
            city: "",
            state: "",
            zip: ""
        },
        creditCards: [
            "Mastercard", "VISA", "Discover", "Amex", "Other"
        ],
        selectedCard: {
            card: "",
            otherCard: ""
        },
        cardNumber: null,
        expirationDate: "",
        cvcNum: "",
        cusSig: {
            data: '',
            isEmpty: true
        },
        cusSigModal: false,
        cusSigDate: new Date().toISOString().substr(0, 10),
        cusSigDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        selectedJobId: "",
        paymentOptions: ["Cash", "Credit Card", "Thrive"],
        paymentOption: "",
        errorDialog: false,
        authUser: false
    }),
    /* async asyncData({$axios}) {
        try {
            let data = await $axios.$get("/api/certificates");
            return {
                coc: data
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    }, */
    computed: {
        ...mapGetters(["isLoggedIn", "getUser", "getReports"]),
        insuredDay1() {
            return this.insuredPayment.day1Date;
        },
        insuredDay5() {
            return this.insuredPayment.day5Date
        },
        nonInsuredEndDate() {
            return this.nonInsuredPayment.endDate;
        },
        nonInsuredDay1() {
            return this.nonInsuredPayment.day1Date;
        },
        nonInsuredDay5() {
            return this.nonInsuredPayment.day5Date;
        },
        cardName() {
            let fullname = this.cardholderName.first + ' '+ [this.cardholderName.middle ? this.cardholderName.middle +' ' : null] + this.cardholderName.last
            return fullname;
        },
        insuredPay1: {
            get() {
                let pay = this.deductible * .50
                if (pay) { return pay }
                else { return 500.00 }
            },
            set(value) {
                this.insuredPayment.firstStep = value
            }
        },
        insuredPay2() {
            return this.deductible * .50
        },
        certificates() {
            return this.getReports.filter((v) => {
                return v.ReportType === "coc"
            })
        }
    },
    watch: {
        insuredEndDate(val) {
            this.insuredEndDateFormatted = this.formatDate(val)
        },
        insuredDay1(val) {
            this.insuredPayment.day1DateFormatted = this.formatDate(val)
        },
        insuredDay5(val) {
            this.insuredPayment.day5DateFormatted = this.formatDate(val)
        },
        nonInsuredEndDate(val) {
            this.nonInsuredPayment.endDateFormatted = this.formatDate(val)
        },
        nonInsuredDay1(val) {
            this.nonInsuredPayment.day1DateFormatted = this.formatDate(val)
        },
        nonInsuredDay5(val) {
            this.nonInsuredPayment.day5DateFormatted = this.formatDate(val)
        },
        repPrintTime(val) {
            this.repPrintTimeFormatted = this.formatTime(val)
        },
        repSignDate(val) {
            this.repSignDateFormatted = this.formatDate(val)
        },
        teamSignDate(val) {
            this.teamSignDateFormatted = this.formatDate(val)
        },
        cusSigDate(val) {
            this.cusSigDateFormatted = this.formatDate(val)
        }
    },
    mounted() {
        this.checkStorage()
        this.mappingJobIds()
        this.$nextTick(() => {
            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    },
    methods: {
        ...mapActions({
            addReport: 'indexDb/addReport',
            checkStorage: 'indexDb/checkStorage',
            mappingJobIds: 'mappingJobIds'
        }),
        selectedJob(option) {
            this.selectedJobId = option;
        },
        formatDate(dateReturned) {
            if (!dateReturned) return null
            const [year, month, day] = dateReturned.split('-')
            return `${month}/${day}/${year}`
        },
        cardSubmittedValue(params) {
            this.cardSubmitted = params
        },
        formatTime(timeReturned) {
            if (!timeReturned) return null
            
            const pieces = timeReturned.split(':')
            let hours
            let minutes
            if (pieces.length === 2) {
                hours = parseInt(pieces[0], 10)
                minutes = parseInt(pieces[1], 10)
            }
            const newFormat = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12
            // To display "0" as "12"
            hours = hours || 12
            minutes = minutes < 10 ? '0' + minutes : minutes
            return `${hours}:${minutes} ${newFormat}`
        },
        parseDate(date) {
            if (!date) return null
            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        currencyFormat($event) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            // only allow number and one dot
            if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.deductible.indexOf('.') != -1)) { // 46 is dot
                $event.preventDefault();
            }
            // restrict to 2 decimal places
            if(this.deductible!=null && this.deductible.indexOf(".")>-1 && (this.deductible.split('.')[1].length > 1)){
                $event.preventDefault();
            }
        },
        acceptNumber() {
            var x = this.cardholderName.phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
            this.cardholderName.phoneNumber = !x[2] ?
            x[1] :
            '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
        },
        maskDate() {
            var x = this.expirationDate.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})/)
            console.log(x)
            this.expirationDate = !x[2] ? x[1] : x[1] + '/' + x[2]
        },
        goToStep(step) {
            if (step < 1) {
                return;
            }
            if (step > 2) {
                this.submitForm();
                return;
            }
            this.currentStep = step
        },
        submitForm() {  
            this.errorMessage = []
            const certificates = this.certificates.map((v) => {
                return v.JobId
            })
            this.$refs.form.validate().then(success => {
                if (!success) {
                    this.errorDialog = true
                    this.submitting = false
                    this.submitted = false
                    return goTo(0)
                }
                if (!certificates.includes(this.selectedJobId)) {
                    if ((this.currentStep === 1 && this.paymentOption !== 'Credit Card') ||
                        this.currentStep === 2) {
                        this.onSubmit()
                        return;
                    }
                    this.currentStep++;
                } else {
                    this.errorMessage.push("Duplicate Job ID is not allowed")
                    return goTo(0)
                }
                
            })            
        },
        onSubmit() {
            this.message = ''
            this.errorMessage = []
            let insuredPayment1Arr = {
              insuredPay: this.insuredPay1,
              day1Date: this.insuredPayment.day1DateFormatted
            };
            const userNameObj = {
                first: this.getUser.name.split(" ")[0],
                last: this.getUser.name.split(" ")[1]
            }
            let insuredPayment2Arr = {
              insuredPay: this.insuredPay2,
              day5Date: this.insuredPayment.day5DateFormatted
            };
            const post = {
              JobId: this.selectedJobId,
              ReportType: "coc",
              subjectProperty: this.subjectProperty,
              deductible: this.deductible,
              insuredEndDate: this.insuredEndDateFormatted,
              insuredPayment1: insuredPayment1Arr,
              insuredPayment2: insuredPayment2Arr,
              nonInsuredEndDate: this.nonInsuredPayment.endDateFormatted,
              nonInsuredPayment1: this.nonInsuredPayment.day1DateFormatted,
              nonInsuredPayment2: this.nonInsuredPayment.day5DateFormatted,
              rating: this.selectedRating,
              repPrint: this.repPrint,
              repSignTime: this.repPrintTimeFormatted,
              repSign: this.repSign.data,
              repSignDate: this.repSignDateFormatted,
              teamSign: this.teamMemberSig.data,
              teamSignDate: this.teamSignDateFormatted,
              testimonial: this.testimonial,
              paymentOption: this.paymentOption,
              teamMember: userNameObj
            };
            if (this.$nuxt.isOffline) {
              this.addReport(post).then(() => {
                this.message = "COC was saved successfully for submission later!"
                this.submitted = true
                setTimeout(() => {
                  this.message = ""
                }, 2000)
              }).catch((err) => {
                this.errorMessage.push(err)
              })
            } else {
              this.$axios.$post("/api/coc/new", post).then((res) => {
                if (res.errors) {
                  this.errorMessage = res.errors
                  return
                }
                this.message = "Certificate of Completion submitted"
                this.submitted = true
                setTimeout(() => {
                  this.message = ""
                  window.location = "/"
                }, 2000)
              }).catch((err) => {
                this.errorMessage.push(err)
              })
            }
        }
    }
}
</script>