<template>
  <!-- This will be used for storing forms saved in offline mode -->
  <div class="profile">
    <h1 v-show="message">{{message}}</h1>
    <ul v-if="$store.state.indexDb.reports.length > 0">
      <li v-for="(report, i) in savedReports" :key="i">
        {{report ? report.JobId : null}} / {{report ? report.ReportType : null}} <button type="submit" @click="submitForm(report, i)" class="button button--normal">Submit</button>
      </li>
    </ul>
    <ul v-if="$store.state.indexDb.reports.length < 0">
      <li v-for="(report, i) in savedReports" :key="i">
        {{report ? report.JobId : null}} / {{report ? report.ReportType : null}} <button type="submit" @click="submitForm(report, i)" class="button button--normal">Submit</button>
      </li>
    </ul>
  </div>
</template>
<script>
  import {
    mapActions,
    mapMutations
  } from 'vuex';
  export default {
    name: "profile",
    data() {
      return {
        savedReports: [],
        message: "",
        employees: [],
        filesUploading: [],
      }
    },
    mounted() {
      this.checkStorage()
      this.savedReports = this.$store.state.indexDb.reports
    },
    async asyncData({
      $axios
    }) {
      try {
        let data = await $axios.$get("/api/employees");
        return {
          employees: data
        }
      } catch (e) {
        console.log("something happened:", e)
      }
    },
    async asyncData({$axios}) {
        try {
            let data = await $axios.$get("/api/employees");
            return { employees: data}
        } catch (e) {
            console.log("something happened:", e)
        }
    },
    methods: {
      ...mapActions({
        checkStorage: 'indexDb/checkStorage',
        deleteReport: 'indexDb/deleteReport'
      }),
      async submitForm(post, index) {
        try {
          await this.$axios.$post(`/api/${post.ReportType}/new`, post).then(() => {
            Object.keys(post).forEach(k => {
                if (k == "photoId") {                 
                    this.submitFiles(post, post.photoId, "Photo ID")
                }
                if (k == "jobFiles") {
                    this.submitFiles(post, post.jobFiles, "Job files")
                }
                if (k == "cardImages") {
                    this.submitFiles(post, post.cardImages, "Card Images")
                }
            })
            post.Pictures = this.filesUploading
            this.message = "Report submitted"
            setTimeout(() => {
              this.message = ""
            }, 2000)
            this.deleteReport(post, index)
          })
            
        } catch (e) {
          this.message = e
        }
      },
      submitFiles(report, uploadarr, element) {
        const today = new Date()
        const date = (today.getMonth() + 1)+'-'+today.getDay()+'-'+today.getFullYear();
        console.log("submitting files")
        uploadarr.forEach((file) => {
          var storageRef = this.$fire.storage.ref()
          
          switch (element) {
            case "Job files":
              var uploadRef = storageRef.child(`${report.JobId}/${date}/${file.name}`)
              var uploadTask = uploadRef.put(file)
              break;
            default:
              var uploadRef = storageRef.child(`${report.JobId}/${file.name}`)
              var uploadTask = uploadRef.put(file)
          }

          uploadTask.on('state_changed',
            (snapshot) => {
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (progress < 100) {
                this.message = "Files uploading"
              }
              if(progress == 100) {
                
              }
            },
            (error) => {
              console.log(error.message)
            },
            () => {
              uploadRef.getDownloadURL().then((url) => {
                var fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
                const fileObj = {
                  name: fileName,
                  url: url,
                  type: fileType
                }
                this.filesUploading.push(fileObj)
                this.message = "Files uploaded"
                setTimeout(() => {
                    this.message = ""
                }, 2000)
              })
            }
          )
        })
      }
    },
    created() {
        this.savedReports = this.$store.state.indexDb.reports
    }
  }
</script>