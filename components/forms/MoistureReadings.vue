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
                    <ValidationProvider vid="JobId" v-slot="{errors, ariaMsg}" name="Job ID" class="form__input--input-group">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID:</label>
                        <select class="form__select form__input" v-model="selectedJobId">
                            <option disabled value="">Please select a Job ID</option>
                            <option v-for="(item, i) in $store.state.reports.jobids" :key="`jobids-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="evalDate" name="Initial date of evaluation" rules="required" v-slot="{errors, ariaMsg}" class="form__input--input-group">
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
                    <div class="form__input--input-group">
                        <label for="location" class="form__label">Location</label>
                        <div id="geocoder" ref="geocoder" class="form__geocoder form__input"
                            @change="$nuxt.$emit('location-updated')"></div>
                    </div>
                    <ValidationProvider vid="address" name="Address" rules="required" v-slot="{errors, ariaMsg}" class="form__input--input-group">
                        <label for="address" class="form__label">Address</label>
                        <input id="address" v-model="location.address" name="Address" type="text" class="form__input form__input--long" />
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="cityStateZip" name="City, State, and Zip" rules="required" v-slot="{errors, ariaMsg}" class="form__input--input-group">
                        <label for="citystatezip" class="form__label">City, State, Zip</label>
                        <input id="citystatezip" v-model="location.cityStateZip" type="text" class="form__input form__input--long" />
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
                    </ValidationProvider>
                </div>
                <div class="form__form-group">
                    <div class="form__input--input-group">
                        <label for="areaSub1" class="form__label">Area Sub-1</label>
                        <input id="areaSub1" type="text" class="form__input" v-model="areaSub1" />
                    </div>
                    <div class="form__input--input-group">
                        <label for="areaSub2" class="form__label">Area Sub-2</label>
                        <input id="areaSub2" type="text" class="form__input" v-model="areaSub2" />
                    </div>
                    <div class="form__input--input-group">
                        <label for="areaSub3" class="form__label">Area Sub-3</label>
                        <input id="areaSub3" type="text" class="form__input" v-model="areaSub3" />
                    </div>
                    <div class="form__input--input-group">
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
                    <ValidationProvider rules="ext:doc,pdf,xlsx,docx,jpg,png,gif,jpeg" ref="jobimages" name="Job images" v-slot="{ errors, validate }" class="form__input--input-group">
                        <label class="form_label">Job images:</label>
                        <p>{{errorMessage}}</p>
                        <input type="hidden" v-model="uploadedFiles" @click="validate" />
                        <div class="file-listing-wrapper">
                            <div v-for="(file, key) in uploadedFiles" class="file-listing" :key="`jobfiles-${key}`">
                                <img class="file-listing__preview" v-bind:ref="'image'+parseInt(key)" />
                                <span class="file-listing__remove-file" @click="removeFile(key, file)" tag="i">
                                    <span class="file-listing__remove-file--leg1 file-listing__remove-file--leg"></span>
                                    <span class="file-listing__remove-file--leg2 file-listing__remove-file--leg"></span>
                                </span>
                            </div>
                        </div>
                        <span class="form__input--error">{{ errors[0] }}</span>
                        <input type="file" name="images" ref="images" accept="image/*" @change="filesChange" multiple />
                        <button type="button" class="button--normal" @click="uploadFiles(uploadedFiles, $refs.jobfiles)" v-if="uploadedFiles.length > 0 && errors.length <= 0 && $nuxt.isOnline">
                            {{ uploading ? 'Uploading' : 'Upload'}}
                        </button>
                        <p aria-label="Upload message goes here" name="Job files" ref="jobfiles"></p>
                        <p v-show="uploadProgress !== ''">Upload is {{uploadProgress}}% done</p>
                        <span class="button__add-files button" @click="addFiles()">Add Files</span>
                    </ValidationProvider>
                </div>
                <button type="submit" class="button button--normal" :disabled="disabled">{{ submitting ? 'Submitting' : 'Submit' }}</button>
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
        },
        uploadFiles(uploadarr, element) {
            const today = new Date()
            const date = (today.getMonth() + 1)+'-'+today.getDay()+'-'+today.getFullYear();
            if (!this.selectedJobId) {
                this.errorMessage = "Job ID is required"
                return;
            }
            
            uploadarr.forEach((file) => {
                var storageRef = this.$fire.storage.ref()
                var field = element.getAttribute('name')
                var uploadRef = storageRef.child(`${this.selectedJobId}/moisture-images/${file.name}`)
                var uploadTask = uploadRef.put(file)
                uploadTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.disabled = true
                    this.uploadProgress = progress
                    if (progress == 100) {
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
                            type: fileType,
                            date: date
                        }
                        this.filesUpload.push(fileObj)
                    })
                    this.disabled = false
                })
            })
        },
        removeFile(key, removedFile) {
            this.uploadedFiles.splice(key, 1);
            this.getImagePreviews(this.uploadedFiles, 'image')
            this.$refs.images.value = null
        },
        async filesChange(e) {
            const fileList = e.target.files
            const uploadarea = e.target.name
            if (!fileList.length) return
            const job = this.jobId
            var {valid} = await this.$refs.jobimages.validate(e)
            if (valid) {
                for (var i = 0; i < this.$refs.images.files.length; i++) {
                    var file = this.$refs.images.files[i]
                    this.uploadedFiles.push(file)
                }
                this.getImagePreviews(this.uploadedFiles, 'image')
            }
        },
        getImagePreviews(filesarr, usekey) {
            for (let i = 0; i < filesarr.length; i++) {
                if (/\.(jpe?g|png|gif)$/i.test(filesarr[i].name)) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                    console.log(usekey)
                    this.$refs[usekey + i][0].src = reader.result;
                    }, false);
                    reader.readAsDataURL(filesarr[i])
                }
            }
        },
        addFiles() {
            this.$refs.images.click()
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