<template>
  <div class="big-hero">
    {{label}}
  </div>
</template>
<script>
import { ref, reactive, onServerPrefetch } from '@vue/composition-api'
export default {
  props: {
    label: String
  },
  setup(props, { ssrContext }) {
    const result = ref()

    onServerPrefetch(async () => {
      result.value = await callApi(ssrContext)
    })
    const { label } = toRefs(props)
    return { label: label.value, result }
  },
}
</script>

<style lang="scss">
.big-hero {
  height: 40vh;
  position: relative;
}
</style>
