<template>
  <v-layout column justify-center class="section-wrapper">
    <template v-if="slice === 'dispatch-report'">
      <LazyFormsDispatchReport :slice="slice" :company="company" />
    </template>
    <template v-if="slice === 'rapid-response-form'">
      <LazyFormsRapidResponse :slice="slice" :company="company" />
    </template>
    <template v-if="slice === 'daily-containment-report'">
      <LazyFormsDailyContainment :company="company" />
    </template>
    <template v-if="slice === 'daily-technician-report'">
      <LazyFormsDailyTechnician :company="company" />
    </template>
    <template v-if="slice === 'atmospheric-readings'">
      <LazyFormsAtmosphericReadings :company="company" />
    </template>
    <template v-if="slice === 'inventory-log'">
      <LazyFormsInventoryLog :company="company" />
    </template>
    <template v-if="slice === 'moisture-readings'">
      <LazyFormsMoistureReadings :company="company" />
    </template>
    <template v-if="slice === 'psychrometric-charting'">
      <LazyFormsPsychrometricCharting :company="company" />
    </template>
    <template v-if="slice === 'aob-contract-form'">
      <LazyFormsAOBContract :company="company" abbreviation="WESI" />
    </template>
    <template v-if="slice === 'certificate-of-completion'">
      <LazyFormsCertificate :company="company" abbreviation="WESI" />
    </template>
  </v-layout>
</template>
<script>
export default {
  name: 'SlicesBlock',
  props: ['slice', 'abbreviation'],
  data() {
    return {
      company: ""
    }
  }
}
</script>
