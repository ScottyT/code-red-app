<template>
  <div class="page-block--home">  
    <div class="page-block__cta page-block__cta--large">
      <h1 class="text-center text-uppercase h1--extra-large">Welcome to the Code Red App!</h1>
    </div>
    <UiFullScreenImage imgsrc="https://images.prismic.io/coderedanalytics/af1903ea-ff02-4ae2-853f-c444488391a8_CR+3D+Globes+w+lens+filter+2MB+JPEG.jpg?auto=compress,format" />
  </div>
</template>

<script>
import { defineComponent, ref, inject, computed, onMounted } from '@nuxtjs/composition-api'
import {mapGetters, mapActions} from 'vuex'

export default defineComponent({
  setup(props, context) {
    console.log(context)
    //const store = inject('userReports')
    const authUser = context.root.$fire.auth.currentUser
    //store.methods.loadReports(authUser.email)
    const data = ref([])
    context.root.$reportStore.methods.loadReports(authUser.email)
    const reports = computed(() => context.root.$reportStore.state.all.value)

    return {
      reports
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
    position:relative;

    &--large {
      max-width:630px;
      padding:20px 40px;
    }
  }
}
</style>