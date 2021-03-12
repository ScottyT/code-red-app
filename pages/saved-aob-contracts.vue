<template>
    <div>
        <client-only>
        <vue-html2pdf :pdf-quality="2" pdf-content-width="100%" :html-to-pdf-options="htmlToPdfOptions" :paginate-elements-by-height="6000" :manual-pagination="false"
                        :show-layout="false" :preview-modal="true" ref="aobhtml2pdf">
            <lazy-aob-contract-content @domRendered="domRendered()" slot="pdf-content" :contracts="contracts" company="Water Emergency Services Incorporated" abbreviation="WESI" />
        </vue-html2pdf>
        </client-only>
        
        <v-btn @click="generateReport(0)">Download PDF</v-btn>       
    </div>
</template>
<script>
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
                filename: `aob-${this.contracts[0].JobId}`,
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
            let data = await $axios.$get("/api/aob-mitigation-contracts");
            return { contracts: data }
        } catch (e) {
            console.error("SOMETHING WENT WRONG: " + e)
        }
    },
    data() {
        return {
            contracts: [],
            contentRendered: false
        }
    },
    methods: {
        domRendered() {
            console.log('dom rendered')
            this.contentRendered = true
        },
        generateReport(key) {
            console.log(this.$refs)
            this.htmlToPdfOptions.filename = `aob-${this.contracts[key].JobId}`
            this.$refs.aobhtml2pdf.generatePdf()
        },
    }
}
</script>