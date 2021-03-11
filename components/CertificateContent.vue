<template>

    <div class="report-details">
        <div class="report-details__content">
            <section class="pdf-content">
            <div class="report-details__company-logo">
                <img src="https://images.prismic.io/water-emergency-services/31b3f2ab-d44e-4f77-8072-faef63fcceb5_WESI+new+Shield+Graphic_800x800.png?auto=compress,format" />
            </div>
            <div class="text-center">
                <h2>{{company}}</h2>
                <h3>CERTIFICATE OF COMPLETION</h3>
                <p>This Assignment of Claim Agreement (hereinafter referred to as “Assignment” and/or “Agreement”) and Mitigation 
                    Contract (hereinafter referred to as “Contract”) is entered into by and between:
                </p>
                <p>
                    Water Emergency Services Incorporated (hereinafter referred to as “WESI” and/or “Insured”)
                    and The Owner/Persons of legal authority (hereinafter referred to as “Property Representative”)
                    of the property more commonly known as and identified by the following address:
                </p>
                <span class="text-decoration-underline">{{certificate[0].subjectProperty}}</span><br />
                <label>(hereinafter referred to as “Subject Property”)</label>
                <p class="text-decoration-underline"><strong>Water Emergency Services Incorporated has completed the Assignment of Benefit Agreement and Mitigation Contract in full</strong></p>
            </div>
            <p>
                SHARE: Property Representative will send a copy of this Agreement, Contract, Certificate of Completion, Xactimate and 
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
            <div class="report-details__bordered">
                <div class="report-details__data report-details__data--row">
                    <div class="report-details__data-field">
                        <label>Insured Deductible:</label>
                        <span>${{certificate[0].deductible}}</span>
                    </div>
                    <div class="report-details__data-field">
                        <label>Insured: Agreed “Term” of Service Minimum End Date:</label>
                        <span>{{certificate[0].insuredMinEndDate}}</span>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <div class="report-details__data-field">
                        <label>Insured Payment 1) = ($500.00 or 50% of Deductible) </label>
                        <span>${{certificate[0].insuredPayment1.insuredPay}}</span>
                    </div>
                    <div class="report-details__data-field">
                        <label>Day (1) Date: </label>
                        <span>{{certificate[0].insuredPayment1.day1Date}}</span>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <div class="report-details__data-field">
                        <label>Insured Payment 2) = (Remaining 50% of Deductible) </label>
                        <span>${{certificate[0].insuredPayment2.insuredPay}}</span>
                    </div>
                    <div class="report-details__data-field">
                        <label>Day (5) Date: </label>
                        <span>${{certificate[0].insuredPayment2.day5Date}} (upon pickup)</span>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Insured Payment 3) = “Available Proceeds” Per terms of this agreement</label>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Insured Payment 4) = Succeeding Day of “Available Proceeds” for Remaining Balance</label>
                </div>
            </div>
            <div class="report-details__bordered">
                <div class="report-details__data report-details__data--row">
                    <div class="report-details__data-field">
                        <label>Non-Insured or Still Pending Coverage: Agreed “Term” of Service Minimum End Date:</label>
                        <div>{{certificate[0].nonInsuredMinEndDate}}</div>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Non-Insured or Still Pending Coverage: Payment 1) = $750.00 Day (1) Date: </label>
                    <div>{{certificate[0].nonInsuredPayment1}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Non-Insured or Still Pending Coverage: Payment 2) = $750.00 Day (5) Date: </label>
                    <div>{{certificate[0].nonInsuredPayment2}} (upon pickup)</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Non-Insured or Still Pending Coverage: Payment 3) = Succeeding Day of the Term for Remaining Balance</label>
                </div>
            </div>
            <div class="report-details__data-field">
                <label>Rating: </label>
                <div>{{certificate[0].rating}}</div>
            </div>
            <p>
                I am satisfied with the completion of all mitigation services and all other related services performed on the 
                Subject Property by Water Emergency Services Incorporated.
            </p>
            <div class="report-details__bordered">
                <div class="report-details__data report-details__data--row">
                    <div class="report-details__data-field">
                        <label>Representative (Print):</label>
                        <div>{{certificate[0].representative}}</div>
                    </div>
                    <div class="report-details__data-field">
                        <label>TIME: </label>
                        <div>{{certificate[0].repSignTime}}</div>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row report-details__data-sig">
                    <div class="report-details__data-field">
                        <label>Representative (Sign):</label>
                        <div class="report-details__data--sig" :style="'background-image:url('+certificate[0].representativeSign+')'"></div>
                    </div>
                    <div class="report-details__data-field">
                        <label>DATE: </label>
                        <div>{{certificate[0].repSignDate}}</div>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row report-details__data-sig">
                    <div class="report-details__data-field">
                        <label>Team Member (Sign):</label>
                        <div class="report-details__data--sig" :style="'background-image:url('+certificate[0].teamSign+')'"></div>
                    </div>
                    <div class="report-details__data-field">
                        <label>DATE: </label>
                        <div>{{certificate[0].teamSignDate}}</div>
                    </div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Testimonial Note: </label>
                    <p>{{certificate[0].testimonial}}</p>
                </div>
            </div>
            <div class="report-details__bordered">
                <h3>Cardholder Name</h3>
                <div class="report-details__data report-details__data--row">
                    <label>Full name</label>
                    <div>{{certificate[0].cardholderName}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Cardholder Email: </label>
                    <div>{{certificate[0].cardholder.email}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Cardholder Phone Number: </label>
                    <div>{{certificate[0].cardholder.phoneNumber}}</div>
                </div>
            </div>
            <div class="report-details__bordered">
                <h3>Billing Address</h3>
                <div class="report-details__data report-details__data--row">
                    <label>Address Line 1: </label>
                    <div>{{certificate[0].billingAddress.address1}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Address Line 2: </label>
                    <div>{{certificate[0].billingAddress.address2}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>City: </label>
                    <div>{{certificate[0].billingAddress.city}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>State: </label>
                    <div>{{certificate[0].billingAddress.state}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Zip: </label>
                    <div>{{certificate[0].billingAddress.zip}}</div>
                </div>
            </div>
            <div class="report-details__bordered">
                <h3>Credit Card</h3>
                <div class="report-details__data report-details__data--row">
                    <label>Credit Card Company: </label>
                    <div>{{certificate[0].creditCardProvider}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Card Number: </label>
                    <div>{{certificate[0].cardNumber}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Cardholder Name: </label>
                    <div>{{certificate[0].cardholderName}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Expiration Date: </label>
                    <div>{{certificate[0].expirationDate}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>CVC Number: </label>
                    <div>{{certificate[0].cvcNumber}}</div>
                </div>
                <div class="report-details__data report-details__data--row">
                    <label>Cardholder Zip Code: </label>
                    <div>{{certificate[0].cardZipCode}}</div>
                </div>
            </div>
            <p>
                I, {{certificate[0].representative}}, authorize Water Emergency Services Incorporated 
                (WESI) to charge my credit card above for the agreed upon purchases and/or services within the above 
                Assignment of Claim Agreement and Mitigation Contract and Equipment Rental Agreement. I understand that 
                my information will be saved to file for future transactions on my account and I hereby authorize WESI to charge 
                my credit card above for the agreed upon future transactions, purchases and/or services if any within the above 
                Assignment of Claim Agreement and Mitigation Contract and Equipment Rental Agreement.
            </p>
            <div class="report-details__data report-details__data--row report-details__data-sig">
                <div class="report-details__data-field">
                    <label>Customer Signature:</label>
                    <div class="report-details__data--sig" :style="'background-image:url('+certificate[0].customerSignature+')'"></div>
                </div>
                <div class="report-details__data-field">
                    <label>Date: </label>
                    <div>{{certificate[0].customerSigDate}}</div>
                </div>
            </div> 
            </section>         
        </div>
    </div>
</template>
<script>
export default {
    name:"CertificateContent",
    props: ['certificate'],
    data() {
        return {
            company: "Water Emergency Services Incorporated"
        }
    },
    mounted() {
        this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("domRendered");
        }, 1000)
      })
    }
}
</script>