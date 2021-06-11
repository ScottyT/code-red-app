<template>
    <div v-if="contracts.length <= 0">
        <h2>There are no AOB Contracts</h2>
    </div>
    <div class="px-5 mt-5" v-else>
        <div class="contracts-list-item" v-for="(item, i) in contracts" :key="`contract-${i}`">
            <p>AOB & Mitigation Contract Job ID: {{item.JobId}}</p>
            <client-only>
                <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" @beforeDownload="beforeDownload($event)" :manual-pagination="true"
                    :show-layout="false" :enable-download="false" :preview-modal="true" :paginate-elements-by-height="10500" :ref="`aobhtml2pdf-${i}`">
                    <PdfAobContract slot="pdf-content" :contracts="item" company="Water Emergency Services Incorporated" abbreviation="WESI" />
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
            title: "AOB & Mitigation Contract"
        }
    },
    computed: {
        htmlToPdfOptions(e) {
            return {
                margin:[10, 10, 20, 10],
                filename: `aob-${this.contracts.JobId}`,
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
    components: {
        VueHtml2pdf
    },
    async fetch() {
        await this.$fire.auth.currentUser.getIdToken(true).then((idToken) => {
            this.$axios.$get("/api/reports/aob", {headers: {authorization: `Bearer ${idToken}`}}).then((res) => {
                    this.contracts = res
            })
        })
    },
    /* async asyncData({ $axios, store, $fire }) {
        try {
            
            let data = await $axios.$get("/api/reports/aob", {headers: {authorization: `Bearer ${store.state.users.user.token}`}});
            return { 
                contracts: data
            }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    }, */
    data() {
        return {
            contracts: [],
            contentRendered: false,
            errorMessage: '',
            cards:[]
        }
    },
    methods: {
        domRendered() {
            this.contentRendered = true
        },
        generateReport(key) {
            this.htmlToPdfOptions.filename = `aob-${this.contracts[key].JobId}`
            this.$refs["aobhtml2pdf-"+key][0].generatePdf()
        },
        async beforeDownload({ html2pdf, options, pdfContent }) {
            console.log(pdfContent)
            await html2pdf().set(options).from(pdfContent).toPdf().get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    pdf.setFontSize(14)
                    pdf.text('Page ' + i + ' of ' + totalPages, (pdf.internal.pageSize.getWidth() * 0.88), (pdf.internal.pageSize.getHeight() - 0.3))
                }
            }).save()
        }
    }
}
</script>