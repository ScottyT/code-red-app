<template>
    <span v-if="coc.length <= 0"><h2>There are no completed jobs</h2></span>
    <div class="px-5 mt-5" v-else>
        <div class="coc-list-item" v-for="(item, i) in coc" :key="`coc-${i}`">
            <p>Certificate for job {{item.JobId}}</p>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="900" :manual-pagination="false"
                            :show-layout="false" :preview-modal="true" :ref="`html2Pdf-${i}`">
                    <PdfCertificateContent :certificate="item" company="Water Emergency Services Incorporated" abbreviation="WESI" @domRendered="domRendered()" slot="pdf-content" />
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
                    format: 'letter',
                    orientation: 'portrait',
                    hotfixes: ['px_scaling']
                }
            }
        }
    },
    async asyncData({ $axios }) {
        try {
            let data = await $axios.$get("/api/reports/coc");
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
    }
}
</script>