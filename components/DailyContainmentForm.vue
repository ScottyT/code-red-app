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
                        <label :for="subitem.label">{{subitem.label}}</label>                        
                    </li>
                </ol>
            </li>
        </ol>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
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
      submitted: false,
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
                  {label: "Content Manipulation"},
                  {label: "Brick & Stack"},
                  {label: "Furniture Dolly & Blankets"}
              ]
          },
          {
              subheading: "Content - (Off-site)",
              sublist: [
                  {label: "Inventory"},
                  {label: "Storage Pod"},
                  {label: "Storage Warehouse"},
                  {label: "Small Box"},
                  {label: "Medium Box"},
                  {label: "Large Box"},
                  {label: "Moving Van"},
                  {label: "Truck Load of Debris"},
                  {label: "Warehouse Clean Technician"}
              ]
          }
      ],
      selectedContent:[]
    }),
    watch: {
      date(val) {
        this.dateFormatted = this.formatDate(val)
      }
    },
    computed: {
      ...mapGetters(['getUser']),
    },
    mounted() {
      this.createGeocoder()
    },
    methods: {
      formatDate(dateReturned) {
        if (!dateReturned) return null
        const [year, month, day] = dateReturned.split('-')
        return `${month}/${day}/${year}`
      },
      createGeocoder() {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const accessToken = 'pk.eyJ1Ijoic2NyYXBweXQiLCJhIjoiY2s2MTRkOGpzMGYyYjNycGtudjAyeHN6ZiJ9.T_ep9Ehc0iE1TDgkx69qhA'
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
    },
    created() {
      this.$nuxt.$on('location-updated', (event) => {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const geocode = this.$refs.geocoder
        const accessToken =
          'pk.eyJ1Ijoic2NyYXBweXQiLCJhIjoiY2s2MTRkOGpzMGYyYjNycGtudjAyeHN6ZiJ9.T_ep9Ehc0iE1TDgkx69qhA'
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
    }
  }
</script>