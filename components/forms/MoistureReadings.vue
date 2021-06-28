<template>
    <div class="form-wrapper">
        <h1 class="text-center">{{company}}</h1>
        <h3 class="text-center">MOISTURE READING MAP READINGS</h3>
        <ValidationObserver ref="form" v-slot="{ errors }">
            <v-dialog width="400px" v-model="errorDialog">
                <div class="modal__error">
                    <div v-for="(error, i) in errors" :key="`error-${i}`">
                        <h3 class="form__input--error">{{ error[0] }}</h3>
                    </div>
                </div>
            </v-dialog>
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <form class="form" v-if="!submitted" @submit.prevent="submitForm">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" v-slot="{errors, ariaMsg}" name="Job ID" class="form__input-group form__input-group--normal">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID:</label>
                        <i class="form__select--icon icon--angle-down mdi" aria-label="icon"></i>
                        <select class="form__input" v-model="selectedJobId">
                            <option disabled value="">Please select a Job ID</option>
                            <option v-for="(item, i) in $store.state.reports.jobids" :key="`jobids-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="evalDate" name="Initial date of evaluation" rules="required" v-slot="{errors, ariaMsg}" class="form__input-group form__input-group--short">
                        <label class="form__label" for="evalDate">Initial Date of Evaluation</label>
                        <input type="hidden" v-model="initialEvalDate" />
                        <v-dialog ref="initEvalDateDialog" v-model="initEvalDateModal" :return-value.sync="initialEvalDate" persistent width="500px">
                            <template v-slot:activator="{on, attrs}">
                                <input id="evalDate" v-model="initialEvalDateFormatted" v-bind="attrs" class="form__input" v-on="on"
                                    @blur="initialEvalDate = parseDate(initialEvalDateFormatted)" />
                            </template>
                            <v-date-picker v-model="initialEvalDate" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="#fff" @click="initEvalDateModal = false">Cancel</v-btn>
                                <v-btn text color="#fff" @click="$refs.initEvalDateDialog.save(initialEvalDate)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <div class="form__input-group form__input-group--long">
                        <label for="location" class="form__label">Location</label>
                        <div id="geocoder" ref="geocoder" class="form__geocoder form__input"
                            @change="$nuxt.$emit('location-updated')"></div>
                    </div>
                    <ValidationProvider vid="address" name="Address" rules="required" v-slot="{errors, ariaMsg}" class="form__input-group form__input-group--long">
                        <label for="address" class="form__label">Address</label>
                        <input id="address" v-model="location.address" name="Address" type="text" class="form__input form__input--long" />
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="cityStateZip" name="City, State, and Zip" rules="required" v-slot="{errors, ariaMsg}" class="form__input-group form__input-group--long">
                        <label for="citystatezip" class="form__label">City, State, Zip</label>
                        <input id="citystatezip" v-model="location.cityStateZip" type="text" class="form__input form__input--long" />
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form__form-group">
                    <div class="form__input-group form__input-group--normal">
                        <label for="areaSub1" class="form__label">Area Sub-1</label>
                        <input id="areaSub1" type="text" class="form__input" v-model="areaSub1" />
                    </div>
                    <div class="form__input-group form__input-group--normal">
                        <label for="areaSub2" class="form__label">Area Sub-2</label>
                        <input id="areaSub2" type="text" class="form__input" v-model="areaSub2" />
                    </div>
                    <div class="form__input-group form__input-group--normal">
                        <label for="areaSub3" class="form__label">Area Sub-3</label>
                        <input id="areaSub3" type="text" class="form__input" v-model="areaSub3" />
                    </div>
                    <div class="form__input-group form__input-group--long">
                        <label for="baseLine" class="form__label">Base Line Comparitive Readings (Non-Affected)</label>
                        <input id="baseLine" type="text" class="form__input" v-model="baseLineReadings" />
                    </div>
                </div>
                <div class="form__table moisture-map">
                    <div class="form__table form__table--rows">
                        <div class="form__table--cols">
                            <label class="form__label">Date:</label>
                        </div>
                        <div class="form__table--cols" v-for="n in areaCols" :key="n">
                            <label class="form__label">Area {{n}}</label>
                        </div>
                    </div>
                    <div class="form__table form__table--rows" v-for="(row, i) in areaRows" :key="`row-${i}`">
                        <div class="form__table--cols">
                            <input type="text" v-mask="'##/##/####'" v-model="row.date" class="form__input" />
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaA" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaB" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaC" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaD" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaE" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaF" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaG" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaH" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaI" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaSub1" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaSub2" class="form__input" /></span>%
                        </div>
                        <div class="form__table--cols">
                            <span class="number-input"><input type="text" maxlength="3" v-model="row.areaSub3" class="form__input" /></span>%
                        </div>
                    </div>
                </div>
                <button class="button--normal" type="button" @click="addRow">Add row</button>
                <div class="form__section">
                    <ValidationProvider vid="notes" name="Notes" rules="required" v-slot="{errors, ariaMsg}" class="form__input--input-group">
                        <label class="form__label" for="notes">Notes:</label>
                        <textarea id="notes" class="form__input form__input--textarea" v-model="notes"></textarea>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form__form-group">
                    <UiFilesUpload :singleImage="false" subDir="moisture-images" :jobId="selectedJobId" @sendImages="uploadedFiles = $event" />
                </div>
                <button type="submit" class="button button--normal" v-show="!disabled">{{ submitting ? 'Submitting' : 'Submit' }}</button>
            </form>
        </ValidationObserver>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
