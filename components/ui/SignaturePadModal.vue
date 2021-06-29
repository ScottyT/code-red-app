<template>
  <ValidationProvider v-slot="{errors}" :vid="inputId" rules="required" :name="name" class="form__input-group" :class="{modalOpen: sigDialog}">
    <label class="form__label">{{name}}</label>
    <input type="hidden" v-model="sigData.data" />
    <!-- <input type="file" accept="image/*" @change="" /> -->
    <v-dialog v-model="sigDialog" :width="width" :height="height">
      <template v-slot:activator="{ on, attrs }">
        <div class="button--normal button" v-bind="attrs" v-on="on">{{sigData.data == '' ? 'Click to sign' : 'Signed'}}</div>
      </template>
      <VueSignaturePad class="form__input" :width="width" :height="height" id="sigPad" :ref="sigRef" :options="{ onBegin }" />
      <div class="modal__footer">
        <button type="button" class="button" @click="clear">Clear</button>
        <button type="button" :disabled="sigData.isEmpty" @click="save" :class="`button ${sigData.isEmpty ? 'button--disabled' : ''}`">{{ sigData.data !== '' ? 'Signed' : 'Sign' }}</button>
      </div>
    </v-dialog>
    <span class="form__input--error">{{ errors[0] }}</span>
  </ValidationProvider>
</template>
<script>
import { defineComponent, onMounted, computed, ref, toRefs, useContext, useStore } from "@nuxtjs/composition-api";
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
      type: String,
      default: "700px"
    },
    height: {
      type: String,
      default: "250px"
    },
    initial: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {refs}) {
    const { sigData, sigRef, name, inputId, width, height, initial } = toRefs(props)
    const { $fire, $fireModule } = useContext()
    const store = useStore()
    const sigDialog = ref(false)
    const sigImage = ref('')
    const user = computed(() => store.getters['users/getUser'])
    
    const uploadFile = (filename) => {
      //var x = decodeURIComponent(escape(window.atob(sigData.value.data)))
      const storageRef = $fire.storage.ref().child(`${user.value.email}/${filename}`);
      /* var formData = new FormData();
      formData.append('teamMember', user.value.email)
      formData.append('signature', sigData.value.data) */
      const data = {
        "teamMember": user.value.email,
        "signature": sigData.value.data
      }
      
      storageRef.putString(data.signature, 'data_url').then((snapshot) => {
        console.log(snapshot)
      })
    }
    const fetchSigORInitial = () => {
      var storageRef = $fire.storage.ref().child(`${user.value.email}`);
      storageRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadUrl(itemRef.name)
        })
      })
    }
    const getDownloadUrl = (filename) => {
      var sigRef = $fire.storage.ref().child(`${user.value.email}/${filename}`)
      sigRef.getDownloadURL().then((url) => {
        sigData.value.data = url
      })
    }
    const clear = () => {
      refs[sigRef.value].clearSignature();
      sigData.value.isEmpty = true
      sigData.value.data = ""
    }
    const save = () => {
      const { data, isEmpty } = refs[sigRef.value].saveSignature();
      sigData.value.data = data;
      sigData.value.isEmpty = isEmpty
      sigDialog.value = false
      if (initial.value) {
        uploadFile("initial")
      } else {
        uploadFile("signature")
      }
    }
    onMounted(fetchSigORInitial)
    onMounted(getDownloadUrl)

    return {
      user,
      sigDialog,
      sigImage,
      save,
      clear,
      getDownloadUrl
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
}
</style>