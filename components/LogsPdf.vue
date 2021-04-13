<template>
    <div class="report-details-wrapper pa-6" slot="pdf-content">
        <section class="pdf-item">
            <h1 class="text-center">{{company}}</h1>
            <h2 class="text-center">{{formName}}</h2>
        </section>
    </div>
</template>
<script>
export default {
    name: "LogsPdf",
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
        },
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
}
.pdf-sig {
    
}
</style>