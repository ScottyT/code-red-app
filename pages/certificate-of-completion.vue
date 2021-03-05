<template>
    <div>
        <span v-if="!isLoggedIn"><LazyLoginForm /></span>
        <div v-else-if="isLoggedIn" class="form-wrapper">
            <h1 class="text-center">Water Emergency Services Incorporated</h1>
            <h2 class="text-center">Certificate of Completion</h2>
            <ValidationObserver v-slot="{ handleSubmit }">
                <h2>{{message}}</h2>
                <h2 class="alert alert--error">{{errorMessage}}</h2>
                <form ref="form" class="form" @submit.prevent="handleSubmit(submitForm)" v-if="!submitted">
                    <p>This Assignment of Claim Agreement (hereinafter referred to as “Assignment” and/or “Agreement”) and Mitigation

                        Contract (hereinafter referred to as “Contract”) is entered into by and between:
                        Water Emergency Services Incorporated (hereinafter referred to as “WESI” and/or “Insured”)

                        and

                        The Owner/Persons of legal authority (hereinafter referred to as “Property Representative”)
                        of the property more commonly known as and identified by the following address:
                    </p>
                    <ValidationProvider rules="required" class="form__form-group" v-slot="{ errors }" name="Address">
                        <input type="text" class="form__input" v-model="address" /><br />
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
                    <div class="form__form-group form__form-group--info-box form__form-group--column">
                        <label for="InsuredDeductible" class="form__label">Insured Deductible:</label>
                        <input type="text" id="InsuredDeductible" class="form__input form__input--short" v-model="deductible" />
                        <br />
                        <label for="InsuredEndDate" class="form__label">Insured: Agreed “Term” of Service Minimum End Date:</label>
                        <v-dialog ref="dialogEndDate" v-model="insuredEndDateModal" :return-value.sync="insuredEndDate"
                            persistent width="400px">
                            <template v-slot:activator="{ on, attrs }">
                                <input id="InsuredEndDate" v-model="insuredEndDateFormatted" v-bind="attrs" class="form__input form__input--short"
                                    v-on="on" @blur="insuredEndDate = parseDate(insuredEndDateFormatted)
                                " />
                            </template>
                            <v-date-picker v-model="insuredEndDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="#fff" @click="insuredEndDateModal = false">Cancel</v-btn>
                            <v-btn text color="#fff" @click="$refs.dialogEndDate.save(insuredEndDate)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </div>
                </form>
            </ValidationObserver>
        </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data: (vm) => ({
        message: '',
        errorMessage: '',
        submitted: false,
        address: '',
        deductible: '',
        insuredEndDateModal: false,
        insuredEndDate: null,
        insuredEndDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
    }),
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
    watch: {
        endDate(val) {
            this.endDateFormatted = this.formatDate(val)
        }
    },
    methods: {
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
    }
}
</script>