<template>
  <div class="report-details report-details__dispatch-report">
    <h1 v-if="message">{{message}}</h1>
    <v-btn v-if="notPdf" @click="startEditing" dark>{{ isEditing ? "Editing" : "Edit"}}</v-btn>
    <v-btn v-show="isEditing" @click="updateReport" dark>Update</v-btn>
    <section class="pdf-content" slot="pdf-content">
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
        <h3>Date of Call:</h3>
        <span>{{report.dateFormatted}}</span>
      </div>
      <div class="report-details__data">
        <h3>Time of call:</h3>
        <span>{{report.timeFormatted}}</span>
      </div>
    </div>
    <div class="report-details__section--contact-group report-details__section">
      <h3 class="report-details__data-label">Caller Name:</h3>
      <span class="report-details__data-field">{{report.callerName}}</span>
      <h3 class="report-details__data-label">Arrival Contact Name:</h3>
      <span class="report-details__data-field">{{report.ArrivalContactName}}</span>

      <h3 class="report-details__data-label">Address:</h3>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.location.address" />
      <span v-if="!isEditing"
        class="report-details__data-field">{{report && report.location ? report.location.address : null}}</span>

      <h3 class="report-details__data-label">City, State, Zip:</h3>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.location.cityStateZip" />
      <span v-if="!isEditing"
        class="report-details__data-field">{{report && report.location ? report.location.cityStateZip : null}}</span>

      <h3 class="report-details__data-label">Phone Number:</h3>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.phoneNumber" @input="acceptNumber" />
      <span v-if="!isEditing" class="report-details__data-field">{{report.phoneNumber}}</span>

      <h3 class="report-details__data-label">Email Address:</h3>
      <input class="form__input" v-if="isEditing" v-model="updatedReport.emailAddress" />
      <span v-if="!isEditing" class="report-details__data-field">{{report.emailAddress}}</span>
      <div class="report-details__checklist">
        <h3 class="report-details__data-label">Property Checklist</h3>
        <ul>
          <li v-for="item in report.propertyChkList" :key="item.id">{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="report-details__section">
      <div class="report-details__data">
        <h3>Appointment time set for:</h3>
        <span>{{report.appointmentTime}}</span>

      </div>
      <div class="report-details__data">
        <h3>Date of Appointment:</h3>
        <span>{{report.appointmentDate}}</span>
      </div>
      <div class="report-details__data">
        <h3>15-Minute Update Call Time:</h3>
        <span v-if="!isEditing">{{report.fifteenUpdate}}</span>
        <span v-if="isEditing">
          <v-dialog ref="fifteenminupdate" v-model="fifteenModal" :return-value.sync="fifteenCallUpdate" persistent
            width="400px">
            <template v-slot:activator="{ on, attrs }">
              <input id="15MinUpdate" v-model="fifteenUpdateFormatted" class="form__input" readonly v-bind="attrs"
                v-on="on" />
              <span class="button" @click="fifteenCallUpdate = ''">clear</span>
            </template>
            <v-time-picker v-if="fifteenModal" v-model="fifteenCallUpdate" full-width format="ampm">
              <v-spacer></v-spacer>
              <v-btn text color="#fff" @click="fifteenModal = false">Cancel</v-btn>
              <v-btn text color="#fff" @click="$refs.fifteenminupdate.save(fifteenCallUpdate)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </span>
      </div>
      <div class="report-details__data">
        <h3>90-Minute Service Call Time:</h3>
        <span v-if="!isEditing">{{report.ninetyUpdate}}</span>
        <span v-if="isEditing">
          <v-dialog ref="ninetyminupdate" v-model="ninetyModal" :return-value.sync="ninetyCallUpdate" persistent
            width="400px">
            <template v-slot:activator="{ on, attrs }">
              <input id="90minupdate" v-model="ninetyUpdateFormatted" class="form__input" readonly v-bind="attrs"
                v-on="on" />
              <span class="button" @click="ninetyCallUpdate = ''">clear</span>
            </template>
            <v-time-picker v-if="ninetyModal" v-model="ninetyCallUpdate" full-width format="ampm">
              <v-spacer></v-spacer>
              <v-btn text color="#fff" @click="ninetyModal = false">Cancel</v-btn>
              <v-btn text color="#fff" @click="$refs.ninetyminupdate.save(ninetyCallUpdate)">OK</v-btn>
            </v-time-picker>
          </v-dialog>
        </span>
      </div>
    </div>
    <div class="report-details__section">
      <h3>Summary of Call:</h3>
      <textarea class="form__input form__input--textarea" v-if="isEditing" v-model="updatedReport.summary"></textarea>
      <span v-if="!isEditing">{{report.summary}}</span>
    </div>
    <div class="report-details__section">
      <div class="report-details__data">
        <h3>Created at</h3>
        <div>{{newCreatedAt}}</div>
      </div>
      <div class="report-details__data" v-if="report.updatedAt">
        <h3>Updated at</h3>
        <div>{{new Date(report.updatedAt)}}</div>
      </div>
    </div>
    </section>
  </div>
</template>
<script>

  export default {
    name: 'ReportDetails',
    props: ['report', 'notPdf'],
    data: (vm) => ({
      message: '',
      updatedReport: {
        JobId: "",
        location: {
          address: '',
          cityStateZip: '',
          city: ''
        },
        phoneNumber: '',
        emailAddress: '',
        summary: '',
        fifteenUpdate: '',//vm.formatTime(new Date().toTimeString().substr(0, 5)),
        ninetyUpdate: ''//vm.formatTime(new Date().toTimeString().substr(0, 5))
      },
      fifteenModal: false,
      ninetyModal: false,
      fifteenCallUpdate: null,
      ninetyCallUpdate: null,
      ninetyUpdateFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      fifteenUpdateFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      isEditing: false,
      repData: null
    }),
    watch: {
      fifteenCallUpdate(val) {
        this.fifteenUpdateFormatted = this.formatTime(this.fifteenCallUpdate)
      },
      ninetyCallUpdate(val) {
        this.ninetyUpdateFormatted = this.formatTime(this.ninetyCallUpdate)
      }
    },
    computed: {
      newCreatedAt() {
        const timestamp = new Date(this.report.createdAt)
        return timestamp
      },
      htmlToPdfOptions(e) {
        return {
          margin: [10, 10, 20, 10],
          filename: `${this.report.ReportType}-${this.report.JobId}`,
          image: {
            type: "jpeg",
            quality: 0.98
          },
          html2canvas: {
            scale: 2,
            useCORS: true
          },
          jsPDF: {
            unit: 'px',
            format: 'letter',
            orientation: 'portrait',
            hotfixes: ['px_scaling']
          }
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("domRendered");
        }, 1000)
      })
    },
    methods: {
      generateReport(key) {
        this.$refs["html2pdf-"+key].generatePdf()
      },
      startEditing() {
        this.isEditing = !this.isEditing;
        const address = this.report && this.report.location ? this.report.location.address : null
        const citystatezip = this.report && this.report.location ? this.report.location.cityStateZip : null
        this.updatedReport.JobId = this.report.JobId
        this.updatedReport.location.address = address
        this.updatedReport.location.cityStateZip = citystatezip
        this.updatedReport.emailAddress = this.report.emailAddress
        this.updatedReport.phoneNumber = this.report.phoneNumber
        this.updatedReport.fifteenUpdate = this.report.fifteenUpdate
        this.updatedReport.ninetyUpdate = this.report.ninetyUpdate
        this.updatedReport.summary = this.report.summary
        this.fifteenUpdateFormatted = this.report.fifteenUpdate
        this.ninetyUpdateFormatted = this.report.ninetyUpdate
        //this.updatedProject.Location.city = this.report.Location.city
      },
      async updateReport() {
        await this.$axios.$post(`/api/report/dispatch/${this.report.JobId}/update`, this.updatedReport).then((res) => {
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
        var x = this.updatedReport.phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        this.updatedReport.phoneNumber = !x[2] ?
          x[1] :
          '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
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
    },
    created() {
      this.repData = this.report
    }
  }
</script>