export default {
    name: "MoistureReadings",
    data: (vm) => ({
        errorDialog: false,
        uploading:false,
        submittedMessage: "",
        errorMessage: "",
        submitted: false,
        submitting: false,
        selectedJobId: "",
        uploadedFiles:[],
        initialEvalDate: new Date().toISOString().substr(0, 10),
        initialEvalDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        initEvalDateModal: false,
        location: {
            address: null,
            city: null,
            cityStateZip: null,
        },
        areaSub1: "",
        areaSub2: "",
        areaSub3: "",
        baseLineReadings: "",
        areaCols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "SUB-1", "SUB-2", "SUB-3"],
        areaRows: [
            {
                date: '',
                areaA: '',
                areaB: '',
                areaC: '',
                areaD: '',
                areaE: '',
                areaF: '',
                areaG: '',
                areaH: '',
                areaI: '',
                areaSub1: '',
                areaSub2: '',
                areaSub3: ''
            }
        ],
        uploadProgress: "",
        uploadMessage: "",
        filesUpload: [],
        notes: '',
        disabled: false
    }),
    props:['company', 'abbreviation'],
    head() {
        return {
            title: "Moisture Readings"
        }
    },
    computed: {
        ...mapGetters({getReports:'reports/getReports', getUser:'users/getUser'})
    },
    watch: {
        initalEvalDate(val) {
            this.initialEvalDateFormatted = this.formatDate(val)
        }
    },
    methods: {
        ...mapActions({
            addReport: 'indexDb/addReport',
            checkStorage: 'indexDb/checkStorage',
        }),
        addRow() {
            this.areaRows.push({
                date: '',
                areaA: '',
                areaB: '',
                areaC: '',
                areaD: '',
                areaE: '',
                areaF: '',
                areaG: '',
                areaH: '',
                areaI: '',
                areaSub1: '',
                areaSub2: '',
                areaSub3: ''
            })
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
        submitForm() {
            this.submitting = true
            this.submittedMessage = ""
            const reports = this.getReports.filter((v) => {
                return v.ReportType === 'moisture-map'
            })
            const jobids = reports.map((v) => {
                return v.JobId
            })
            const post = {
                JobId: this.selectedJobId,
                ReportType: "moisture-map",
                formType: "logs-report",
                initialEvalDate: this.initialEvalDateFormatted,
                location: this.location,
                areaSub1: this.areaSub1,
                areaSub2: this.areaSub2,
                areaSub3: this.areaSub3,
                baseLineReadings: this.baseLineReadings,
                readingsRow: this.areaRows,
                notes: this.notes,
                teamMember: this.getUser
            };
            this.$refs.form.validate().then(success => {
                if (!success) {
                    this.submitting = false
                    this.errorDialog = true
                    return;
                }
                if (this.$nuxt.isOffline) {
                    if (!jobids.includes(this.selectedJobId)) {
                        const tempPost = {...post}
                        tempPost.jobImages = this.uploadedFiles
                        this.addReport(tempPost).then(() => {
                            this.submittedMessage = "Report was saved successfully for submission later!"
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
                        return;
                    }
                }
                if (this.$nuxt.isOnline) {
                    this.$axios.$post("/api/logs-report/new", post).then((res) => {
                        if (res.errors) {
                            this.errorDialog = true
                            this.submitting = false
                            this.$refs.form.setErrors({
                                JobId: res.errors.filter(obj => obj.param === 'JobId').map(v => v.msg),
                                notes: res.errors.filter(obj => obj.param === 'notes').map(v => v.msg)
                            })
                            return
                        }
                        this.submittedMessage = res.message
                        this.submitting = false
                        this.submitted = true
                        setTimeout(() => {
                            window.location = "/"
                        }, 2000)
                    })
                }
            })
        }
    },
    mounted() {
        this.createGeocoder()
        this.checkStorage()
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
<style lang="scss">
.moisture-map {
    @include respond(tabletLargeMax) {
        font-size:.95em;
    }
    .form__table--rows {
        grid-template-columns:100px repeat(12, 1fr);
    }
    input[type=text] {
        margin-bottom:0;
        @include respond(tabletLandscapeMax) {
            font-size:.9em;
            padding:2px 4px;
        }
    }
    .number-input {
        display:inline-block;
        @include respond(tabletLarge) {
            width:53px;
            input {
                padding:2px 4px;
            }
        }
        width:38px;
    }
}
</style>