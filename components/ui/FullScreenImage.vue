<template>
  <div class="fs-image">
    <img :src="image.imgsrc" /> 
  </div>
</template>
<script>
import { toRef } from 'vue'
import { ref, reactive, onServerPrefetch, computed } from '@vue/composition-api'

export default {
  props: {
    imgsrc: String
  },
  setup(props) {
    const src = ref(props, 'imgsrc')
    return { image: src.value }
  },
}
</script>

<style lang="scss">
.fs-image {
  height: calc(100vh - 400px);
  width:100%;
  position: absolute;
  top:0;
  left:50%;
  transform:translateX(-50%);
  max-width:400px;

  @include respond(tabletLargeMax) {
    height:auto;
    max-width:600px;
  }
  img {
    object-fit:contain;
  }
}
</style>
