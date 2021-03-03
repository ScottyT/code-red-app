<template>
  <div class="folder-contents">
    <div class="upload-area">
      <v-btn @click="$refs.jobfiles.click()">Add Files</v-btn>
      <ValidationProvider ref="provider" rules="ext:doc,pdf,xlsx,docx,jpg,png,gif,jpeg" name="Upload"
        v-slot="{ validate, errors }">
        <v-btn @click="uploadFiles(uploadFilesArr)" v-if="uploadFilesArr.length > 0 && errors.length <= 0">
          {{uploading ? 'Uploading' : 'Upload'}}</v-btn>
        <input type="hidden" v-model="uploadFilesArr" @click="validate" />
        <input type="file" name="files" ref="jobfiles" accept="image/*,.doc,.docx,.xls,.xlsx,.pdf"
          @change="filesChange" multiple />
        <br />
        <span ref="uploadError" name="Upload" class="upload-area--error">{{ errors[0] }}</span>
      </ValidationProvider>
      <v-btn @click="editing = !editing"  class="button--normal">Editing</v-btn>
      <v-btn @click.stop="deleteDialog = true" v-if="editing">Delete?</v-btn>
      <v-dialog v-model="deleteDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="headline">Are you sure you want to delete the selected files?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deleteDialog = false">No</v-btn>
            <v-btn @click="deleteFiles">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn class="button--normal" @click="downloadFiles">Download All</v-btn>
    </div>
    <div class="folder-contents__content" v-for="(item, i) in files" :key="i">
      <input type="checkbox" @change="selectedFiles" v-if="editing" :id="`delete-${i}`" :value="item" v-model="filesToDelete" class="folder-contents__content--checkbox" />
      <a :href="item.url" target="_blank" v-if="item.type === '.jpg' || item.type === '.png' || item.type === '.gif'">
        <img class="folder-contents__content--image" :src="item.url" />
      </a>
      <p v-if="item.type === '.jpg' || item.type === '.png' || item.type === '.gif'">{{item.name}}</p>
      <a class="folder-contents__content--file" :href="item.url" target="_blank" v-else>
        <v-icon x-large>mdi-file-document</v-icon><p>{{item.name}}</p>
      </a>
    </div>
    <div class="folder-contents__content folder-contents__content--subfolder" v-for="(subfolder, i) in subfolders"
      :key="`subfolder-${i}`">
      <v-icon x-large>mdi-folder</v-icon>
      <nuxt-link :to="`/storage/${subfolder.path}`">{{subfolder.name}}</nuxt-link>
    </div>
    <div class="file-listing folder-contents__file-listing" v-for="(file, key) in uploadFilesArr" :key="`image-${key}`">
      <img class="file-listing__preview" v-bind:ref="'image'+parseInt(key)"
        v-if="file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif'" />
      <p v-else>{{file.name}}</p>
      <v-icon class="file-listing__remove-file" @click="removeFile(key)" tag="i" large>mdi-close-circle</v-icon>
    </div>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import axios from 'axios'
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Breadcrumbs from './Breadcrumbs.vue'
export default {
  components: {
    Breadcrumbs,
    ValidationProvider,
    ValidationObserver
  },
  name: "FolderContents",
  data: () => ({
    files: [],
    subfolders: [],
    uploadFilesArr: [],
    uploading: false,
    filesUploading: [],
    editing: false,
    filesToDelete:[],
    errorMessage: "",
    deleteDialog:false,
    fileMeta:[]
  }),
  props: ['path'],
  methods: {
    async getFolders() {
      var storageRef = this.$fire.storage.ref()
      var listRef = storageRef.child(this.path)
      listRef.listAll().then((res) => {
        res.prefixes.forEach((folderRef) => {
          var folderPath = folderRef.location.path_
          var subfolder = folderPath.substring(folderPath.lastIndexOf('/') + 1, folderPath.length)
          const folderObj = {
            path: folderPath,
            name: subfolder
          }
          this.subfolders.push(folderObj)
        })
        res.items.forEach((itemRef) => {
          var itemPath = itemRef.location.path_;
          storageRef.child(itemPath).getMetadata().then((metadata) => {
            this.metaFile.push(metadata)
          }).catch(err => {
            this.errorMessage = err
          })
          storageRef.child(itemPath).getDownloadURL().then((url) => {
            var fileName = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length)
            var fileType = itemPath.substring(itemPath.lastIndexOf('.'), itemPath.length)
            const fileObj = {
              name: fileName,
              url: url,
              type: fileType
            }
            this.files.push(fileObj)
          }).catch((err) => {
            this.errorMessage = err
          })
        })
      })
    },
    async filesChange(e) {
      const fileList = e.target.files
      if (!fileList.length) return

      const {
        valid
      } = await this.$refs.provider.validate(e);
      if (valid) {
        for (let i = 0; i < this.$refs.jobfiles.files.length; i++) {

          this.$refs.uploadError.innerHTML = ""
          var file = this.$refs.jobfiles.files[i]
          this.uploadFilesArr.push(file)

          this.getImagePreviews(this.uploadFilesArr)
        }
      }
    },
    async selectedFiles(e) {
      const fileList = e.target.value
      console.log("filelist:", fileList)
    },
    async deleteFiles(e) {
      var storageRef = this.$fire.storage.ref()
      
      this.filesToDelete.forEach((file, i) => {
        this.deleteDialog = false
        var fileRef = storageRef.child(`${this.path}/${file.name}`)
        fileRef.delete().then(() => {
          this.folders.splice(i, 1)
          this.filesToDelete = []
        }).catch((error) => {
          this.errorMessage = error
        })
      })
    },
    async downloadFiles() {
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      const getFile = url => {
        return new Promise((resolve, reject) => {
          this.$axios({
            url,
            responseType: "arraybuffer"
          }).then(res => {
            resolve(res.data)
          }).catch(err => {
            reject(err.toString())
          })
        })
      }
      this.files.forEach((file) => {
        const promise = getFile(file.url).then(data => {
          zip.file(file.name, data, {binary: true});
          cache[file.name] = data;
        });
        promises.push(promise);
      });
     
      Promise.all(promises).then(() => {
        zip.generateAsync({ type:"blob" }).then(content => {
          saveAs(content, `${this.path}.zip`)
        })
      })
    },
    getImagePreviews(filesarr) {
      for (let i = 0; i < filesarr.length; i++) {
        if (/\.(jpe?g|png|gif)$/i.test(filesarr[i].name)) {
          const reader = new FileReader()
          console.log(reader)
          reader.addEventListener("load", () => {
            this.$refs['image' + parseInt(i)][0].src = reader.result;
          }, false);
          reader.readAsDataURL(filesarr[i])
        }
      }
    },
    uploadFiles() {
      this.uploadFilesArr.forEach((file) => {
        var storageRef = this.$fire.storage.ref()
        var uploadTask = storageRef.child(`${this.path}/${file.name}`).put(file)
        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress < 100) {
              this.uploading = true
            }
            if (progress == 100) {
              this.uploading = false
              this.uploadFilesArr = []
            }
          },
          (error) => {
            console.log(error.message)
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              var fileName = file.name.substring(0, file.name.lastIndexOf('.'))
              var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
              const fileObj = {
                name: fileName,
                url: url,
                type: fileType
              }
              this.filesUploading.push(fileObj)
              this.files.push(fileObj)
            })
          })
      })
    },
    removeFile(key) {
      this.uploadFilesArr.splice(key, 1);
      this.getImagePreviews(this.uploadFilesArr)
      this.$refs.jobfiles.value = null
    }
  },
  created() {
    this.getFolders()
  }
}
</script>
<style lang="scss">
.folder-contents {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(200px, 1fr));
  row-gap: 40px;
  column-gap: 40px;
  padding-top:20px;

  &__file-listing {
      max-width:100%;
  }

  &__content {
    height: 162px;
    position: relative;

    p {
        word-break:break-word;
    }

    &--image {
      max-width: 240px;
    }

    &--file {
      display: flex;
      flex-direction: column;
      position: absolute;
      bottom: 0;
      width: 100%;
      text-align: center;
    }
    &--checkbox {
      width:100%;
    }
  }
}
.upload-area {
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  &--error {
    color:$color-white;
  }
}
</style>