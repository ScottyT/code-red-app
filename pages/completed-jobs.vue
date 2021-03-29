<template>
    <div>
        <div class="coc-list-item" v-for="(item, i) in coc" :key="`coc-${i}`">
            <p>Certificate for job {{item.JobId}}</p>
            <client-only>
            <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="3000" :manual-pagination="false"
                        :show-layout="false" :preview-modal="true" :ref="`html2Pdf-${i}`" @beforeDownload="beforeDownload($event)">
                <lazy-certificate-content :certificate="coc[i]" @domRendered="domRendered()" slot="pdf-content" />
            </vue-html2pdf>
            </client-only>
            <v-btn @click="generateReport(i)">Download PDF</v-btn>
            <!-- <lazy-certificate-content :certificate="coc[i]" @domRendered="domRendered()" slot="pdf-content" /> -->
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
            console.log(e)
            return {
                margin:[10, 10, 20, 10],
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
                    format: 'a4',
                    orientation: 'portrait',
                    hotfixes: ['px_scaling']
                }
            }
        }
    },
    async asyncData({ $axios }) {
        try {
            let data = await $axios.$get("/api/certificates");
            return {
                coc: data
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    },
    data() {
        return {
            coc:[]
        }
    },
    methods: {
        domRendered() {
            console.log('dom rendered')
            this.contentRendered = true
        },
        generateReport(key) {
            this.htmlToPdfOptions.filename = `coc-${this.coc[key].JobId}`
            this.$refs["html2Pdf-" + key][0].generatePdf()
        },
        async beforeDownload({
            html2Pdf,
            options,
            pdfContent
        }) {
            /* await html2Pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
            const totalPages = pdf.internal.getNumberOfPages()
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i)
                pdf.setFontSize(10)
                pdf.setTextColor(150)
                pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
            }
            }).save() */
        }
    }
}
</script>