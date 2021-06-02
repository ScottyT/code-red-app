<template>
    <ValidationObserver ref="cardForm">
      <h2>{{message}}</h2>
      <h2 class="alert alert--error">{{errorMessage}}</h2>
      <p class="text-decoration-underline text-center"><strong>THIS IS NOT AN AGREEMENT TO REPAIR/REBUILD/RESTORE ANY PROPERTY</strong></p>
      <p class="text-center">{{company}} ({{abbreviation}}) is an independent janitorial contractor.
        We are not affiliated, associated, endorsed by or in any way officially connected with any other company,
        agency or franchise.</p>
      <p>Please complete all fields. You may cancel this authorization at any time by contacting us. This
        authorization will remain in effect until cancelled.</p>
        <form ref="cardForm" @submit.prevent="submitCard">
      <fieldset v-if="currentStep === 1" class="form__form-group form__form-group--info-box form__form-group--column">
        <h3 class="form__label">Cardholder Name* (as shown on card)</h3>
        <div class="d-flex flex-wrap">
          <ValidationProvider rules="required" v-slot="{errors}" name="First name" class="form__input--input-group">
            <label for="firstname" class="form__label">First name</label>
            <input id="firstname" type="text" class="form__input" v-model="cardholderInfo.first" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="alpha" v-slot="{errors}" name="Middle initial" class="form__input--input-group">
            <label for="middle" class="form__label">Middle initial</label>
            <input id="middle" type="text" class="form__input" v-model="cardholderInfo.middle" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{errors}" name="Last name" class="form__input--input-group">
            <label for="lastname" class="form__label">Last name</label>
            <input id="lastname" type="text" class="form__input" v-model="cardholderInfo.last" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required|email" v-slot="{errors}" name="Cardholder email" class="form__input--input-group">
            <label for="cardholderemail" class="form__label">Cardholder Email</label>
            <input id="cardholderemail" type="email" class="form__input" v-model="cardholderInfo.email" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{errors}" name="Cardholder phone number" class="form__input--input-group">
            <label for="cardholderphone" class="form__label">Cardholder Phone Number</label>
            <input id="cardholderphone" type="text" class="form__input" @input="acceptNumber" v-model="cardholderInfo.phoneNumber" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider vid="cardNumber" rules="required|numeric" v-slot="{errors}" name="Card number" class="form__input--input-group">
            <label for="cardNumber" class="form__label">Card Number:</label>
            <input type="text" class="form__input" id="cardNumber" v-model="cardNumber" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form__form-group">
          <h3 class="form__label">Debit/Credit Card</h3>
          <ValidationProvider name="Card type" class="form__input--input-group form__form-group" rules="required" v-slot="{errors}">
            <p class="form__label">Which card will you be using?</p>
            <ul class="form__form-group--inline">
              <li v-for="(type, i) in cardTypes" :key="`type-${i}`" class="form__input--radio">
                <label :for="type">{{type}}</label>
                <input :id="type" v-model="selectedCardType" type="radio" :value="type" /> 
              </li>
            </ul>
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="form__input--card-upload-group">             
              <ValidationProvider vid="frontcard" ref="frontcard" name="Front Side" rules="image" v-slot="{validate, errors}" class="card-upload card-upload--front">
                <p>Front side:</p>
                <input type="hidden" v-model="frontCardImage[0]" @click="validate" />
                <span class="button button--normal" @click="$refs.frontCard.click()">Add image</span>
                <input type="file" id="frontcard" name="frontcardimage" accept="image/*" ref="frontCard" @change="filesChange" />
                <span class="form__input--error">{{ errors[0] }}</span>
                <div class="file-listing"><img class="file-listing__preview" v-bind:ref="`frontcardimage`" /></div>
              </ValidationProvider>
              
              <ValidationProvider vid="backcard" ref="backcard" v-if="frontCardValue !== ''" name="Back Side" rules="image" v-slot="{validate, errors}" class="card-upload card-upload--back">
                <p>Back side:</p>
                <input type="hidden" v-model="backCardImage[0]" @click="validate" />
                <span class="button button--normal" @click="$refs.backCard.click()">Add image</span>
                <input type="file" id="backcard" name="backcardimage" accept="image/*" ref="backCard" @change="filesChange" />
                <span class="form__input--error">{{ errors[0] }}</span>
                <div class="file-listing"><img class="file-listing__preview" v-bind:ref="`backcardimage`" /></div>          
              </ValidationProvider>
              <div class="buttons-wrapper">
                <v-btn @click="submitFiles(cardImages, $refs.cardimage)" v-if="(frontCardValue !== '' && backCardValue !== '') && $nuxt.isOnline"
                  :class="[uploaded ? 'button--disabled' : 'button']">{{ uploading ? 'Uploading' : 'Upload'}}</v-btn>
                <p class="card-upload__message" aria-label="Upload message goes here" name="Debit/Credit card " ref="cardimage"></p>
              </div>
            </div>
        </div>
      </fieldset>
      <fieldset v-if="currentStep === 2" class="form__form-group form__form-group form__form-group--info-box">
        <div class="form__form-group--left-side">
          <h3 class="form__label">Billing Address*</h3>
          <ValidationProvider rules="required" v-slot="{errors}" name="Address Line 1" class="form__input--input-group">
            <label for="addressLine1" class="form__label">Address Line 1:</label>
            <input id="addressLine1" type="text" v-model="billingAddress.address1" class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider name="Address Line 2" class="form__input--input-group">
            <label for="addressLine2" class="form__label">Address Line 2:</label>
            <input id="addressLine2" type="text" v-model="billingAddress.address2" class="form__input" />
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{errors}" name="City" class="form__input--input-group">
            <label for="city" class="form__label">City:</label>
            <input id="city" type="text" v-model="billingAddress.city" class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{errors}" name="State" class="form__input--input-group">
            <label for="state" class="form__label">State:</label>
            <input id="state" type="text" v-model="billingAddress.state" class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required|numeric|length:5" v-slot="{errors}" name="Zip code" class="form__input--input-group">
            <label for="zip" class="form__label">Zip:</label>
            <input id="zip" type="text" v-model="billingAddress.zip" class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form__form-group--right-side">
          <h3 class="form__label">Credit Card*</h3>
          <ValidationProvider rules="required" v-slot="{errors}" name="Card" class="form__checkbox-wrapper--long">
            <div class="form__input--radio" v-for="(card, i) in creditCards" :key="`card-${i}`">
              <input type="radio" :id="card" v-model="selectedCard.card" :value="card" />
              <label :for="card" class="form__label">{{card}}</label>            
            </div>
            <input :required="selectedCard.card == 'Other'" v-if="selectedCard.card == 'Other'" type="text" v-model="selectedCard.otherCard" class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          
          <ValidationProvider rules="required" v-slot="{errors}" name="Card name" class="form__input--input-group">
            <label for="cardholderName" class="form__label">Cardholder Name</label>
            <input type="text" id="cardholderName" class="form__input" v-model="cardName" readonly />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required|length:5" v-slot="{errors}" name="Expiration date" class="form__input--input-group">
            <label for="expDate" class="form__label">Expiration Date (mm/yy):</label>
            <input type="text" id="expDate" v-model="expirationDate" class="form__input" @input="maskDate" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required|length:3|numeric" v-slot="{errors}" name="CVC number" class="form__input--input-group">
            <label for="cvc" class="form__label">CVC Number:</label>
            <input type="number" id="cvc" v-model="cvcNum" class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <ValidationProvider rules="required" v-slot="{errors}" name="Cardholder zip code" class="form__input--input-group">
            <label for="cvc" class="form__label">Cardholder zip code:</label>
            <input type="text" id="cvc" v-model="billingAddress.zip" readonly class="form__input" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="form__form-group form__form-group--inline">
          <p>I, {{repPrint}}, authorize {{company}}
          ({{abbreviation}}) to charge my credit card above for the agreed upon purchases and/or services within the above
          Assignment of Claim Agreement and Mitigation Contract and Equipment Rental Agreement. I understand that
          my information will be saved to file for future transactions on my account and I hereby authorize {{abbreviation}} to
          charge
          my credit card above for the agreed upon future transactions, purchases and/or services if any within the
          above
          Assignment of Claim Agreement and Mitigation Contract and Equipment Rental Agreement.</p>
          <span>
            <div class="form__input--input-group">
              <label for="cusSig" class="form__label">Customer Signature:</label>
              <LazyUiSignaturePadModal :sigData="cusSig" sigRef="cusSigPad" name="Customer signature" />
            </div>
            <div class="form__input--input-group">
              <label for="dateCusSign" class="form__label">Date</label>
              <v-dialog ref="dialogCusSign" v-model="cusSigModal" :return-value.sync="cusSigDate" persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="dateCusSign" v-model="cusSigDateFormatted" v-bind="attrs"
                        class="form__input form__input--short" readonly v-on="on"
                        @blur="cusSigDate = parseDate(cusSigDateFormatted)" />
                </template>
                <v-date-picker v-model="cusSigDate" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="cusSigModal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.dialogCusSign.save(cusSigDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </div>
          </span>
        </div>
      </fieldset>
      <div class="mb-3">
        <v-btn type="button" @click="goToStep(currentStep - 1)">Previous</v-btn>
        <v-btn type="submit" :class="[backCardValue !== '' ? 'button button--normal':'button--disabled']" @click="submit" 
          v-if="(cardDownloadUrls.length > 1 && $nuxt.isOnline) || (backCardValue && $nuxt.isOffline)">{{ currentStep === 2 ? submitText : 'Next' }}</v-btn>
      </div>    
      </form>
    </ValidationObserver>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
  export default {
    name: "CreditCard",
    data: (vm) => ({
        currentStep:1,
        message: '',
        errorMessage: null,
        cardholderInfo: {
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
        isSubmitted: false,
        submitText: 'Submit Card',
        cardDownloadUrls:[],
        cardImages: [],
        frontCardImage: [],
        backCardImage: [],
        uploading: false,
        uploaded: false,
        cardTypes: ["Debit", "Credit"],
        selectedCardType: "",
        frontCardValue: '',
        backCardValue: ''
    }),
    props: {
        jobId: {
            type: String,
            required: true
        },
        repPrint: {
            type: String
        },
        step: {
            type: Number
        },
        partOfLastSection: {
            type: Boolean
        },
        company: {
          type: String
        },
        abbreviation: {
          type: String
        }
    },
    computed: {
        cardName() {
            let fullname = this.cardholderInfo.first + ' '+ [this.cardholderInfo.middle ? this.cardholderInfo.middle +' ' : null] + this.cardholderInfo.last
            return fullname;
        },
        ...mapGetters({getCards:'reports/getCards', getUser:'users/getUser'})
    },
    watch: {
        cusSigDate(val) {
            this.cusSigDateFormatted = this.formatDate(val)
        },
        isSubmitted(val) {
            this.submitText = "Submitted"
            this.$emit("cardSubmit", this.isSubmitted)
        }
    },
    methods: {
        ...mapActions({
            addCreditCard: 'indexDb/addCreditCard',
            checkStorage: 'indexDb/checkStorage'
        }),
        goToStep(step) {
          if (step < 1) {
            return;
          }
          this.currentStep = step;
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
        acceptNumber() {
            var x = this.cardholderInfo.phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
            this.cardholderInfo.phoneNumber = !x[2] ?
            x[1] :
            '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
        },
        async filesChange(e) {
          const fileList = e.target.files
          const uploadarea = e.target.name
          const cardid = e.target.id
          if (!fileList.length) {
            console.log("no files: ", fileList)
            return;
          }
          var {valid} = await this.$refs[cardid].validate(e);
          if (valid) {
            var file = e.target.files[0];
            var blob = file.slice(0, file.size, file.type)
            var filetype = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
            var newFile = new File([blob], `${uploadarea}-${this.cardNumber}${filetype}`, {
              type: file.type
            })
            if (uploadarea === 'frontcardimage') {      
              this.frontCardImage[0] = newFile
              this.frontCardValue = this.$refs.frontCard.value
              this.$refs.frontcardimage.src = URL.createObjectURL(newFile)
            }
            if (uploadarea === 'backcardimage') {
              this.backCardImage[0] = newFile
              this.backCardValue = this.$refs.backCard.value
              this.$refs.backcardimage.src = URL.createObjectURL(newFile)
            }
            this.cardImages = new Set([
              ...this.frontCardImage,
              ...this.backCardImage
            ])
          } 
        },
        getImagePreview(file, usekey) {
          if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            const reader = new FileReader();
            reader.onload = e => {
              this.$refs[usekey].src = reader.result;
            }
            reader.readAsDataURL(file)
          }
        },
        async submitFiles(uploadarr, element) {
          // uploadarr is the array of Files 
          const field = element.getAttribute('name')

          uploadarr.forEach((file) => {
            var storageRef = this.$fire.storage.ref()
            var uploadRef = storageRef.child(`${this.cardNumber}/${file.name}`)
            var uploadTask = uploadRef.put(file)
            uploadTask.on('state_changed', (snapshot) => {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (progress < 100) {
                this.uploading = true
              }
              if(progress == 100) {
                this.uploading = false
                
                var uploadMessage = `${this.selectedCardType !== '' ? this.selectedCardType : 'Card '} images uploaded successfully`
                element.innerHTML = uploadMessage
                uploadarr = []
              }
            }, (error) => {
              console.log(error.message)
            }, () => {
              
              uploadRef.getDownloadURL().then((url) => {
                var fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
                const fileObj = {
                  name: fileName,
                  url: url,
                  type: fileType
                }
                this.cardDownloadUrls.push(fileObj)
              })
            })
            
          })

        },
        async submitCard() {
            const cards = this.getCards.map((v) => { return v.cardNumber })
            const userNameObj = {
                first: this.getUser.name.split(" ")[0],
                last: this.getUser.name.split(" ")[1]
            };

            await this.$refs.cardForm.validate().then(success => {
              if (!success) {
                this.isSubmitted = false
                return;
              }
              if (this.currentStep === 2) {
                const post = {
                  JobId: this.jobId,
                  ReportType: 'credit-card',
                  cardholderInfo: this.cardholderInfo,
                  billingAddress: this.billingAddress,
                  creditCard: this.selectedCard.card == 'Other' ? this.selectedCard.otherCard : this.selectedCard.card,
                  cardNumber: this.cardNumber,
                  cardholderName: this.cardName,
                  expDate: this.expirationDate,
                  cvcNum: this.cvcNum,
                  cardholderZip: this.billingAddress.zip,
                  cusSign: this.cusSig.data,
                  customerSigDate: this.cusSigDateFormatted,
                  teamMember: userNameObj,
                  cardImages: this.$nuxt.isOffline ? this.cardImages : this.cardDownloadUrls
                };
                if (!cards.includes(this.cardNumber)) {
                  if (this.$nuxt.isOffline) {
                    this.addCreditCard(post).then(() => {
                      this.message = "Credit card info saved"
                      this.isSubmitted = true
                      setTimeout(() => {
                        this.message = ""
                      }, 5000);
                    }).catch((err) => {
                      this.errorMessage = err
                    })
                  } else {
                    this.$axios.$post("/api/credit-card/new", post).then((res) => {
                      if (res.errors) {
                        this.errorMessage = res.errors
                        return;
                      }
                      this.message = "Credit card info submitted"
                      this.isSubmitted = true
                      
                      setTimeout(() => {
                        this.message = ""
                        this.errorMessage = ""
                      }, 5000);
                    }).catch((err) => {
                      this.errorMessage = err
                    })
                  }
                } else {
                  this.errorMessage = "Can't have duplicate credit card numbers"
                }
                
                return;
              }
              this.currentStep++
            })
        },
        submit() {
            this.$emit('submitForm')
        },
        maskDate() {
            var x = this.expirationDate.replace(/\D/g, '').match(/(\d{0,2})(\d{0,2})/)
            this.expirationDate = !x[2] ? x[1] : x[1] + '/' + x[2]
        }
    },
    mounted() {
        this.checkStorage()
    }
  }
</script>
<style lang="scss">
.card-upload {
  display:flex;
  flex-direction:column;
  max-width:300px;
  width:100%;
  &__message {
    grid-column:3;
  }
}
</style>