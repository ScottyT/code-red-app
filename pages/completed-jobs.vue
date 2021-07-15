<template>
    <span v-if="coc.length <= 0"><h2>There are no completed jobs</h2></span>
    <div class="px-5 mt-5" v-else>
        <div class="coc-list-item" v-for="(item, i) in coc" :key="`coc-${i}`">
            <p>Certificate for job {{item.JobId}}</p>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="1250" :manual-pagination="false"
                            :show-layout="false" :enable-download="false" @beforeDownload="beforeDownload($event)" :preview-modal="true" :ref="`html2Pdf-${i}`">
                    <PdfCertificateContent :certificate="item" company="Water Emergency Services Incorporated" abbreviation="WESI"  slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <v-btn @click="generateReport(i)">Download PDF</v-btn>
        </div>
    </div>
</template>
<script>
export default {
    head() {
        return {
            title: "Completed Jobs"
        }
    },
    computed: {
        htmlToPdfOptions(e) {
            return {
                margin:[20, 10, 20, 10],
                filename: `coc-${this.coc.JobId}`,
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
    async fetch() {
        await this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
            this.$axios.$get("/api/reports/coc", {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                this.coc = res
            })
        }).catch((err) => {
            console.log(err)
        })
    },
    data() {
        return {
            coc:[],
            contentRendered: false,
            cards: []
        }
    },
    methods: {
        domRendered() {
            this.contentRendered = true
        },
        generateReport(key) {
            this.htmlToPdfOptions.filename = `coc-${this.coc[key].JobId}`
            this.$refs["html2Pdf-" + key][0].generatePdf()
        },
        async beforeDownload ({ html2pdf, options, pdfContent }) {
            await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    pdf.setFontSize(13)
                    pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 10))
                } 
            }).save()
        }
    }
}
</script>