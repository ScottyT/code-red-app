<template>
  <v-layout column justify-center class="section-wrapper">
    <section v-for="(slice, index) in slices" :key="index">
      <template v-if="slice.slice_type === 'bighero'">
        <BigHero :slice="slice" />
      </template>
      <template v-else-if="slice.slice_type === 'evalreportform'">
        <EvalReportForm :slice="slice" />
      </template>
      <template v-else-if="slice.slice_type === 'rapidresponseform'">
        <RapidResponseForm :slice="slice" />
      </template>
    </section>
  </v-layout>
</template>
<script>
export default {
  name: 'SlicesBlock',
  components: {
    BigHero: () => import('./slices/BigHero.vue'),
    EvalReportForm: () => import('./slices/EvalReportForm.vue'),
    RapidResponseForm: () => import('./slices/RapidResponseForm.vue'),
  },
  props: {
    slices: Array,
  },
}
</script>
