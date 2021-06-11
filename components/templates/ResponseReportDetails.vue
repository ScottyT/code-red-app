<template>
<section class="pdf-content">
  <div class="report-details report-details__response-report">
    <h1 v-if="message">{{message}}</h1>
    <h1 class="text-center">{{company}}</h1>
    <h2 class="text-center">{{formName}}</h2>
    <v-btn v-if="notPdf" @click="startEditing" dark>{{ isEditing ? "Editing" : "Edit"}}</v-btn>
    <v-btn v-show="isEditing" @click="updateReport" dark>Update</v-btn>
    <div class="report-details__section">
      
      <div class="report-details__data">
        <h3>Team Lead ID #:</h3>
        <span>{{report.id}}</span>
      </div>
      <div class="report-details__data">
        <h3>Job ID:</h3>
        <span>{{report.JobId}}</span>
      </div>
      <div class="report-details__data">
        <h3>Date of Loss:</h3>
        <span>{{report.DateOfLoss}}</span>
      </div>
      <div class="report-details__data">
        <h3>Date Of Evaluation:</h3>
        <span>{{report.DateOfEvaluation}}</span>
      </div>
    </div>
    <div class="report-details__section--contact-group report-details__section">
      <div class="report-details__data-label">Contact Name:</div>
      <span class="report-details__data-field">{{report.ContactName}}</span>

      <div class="report-details__data-label">Address:</div>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.location.address" />
      <span v-if="!isEditing"
        class="report-details__data-field">{{report && report.location ? report.location.address : null}}</span>

      <div class="report-details__data-label">City, State, Zip:</div>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.location.cityStateZip" />
      <span v-if="!isEditing"
        class="report-details__data-field">{{report && report.location ? report.location.cityStateZip : null}}</span>

      <div class="report-details__data-label">Phone Number:</div>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.PhoneNumber" @input="acceptNumber" />
      <span v-if="!isEditing" class="report-details__data-field">{{report.PhoneNumber}}</span>

      <div class="report-details__data-label">Email Address:</div>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.EmailAddress" />
      <span v-if="!isEditing" class="report-details__data-field">{{report.EmailAddress}}</span>
    </div>    
    
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h3>Inital Response, Inspection, and Preliminary Determination</h3>
        <ul>
          <li v-for="item in report.PictureTypes" :key="item.id">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h3>Source of Water Intrusion</h3>
        <ul>
          <li v-for="item in report.sourceWaterIntrusion" :key="item.id">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__data" v-for="(item, i) in report.intrusion" :key="`intrusion-${i}`">
        <label class="form__label">{{item.label}}</label>
        <span>{{item.value}}</span>
      </div>
    </div>
    <div class="report-details__data">
      <label class="form__label">Initial:</label>
      <span class="text-uppercase">{{report.initial1}}</span>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h3>Preliminary Determination</h3>
        <ul>
          <li v-for="(item, i) in report.preliminaryDetermination" :key="`prelim-${i}`">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="report-details report-details__response-report">
    <div class="report-details__data">
      <label class="form__label">Initial:</label>
      <span class="text-uppercase">{{report.initial2}}</span>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h3>Initial Moisture Inspection</h3>
        <ul>
          <li v-for="(item, i) in report.moistureInspection" :key="`moisture-${i}`">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
    <div class="report-details__data">
      <label class="form__label">Initial:</label>
      <span class="text-uppercase">{{report.initial3}}</span>
    </div>
    
    <div class="report-details__section">
      <label class="form__label">Initial Moisture Map</label>
      <p>An initial moisture inspection should be conducted to identify the full extent of water intrusion,
        including the
        identification of affected assemblies, building materials, and the edge of water mitigation. Normally,
        this process
        begins at the source of the water intrusion. The initial inspection process should continue in all
        directions from the
        source of water intrusion until the restorer identifies and documents the extent of migration. The extent
        of the
        moisture migration should be documented using one or more appropriate methods including at a minimum a
        moisture map. (i.e., a diagram of the structure indicating the areas affected by migrating water). IICRC
        S500 Pg 179</p>
      <div class="map-wrapper">
        <div class="map-wrapper__map">
          <div class="map-wrapper__map--row" v-for="n in 37" :key="n">
            <div class="map-wrapper__map--col" v-for="n in 20" :key="n"></div>
          </div>
        </div>
        <img id="moisture-map-image" :src="report.moistureMap" />
      </div>
      <!-- <div class="report-details__section--pictures" v-show="pictures.length > 0">
        <h3>Photographs</h3>
        <div class="report-details__file-listing" v-for="(picture, i) in jobFiles" :key="i">
          <a :href="picture.url" target="_blank">
            <img class="report-details__file-listing--image" v-if="picture.type === '.jpg' || picture.type === '.png' 
              || picture.type === '.gif' || picture.type === '.jpeg'" :src="picture.url" :alt="`image-${i}`" />
            <p v-else>{{picture.name}}</p>
          </a>       
        </div>
      </div> -->
    </div>
    <div class="report-details__data">
      <label class="form__label">Initial:</label>
      <span class="text-uppercase">{{report.initial4}}</span>
    </div>
    </div>
    <div class="report-details report-details__response-report">
      <div class="report-details__section">
        <div class="report-details__data" v-if="report.preRestorationEval.hasOwnProperty('emergencyResAct')">
          <label class="form__label">Emergency Response Actions Identified:</label>
          <span>{{report.preRestorationEval.emergencyResAct}}</span>
        </div>
        <div class="report-details__data" v-if="report.preRestorationEval.hasOwnProperty('buildingMatRestore')">
          <label class="form__label">Building Material Restorability:</label>
          <span>{{report.preRestorationEval.buildingMatRestore}}</span>
        </div>
        <div class="report-details__data" v-if="report.preRestorationEval.hasOwnProperty('contentEval')">
          <label class="form__label">Content Evaluation:</label>
          <span>{{report.preRestorationEval.contentEval}}</span>
        </div>
        <div class="report-details__data" v-if="report.preRestorationEval.hasOwnProperty('hvacEval')">
          <label class="form__label">HVAC Evaluation:</label>
          <span>{{report.preRestorationEval.hvacEval}}</span>
        </div>
        <div class="report-details__data" v-if="report.preRestorationEval.hasOwnProperty('substructure')">
          <label class="form__label">Substructure & Unfinished Spaces:</label>
          <span>{{report.preRestorationEval.substructure}}</span>
        </div>
      </div>
    
    <div class="report-details__section">
      <div class="report-details__data">
        <h3>Insurance Company:</h3>
        <input class="form__input" type="text" v-if="isEditing" v-model="updatedReport.InsuranceCompany" />
        <span v-if="!isEditing">{{report.InsuranceCompany}}</span>
      </div>
      <div class="report-details__data">
        <h3>Claim Number:</h3>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.ClaimNumber" />
        <span v-if="!isEditing">{{report.ClaimNumber}}</span>
      </div>
      <div class="report-details__data">
        <h3>Policy Number:</h3>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.PolicyNumber" />
        <span v-if="!isEditing">{{report.PolicyNumber}}</span>
      </div>
      <div class="report-details__data">
        <h3>Adjuster Name:</h3>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.adjusterName" />
        <span v-if="!isEditing">{{report.adjusterName}}</span>
      </div>
      <div class="report-details__data">
        <h3>Adjuster Phone:</h3>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.adjusterPhone" />
        <span v-if="!isEditing">{{report.adjusterPhone}}</span>
      </div>
      <div class="report-details__data">
        <h3>Adjuster Email:</h3>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.adjusterEmail" />
        <span v-if="!isEditing">{{report.adjusterEmail}}</span>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h3>Develop Initial Project Work Plan & Communicate to Headquarters:</h3>
        <ul>
          <li v-for="item in report.Steps" :key="item.id">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h3>Evaluation Logs</h3>
        <ul>
          <li v-for="(evalLog, i) in report.EvaluationLogs" :key="i">
            <label class="form__label">{{ evalLog && evalLog.label ? evalLog.label : null}}</label>
            <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.EvaluationLogs[i].value" />
            <span v-if="!isEditing">{{ evalLog && evalLog.value ? evalLog.value : null}}</span>
          </li>
        </ul>
      </div>
      <div class="report-details__checklist">
        <h3>Document Verification</h3>
        <ul>
          <li v-for="(docVerify, i) in report.documentVerification" :key="`doc-${i}`">
            {{docVerify}}
          </li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__data">
        <h3>Customer:</h3>
        <span>{{report.cusFirstName}} {{report.cusLastName}}</span>
      </div>
      <div class="report-details__data">
        <h3>Customer Signiture:</h3>
        <div v-if="signiture !== ''">
        <div class="report-details__data--cusSig" :style="'background-image:url('+signiture+')'"></div>
        </div>
      </div>
      <div class="report-details__data">
        <h3>Sign Date:</h3>
        <span>{{report.cusSignDate}}</span>
      </div>
      <div class="report-details__data">
        <h3>Team Member Signiture:</h3>
        <div v-if="report.teamMemberSig !== ''">
          <div class="report-details__data--cusSig" :style="'background-image:url('+report.teamMemberSig+')'"></div>
        </div>
      </div>
      <div class="report-details__data">
        <h3>Sign Date:</h3>
        <span>{{report.signDate}}</span>
      </div>
    </div>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'ResponseReportDetails',
    props: ['report', 'notPdf', 'company', 'formName'],
    data: (vm) => ({
      message: '',
      stepsArrLength: '',
      isEditing: false,
      updatedReport: {
        JobId: "",
        location: {
          address: '',
          cityStateZip: '',
          city: ''
        },
        PhoneNumber: '',
        EmailAddress: '',
        ClaimNumber: '',
        adjusterName: '',
        adjusterEmail: '',
        adjusterPhone: '',
        EvaluationLogs: [],
        InsuranceCompany: '',
        PolicyNumber: '',
        PropertyOwner: ''
      },
      jobFiles: [],
      repData: null
    }),
    computed: {
      loading() {
        if (Object.keys(this.report).length === 0) {
          return false
        } else {
          return true
        }
      },
      signiture() {
        var sig = this.report && this.report.customerSig ? this.report.customerSig : null;
        if (sig !== null) {
          return this.report.customerSig
        }
        return ""
      }
    },
    methods: {
      pictures(report) {
        var storageRef = this.$fire.storage.ref()
        var listRef = storageRef.child(report)
        listRef.listAll().then((res) => {
          var folderPath = ""
          res.prefixes.forEach((folderRef) => {
            folderPath = folderRef
            folderRef.listAll().then((res) => {
              res.items.forEach((itemRef) => {
                var itemPath = itemRef.fullPath
                storageRef.child(itemPath).getDownloadURL().then((url) => {
                  var fileName = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length)
                  var fileType = itemPath.substring(itemPath.lastIndexOf('.'), itemPath.length)
                  const fileObj = {
                    jobid: report,
                    name: fileName,
                    url: url,
                    type: fileType
                  }
                  this.jobFiles.push(fileObj)
                }).catch((err) => {
                  console.error(err)
                })
              })
            })
          })
        })
      },
      startEditing() {
        this.isEditing = !this.isEditing;
        const address = this.report && this.report.location ? this.report.location.address : null
        const citystatezip = this.report && this.report.location ? this.report.location.cityStateZip : null
        this.updatedReport.JobId = this.report.JobId
        this.updatedReport.location.address = address
        this.updatedReport.location.cityStateZip = citystatezip
        this.updatedReport.EmailAddress = this.report.EmailAddress
        this.updatedReport.PhoneNumber = this.report.PhoneNumber
        this.updatedReport.InsuranceCompany = this.report.InsuranceCompany
        this.updatedReport.EvaluationLogs = this.report.EvaluationLogs
        this.updatedReport.ClaimNumber = this.report.ClaimNumber
        //this.updatedProject.Location.city = this.report.Location.city
      },
      async updateReport() {
        await this.$axios.$post(`/api/report/rapid-response/${this.report.JobId}/update`, this.updatedReport).then((res) => {
          this.message = "Report was updated!"
          this.isEditing = false
          setTimeout(() => {
            this.message = ""
          }, 5000)
          Object.assign(this.repData, this.updatedReport)
        }).catch((err) => {
          this.message = err
        })
      },
      acceptNumber() {
        var x = this.updatedReport.PhoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        this.updatedReport.PhoneNumber = !x[2] ?
          x[1] :
          '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
      }
    },
    created() {
      this.repData = this.report
      this.pictures(this.repData.JobId)
    }
  }
</script>
<style lang="scss">
#moisture-map-image {
  position:absolute;
  top:0;
  left:0;
  object-fit:contain;
}
.form__label {
  font-weight: bold;
}
.map-wrapper {
    position:relative;
    width:100%;
    max-width:660px;
    margin:auto;
    /* @include respond(tabletLarge) {
      max-width:768px;
    } */
    
    &__canvas {
      position:absolute;
      width:100%;
      height:100%;
      top:0;
      height:0;
      
    }
    &__map {
      border-left:1px solid $color-black;
      border-right:1px solid $color-black;
      height:100%;
      
      &--row {
        height:19px;
        border-top:1px solid $color-black;
        display:flex;
        flex-direction:row;
        
        &:not(:first-child) {
          border-top:0px solid $color-black;
          border-bottom:0;
        }
      }
      &--col {
        flex:1 0 auto;
        border:1px solid $color-black;
        height:100%;
      }
    }
  }
</style>