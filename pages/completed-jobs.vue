<template>
    <span v-if="coc.length <= 0"><h2>There are no completed jobs</h2></span>
    <div class="px-5 mt-5" v-else>
        <div class="coc-list-item" v-for="(item, i) in coc" :key="`coc-${i}`">
            <p>Certificate for job {{item.JobId}}</p>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="1250" :manual-pagination="false"
                            :show-layout="false" :enable-download="false" @beforeDownload="beforeDownload($event)" :preview-modal="true" :ref="`html2Pdf-${i}`">
                    <PdfCertificateContent :certificate="item" company="Water Emergency Services Incorporated" abbreviation="WESI" @domRendered="domRendered()" slot="pdf-content" />
                </vue-html2pdf>
            </client-only>
            <v-btn @click="generateReport(i)">Download PDF</v-btn>
        </div>
    </div>
</template>
<script>
import VueHtml2pdf from 'vue-html2pdf'
export default {
    head() {
        return {
            title: "Completed Jobs"
        }
    },
    components: {
        VueHtml2pdf
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
    async asyncData({ $axios, store }) {
        try {
            let data = await $axios.$get("/api/reports/coc", {headers: {authorization: `Bearer ${store.state.users.user.token}`}});
            return {
                coc: data
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
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
                    console.log(pdf.internal.pageSize.getHeight())
                    pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 10))
                } 
            }).save()
        }
    }
}
</script>