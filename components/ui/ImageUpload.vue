<template>
    <div>
        <div @click="launchFilePicker()" class="d-inline">
            <slot name="activator"></slot>
        </div>
        <input type="file" ref="file" :name="uploadFieldName" @change="onFileChange($event.target.name, $event.target.files)" style="display:none" />
        <v-dialog v-model="errorDialog" max-width="300">
            <v-card light class="pa-3">
                <p class="text">{{errorText}}</p>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark @click="errorDialog = false">Got it!</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { ref, toRefs } from '@nuxtjs/composition-api'
export default {
    props: {
        value: Object,
        maxSize: Number,
        uploadFieldName: String,
        email: String,
        errorText: String
    },
    setup(props, { root, refs, emit }) {
        const { maxSize, uploadFieldName, email, errorText } = toRefs(props)
        
        const errorDialog = ref(false)
        const launchFilePicker = () => {
            refs.file.click()
        }
        const onFileChange = (fieldName, file) => {
            let imageFile = file[0]
            if (file.length > 0) {
                let size = imageFile.size / maxSize.value / maxSize.value
                if (!imageFile.type.match('image.*')) {
                    errorDialog.value = true
                    errorText.value = 'Please upload an image file'
                } else if (size>1) {
                    errorDialog.value = true
                    errorText.value = 'Your file is too big!'
                } else {
                    let formData = new FormData()
                    let imageUrl = URL.createObjectURL(imageFile)
                    let imageName = imageFile.name
                    formData.append(fieldName, imageFile)                   
                    formData.append('contentType', imageFile.type)
                    
                    emit('input', { formData, imageUrl, imageName })
                }
            }
        }

        return {
            launchFilePicker,
            onFileChange,
            errorDialog
        }
    },
}
</script>