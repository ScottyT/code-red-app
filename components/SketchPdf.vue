<template>
    <div class="report-details-wrapper pa-6" slot="pdf-content">

      <section class="pdf-item">
        <div class="pdf-item__company-logo">
          <img src="https://images.prismic.io/water-emergency-services/31b3f2ab-d44e-4f77-8072-faef63fcceb5_WESI+new+Shield+Graphic_800x800.png?auto=compress,format" />
        </div>
        <h1 class="text-center">{{company}}</h1>
        <h2 class="text-center">{{formName}}</h2>
        <div class="pdf-item__inline">
          Job ID: {{report.JobId}}
        </div>
        <div v-if="report.ReportType === 'sketch-report'" class="pdf-item__sketch-area" :style="'background-image:url('+report.sketch+')'"></div>
        <div v-else></div>
      </section>
    </div>
</template>
<script>
export default {
    name:"SketchPdf",
    props: ['formType', 'formName', 'reportType', 'report', 'company'],
    computed: {
        htmlToPdfOptions(e) {
            return {
                margin:[10, 10, 20, 10],
                filename: `${this.reportType}-${this.formType}-${this.jobId}`,
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
    methods: {
        generateReport(key) {
            //this.htmlToPdfOptions.filename = `coc-${this.report[key].JobId}`
            this.$refs["html2Pdf-" + key].generatePdf()
        },
    }
}
</script>
<style lang="scss" scoped>
.pdf-item {
    position:relative;
    .text-center {
        text-align:center;
    }
    &__company-logo {
        width:100px;
        
        margin:0 auto;
    }
    &__inline {
        display:inline-block;
    }
    &__sketch-area {
        width:800px;
        height:500px;
        background-size:contain;
    }
}
.pdf-sig {
    
}
</style>