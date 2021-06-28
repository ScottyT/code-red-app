<template>
    <div v-if="single">
        <span class="button--normal button" @click="$refs.images.click()">Add Image</span>
        <input type="file" name="single" accept="image/*" ref="images" @change="filesChange" />
        <div class="file-listing" v-if="inlinePreview"><img class="file-listing__preview" v-bind:ref="`singlefile`" /></div>
        <v-btn @click="uploadFiles(uploadimages, $refs.images)" v-if="showUpload && $nuxt.isOnline">{{ uploading ? 'Uploading' : 'Upload'}}</v-btn>
        <p aria-label="Upload message goes here" id="singleMessage" ref="singleMessage"></p>
        <h3 v-show="uploadMessage !== ''">{{uploadMessage}}</h3>
    </div>
    <div v-else>
        <ValidationProvider rules="ext:doc,pdf,xlsx,docx,jpg,png,gif,jpeg" name="Files" v-slot="{ errors, validate }" ref="multiple">
            <span class="button__add-files button mt-4" @click="$refs.images.click()">Add Files</span>           
            <input type="file" name="multiple" ref="images" accept="image/*" @change="filesChange" multiple />
            <div class="file-listing-wrapper" v-if="inlinePreview">
                <div v-for="(file, key) in uploadimages" class="file-listing" :key="`images-${key}`">
                    <input type="hidden" v-model="file[key]" @click="validate" />
                    <img class="file-listing__preview" v-bind:ref="'image'+parseInt(key)" />
                    <span class="file-listing__remove-file" @click="removeFile(key)" tag="i">
                        <span class="file-listing__remove-file--leg1 file-listing__remove-file--leg"></span>
                        <span class="file-listing__remove-file--leg2 file-listing__remove-file--leg"></span>
                    </span>
                </div>
            </div>
            <v-btn @click="uploadFiles(uploadimages, $refs.images)" v-if="showUpload && $nuxt.isOnline">
                {{ uploading ? 'Uploading' : 'Upload'}}
            </v-btn>
            <span class="form__input--error">{{ errors[0] }}</span>
            <p aria-label="Upload message goes here" ref="multipleMessage"></p>
            <h3 v-show="uploadMessage !== ''">{{uploadMessage}}</h3>
        </ValidationProvider>
    </div>
</template>
<script>
import { defineComponent, toRefs, watch, ref, useContext, computed } from '@nuxtjs/composition-api'

export default defineComponent({
    props: {
        singleImage: {
            type: Boolean,
            required: true
        },
        singleImageName: String,
        subDir: String,
        errors: Array,
        jobId: {
            type: String,
        },
        inlinePreviews: {
            type: Boolean,
            default: true
        }
    },
    setup(props, { refs, emit }) {
        const { singleImage, jobId, singleImageName, subDir, errors, inlinePreviews } = toRefs(props)
        const { $fire, $fireModule } = useContext()
        const uploadimages = ref([])
        const uploadMessage = ref('')
        const filesUploaded = ref([])
        const uploading = ref(false)
        const errorMessage = ref('')
        const errorDialog = ref(false)
        const showUpload = ref(false)
        const errorslist = computed(() => errors.value)

        const getSinglePreview = (files, usekey) => {
            if (/\.(jpe?g|png|gif)$/i.test(files[0].name)) {
                const reader = new FileReader();
                reader.onload = e => {
                    refs[usekey].src = reader.result;
                }
                reader.readAsDataURL(files[0])
            }
        }
        const getImagePreviews = (filesarr, usekey) => {
            for (let i = 0; i < filesarr.length; i++) {
                if (/\.(jpe?g|png|gif)$/i.test(filesarr[i].name)) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        refs[usekey + i][0].src = reader.result;
                    }, false);
                    reader.readAsDataURL(filesarr[i])
                }
            }
        }
        const filesChange = async (e) => {
            const fileList = e.target.files
            const uploadarea = e.target.name
            showUpload.value = !showUpload.value
            if (!fileList.length) return
            
            if (singleImage.value) {
                for (let i = 0; i<refs.images.files.length; i++) {
                    console.log("files:", refs.images.files)
                    var image = refs.images.files[i]
                    var blob = image.slice(0, image.size, image.type)
                    var filetype = image.name.substring(image.name.lastIndexOf('.'), image.name.length)
                    var newFile = new File([blob], `${singleImageName.value}-${jobId.value}${filetype}`, {
                        type: image.type
                    })
                    uploadimages.value[0] = newFile
                }
                getSinglePreview(uploadimages.value, 'singlefile')
            } else {
                const { valid } = await refs.multiple.validate(e)
                console.log(valid)
                if (valid) {
                    uploadimages.value = refs.images.files
                    emit('filePreviews', uploadimages.value)
                    getImagePreviews(uploadimages.value, 'image')
                } else {
                    showUpload.value = false
                }
            }
            emit('sendImages', uploadimages.value)
        }
        const removeFile = (key, i) => {
            const files = Array.from(uploadimages.value)
            console.log(files)
            files.splice(key, 1)
            getImagePreviews(files, 'image')
            refs['image' + key][0].value = null
        }
        const uploadFiles = (uploadarr, element) => {
            const today = new Date()
            const date = (today.getMonth() + 1)+'-'+today.getUTCDate()+'-'+today.getFullYear();
            if (!jobId.value) {
                errorMessage.value = "Job ID is required"
                return;
            }
            const promises = []
            uploadimages.value = Array.from(refs.images.files)
            let len = uploadimages.value.length
            Array.prototype.forEach.call(uploadarr, file => {
                var storageRef = $fire.storage.ref()
                var field = element.getAttribute('name')
                switch (field) {
                    case "multiple":
                        var uploadRef = storageRef.child(`${jobId.value}/${subDir.value}-${date}/${file.name}`)
                        var uploadTask = uploadRef.put(file)
                        break;
                    default:
                        var uploadRef = storageRef.child(`${jobId.value}/${file.name}`)
                        var uploadTask = uploadRef.put(file)
                        break;
                }
                promises.push(uploadTask)
                uploading.value = true
                uploadTask.on('state_changed', (snapshot) => {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    switch (snapshot.state) {
                        case $fireModule.storage.TaskState.PAUSED:
                            uploadMessage.value = "Upload paused :("
                            break;
                        case $fireModule.storage.TaskState.RUNNING:
                            uploadMessage.value = "Images are still uploading..."
                            break;
                    }
                    if (progress == 100) {
                        uploadarr = []
                    }
                }, (error) => {
                    errorDialog.value = true
                    errorMessage.value = error
                }, () => {
                    uploadRef.getDownloadURL().then((url) => {
                        var fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                        var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
                        const fileObj = {
                            name: fileName,
                            url: url,
                            type: fileType,
                            date: date
                        }
                        filesUploaded.value.push(fileObj)
                    })
                    uploadimages.value.splice(len - 1, 1)
                    len--
                })
            })
            Promise.all(promises).then(result => {
                uploading.value = false
                uploadMessage.value = "Images have been successfully uploaded!"
            })
        }

        return {
            errorslist,
            uploading,
            showUpload,
            uploadimages,
            uploadMessage,
            inlinePreview: inlinePreviews.value,
            single: singleImage.value,
            filesChange,
            removeFile,
            uploadFiles
        }
    }
})
</script>
