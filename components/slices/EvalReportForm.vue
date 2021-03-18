<!-- eslint-disable -->
<template>
  <div class="form-wrapper form-wrapper__dispatch-form">
    <h1 class="text-center">Water Emergency Services Incorporated</h1>
    <h2 class="text-center">Dispatch Service Evaluation Report</h2>
    <ValidationObserver v-slot="{ handleSubmit }">
      <h2>{{ message }}</h2>
      <h2 class="alert alert--error">{{errorMessage}}</h2>
      <form ref="form" class="form" @submit.prevent="handleSubmit(submitForm)" v-if="!submitted">
        <div class="form__form-group">
          <!-- <ValidationProvider
            v-slot="{ errors }"
            name="timeofCall"
            class="form__input--input-group"
          >
            <label class="form__label">Time of Call</label>
            <input v-model="timeOfCall" class="form__input" type="text" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>-->
          <ValidationProvider ref="jobIdField" rules="required" v-slot="{ errors, ariaMsg, ariaInput }" name="Job Id" class="form__input--input-group">
            <label class="form__label">Job ID Number</label>
            <input name="jobId" v-model="jobId" class="form__input" type="text" v-bind="ariaInput" />
            <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="form__input--input-group">
            <label for="timeOfCall" class="form__label">Time of Call</label>
            <v-dialog ref="timeDialog" v-model="timeModal" :return-value.sync="timeOfCall" persistent width="400px">
              <template v-slot:activator="{ on, attrs }">
                <input id="timeOfCall" v-model="timeFormatted" class="form__input" readonly v-bind="attrs" v-on="on" />
              </template>
              <v-time-picker v-if="timeModal" v-model="timeOfCall" full-width format="ampm">
                <v-spacer></v-spacer>
                <v-btn text color="#fff" @click="timeModal = false">Cancel</v-btn>
                <v-btn text color="#fff" @click="$refs.timeDialog.save(timeOfCall)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </div>
          <div class="form__input--input-group">
            <label for="dateOfCall" class="form__label">Date of Call</label>

            <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="400px">
              <template v-slot:activator="{ on, attrs }">
                <input id="dateOfCall" v-model="dateFormatted" v-bind="attrs" class="form__input" v-on="on"
                       @blur="date = parseDate(dateFormatted)" />
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="#fff" @click="modal = false">Cancel</v-btn>
                <v-btn text color="#fff" @click="$refs.dialog.save(date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
            <v-date-picker v-if="dateBoxSelected" v-model="picker"></v-date-picker>
          </div>
          <div class="form__input--input-group">
            <label for="location" class="form__label">Location</label>
            <div id="geocoder" ref="geocoder" class="form__geocoder form__input"
                 @change="$nuxt.$emit('location-updated')"></div>
          </div>
        </div>
        <div class="form__form-group form__form-group--info-box">
          <div class="form__form-group--left-side">
            <label for="CallerName" class="form__label">Caller Name</label>
            <input id="CallerName" v-model="callerName" name="Caller" type="text"
                   class="form__input form__input--long" />
            <label for="ContactName" class="form__label">Arrival Contact Name</label>
            <input id="ContactName" v-model="arrivalContactName" name="ContactName" type="text"
                   class="form__input form__input--long" />
            <label class="form__label">Address</label>
            <input v-model="location.address" name="Address" type="text" class="form__input form__input--long"
                   readonly />
            <label class="form__label">City, State, Zip</label>
            <input v-model="location.cityStateZip" name="cityStateZip" type="text" class="form__input form__input--long"
                   readonly />
            <label class="form__label" for="phone">Phone Number</label>
            <input id="phone" v-model="phone" name="Phone" class="form__input" type="phone" @input="acceptNumber" />
            <ValidationProvider v-slot="{ errors }" name="Email" rules="email">
              <label for="email" class="form__label">Email Address</label>
              <br />
              <input id="email" v-model="email" type="email" class="form__input" name="Email" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group--right-side">
            <h2>Check all that apply</h2>
            <div v-for="propertyDesc in property" :key="propertyDesc.id" class="form__input-wrapper--checkboxes">
              <input :id="propertyDesc.id" v-model="selectedCheckboxes" type="checkbox" :value="propertyDesc.text" />
              <label :for="propertyDesc.id">{{ propertyDesc.text }}</label>
            </div>
          </div>
          <div class="form__form-group--block form__section">
            <h3>Intrusion Logs</h3>
            <div class="form__input-wrapper">
              <div class="form__input--input-group">
                <label for="sourceIntrusion" class="form__label">Source of Intrusion</label>
                <input id="sourceIntrusion" type="text" class="form__input" />
              </div>
              <div class="form__input--input-group">
                <label for="dateOfIntrusion" class="form__label">Date of Intrusion</label>
                <v-dialog ref="dateIntrusionDialog" v-model="intrusionLogsDialog.dateIntrusion" persistent :return-value.sync="dateIntrusion" transition="scale-transition" max-width="320px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="dateOfIntrusion" v-model="dateIntrusionFormatted" class="form__input" v-bind="attrs" v-on="on" />
                    <span class="button" @click="dateIntrusion = ''">clear</span>
                  </template>
                  <v-date-picker v-if="intrusionLogsDialog.dateIntrusion" v-model="dateIntrusion" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="intrusionLogsDialog.dateIntrusion = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dateIntrusionDialog.save(dateIntrusion)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group">
                <label for="timeIntrusionBegan" class="form__label">Time Intrusion Began</label>
                <v-dialog ref="timeIntrusionBegan" v-model="intrusionLogsDialog.timeIntBegan" persistent
                  :return-value.sync="timeIntBegan" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="timeIntrusionBegan" v-model="timeIntBeganFormatted" class="form__input" v-bind="attrs"
                      v-on="on" />
                    <span class="button" @click="timeIntBegan = ''">clear</span>
                  </template>
                  <v-time-picker v-if="intrusionLogsDialog.timeIntBegan" v-model="timeIntBegan" format="ampm" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="intrusionLogsDialog.timeIntBegan = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.timeIntrusionBegan.save(timeIntBegan)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group">
                <label for="timeIntrusionEnd" class="form__label">Time Intrusion End</label>
                <v-dialog ref="timeIntrusionEnd" v-model="intrusionLogsDialog.timeIntEnd" persistent
                  :return-value.sync="timeIntEnd" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="timeIntrusionEnd" v-model="timeIntEndFormatted" class="form__input" v-bind="attrs"
                      v-on="on" />
                    <span class="button" @click="timeIntEnd = ''">clear</span>
                  </template>
                  <v-time-picker v-if="intrusionLogsDialog.timeIntEnd" v-model="timeIntEnd" format="ampm" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="intrusionLogsDialog.timeIntEnd = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.timeIntrusionEnd.save(timeIntEnd)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group">
                <label for="ageStructure" class="form__label">Age of Structure</label>
                <input id="ageStructure" type="text" v-model="structureAge" class="form__input" />
              </div>
              <div class="form__input--input-group">
                <label for="numberOfRooms" class="form__label">Number of Rooms</label>
                <input type="number" id="numberOfRooms" class="form__input" v-model="numberRooms" />
              </div>
              <div class="form__input--input-group">
                <label for="numberOfStories" class="form__label">Number of Stories</label>
                <input type="number" id="numberOfStories" class="form__input" v-model="numberStories" />
              </div>
              <div class="form__input--input-group">
                <label for="approxSquareFoot" class="form__label">Approx. Square Foot</label>
                <input type="number" id="approxSquareFoot" class="form__input" v-model="approxSqFt" />
              </div>
            </div>
          </div>
          <div class="form__form-group--full-width">
            <div class="form__input--input-group">
              <label for="appointment" class="form__label">Appointment time set for</label>
              <v-dialog content-class="time-pickers__range" max-width="700px" ref="appointmentTimeDialog"
                        v-model="appointmentTimeModal" :return-value.sync="appointmentTimeFormatted" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <input type="text" id="appointment" v-model="appointmentTimeFormatted" class="form__input" readonly
                         v-bind="attrs" v-on="on" />
                </template>
                <v-time-picker class="time-picker time-picker-start" v-if="appointmentTimeModal" v-model="appointmentTimeStart" format="ampm" :max="appointmentTimeEnd">
                  <v-spacer></v-spacer>
                  <!-- <v-btn text color="#fff" @click="appointmentTimeModal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.appointmentTimeDialog.save(appointmentTimeStart)">OK</v-btn> -->
                </v-time-picker>
                <v-time-picker class="time-picker time-picker--end" v-if="appointmentTimeModal" v-model="appointmentTimeEnd" :min="appointmentTimeStart">
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="appointmentTimeModal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.appointmentTimeDialog.save(appointmentTimeEnd)">OK</v-btn>
                </v-time-picker>
              
              </v-dialog>
            </div>
            <div class="form__input--input-group">
              <label for="appointmentDate" class="form__label">Date of Appointment</label>
              <v-dialog ref="dialogAppointment" v-model="modalAppointment" :return-value.sync="appointmentDate"
                        persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="appointmentDate" v-model="appointmentDateFormatted" v-bind="attrs" class="form__input"
                         v-on="on" @blur="
                      appointmentDate = parseDate(appointmentDateFormatted)
                    " />
                </template>
                <v-date-picker v-model="appointmentDate" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="modalAppointment = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.dialogAppointment.save(appointmentDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </div>
            <div class="form__input--input-group">
              <label for="updateTimeCall" class="form__label">(15-Min) ETA Verification Call Time</label>
              <v-dialog ref="updateCallTime" v-model="verificationTime.callTime" :return-value.sync="callTime"
                        persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="updateTimeCall" v-model="callTimeFormatted" class="form__input" readonly v-bind="attrs"
                         v-on="on" />
                  <span class="button" @click="callTime = ''">clear</span>
                </template>
                <v-time-picker v-if="verificationTime.callTime" v-model="callTime" full-width format="ampm">
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="verificationTime.callTime = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.updateCallTime.save(callTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </div>
            <div class="form__input--input-group">
              <label for="textVerificationTime" class="form__label">Text ETA Verification Time</label>
              <v-dialog ref="textVerificationTime" v-model="verificationTime.textEtaTime" :return-value.sync="textEtaTime"
                        persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="textVerificationTime" v-model="textEtaTimeFormatted" class="form__input" readonly
                         v-bind="attrs" v-on="on" />
                  <span class="button" @click="textEtaTime = ''">clear</span>
                </template>
                <v-time-picker v-if="verificationTime.textEtaTime" v-model="textEtaTime" full-width format="ampm">
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="verificationTime.textEtaTime = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.textVerificationTime.save(textEtaTime)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </div>
          </div>
          <div class="form__form-group--full-width">
            <label for="notes" class="form__label">Notes</label>
            <textarea class="form__input--textbox form__input" v-model="notes"></textarea>
          </div>
          <div class="form__form-group--full-width form__section">
            <div class="form__input--input-group">
              <label class="form__label">Team Member</label>
              <p>{{getUser ? getUser.name : null}}</p>
            </div>
            <div class="form__input--input-group">
              <label class="form__label">Team Member Signature</label>
              <div class="form__input-wrapper">
                <lazy-signature-pad-modal :sigData="teamMemberSig" name="Team member signature" sigRef="teamSignaturePad" />
              </div>
            </div>          
          </div>
        </div>
        <div class="form__button-wrapper"><button class="button form__button-wrapper--submit" type="submit">{{ submitting ? 'Submitting' : 'Submit' }}</button></div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  /* eslint-disable */
  import {
    mapGetters,
    mapState,
    mapActions
  } from 'vuex'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  export default {
    name: 'EvalReportForm',
    props: ['slice'],
    data: (vm) => ({
      id: "",
      name: "",
      jobId: null,
      timeOfCall: new Date().toTimeString().substr(0, 5),
      timeFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      timeOfDay: '',
      dateOfCall: '',
      dateBoxSelected: false,
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      appointmentDateSelected: false,
      appointmentDate: new Date().toISOString().substr(0, 10),
      appointmentDateFormatted: vm.formatDate(
        new Date().toISOString().substr(0, 10)
      ),
      appointmentTimeSelected: false,
      appointmentTime: null,
      appointmentTimeFormatted: vm.formatTimeRange(
        new Date().toTimeString().substr(0, 5), new Date().toTimeString().substr(0, 5)
      ),
      appointmentTimeStart: null,
      appointmentTimeEnd: null,
      modal: false, //Binded to Date of call
      modalAppointment: false,
      timeModal: false,
      appointmentTimeModal: false,
      verificationTime: {
        callTime: false,
        textEtaTime: false,
      },
      callTime: null,
      callTimeFormatted: vm.formatTime(null),
      textEtaTime: null,
      textEtaTimeFormatted: vm.formatTime(null),
      location: {
        address: null,
        city: null,
        cityStateZip: null,
      },
      callerName: '',
      arrivalContactName: '',
      property: [{
          id: 1,
          text: 'The property owner is the caller',
          checked: false
        },
        {
          id: 2,
          text: 'The property is insured properly',
          checked: false
        },
        {
          id: 3,
          text: 'The property is a residential building',
          checked: false
        },
        {
          id: 4,
          text: 'The property is a commercial building',
          checked: false
        },
        {
          id: 5,
          text: 'The property is an apartment/condo building',
          checked: false,
        },
        {
          id: 6,
          text: 'The property is currently wet',
          checked: false
        },
        {
          id: 7,
          text: 'The property has standing water',
          checked: false
        },
        {
          id: 8,
          text: 'The property has wet carpet',
          checked: false
        },
        {
          id: 9,
          text: 'The property has been wet longer than 72 hours',
          checked: false,
        },
        {
          id: 10,
          text: 'The property will require water pumps for extraction',
          checked: false,
        },
        {
          id: 11,
          text: 'The property has requested the use of PPE products by on-site personnel'
        }
      ],
      email: '',
      phone: '',
      selectedCheckboxes: [],
      appointmentTime: '',
      notes: '',
      message: '',
      errorMessage:'',
      submitted: false,
      submitting: false,
      sourceIntrusion: "",
      intrusionLogsDialog: {
        sourceIntrusion: false,
        dateIntrusion: false,
        timeIntBegan: false,
        timeIntEnd: false,
        structureAge: false,
        numberRooms: false,
        numberStories: false,
        approxSqFt: false
      },
      dateIntrusion: new Date().toISOString().substr(0, 10),
      dateIntrusionFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      timeIntBegan: null,
      timeIntBeganFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      timeIntEnd: null,
      timeIntEndFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      structureAge: null,
      numberRooms: null,
      numberStories: null,
      approxSqFt: null,
      teamMemberSig: {
        data: '',
        isEmpty: true
      },
      signDateTime: new Date().toLocaleString(),
      sigDialog: false
    }),
    watch: {
      date(val) {
        this.dateFormatted = this.formatDate(val)
      },
      appointmentDate(val) {
        this.appointmentDateFormatted = this.formatDate(val)
      },
      appointmentTimeFormatted(val) {
        this.appointmentTimeFormatted = this.formatTimeRange(this.appointmentTimeStart, this.appointmentTimeEnd)
      },
      timeOfCall(val) {
        this.timeFormatted = this.formatTime(val)
      },
      callTime(val) {
        this.callTimeFormatted = this.formatTime(val)
      },
      textEtaTime(val) {
        this.textEtaTimeFormatted = this.formatTime(val)
      },
      dateIntrusion(val) {
        this.dateIntrusionFormatted = this.formatDate(val)
      },
      timeIntBegan(val) {
        this.timeIntBeganFormatted = this.formatTime(val)
      },
      timeIntEnd(val) {
        this.timeIntrusionEnd = this.formatTime(val)
      }
    },
    created() {
      this.$nuxt.$on('location-updated', (event) => {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const geocode = this.$refs.geocoder
        const accessToken = process.env.mapboxKey
        const g = new MapboxGeocoder({
          accessToken: accessToken,
          types: 'region,place,postcode,address',
        })
        const location = geocode.firstChild.childNodes[1].value.split(',', 3)
        
        const address = location[0].trim()
        let city
        let stateZip
        if (location[1] !== undefined && location[2] !== undefined) {
          city = location[1].trim()
          stateZip = location[2].trim()
          this.location.cityStateZip = city + ', ' + stateZip
        } else {
          city = ''
          stateZip = ''
        }
        this.location.address = address
        this.location.city = city
      })
    },
    mounted() {
      this.createGeocoder()
      this.checkStorage()
    },
    computed: {
      ...mapGetters(['getUser']),
      ...mapGetters(['getReports']),
      ...mapState('indexDb',[
        'reports'
      ])
    },
    methods: {
      ...mapActions({
        addReport: 'indexDb/addReport',
        checkStorage: 'indexDb/checkStorage'
      }),
      clear() {
        this.$refs.signaturePad.clearSignature();
        this.cusSignature.isEmpty = true
        this.cusSignature.data = null
      },
      save() {
        const {
          data,
          isEmpty
        } = this.$refs.signaturePad.saveSignature();
        this.cusSignature.data = data;
        this.cusSignature.isEmpty = isEmpty
      },
      onBegin() {
        const {
          isEmpty
        } = this.$refs.signaturePad.saveSignature();
        this.cusSignature.isEmpty = isEmpty
        this.$nextTick(() => {
          this.$refs.signaturePad.resizeCanvas()
        })
      },
      createGeocoder() {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const accessToken = process.env.mapboxKey
        const geocoder = new MapboxGeocoder({
          accessToken: accessToken,
          types: 'region,place,postcode,address',
          placeholder: 'Search for address...',
        })
        geocoder.setTypes('address').addTo('.form__geocoder')
      },
      async submitForm() {
        this.message = ""
        const user = this.getUser
        const reports = this.getReports.map((v) => { return v.JobId })
        const userNameObj = {
          first: user.name.split(" ")[0],
          last: user.name.split(" ")[1]
        }

        if (!reports.includes(this.jobId)) {
          const post = {
            JobId: this.jobId,
            callerName: this.callerName,
            ArrivalContactName: this.arrivalContactName,
            phoneNumber: this.phone,
            emailAddress: this.email,
            location: this.location,
            timeFormatted: this.timeFormatted,
            dateFormatted: this.dateFormatted,
            appointmentDate: this.appointmentDateFormatted,
            appointmentTime: this.appointmentTimeFormatted,
            callTimeUpdate: this.callTimeFormatted,
            textTimeUpdate: this.textEtaTimeFormatted,
            propertyChkList: this.selectedCheckboxes,
            summary: this.notes,
            ReportType: 'dispatch',
            teamMember: userNameObj,
            id: user.id,
            teamMemberSig: this.teamMemberSig.data,
            signDate: this.signDateTime
          };
          if (this.$nuxt.isOffline) {
            this.addReport(post).then(() => {
              this.message = "Report was saved successfully for submission later!"
              this.jobId = ""
              this.callerName = ""
              this.email = ""
              this.location = {
                address: null,
                city: null,
                cityStateZip: null,
              }
              this.phone = ""
              this.notes = ""
              this.selectedCheckboxes = []
              this.$refs.jobIdField.value = ""
              this.submitted = true
              setTimeout(() => {
                this.message = ""
                this.$router.push("/")
              }, 2000)
            })
          } else {
            await this.$axios.$post("/api/dispatch/new", post).then(() => {
              this.message = "Report submitted"
              this.submitted = true
              setTimeout(() => {
                this.message = ""
                this.$router.push("/")
              }, 2000)
              this.message = "Report was saved successfully for submission later!"
              this.jobId = ""
              this.callerName = ""
              this.email = ""
              this.location = {
                address: null,
                city: null,
                cityStateZip: null,
              }
              this.phone = ""
              this.notes = ""
              this.selectedCheckboxes = []
              this.$refs.jobIdField.value = ""
            }).catch((err) => {
              this.errorMessage = err
            })
          }
        } else {
          this.errorMessage = "Duplicate Job ID can't exist"
        }        
      },
      formatDate(dateReturned) {
        if (!dateReturned) return null
        const [year, month, day] = dateReturned.split('-')
        return `${month}/${day}/${year}`
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
      formatTimeRange(timeStart, timeEnd) {
        if (!timeStart && !timeEnd) return null
        if (timeStart> timeEnd) return "Invalid time range"
        const startPieces = timeStart.split(':')
        const endPieces = timeEnd.split(':')
        let starthours, startminutes, endhours, endminutes
        if (startPieces.length === 2) {
          starthours = parseInt(startPieces[0], 10)
          startminutes = parseInt(startPieces[1], 10)
        }
        const newFormat1 = starthours >= 12 ? 'PM' : 'AM'
        starthours = starthours % 12
        // To display "0" as "12"
        starthours = starthours || 12
        startminutes = startminutes < 10 ? '0' + startminutes : startminutes
        if (endPieces.length === 2) {
          endhours = parseInt(endPieces[0], 10)
          endminutes = parseInt(endPieces[1], 10)
        }
        const newFormat2 = endhours >= 12 ? 'PM' : 'AM'
        endhours = endhours % 12
        // To display "0" as "12"
        endhours = endhours || 12
        endminutes = endminutes < 10 ? '0' + endminutes : endminutes
        return `${starthours}:${startminutes} ${newFormat1}-${endhours}:${endminutes} ${newFormat2}`
      },
      parseTime(time) {
        if (!time) return null
      },
      parseDate(date) {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      acceptNumber() {
        var x = this.phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        this.phone = !x[2] ?
          x[1] :
          '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
      },
    },
    beforeDestroy() {
      this.$nuxt.$off('location-updated')
    }
  }
</script>
<style lang="scss">
  #map {
    height: 200px;
    width: 200px;
  }
  
  .form {
    &__form-group {
      
    }
  }
</style>