<template>
  <div class="reports-detail-wrapper">
    <h1>Report details</h1>
    <v-btn @click="generateReport">Download PDF</v-btn>
    <client-only>
      <vue-html2pdf :filename="`${reportType}-${report.JobId}`" :paginate-elements-by-height="1400" :manual-pagination="false"
                    :show-layout="false" :preview-modal="true" ref="html2Pdf" @beforeDownload="beforeDownload($event)">

        <report-details slot="pdf-content" @domRendered="domRendered()" :report="report" />

      </vue-html2pdf>
    </client-only>
    <response-report-details :report="report" v-if="reportType == 'rapid-response'" />
    <lazy-case-file-details :report="report" v-else-if="reportType.includes('case-file-')" />
    <report-details :report="report" v-else />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        report: {},
        loading: true,
        contentRendered: false
      }
    },
    layout: "dashboard-layout",
    head() {
      return {
        title: "Report " + this.repId
      }
    },
    /* async middleware({ store, redirect, route }) {
      if (store.state.user.role !== "admin") {    
        return redirect("/")
      }
    }, */
    async asyncData({
      $prismic,
      params,
      $axios
    }) {
      try {
        const reportType = params.slug
        const repId = params.id
        let data = await $axios.$get(`/api/reports/${reportType}/${repId}`)
        return {
          report: data,
          reportType
        }
      } catch (e) {
        console.error("SOMETHING WENT WRONG: " + e)
      }
    },
    methods: {
      generateReport() {
        this.$refs.html2Pdf.generatePdf()
      },
      domRendered() {
        console.log('dom rendered')
        this.contentRendered = true
      },
      async beforeDownload({
        html2Pdf,
        options,
        pdfContent
      }) {
        console.log(options)
        /* await html2Pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages()
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i)
            pdf.setFontSize(10)
            pdf.setTextColor(150)
            pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
          }
        }).save() */
      }
    }
  }
</script>