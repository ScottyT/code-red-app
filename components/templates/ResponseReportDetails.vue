<template>
<section class="pdf-content">
  <div class="report-details report-details__response-report">
    <h1 v-if="message">{{message}}</h1>
    <v-btn v-if="notPdf" @click="startEditing" dark>{{ isEditing ? "Editing" : "Edit"}}</v-btn>
    <v-btn v-show="isEditing" @click="updateReport" dark>Update</v-btn>
    <div class="report-details__section">
      <div class="report-details__data">
        <h2>Team Lead ID #:</h2>
        <span>{{report.id}}</span>
      </div>
      <div class="report-details__data">
        <h2>Job ID:</h2>
        <span>{{report.JobId}}</span>
      </div>
      <div class="report-details__data">
        <h2>Date of Loss:</h2>
        <span>{{report.DateOfLoss}}</span>
      </div>
      <div class="report-details__data">
        <h2>Date Of Evaluation:</h2>
        <span>{{report.DateOfEvaluation}}</span>
      </div>
    </div>
    <div class="report-details__section--contact-group report-details__section">
      <h2 class="report-details__data-label">Contact Name:</h2>
      <span class="report-details__data-field">{{report.ContactName}}</span>

      <h2 class="report-details__data-label">Address:</h2>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.location.address" />
      <span v-if="!isEditing"
        class="report-details__data-field">{{report && report.location ? report.location.address : null}}</span>

      <h2 class="report-details__data-label">City, State, Zip:</h2>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.location.cityStateZip" />
      <span v-if="!isEditing"
        class="report-details__data-field">{{report && report.location ? report.location.cityStateZip : null}}</span>

      <h2 class="report-details__data-label">Phone Number:</h2>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.PhoneNumber" @input="acceptNumber" />
      <span v-if="!isEditing" class="report-details__data-field">{{report.PhoneNumber}}</span>

      <h2 class="report-details__data-label">Email Address:</h2>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.EmailAddress" />
      <span v-if="!isEditing" class="report-details__data-field">{{report.EmailAddress}}</span>
      <div class="report-details__checklist">
        <h2 class="report-details__data-label">Type of loss:</h2>
        <ul>
          <li v-for="item in report.TypesOfLoss" :key="item.id">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h2>Communicate steps to Headquarters:</h2>
        <ul>
          <li v-for="item in report.Steps" :key="item.id">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h2>Picture Categories</h2>
        <ul>
          <li v-for="item in report.PicturesTypes" :key="item.id">
            {{item}}
          </li>
        </ul>
      </div>
    </div>
    <div class="report-details__section--pictures">
      <h2>Photographs</h2>

      <span v-show="pictures.length > 0">
        <div class="report-details__file-listing" v-for="(picture, i) in pictures" :key="i">
          <a :href="picture.url" target="_blank">
            <img class="report-details__file-listing--image" v-if="picture.type === '.jpg' || picture.type === '.png' || picture.type === '.gif'" :src="picture.url" :alt="`image-${i}`" />
            <p v-else>{{picture.name}}</p>
          </a>
        </div>
      </span>
    </div>
    <div class="report-details__section">
      <div class="report-details__data">
        <h2>Insurance Company:</h2>
        <input class="form__input" type="text" v-if="isEditing" v-model="updatedReport.InsuranceCompany" />
        <span v-if="!isEditing">{{report.InsuranceCompany}}</span>
      </div>
      <div class="report-details__data">
        <h2>Claim Number:</h2>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.ClaimNumber" />
        <span v-if="!isEditing">{{report.ClaimNumber}}</span>
      </div>
      <div class="report-details__data">
        <h2>Policy Number:</h2>
        <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.PolicyNumber" />
        <span v-if="!isEditing">{{report.PolicyNumber}}</span>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__checklist">
        <h2>Evaluation Logs</h2>
        <ul>
          <li v-for="(evalLog, i) in report.EvaluationLogs" :key="i">
            <label class="form__label">{{ evalLog && evalLog.label ? evalLog.label : null}}</label>
            <input type="text" class="form__input" v-if="isEditing" v-model="updatedReport.EvaluationLogs[i].value" />
            <span v-if="!isEditing">{{ evalLog && evalLog.value ? evalLog.value : null}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__data">
        <h2>Customer:</h2>
        <span>{{report.cusFirstName}} {{report.cusLastName}}</span>
      </div>
      <div class="report-details__data">
        <h2>Customer Signiture:</h2>
        <div v-if="signiture !== ''">
        <div class="report-details__data--cusSig" :style="'background-image:url('+signiture+')'"></div>
        </div>
      </div>
      <div class="report-details__data">
        <h2>Date:</h2>
        <span>{{report.signDate}}</span>
      </div>
    </div>
  </div>
  </section>
</template>
<script>
  export default {
    name: 'ResponseReportDetails',
    props: ['report', 'notPdf'],
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
        EvaluationLogs: [],
        InsuranceCompany: '',
        PolicyNumber: '',
        PropertyOwner: ''
      },
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
      },
      pictures() {
        var picArr = this.report && this.report.Pictures ? this.report.Pictures : null;
        if (picArr !== null) {
          return this.report.Pictures
        }
        return []
      }
    },
    methods: {
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
    }
  }
</script>