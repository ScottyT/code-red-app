<template>
    <div v-if="single">
        <span class="button--normal button" @click="$refs.single.click()">Add Image</span>
        <input type="file" name="single" accept="image/*" ref="single" @change="filesChange" />
        <div class="file-listing"><img class="file-listing__preview" v-bind:ref="`singlefile`" /></div>
        <v-btn @click="uploadFiles(uploadimages, $refs.single)" v-if="showUpload && $nuxt.isOnline">{{ uploading ? 'Uploading' : 'Upload'}}</v-btn>
        <p aria-label="Upload message goes here" id="singleMessage" ref="singleMessage"></p>
        <h3 v-show="uploadMessage !== ''">{{uploadMessage}}</h3>
    </div>
    <div v-else>
        <span class="button__add-files button mt-4" @click="$refs.multiple.click()">Add Files</span>
        <input type="file" name="multiple" ref="multiple" accept="image/*" @change="filesChange" multiple />
        <div class="file-listing-wrapper">
            <div v-for="(file, key) in uploadimages" class="file-listing" :key="`images-${key}`">
                <img class="file-listing__preview" v-bind:ref="'image'+parseInt(key)" />
                <span class="file-listing__remove-file" @click="removeFile(key)" tag="i">
                    <span class="file-listing__remove-file--leg1 file-listing__remove-file--leg"></span>
                    <span class="file-listing__remove-file--leg2 file-listing__remove-file--leg"></span>
                </span>
            </div>
        </div>
        <v-btn @click="uploadFiles(uploadimages, $refs.multiple)" v-if="showUpload && $nuxt.isOnline">
            {{ uploading ? 'Uploading' : 'Upload'}}
        </v-btn>
        <p aria-label="Upload message goes here" ref="multipleMessage"></p>
        <h3 v-show="uploadMessage !== ''">{{uploadMessage}}</h3>
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
        }
    },
    setup(props, { refs }) {
        const { singleImage, jobId, singleImageName, subDir, errors } = toRefs(props)
        const { $fire, $fireModule } = useContext()
        const uploadimages = ref([])
        const uploadMessage = ref('')
        const filesUploaded = ref([])
        const uploading = ref(false)
        const errorMessage = ref('')
        const errorDialog = ref(false)
        const showUpload = ref(false)
        const errorslist = computed(() => errors.value)
        const job = computed(() => jobId.value)

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
                        console.log(usekey)
                        refs[usekey + i][0].src = reader.result;
                    }, false);
                    reader.readAsDataURL(filesarr[i])
                }
            }
        }
        const filesChange = (e) => {
            const fileList = e.target.files
            const uploadarea = e.target.name
            showUpload.value = !showUpload.value
            if (!fileList.length) return
            if (singleImage.value) {
                for (let i = 0; i<refs.single.files.length; i++) {
                    console.log("files:", refs.single.files)
                    var image = refs.single.files[i]
                    var blob = image.slice(0, image.size, image.type)
                    var filetype = image.name.substring(image.name.lastIndexOf('.'), image.name.length)
                    var newFile = new File([blob], `${singleImageName.value}-${jobId.value}${filetype}`, {
                        type: image.type
                    })
                    uploadimages.value[0] = newFile
                    console.log(uploadimages.value)
                }
                getSinglePreview(uploadimages.value, 'singlefile')
            } else {
                uploadimages.value = refs.multiple.files
                getImagePreviews(uploadimages.value, 'image')
            }
        }
        const removeFile = (key) => {
            uploadimages.value.splice(key, 1)
            getImagePreviews(uploadimages.value, 'image')
            refs.files.value = null
        }
        const uploadFiles = (uploadarr, element) => {
            const today = new Date()
            const date = (today.getMonth() + 1)+'-'+today.getDay()+'-'+today.getFullYear();
            if (!job) {
                errorMessage.value = "Job ID is required"
                return;
            }
            const promises = []
            let len = uploadimages.value.length
            console.log("length of uploaded images:", len)
            var uploadedFiles = uploadimages.value
            Array.prototype.forEach.call(uploadarr, file => {
                var storageRef = $fire.storage.ref()
                var field = element.getAttribute('name')
                switch (field) {
                    case "multiple":
                        var uploadRef = storageRef.child(`${job}/${subDir.value}-${date}/${file.name}`)
                        var uploadTask = uploadRef.put(file)
                        break;
                    default:
                        var uploadRef = storageRef.child(`${jobId.value}/${file.name}`)
                        var uploadTask = uploadRef.put(file)
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
                        //Array.prototype.splice.call(uploadimages.value, len - 1, 1)
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
                    --len
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
            single: singleImage.value,
            filesChange,
            removeFile,
            uploadFiles
        }
    }
})
</script>
