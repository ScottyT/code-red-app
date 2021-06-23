<template>
  <div class="page-block--home">  
    <div class="page-block__cta page-block__cta--large">
      <h1 class="text-center text-uppercase h1--extra-large">Welcome to the Code Red App!</h1>
    </div>
    <UiFullScreenImage imgsrc="https://images.prismic.io/wateremergencyservices-pwa/b146a127-57a7-4147-bfa7-bbb2f67fff2b_cr+logo.png?auto=compress,format" />
  </div>
</template>

<script>
import { defineComponent, ref, inject, computed, onMounted, watch } from '@nuxtjs/composition-api';

export default defineComponent({
  setup(props, context) {
    const authUser = context.root.$fire.auth.currentUser
    let reportStoreMethods = context.root.$reportStore.methods
    const data = ref([])
    const reports = computed(() => context.root.$reportStore.state.all.value)
  
    return {
      reports,
    }
  }
})
</script>
<style lang="scss">
.page-block {
  &--home {
    position:relative;
    display:flex;
    justify-content:center;
    align-items:center;
    width:100%;
    height:100%;
    z-index:1;
    margin-top:0!important;
  }
  &__cta {
    width:100%;
    background-color:rgba($color-black, .5);
    border-radius:15px;
    z-index:2;
    position:absolute;
    top:65%;
    transform:translateY(-50%);

    &--large {
      max-width:630px;
      padding:20px 40px;
    }
  }
}
</style>