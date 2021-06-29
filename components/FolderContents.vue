<template>
  <div class="folder-contents">
    <div class="upload-area">
      <ValidationProvider ref="provider" rules="ext:doc,pdf,xlsx,docx,jpg,png,gif,jpeg" name="Upload"
        v-slot="{ validate, errors }">
        <UiFilesUpload :singleImage="false" :subDir="subPath" :jobId="path" :inlinePreviews="false" @sendDownloadUrl="files.push($event)" @sendImages="filePreviews($event)" />
        <input type="hidden" v-model="uploadFilesArr" @click="validate" />
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
      <a :href="item.url" target="_blank" v-if="item.type === '.jpg' || item.type === '.jpeg' || item.type === '.png' || item.type === '.gif'">
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
      <img class="file-listing__preview" v-bind:ref="'image'+parseInt(key)" />
      <v-icon class="file-listing__remove-file" @click="removeFile(key)" tag="i" large>mdi-close-circle</v-icon>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import JSZip from "jszip";
import { saveAs } from "file-saver";
export default {
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
  props: ['path', 'subPath'],
  methods: {
    async getFolders() {
      var storageRef = this.$fire.storage.ref()
      var listRef = storageRef.child(`${this.path}/${this.subPath}`)
      listRef.listAll().then((res) => {
        res.prefixes.forEach((folderRef) => {
          var folderPath = folderRef.fullPath
          var subfolder = folderPath.substring(folderPath.lastIndexOf('/') + 1, folderPath.length)
          const folderObj = {
            path: folderPath,
            name: subfolder
          }
          this.subfolders.push(folderObj)
        })
        res.items.forEach((itemRef) => {
          var itemPath = itemRef.fullPath
          storageRef.child(itemPath).getMetadata().then((metadata) => {
            this.fileMeta.push(metadata)
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
    async selectedFiles(e) {
      const fileList = e.target.value
    },
    async deleteFiles(e) {
      var storageRef = this.$fire.storage.ref()
      
      this.filesToDelete.forEach((file, i) => {
        this.deleteDialog = false
        var fileRef = storageRef.child(`${this.path}/${this.subPath}/${file.name}`)
        var fileIndex = this.files.findIndex(x => x.name === file.name)
        this.files.splice(fileIndex, 1)
        fileRef.delete().then(() => {         
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
    filePreviews(images) {
      this.uploadFilesArr = images
      for (let i = 0; i < images.length; i++) {
        if (/\.(jpe?g|png|gif)$/i.test(images[i].name)) {
          const reader = new FileReader()
          reader.addEventListener("load", () => {
            this.$refs['image' + parseInt(i)][0].src = reader.result;
          }, false);
          reader.readAsDataURL(images[i])
        }
      }
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
    position: relative;

    a {
      height:200px;
      display:block;
    }

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