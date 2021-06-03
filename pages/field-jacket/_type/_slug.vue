<template>
    <p v-if="$nuxt.isOffline">You must be online to view a report</p>
    <div class="report-details-wrapper" v-else>
        <UiBreadcrumbs page="field-jacket" :displayStrip="false" />       
        <span v-if="reportType === 'dispatch'">
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="1200" :manual-pagination="false"
                    :show-layout="false" :preview-modal="true" ref="html2Pdf0">
                    <LazyLayoutReportDetails :notPdf="false" :report="report" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
            <LazyLayoutReportDetails :notPdf="true" :report="report" />
        </span>
        <span v-if="reportType === 'rapid-response'">
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="800px" :html-to-pdf-options="htmlToPdfOptions" @startPagination="startPagination()" @hasPaginated="hasPaginated()" 
                :paginate-elements-by-height="1500" @beforeDownload="beforeDownload($event)" :manual-pagination="false"
                    :show-layout="false" :preview-modal="true" ref="html2Pdf0">
                    <LazyLayoutResponseReportDetails company="Water Emergency Services Incorporated" formName="Rapid Response Report" :notPdf="false" :report="report" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
            <LazyLayoutResponseReportDetails :notPdf="true" :report="report" />
        </span>
        <span v-if="report.ReportType === 'case-file-containment' || report.ReportType === 'case-file-technician'">
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
                    :show-layout="false" :preview-modal="true" ref="html2Pdf0">
                    <LazyLayoutCaseFileDetails :notPdf="false" :report="report" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
            <LazyLayoutCaseFileDetails :notPdf="true" :report="report" />
        </span>
        <span v-if="report.formType === 'sketch-report'">
            <h1>{{formName}} for job {{jobId}}</h1>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
                 :show-layout="false" :preview-modal="false" ref="html2Pdf0">
                    <PdfSketch :formName="formName" :reportType="reportType" :report="report" company="Water Emergency Services Incorporated" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
        </span>
        <span v-if="report.formType === 'logs-report'">
            <h1>{{formName}} for job {{jobId}}</h1>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="1200" :manual-pagination="false"
                 :show-layout="false" :preview-modal="true" ref="html2Pdf0">
                    <PdfLogs :formName="formName" :reportType="reportType" :report="report" company="Water Emergency Services Incorporated" slot="pdf-content" />
                 </vue-html2pdf>
            </client-only>
            <!-- <LazyLogsPdf :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" /> -->
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
        </span>
        <span v-if="report.formType === 'chart-report'">
            <h1>{{formName}} for job {{jobId}}</h1>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
                 :show-layout="false" :preview-modal="false" ref="html2Pdf0">
                    <PdfSketch :formName="formName" :reportType="reportType" :report="report" company="Water Emergency Services Incorporated" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <!-- <LazySketchPdf :formType="formType" :formName="formName" :reportType="reportType" :report="data" company="Water Emergency Services Incorporated" slot="pdf-content" /> -->
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
        </span>
        <span v-if="report.formType === 'moisture-map'">
            <h1>{{formName}} for job {{jobId}}</h1>
            <LazySavedLogReports :formName="formName" :formType="formType" :reportType="reportType" :report="report" company="Water Emergency Services Incorporated" />
        </span>
    </div>
</template>
<script>
import VueHtml2pdf from 'vue-html2pdf'
import {mapGetters} from 'vuex'
export default {
    layout: "dashboard-layout",
    head() {
        return {
            title: "Report -" + this.reportType + '-' + this.jobId
        }
    },
    data() {
        return {
            report: {},
            contentRendered: false
        }
    },
    components: {
        VueHtml2pdf
    },
    async middleware({store, redirect}) {
        if (store.state.users.user.role !== "admin") {
            return redirect("/")
        }
    },
    async asyncData({$axios, params, store}) {
        try {
            var formName = ""
            var reportType = params.type;
            var jobId = params.slug;
            var token = store.state.users.user.token
            let data = await $axios.$get(`/api/report/${params.type}/${params.slug}`, {headers: {authorization: `Bearer ${token}`}});
            switch (reportType) {
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
                default:
                    formName = "Sketch Form"
            }
            return {
                report: data,
                jobId,
                reportType,
                formName
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    },
    computed: {
        ...mapGetters({user: 'users/getUser'}),
        htmlToPdfOptions() {
            return {
                margin:[20, 10, 20, 10],
                filename: `${this.reportType}-${this.jobId}`,
                image: {
                    type: "jpeg",
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    removeContainer: true
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
        async generateReport(key) {
            //this.htmlToPdfOptions.filename = `coc-${this.report[key].JobId}`
            this.$refs.html2Pdf0.generatePdf()
        },
        async beforeDownload({ html2pdf, options, pdfContent }) {
            await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                pdf.addPage()
            })
        },
        startPagination() {
            console.log("PDF has started pagination")
        },
        hasPaginated() {
            console.log("PDF has been paginated")
        }
    }
}
</script>