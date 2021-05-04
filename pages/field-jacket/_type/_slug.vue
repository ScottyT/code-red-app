<template>
    <div class="report-details-wrapper pa-6">
        <LazyBreadcrumbs page="field-jacket" :displayStrip="false" />
        <!-- <h1>{{formName}} for job {{jobId}}</h1> -->

        
        <span v-if="reportType === 'dispatch'">
            <LazyReportDetails :report="report" />
        </span>
        <span v-if="reportType === 'rapid-response'">
            <LazyResponseReportDetails :report="report" />
        </span>
        <span v-if="report.ReportType === 'case-file'">
            <LazyCaseFileDetails :report="report" />
        </span>
    </div>
</template>
<script>
export default {
    layout: "dashboard-layout",
    head() {
        return {
            title: "Sketch -" + this.formType + '-' + this.jobId
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
            var formType = params.id;
            var reportType = params.type;
            var jobId = params.uid;
            let data = await $axios.$get(`/api/reports/${params.type}/${params.slug}`);
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
                default:
                    formName = "Sketch Form"
            }
            return {
                report: data,
                jobId,
                formType,
                reportType,
                formName
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
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