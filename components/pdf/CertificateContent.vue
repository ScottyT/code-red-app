<template>
  <section slot="pdf-content" class="pdf-content">
        <div class="text-center pdf-first-section">
            <div class="report-details__company-logo">
              <img
                  src="https://images.prismic.io/water-emergency-services/31b3f2ab-d44e-4f77-8072-faef63fcceb5_WESI+new+Shield+Graphic_800x800.png?auto=compress,format" />
            </div>
            <h2>{{company}}</h2>
            <h3>CERTIFICATE OF COMPLETION</h3>
            <p class="pdf-detail">This Assignment of Claim Agreement (hereinafter referred to as “Assignment” and/or “Agreement”) and
              Mitigation
              Contract (hereinafter referred to as “Contract”) is entered into by and between:
            </p>
            <p class="pdf-detail">
              {{company}} (hereinafter referred to as “{{abbreviation}}” and/or “Insured”)
              and The Owner/Persons of legal authority (hereinafter referred to as “Property Representative”)
              of the property more commonly known as and identified by the following address:
            </p>
            <span class="text-decoration-underline pdf-detail">{{certificate.subjectProperty}}</span><br />
            <label>(hereinafter referred to as “Subject Property”)</label>
            <p class="text-decoration-underline"><strong>{{company}} has completed the
                Assignment of Benefit Agreement and Mitigation Contract in full</strong></p>
        </div>
        <div class="report-details"><p class="pdf-detail report-details__data">
            SHARE: Property Representative will send a copy of this Agreement, Contract, Certificate of Completion,
            Xactimate and
            the {{abbreviation}} W9 to the insurance company, the insurance company’s representatives and mortgage institutions to
            allow {{abbreviation}}
            to communicate, share and exchange through reasonable introduction and/or through means found proper in the
            daily course
            of business information including but not limited to the services that {{abbreviation}} has provided, currently is
            providing and/or may
            be required to provide in the future.
        </p>
        <p class="pdf-detail report-details__data">
            DIRECTION OF PAYMENT: Property Representative hereby authorizes and unequivocally instructs direct payment
            of
            any benefits or proceeds for services rendered pursuant to the Assignment of Claim Agreement and Mitigation
            Contract and
            that such payment be made payable directly and solely to {{abbreviation}} and sent exclusively to {{abbreviation}} from the
            insurance company
            including but not limited to all invoices, tasks, billable hours and billable units partially and /or
            completely provided by
            {{abbreviation}}.
        </p></div>
          <div class="report-details__bordered pdf-detail">
            <div class="report-details__data report-details__data--row">
              <div class="report-details__data-field">
                <label>Insured Deductible: </label>
                <span>${{certificate.deductible}}</span>
              </div>
              <div class="report-details__data-field">
                <label>Insured: Agreed “Term” of Service Minimum End Date: </label>
                <span>{{certificate.insuredMinEndDate}}</span>
              </div>
            </div>
            <div class="report-details__data report-details__data--row">
              <div class="report-details__data-field">
                <label>Insured Payment 1) = ($500.00 or 50% of Deductible) </label>
                <span>${{certificate.insuredPayment1.insuredPay}}</span>
              </div>
              <div class="report-details__data-field">
                <label>Day (1) Date: </label>
                <span>{{certificate.insuredPayment1.day1Date}}</span>
              </div>
            </div>
            <div class="report-details__data report-details__data--row">
              <div class="report-details__data-field">
                <label>Insured Payment 2) = (Remaining 50% of Deductible) </label>
                <span>${{certificate.insuredPayment2.insuredPay}}</span>
              </div>
              <div class="report-details__data-field">
                <label>Day (5) Date: </label>
                <span>{{certificate.insuredPayment2.day5Date}} (upon pickup)</span>
              </div>
            </div>
            <div class="report-details__data report-details__data--row">
              <label>Insured Payment 3) = “Available Proceeds” Per terms of this agreement</label>
            </div>
            <div class="report-details__data report-details__data--row">
              <label>Insured Payment 4) = Succeeding Day of “Available Proceeds” for Remaining Balance</label>
            </div>
          </div>
          <div class="report-details__bordered pdf-detail">
            <div class="report-details__data report-details__data--row">
              <div class="report-details__data-field">
                <label>Non-Insured or Still Pending Coverage: Agreed “Term” of Service Minimum End Date:</label>
                <div>{{certificate.nonInsuredMinEndDate}}</div>
              </div>
            </div>
            <div class="report-details__data report-details__data--row">
              <label>Non-Insured or Still Pending Coverage: Payment 1) = $750.00 Day (1) Date: </label>
              <div>{{certificate.nonInsuredPayment1}}</div>
            </div>
            <div class="report-details__data report-details__data--row">
              <label>Non-Insured or Still Pending Coverage: Payment 2) = $750.00 Day (5) Date: </label>
              <div>{{certificate.nonInsuredPayment2}} (upon pickup)</div>
            </div>
            <div class="report-details__data report-details__data--row">
              <label>Non-Insured or Still Pending Coverage: Payment 3) = Succeeding Day of the Term for Remaining
                Balance</label>
            </div>
          </div>
          <div class="report-details__data-field pdf-detail">
            <label>Rating: </label>
            <div>{{certificate.rating}}</div>
          </div>
          <p class="pdf-detail">
            I am satisfied with the completion of all mitigation services and all other related services performed on
            the
            Subject Property by {{company}}.
          </p>
          
  
        <section class="pdf-item pdf-detail">
          <div class="report-details__bordered">
            <div class="report-details__data report-details__data--row">
              <div class="report-details__data-field">
                <label>Representative (Print):</label>
                <div>{{certificate.representative}}</div>
              </div>
              <div class="report-details__data-field">
                <label>TIME: </label>
                <div>{{certificate.repSignTime}}</div>
              </div>
            </div>
            <div class="report-details__data report-details__data--row report-details__data-sig">
              <div class="report-details__data-field">
                <label>Representative (Sign):</label>
                <div class="report-details__data--sig"
                     :style="'background-image:url('+certificate.representativeSign+')'"></div>
              </div>
              <div class="report-details__data-field">
                <label>DATE: </label>
                <div>{{certificate.repSignDate}}</div>
              </div>
            </div>
            <div class="report-details__data report-details__data--row report-details__data-sig">
              <div class="report-details__data-field">
                <label>Team Member (Sign):</label>
                <div class="report-details__data--sig" :style="'background-image:url('+certificate.teamSign+')'">
                </div>
              </div>
              <div class="report-details__data-field">
                <label>DATE: </label>
                <div>{{certificate.teamSignDate}}</div>
              </div>
            </div>
            <div class="report-details__data report-details__data--row">
              <label>Testimonial Note: </label>
              <p>{{certificate.testimonial}}</p>
            </div>
          </div>
        </section>
          <div class="report-details__data data-section pdf-detail">
            <div class="data-section__heading">Debit/Credit Cards</div>
            <div class="data-section__data" v-for="card in cards" :key="card.cardNumber">
              <div class="data-section__data--group">
                <div class="data-section__subheading">Cardholder</div>
                <div class="data-section__data--group-item">
                  <label>Name:</label>
                  <div>{{card.cardholderName}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>Email:</label>
                  <div>{{card.cardholderInfo.email}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>Phone number:</label>
                  <div>{{card.cardholderInfo.phoneNumber}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>Name of card:</label>
                  <div>{{card.creditCard}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>Card Number:</label>
                  <div>{{card.cardNumber}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>CVC Number:</label>
                  <div>{{card.cvcNum}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>Expiration Date:</label>
                  <div>{{card.expirationDate}}</div>
                </div>
              </div>
              <div class="data-section__data--group">
                <div class="data-section__subheading">Billing Address</div>
                <div class="data-section__data--group-item">
                  <label>Address 1:</label>
                  <div>{{card.billingAddress.address1}}</div>
                </div>
                <div class="data-section__data--group-item" v-show="card.billingAddress.address2">
                  <label>Address 2:</label>
                  <div>{{card.billingAddress.address2}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>City: </label>
                  <div>{{card.billingAddress.city}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>State: </label>
                  <div>{{card.billingAddress.state}}</div>
                </div>
                <div class="data-section__data--group-item">
                  <label>Zip: </label>
                  <div>{{card.billingAddress.zip}}</div>
                </div>
              </div>
              <div class="data-section__data--group data-section__signature">
                <label>Card Owner Signature:</label>
                <div class="data-section__data--group-item">
                  <div class="report-details__data--sig pdf-sig" :style="'background-image:url('+card.customerSig+')'">
                  </div>
                </div>
              </div>
              <div class="data-section__card-images">
                <div class="card-image" v-for="(image, i) in cardImages.filter(v => v.cardNumber == card.cardNumber)"
                     :key="`card-${i}`">
                  <img :src="image.url" />
                </div>
              </div>
              <div class="html2pdf__page-break"/>
            </div>
          </div>
      </section>
</template>
<script>
export default {
    name:"CertificateContent",
    props: ['certificate', 'company', 'abbreviation'],
    data() {
        return {
          cards: [],
            errorMessage: "",
            cardImages: []
        }
    },
    methods: {
      fetchcardimages(card) {
        var storageRef = this.$fire.storage.ref()
        var listRef = storageRef.child(card)
        listRef.listAll().then((res) => {
          res.items.forEach((itemRef) => {
            var itemPath = itemRef.fullPath;
            storageRef.child(itemPath).getDownloadURL().then((url) => {
              var fileName = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length)
              var fileType = itemPath.substring(itemPath.lastIndexOf('.'), itemPath.length)
              const fileObj = {
                cardNumber: card,
                name: fileName,
                url: url,
                type: fileType
              }
              this.cardImages.push(fileObj)
            }).catch((err) => {
              this.errorMessage = err
            })
          })
        })
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("domRendered");
        }, 1000)
      })
    },
    created() {
      if (this.certificate.paymentOption === 'Card') {
        this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
          this.$axios.$get(`/api/credit-card/${this.certificate.cardNumber}`, {headers: {authorization: `Bearer ${idToken}`}})
            .then((res) => {
              this.cards = res
              this.cards.forEach((card) => {
                this.fetchcardimages(card.cardNumber)
              })        
            })
        })
        
      }
    }
}
</script>
<style lang="scss" scoped>
.data-section {
    margin: 20px 0;
    display:grid;
    grid-template-columns: 1fr;
    &__heading {
        font-size:1.4em;
        font-weight:bold;
        text-align:center;
    }
    &__subheading {
        font-size:1.2em;
        font-weight:bold;
        grid-row:1/2;
        text-decoration: underline;
    }
    &__data {
        width:100%;
        padding:5px;
        margin-top:5px;
        display:grid;
        grid-column:1 span;
        grid-template-columns:1fr;
        grid-template-rows:1fr 1fr 150px 210px;
        &--group {
            padding-bottom:20px;
            display:grid;
            grid-template-rows:50px 1fr;
            grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));
        }
        &--group-item {
            height:100%;
            &:not(:last-child) {
                padding-bottom:5px;
            }
        }
    }
    &__signature {
        grid-template-columns:1fr;
    }
    &__card-images {
        position:relative;
        display:inline-flex;
        flex-direction:row;
        justify-content:space-between;
        height:200px;
        div:nth-child(2) {
            left:400px;
        }
    }
}
.card-image {
    max-width:300px;
    height:200px;
    position:absolute;
    top:0;
    display:inline-block;
}
.pdf-detail {
  padding-bottom: 10px;

  label {
    font-weight:bold;
    margin-right:5px;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
.report-details {
  max-width:600px;
  width:100%;
  margin:auto;
}
.pdf-first-section {
  text-align: center;
  margin-bottom: 10px;
}
.pdf-item {
    .detail-margin-top {
        margin-top:10px;
    }
    
    
    .pdf-sig {
        width:500px;
        height:295px;
    }
    &.sig-row {
        height:400px;
    }
}
.pdf-content {
  max-width:800px;
  width:100%;
}
</style>