<template>
  <!-- This will be used for storing forms saved in offline mode -->
  <div>
    <span v-if="!authUser"><login-form /></span>
    <div class="profile" v-else>
      <div class="profile__title">
        <h1 class="text-center">Saved Forms</h1>
        <h2 v-show="message">{{message}}</h2>
      </div>
      <!-- <ul v-if="$store.state.indexDb.reports.length > 0">
        <li v-for="(report, i) in $store.state.indexDb.reports" :key="i">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report, i)" class="button button--normal">Submit</button>
        </li>
      </ul> -->
      <ul class="profile__group">
        <h3>Dispatch and Rapid Response Reports</h3>
        <li v-for="(report, i) in defaultReports" :key="`default-reports-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report, i)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group">
        <h3>Containment Reports</h3>
        <li v-for="(report, i) in containmentReps" :key="`containment-reps-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.CaseFileType : null}}</span> <button type="submit"
            @click="submitForm(report, i)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group">
        <h3>Credit Card Reports</h3>
        <li v-for="(report, i) in creditCardReps" :key="`credit-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report, i)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group">
        <h3>Certificate of Completion Reports</h3>
        <li v-for="(report, i) in cocReports" :key="`coc-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report, i)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group">
        <h3>AOB Mitigation Contract</h3>
        <li v-for="(report, i) in aobReports" :key="`coc-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report, i)" class="button button--normal">Submit</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {
    mapGetters,
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
        authUser: false
      }
    },
    computed: {
      ...mapGetters({
        isLoggedIn: 'isLoggedIn',
        getSavedReports: 'indexDb/getSavedReports'
      }),
      containmentReps() {
        return this.getSavedReports.filter((v) => {
          return v.CaseFileType == 'containment'
        })
      },
      technicianReps() {
        return this.getSavedReports.filter((v) => {
          return v.CaseFileType == 'technician'
        })
      },
      defaultReports() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType == 'dispatch' || v.ReportType == 'rapid-response'
        })
      },
      creditCardReps() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType == 'credit-card'
        })
      },
      cocReports() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType == 'coc'
        })
      },
      aobReports() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType == 'aob'
        })
      }
    },
    mounted() {
      this.checkStorage()
      this.$nextTick(() => {
        this.authUser = this.$fire.auth.currentUser ? true : false
      })
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
          this.$axios.$post(`/api/${post.ReportType}/new`, post).then((res) => {
            if (post.ReportType == 'rapid-response') {
              Object.keys(post).forEach(k => {
                if (k == "photoId") {                 
                    this.submitFiles(post, post.photoId, "Photo ID")
                }
                if (k == "jobFiles") {
                    this.submitFiles(post, post.jobFiles, "Job files")
                }
              })
            }
            if (post.ReportType == 'credit-card') {
              this.submitFiles(post, post.cardImages, "Card Images")
            }
            this.message = res.message
            setTimeout(() => {
              this.message = ""
            }, 2000)
            this.deleteReport(post)
          })            
        } catch (e) {
          this.message = e
        }
        
      },
      async submitFiles(report, uploadarr, element) {
        const today = new Date()
        const date = (today.getMonth() + 1)+'-'+today.getDay()+'-'+today.getFullYear();
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
                  uploadarr = []
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
    }
  }
</script>
<style lang="scss">
.profile {
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  grid-template-rows:100px 1fr;
  &__title {
    grid-column:1/4;
  }
  &__group {
    li {
      padding-bottom:10px;
    }
  }
}
</style>