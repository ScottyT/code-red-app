<template>
    <div>
        <client-only>
        <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" pdf-format="a4" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="1100" :manual-pagination="false"
                    :show-layout="false" :preview-modal="true" ref="html2Pdf" @beforeDownload="beforeDownload($event)">
            <lazy-certificate-content :certificate="coc" @domRendered="domRendered()" slot="pdf-content" />
        </vue-html2pdf>
        </client-only>
        
        <v-btn @click="generateReport">Download PDF</v-btn>
    </div>
    <!-- <lazy-certificate-content :certificate="coc" /> -->
</template>
<script>
export default {
    head() {
        return {
            title: "Completed Jobs"
        }
    },
    computed: {
        htmlToPdfOptions() {
            return {
                margin:0,
                filename: `coc-${this.coc[0].JobId}`,
                image: {
                    type: "jpeg",
                    quality: 0.98
                },
                html2canvas: {
                    scale: 1,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: 'portrait'
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
        generateReport() {
            this.$refs.html2Pdf.generatePdf()
        },
        async beforeDownload({
            html2Pdf,
            options,
            pdfContent
        }) {
            console.log(options)
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