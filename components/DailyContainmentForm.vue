<template>
  <div class="form-wrapper form-wrapper__case-file">
    <h1 class="text-center">Water Emergency Services Incorporated</h1>
    <h2 class="text-center">Daily Containement Case File Report</h2>
    <ValidationObserver v-slot="{ handleSubmit }">
      <h2>{{message}}</h2>
      <h2 class="alert alert--error">{{errorMessage}}</h2>
      <form ref="form" class="form" @submit.prevent="handleSubmit(submitForm)" v-if="!submitted">
        <div class="form__form-group">
          <ValidationProvider ref="jobIdField" rules="required" v-slot="{ errors, ariaMsg, ariaInput }" name="JobId"
                              class="form__input--input-group">
            <label class="form__label">Job ID Number</label>
            <input name="jobId" v-model="jobId" class="form__input" type="text" v-bind="ariaInput" />
            <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="form__input--input-group">
            <label class="form__label">Team Lead ID #</label>
            <input type="text" readonly v-model="getUser.id" name="teamLeadId" class="form__input" />
          </div>
          <div class="form__input--input-group">
            <label for="date" class="form__label">Date</label>
            <v-dialog ref="dateDialog" v-model="dateDialog" :return-value.sync="date" persistent width="400px">
              <template v-slot:activator="{on, attrs}">
                <input id="date" v-model="dateFormatted" v-bind="attrs" class="form__input" v-on="on"
                       @blur="date = parseDate(dateFormatted)" />
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="#fff" @click="dateDialog = false">Cancel</v-btn>
                <v-btn text color="#fff" @click="$refs.dateDialog.save(date)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <div class="form__input--input-group">
            <label for="location" class="form__label">Address</label>
            <div id="geocoder" ref="geocoder" class="form__geocoder form__input"
                 @change="$nuxt.$emit('location-updated')"></div>
          </div>
        </div>
        <div class="form__form-group">
          <label class="form__label">Address</label>
          <input v-model="location.address" name="Address" type="text" class="form__input form__input--long" />
          <label class="form__label">City, State, and Zip</label>
          <input v-model="location.cityStateZip" name="CityStateZip" type="text"
                 class="form__input form__input--long" />
        </div>
        <div class="form__form-group form__section">         
          <ol class="form__form-group--block form__form-group--listing" v-for="(item, i) in tmpRepairSection" :key="`item-${i}`">
            <h3>1) TMP REPAIR</h3>
            <li>
              {{item.subheading}}
            </li>
            <ol class="form__form-group form__form-group--sublisting">
              <li v-for="(subitem, i) in item.sublist" :key="`sub-${i}`">
                <input :id="`subitem${i}`" type="checkbox" v-model="selectedTMPRepairs" :value="subitem.label" />
                <label :for="`subitem${i}`" class="form__label">{{subitem.label}}</label>               
              </li>
            </ol>
          </ol>
        </div>
        <div class="form__form-group form__form-group--info-box">
          <h3>2) CONTENT</h3>
          <ol class="form__form-group--listing">                
              <li v-for="(item, i) in contentSection" :key="`content-${i}`">                
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                      <li v-for="(subitem, i) in item.sublist" :key="`content-sublist-${i}`">
                          <input :id="subitem.label" type="checkbox" v-model="selectedContent" :value="subitem" />
                          <label class="form__label" :for="subitem.label">{{subitem.label}}</label>                        
                      </li>
                  </ol>
              </li>
          </ol>
        </div>
        <div class="form__form-group form__form-group--info-box">
          <h3>3) STRUCTURAL DRYING</h3>
          <ol class="form__form-group--listing">
            <li v-for="(item, i) in structualDryingSection" :key="`structure-${i}`">
              <span>{{item.subheading}}</span>
              <ol class="form__form-group form__form-group--sublisting">
                <li v-for="(subitem, i) in item.sublist" :key="`structure-sublist${i}`">
                  <input :id="subitem.label" type="checkbox" v-model="selectedStructualDrying" :value="subitem" />
                  <label class="form__label" :for="subitem.label">{{subitem.label}}</label>
                </li>
              </ol>
            </li>
          </ol>
        </div>
        <div class="form__form-group form__form-group--info-box">
          <h3>4) STRUCTURAL CLEANING</h3>
          <ol class="form__form-group--listing">
            <li v-for="(item, i) in structualCleaningSection" :key="`cleaning-${i}`">
              <span>{{item.subheading}}</span>
              <ol class="form__form-group form__form-group--sublisting">
                <li v-for="(subitem, i) in item.sublist" :key="`cleaning-sublist${i}`">
                  <input :id="subitem.label" type="checkbox" v-model="selectedStructualCleaning" :value="subitem" />
                  <label class="form__label" :for="subitem.label">{{subitem.label}}</label>
                </li>
              </ol>
            </li>
          </ol>
        </div>
        <div class="form__form-group--block form__section">
          <h3>Evaluation Logs</h3>
          <div class="form__input-wrapper">
            <div class="form__input--input-group">
              <label for="dispatchToProperty" class="form__label">Dispatch to Property</label>
              <v-dialog ref="dispatchDialog" v-model="evalLogsDialog.dispatchToProperty" persistent
                  :return-value.sync="dispatchToProperty" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="dispatchToProperty" v-model="dispatchPropertyFormatted" class="form__input"
                      v-bind="attrs" v-on="on" />
                    <span class="button" @click="dispatchToProperty = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.dispatchToProperty" v-model="dispatchToProperty" format="ampm"
                    full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.dispatchToProperty = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dispatchDialog.save(dispatchToProperty)">OK</v-btn>
                  </v-time-picker>
              </v-dialog>
            </div>
            <div class="form__input--input-group">
              <label for="startTime" class="form__label">Start Time</label>
              <v-dialog ref="dialogEvalStart" v-model="evalLogsDialog.evalStart" persistent
                  :return-value.sync="evalStart" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="startTime" v-model="evalStartFormatted" class="form__input"
                      v-bind="attrs" v-on="on" />
                    <span class="button" @click="evalStart = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.evalStart" v-model="evalStart" format="ampm"
                    full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.evalStart = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dialogEvalStart.save(evalStart)">OK</v-btn>
                  </v-time-picker>
              </v-dialog>
            </div>
            <div class="form__input--input-group">
              <label for="endTime" class="form__label">End Time</label>
              <v-dialog ref="dialogEvalEnd" v-model="evalLogsDialog.evalEnd" persistent
                  :return-value.sync="evalEnd" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="endTime" v-model="evalEndFormatted" class="form__input"
                      v-bind="attrs" v-on="on" />
                    <span class="button" @click="evalEnd = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.evalEnd" v-model="evalEnd" format="ampm"
                    full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.evalEnd = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dialogEvalEnd.save(evalEnd)">OK</v-btn>
                  </v-time-picker>
              </v-dialog>
            </div>
            <div class="form_input--input-group">
              <label for="totalTime" class="form__label">Total Time</label>
              <input type="text" readonly v-model="duration" />
            </div>
          </div>
          <div class="form__form-group">
            <div class="form__input-wrapper">
              <label class="form__label">Sign for Verification</label>
              <lazy-signature-pad-modal :sigData="verifySig" sigRef="verifySignaturePad" />
            </div>
          </div>
        </div>
        <div class="form__button-wrapper"><button class="button form__button-wrapper--submit" type="submit">{{ submitting ? 'Submitting' : 'Submit' }}</button></div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import {
    mapGetters, mapActions
  } from 'vuex'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  import moment from 'moment';
  export default {
    name: "DailyContainmentForm",
    data: (vm) => ({
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateDialog: false,
      jobId: null,
      location: {
        address: null,
        city: null,
        cityStateZip: null
      },
      message: '',
      errorMessage: '',
      tmpRepairSection: [{
        subheading: "Temporary Repairs",
        sublist: [{
            label: "Temporary Board-Up"
          },
          {
            label: "Temporary Tarp"
          },
          {
            label: "Temporary Power/Generator"
          }
        ]
      }],
      selectedTMPRepairs: [],
      contentSection: [
          {
              subheading: "Content - (On-site)",
              sublist: [
                  {label: "Content Manipulation", group:"Content - (On-site)"},
                  {label: "Brick & Stack", group:"Content - (On-site)"},
                  {label: "Furniture Dolly & Blankets", group:"Content - (On-site)"}
              ]
          },
          {
              subheading: "Content - (Off-site)",
              sublist: [
                  {label: "Inventory", group: "Content - (Off-site)"},
                  {label: "Storage Pod", group: "Content - (Off-site)"},
                  {label: "Storage Warehouse", group: "Content - (Off-site)"},
                  {label: "Small Box", group: "Content - (Off-site)"},
                  {label: "Medium Box", group: "Content - (Off-site)"},
                  {label: "Large Box", group: "Content - (Off-site)"},
                  {label: "Moving Van", group: "Content - (Off-site)"},
                  {label: "Truck Load of Debris", group: "Content - (Off-site)"},
                  {label: "Warehouse Clean Technician", group: "Content - (Off-site)"}
              ]
          }
      ],
      selectedContent:[],
      structualDryingSection: [
        {
          subheading: "Water Removal Services (Multiple Extractions may be required)",
          sublist: [
            {label:"H-Surface Extraction", group: "Water Removal Services (Multiple Extractions may be required)"},
            {label: "Carpet Extraction", group: "Water Removal Services (Multiple Extractions may be required)"},
            {label:"Lifted Carpet & Air", group: "Water Removal Services (Multiple Extractions may be required)"}
          ]
        },
        {
          subheading: "Protection - Plastic/Paper",
          sublist: [
            {label: "Containment Barrier", group: "Protection - Plastic/Paper"},
            {label: "Temporary Posts", group: "Protection - Plastic/Paper"},
            {label: "Cover Content", group: "Protection - Plastic/Paper"},
            {label: "Floor Protection", group: "Protection - Plastic/Paper"}
          ]
        },
        {
          subheading: "Material Removal",
          sublist: [
            {label: "Cut Caulk Lines", group:"Material Removal"},
            {label: "Baseboard", group: "Material Removal"},
            {label: "Trim/Casing", group: "Material Removal"},
            {label: "Doors", group: "Material Removal"},
            {label: "Floor Pad/Moisture B", group: "Material Removal"},
            {label: "Flooring", group: "Material Removal"},
            {label: "Tack Strip", group: "Material Removal"},
            {label: "Flooring Glue", group: "Material Removal"},
            {label: "Drywall Air-Wholes", group: "Material Removal"},
            {label: "Drywall Four Inch", group: "Material Removal"},
            {label: "Drywall Twenty Inch", group: "Material Removal"},
            {label: "Drywall Forty Inch", group: "Material Removal"},
            {label: "Wall Moisture B.", group: "Material Removal"},
            {label: "Paper-back Insulation", group: "Material Removal"},
            {label: "Blown-in Insulation", group: "Material Removal"},
            {label: "2” Wall Plaster/Lath", group: "Material Removal"}
          ]
        },
        {
          subheading: "Material Detach",
          sublist: [
            {label: "Toe-Kick", group: "Material Detach"},
            {label: "Cabinet", group: "Material Detach"},
            {label: "Vanity", group: "Material Detach"},
            {label: "Counter", group: "Material Detach"},
            {label: "Tub/Base", group: "Material Detach"},
            {label: "Shower/Surround", group: "Material Detach"},
            {label: "Shower Doors", group: "Material Detach"},
            {label: "Curtain Rod", group: "Material Detach"},
            {label: "Toilet", group: "Material Detach"},
            {label: "Medicine Cabinet", group: "Material Detach"},
            {label: "Sink/Faucet", group: "Material Detach"},
            {label: "P-Trap", group: "Material Detach"},
            {label: "Stovetop", group: "Material Detach"},
            {label: "Refrigerator", group: "Material Detach"},
            {label: "Oven", group: "Material Detach"},
            {label: "Dish Washer", group: "Material Detach"},
          ]
        }
      ],
      selectedStructualDrying:[],
      structualCleaningSection: [
        {
          subheading: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)",
          sublist: [
            {label: "Clean Floors", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Studs", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Walls", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Ceiling", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "HEPA Vac Walls", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "HEPA Vac Ceilings", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "HEPA Studs", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "HEPA Horizontal", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Horizontal", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Vertical", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Rafters/Joists", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"},
            {label: "Clean Heavy", group: "Cleaning (Initial Clean) - (Bulk Clean) - (Final Clean)"}
          ]
        },
        {
          subheading: "Agents & Sealants",
          sublist: [
            {label: "Anti-Microbial Agent", group: "Agents & Sealants"},
            {label: "Odor Control Agent", group: "Agents & Sealants"},
            {label: "Mold Agent", group: "Agents & Sealants"},
            {label: "Biological Agent", group: "Agents & Sealants"},
            {label: "Anti-Micro Sealant", group: "Agents & Sealants"},
            {label: "Odor Shellac", group: "Agents & Sealants"},
            {label: "Mold Sealant", group: "Agents & Sealants"},
            {label: "Encapsulate Sealant", group: "Agents & Sealants"}
          ]
        }
      ],
      selectedStructualCleaning: [],
      evalLogsDialog: {
        dispatchToProperty: false,
        evalStart: false,
        evalEnd: false,
        evalTotalTime: false
      },
      dispatchToProperty: null,
      dispatchPropertyFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      evalStart: new Date().toTimeString().substr(0, 5),
      evalStartFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      evalEnd: new Date().toTimeString().substr(0, 5),
      evalEndFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      verifySig: {
        data: '',
        isEmpty: true
      },
      submitting: false,
      submitted: false
    }),
    watch: {
      date(val) {
        this.dateFormatted = this.formatDate(val)
      },
      dispatchToProperty(val) {
        this.dispatchPropertyFormatted = this.formatTime(val)
      },
      evalStart(val) {
        this.evalStartFormatted = this.formatTime(val)
      },
      evalEnd(val) {
        this.evalEndFormatted = this.formatTime(val)
      }
    },
    computed: {
      ...mapGetters(['getUser', 'getReports']),
      duration() {
        let start = moment(this.date + 'T' + this.evalStart)
        let end = moment(this.date + 'T' + this.evalEnd)
        let duration = moment.duration(end.diff(start)).asMinutes()
        return duration + ' minutes'
      }
    },
    mounted() {
      this.createGeocoder()
      this.checkStorage()
    },
    methods: {
      ...mapActions({
        addReport: 'indexDb/addReport',
        checkStorage: 'indexDb/checkStorage'
      }),
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
      parseDate(date) {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      async submitForm() {
        this.message = ''
        const user = this.getUser;
        const userNameObj = {
          first: user.name.split(" ")[0],
          last: user.name.split(" ")[1]
        }
        const reports = this.getReports.map((v) => { return v.JobId })
        const evaluationLogs= [
          {label: 'Dispatch to Property', value: this.dispatchPropertyFormatted},
          {label: 'Start Time', value: this.evalStart},
          {label: 'End Time', value: this.evalEnd},
          {label: 'Total Time', value: this.duration}
        ]
        if (reports.includes(this.jobId)) {
          const post = {
            JobId: this.jobId,
            id: user.id,
            date: this.dateFormatted,
            location: this.location,
            selectedTMPRepairs: this.selectedTMPRepairs,
            selectedContent: this.selectedContent,
            selectedStructualCleaning: this.selectedStructualCleaning,
            selectedStructualDrying: this.selectedStructualDrying,
            selectedStructualCleaning: this.selectedStructualCleaning,
            evaluationLogs: evaluationLogs,
            verifySig: this.verifySig.data,
            ReportType: 'case-file',
            CaseFileType: 'containment',
            teamMember: userNameObj,
            afterHoursWork: 'No'
          };
          if (this.$nuxt.isOffline) {
            this.addReport(post).then(() => {
              this.message = "Report was saved successfully for submission later!"
              this.submitted = true
              setTimeout(() => {
                this.message = ""
                this.$router.push("/")
              }, 2000)
            })
          } else {
            this.$axios.$post("/api/case-file-report/new", post).then(() => {
              this.message = "Report submitted"
              this.submitted = true
              setTimeout(() => {
                this.message = ""
                this.$router.push("/")
              }, 2000)
            }).catch((err) => {
              this.errorMessage = err
            })
          }
        } else {
          this.submitted = false
          this.submitting = false
          this.errorMessage = "Job ID exsits"
        }
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
    beforeDestroy() {
      this.$nuxt.$off('location-updated')
    }
  }
</script>