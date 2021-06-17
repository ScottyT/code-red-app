<template>
    <p v-if="$nuxt.isOffline">You must be online to view a report</p>
    <div class="report-details-wrapper" v-else>
        <p v-if="$fetchState.pending">Fetching content...</p>
        <div v-else><UiBreadcrumbs page="field-jacket" :displayStrip="false" />       
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
            <button class="button--normal" @click="generateReport(0)">Download PDF</button>
        </span>
        <span v-if="report.formType === 'moisture-map'">
            <h1>{{formName}} for job {{jobId}}</h1>
            <LazySavedLogReports :formName="formName" :reportType="reportType" :report="report" company="Water Emergency Services Incorporated" />
        </span></div>
    </div>
</template>
<script>
import VueHtml2pdf from 'vue-html2pdf'
import {mapGetters} from 'vuex'
import { defineComponent, ref, onMounted, useAsync, computed } from '@nuxtjs/composition-api';
import useReports from '@/composable/reports';
export default defineComponent({
    layout: 'dashboard-layout',
    components: {
        VueHtml2pdf
    },
    setup(props, {root, refs}) {
        let authUser = root.$fire.auth.currentUser
        const { report, getReport } = useReports()
        const formName = ref("")
        const company = ref("")
        let reportType = root.$route.params.type
        switch (reportType) {
                case "moisture-sketch":
                    formName.value = "Moisture Mapping Location and Sketch"
                    break;
                case "measurements-sketch":
                    formName.value = "Measurements and Sketch"
                    break;
                case "equipment-location-sketch":
                    formName.value = "Equipment Location and Sketch"
                    break;
                case "atmospheric-readings":
                    formName.value = "Atmospheric Readings"
                    break;
                case "quantity-inventory-logs":
                    formName.value = "Unit Quantity and Equipment Inventory"
                    break;
                default:
                    formName.value = "Sketch Form"
            }
        let jobId = root.$route.params.slug
        const htmlToPdfOptions = computed(() => {
            return {
                margin:[20, 10, 20, 10],
                filename: `${reportType}-${jobId}`,
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
        })
        const generateReport = async () => {
            refs.html2Pdf0.generatePdf()
        }
        const beforeDownload = async ({ html2pdf, options, pdfContent }) => {
            await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                pdf.addPage()
            })
        }
        //getReport(`${reportType}/${jobId}`).fetchReport()
        getReport(`${reportType}/${jobId}`).fetchState
        return {
            report,
            reportType,
            htmlToPdfOptions,
            generateReport,
            beforeDownload,
            formName,
            jobId,
            company
        }
    }
})
</script>