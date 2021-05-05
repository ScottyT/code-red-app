<template>
  <ValidationProvider v-slot="{ errors }" :name="name" class="form__input--input-group" :class="{modalOpen: sigDialog}" rules="required">
    <input type="hidden" v-model="sigData.data" />
    <v-dialog v-model="sigDialog" width="700">
      <template v-slot:activator="{ on, attrs }">
        <div class="button--normal button" v-bind="attrs" v-on="on">{{sigData.data == '' ? 'Click to sign' : 'Signed'}}</div>
      </template>
      <VueSignaturePad class="form__input" width="700" height="250px" id="sigPad" :ref="sigRef" :options="{ onBegin }" />
      <div class="modal__footer">
        <button type="button" class="button button--normal" @click="clear">Clear</button>
        <button type="button" :disabled="sigData.isEmpty" @click="save" :class="`button ${sigData.isEmpty ? 'button--disabled' : ''}`">{{ sigData.data !== '' ? 'Signed' : 'Sign' }}</button>
      </div>
    </v-dialog>
    <span class="form__input--error">{{ errors[0] }}</span>
  </ValidationProvider>
</template>
<script>
export default {
  name: 'SignaturePadModal',
  props: {
    sigData: {
      type: Object,
      required: true
    },
    sigRef: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: "Signature"
    }
  },
  data() {
    return {
      sigDialog: false
    }
  },
  methods: {
    clear() {
      this.$refs[this.sigRef].clearSignature();
      this.sigData.isEmpty = true
      this.sigData.data = null
    },
    save() {
      const {
        data,
        isEmpty
      } = this.$refs[this.sigRef].saveSignature();
      this.sigData.data = data;
      this.sigData.isEmpty = isEmpty
      this.sigDialog = false
    },
    onBegin() {
      const {
        isEmpty
      } = this.$refs[this.sigRef].saveSignature();
      this.sigData.isEmpty = isEmpty
      this.$nextTick(() => {
        console.log(this.$refs)
        this.$refs[this.sigRef].resizeCanvas()
      })
    },
  },
  created() {

  }
}
</script>
<style>
#sigPad {
   background-color:white;
}
</style>