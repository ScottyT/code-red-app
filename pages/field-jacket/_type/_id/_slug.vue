<template>
    <div class="report-details-wrapper pa-6">
        <UiBreadcrumbs page="field-jacket" :displayStrip="false" />
        <h1>{{formName}} for job {{jobId}}</h1>
        <span v-if="reportType === 'sketch-report'">
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
                 :show-layout="false" :preview-modal="false" ref="html2Pdf-0">
                    <PdfSketch :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <v-btn @click="generateReport(0)">Download PDF</v-btn>
        </span>
        <span v-if="reportType === 'logs-report'">
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="1200" :manual-pagination="false"
                 :show-layout="false" :preview-modal="true" ref="html2Pdf-0">
                    <PdfLogs :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" />
                 </vue-html2pdf>
            </client-only>
            <!-- <LazyLogsPdf :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" /> -->
            <v-btn @click="generateReport(0)">Download PDF</v-btn>
        </span>
        <span v-if="reportType === 'chart-report'">
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
                 :show-layout="false" :preview-modal="false" ref="html2Pdf-0">
                    <PdfSketch :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <!-- <LazySketchPdf :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" /> -->
            <v-btn @click="generateReport(0)">Download PDF</v-btn>
        </span>
        <span v-if="reportType === 'moisture-map'">
            <LazySavedLogReports :formName="formName" :formType="formType" :report="data" company="Water Emergency Services Incorporated" />
        </span>
    </div>
</template>
<script>
export default {
    head() {
        return {
            title: this.formName + " Details"
        }
    },
    async middleware({store, redirect}) {
        if (store.state.users.user.role !== "admin") {
            return redirect("/")
        }
    },
    async asyncData({$axios, params}) {
        var formName = ""
        var formType = params.id;
        var reportType = params.type;
        var jobId = params.slug;
        let data = await $axios.$get(`/api/${params.type}/${params.id}/${params.slug}`);
        switch (formType) {
            case "moisture-sketch":
                formName = "Moisture Mapping Location and Sketch"
                break;
            case "measurements-sketch":
                formName = "Measurements and Sketch"
                break;
            case "equipment-location-sketch":
                formName = "Equipment Location and Sketch"
                break;
            case "atmospheric-readings":
                formName = "Atmospheric Readings"
                break;
            case "quantity-inventory-logs":
                formName = "Unit Quantity and Equipment Inventory"
                break;
            case "psychrometric-chart":
                formName = "Psychrometric Chart"
                break;
            case "moisture-map":
                formName = "Moisture Readings Map Readings"
                break;
            default:
                formName = "Sketch Form"
        }
        return {
            data,
            formName,
            jobId,
            reportType,
            formType
        }
    },
    computed: {
        htmlToPdfOptions(e) {
            return {
                margin:[20, 10, 20, 10],
                filename: `${this.reportType}-${this.formType}-${this.jobId}`,
                image: {
                    type: "jpeg",
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    width:800
                },
                jsPDF: {
                    unit: 'px',
                    format: 'a4',
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