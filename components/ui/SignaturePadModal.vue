<template>
  <ValidationProvider v-if="dialog" v-slot="{errors}" :vid="inputId" rules="required" :name="name" class="form__input-group sig-pad-wrapper" :class="{modalOpen: sigDialog}">
    <label class="form__label">{{name}}</label>
    <input type="hidden" v-model="sigData.data" />
    <v-dialog v-model="sigDialog" :width="width" :height="height" v-if="sigData.data === ''">
      <template v-slot:activator="{ on, attrs }">
        <div class="button--normal button" v-bind="attrs" v-on="on">{{sigData.data == '' ? 'Click to sign' : 'Signed'}}</div>
      </template>
      <VueSignaturePad :width="width" :height="height" id="sigPad" :ref="sigRef" :options="{ onBegin }" />
      <div class="modal__footer">
        <button type="button" class="button" @click="clear">Clear</button>
        <button type="button" :disabled="sigData.isEmpty" @click="save" :class="`button`">{{ sigData.data !== '' ? 'Signed' : 'Sign' }}</button>
      </div>
    </v-dialog>
    <div id="populate" v-else class="button--normal button" @click="populateField">{{!signed ? 'Click to sign' : 'Signed'}}</div>
    <span class="form__input--error">{{ errors[0] }}</span>
    <div :style="`max-width:${width}; height:${height};width:100%;`" v-if="signed">
      <img :src="sigData.data" />
    </div>   
  </ValidationProvider>
  <ValidationProvider v-else v-slot="{errors}" :vid="inputId" rules="required" :name="name" class="form__input-group">
    <label class="form__label">{{name}}</label>
    <input type="hidden" v-model="sigData.data" />
    <div class="sig-pad" v-if="sigData.data === ''">
      <VueSignaturePad class="form__input" :width="width" :height="height" id="sigPad" :ref="sigRef" :options="{ onBegin }" />
      <div class="sig-pad__footer" >
        <button type="button" class="button" @click="clear">Clear</button>
        <button type="button" @click="save" :class="`button`">{{ sigData.data !== '' ? 'Signed' : 'Sign' }}</button>
      </div>
    </div>
    <div id="populate" v-else class="button--normal button" @click="populateField">{{!signed ? 'Click to sign' : 'Signed'}}</div>
    <div :style="`max-width:${width}; height:${height};width:100%;`" v-if="signed">
      <img :src="sigData.data" />
    </div>
    <span class="form__input--error">{{ errors[0] }}</span>
  </ValidationProvider>
</template>
<script>
import { defineComponent, onMounted, watch, computed, ref, toRefs, useContext, useStore } from "@nuxtjs/composition-api";
import axios from 'axios';
export default defineComponent({
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
    },
    inputId: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    initial: {
      type: Boolean,
      default: false
    },
    sigType: String,
    dialog: Boolean
  },
  setup(props, {refs, emit}) {
    const { sigData, sigRef, sigType, initial } = toRefs(props)
    const { $fire, $fireModule } = useContext()
    const store = useStore()
    const sigDialog = ref(false)
    const sigImage = ref('')
    const signed = ref(false)
    const user = computed(() => store.getters['users/getUser'])
    
    const uploadFile = (filename) => {
      const storageRef = $fire.storage.ref().child(`${user.value.email}/${filename}`);
      const data = {
        "teamMember": user.value.email,
        "signature": sigData.value.data
      }
      
      storageRef.putString(data.signature, 'data_url').then((snapshot) => {
        getDownloadUrl(snapshot.ref.name)
      })
    }
    const fetchSigORInitial = async () => {
      if (initial.value) {
        getDownloadUrl("initial")
      } else if (sigType.value === 'employee') {
        getDownloadUrl("signature")
      }
    }
    const getDownloadUrl = (filename) => {
      var sigRef = $fire.storage.ref().child(`${user.value.email}/${filename}`)
      sigRef.getDownloadURL().then((url) => {
        sigImage.value = url
        sigData.value.data = url
      })
    }
    const populateField = () => {
      /* fetchSigORInitial().then(() => {
        signed.value = true
      }) */
      signed.value = true
      
      //sigData.value.data = sigImage.value
    }
    const clear = () => {
      refs[sigRef.value].clearSignature();
      sigData.value.isEmpty = true
      sigData.value.data = ""
    }
    const save = () => {
      if (sigData.value.isEmpty) return;
      const { data, isEmpty } = refs[sigRef.value].saveSignature();
      sigData.value.data = data;
      sigData.value.isEmpty = isEmpty
      sigDialog.value = false
      signed.value = true
      
      if (initial.value) {
        uploadFile("initial")
      } else if (sigType.value === 'employee') {
        uploadFile("signature")
      }
    }
    /* watch(sigData.value.data, (val) => {
      console.log("success")
    }) */
    if (sigImage.value !== '') {
      
    }
    onMounted(fetchSigORInitial)
    //onMounted(getDownloadUrl)

    return {
      user,
      sigDialog,
      sigImage,
      signed,
      save,
      clear,
      populateField
    }
  },
  methods: {
    onBegin() {
      const { isEmpty } = this.$refs[this.sigRef].saveSignature();
      this.sigData.isEmpty = isEmpty
      this.$nextTick(() => {
        this.$refs[this.sigRef].resizeCanvas()
      })
    }
  }
})
</script>
<style>
#sigPad {
   background-color:white;
   padding:0!important;
}
.sig-pad-wrapper {
  grid-column:1/3 span;
}
</style>