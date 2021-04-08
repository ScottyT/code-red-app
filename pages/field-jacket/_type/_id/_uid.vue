<template>
    <div class="report-details-wrapper">
        <h1>{{formName}} for job {{jobId}}</h1>
        <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
            :show-layout="false" :preview-modal="true" ref="html2Pdf-0">
            <section slot="pdf-content">
                <section class="pdf-item">
                    <div class="pdf-item__company-logo">
                        <img src="https://images.prismic.io/water-emergency-services/31b3f2ab-d44e-4f77-8072-faef63fcceb5_WESI+new+Shield+Graphic_800x800.png?auto=compress,format" />
                    </div>
                    <h1 class="text-center">Water Emergency Services Incorporated</h1>
                    <h2 class="text-center">{{formName}}</h2>
                    <div class="pdf-item__inline">
                        Job ID: {{report.JobId}}
                    </div>
                    <div class="pdf-item__sketch-area"
                        :style="'background-image:url('+report.sketch+')'"></div>                       
                </section>
            </section>
        </vue-html2pdf>      
        <v-btn @click="generateReport(0)">Download PDF</v-btn>
    </div>
</template>
<script>
export default {
    layout: "default",
    head() {
        return {
            title: "Sketch -" + this.sketchType + '-' + this.jobId
        }
    },
    data() {
        return {
            report: {},
            contentRendered: false
        }
    },
    async middleware({store, redirect}) {
        if (store.state.user.role !== "admin") {
            return redirect("/")
        }
    },
    async asyncData({$axios, params}) {
        try {
            var formName = ""
            var sketchType = params.id;
            var jobId = params.uid;
            let data = await $axios.$get(`/api/sketch/${sketchType}/${jobId}`);
            switch (sketchType) {
                case "moisture-sketch":
                    formName = "Moisture Mapping Location and Sketch"
                    break;
                case "measurements-sketch":
                    formName = "Measurements and Sketch"
                    break;
                case "equipment-location-sketch":
                    formName = "Equipment Location and Sketch"
                    break;
                default:
                    formName = "Sketch Form"
            }
            return {
                report: data,
                jobId,
                sketchType,
                formName
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    },
    computed: {
        htmlToPdfOptions(e) {
            return {
                margin:[10, 10, 20, 10],
                filename: `sketch-${this.sketchType}-${this.jobId}`,
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