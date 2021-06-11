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
        <div v-if="report.formType === 'sketch-report'" class="pdf-item__sketch-area" :style="'background-image:url('+report.sketch+')'"></div>
        <div class="chart-wrapper" v-else>
            <img class="chart-wrapper__bg" :src="bgimage" />
            <img class="chart-wrapper__bg" :src="report.chart" />
        </div>
      </section>
    </div>
</template>
<script>
export default {
    props: ['formName', 'reportType', 'report', 'company'],
    data() {
        return {
            chartimg: null,
            bgimage: "https://images.prismic.io/wateremergencyservices-pwa/812c9310-c970-489b-a441-0243ff518aa6_messageImage_1619619411880.jpg?auto=compress,format",
        }
    },
    computed: {
        htmlToPdfOptions(e) {
            return {
                margin:[10, 10, 20, 10],
                filename: `${this.reportType}-${this.jobId}`,
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
        decodeBuffer(buf) {
           /*  var typedArray = new Uint8Array(buf)
            const stringChar = typedArray.reduce((data, byte) => {
                return data + String.fromCharCode(byte)
            }, '');
            var base64string = btoa(stringChar);
            return base64string */
            var buffer = Buffer.from(buf.data)
            var base64string = buffer.toString('base64')
            return base64string
        },
        generateReport(key) {
            //this.htmlToPdfOptions.filename = `coc-${this.report[key].JobId}`
            this.$refs["html2Pdf-" + key].generatePdf()
        },
    },
    created() {
        //this.decodeBuffer(this.report.chart.data.data)
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
.chart-wrapper {
    position:relative;
    width:100%;
    height:490px;
    max-width:719px;
    @include respond(tabletLarge) {
        max-width:943px;
        height:642px;
    }
    &__bg {
        position:absolute;
        top:0;
        left:0;
        object-fit:contain;
    }
}
</style>