<template>
  <!-- This will be used for storing forms saved in offline mode -->
  <!-- Might refactor later -->
  <div>
    <div class="profile">
      <div class="profile__title">
        <h1 class="text-center">Saved Forms</h1>
        <h2 v-show="message">{{message}}</h2>
      </div>
      <ul class="profile__group" v-if="defaultReports.length > 0">
        <h3>Dispatch and Rapid Response Reports</h3>
        <li v-for="(report, i) in defaultReports" :key="`default-reports-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group" v-if="containmentReps.length > 0">
        <h3>Containment Reports</h3>
        <li v-for="(report, i) in containmentReps" :key="`containment-reps-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.CaseFileType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group" v-if="creditCardReps.length > 0">
        <h3>Credit Card Reports</h3>
        <li v-for="(report, i) in creditCardReps" :key="`credit-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group" v-if="cocReports.length > 0">
        <h3>Certificate of Completion Reports</h3>
        <li v-for="(report, i) in cocReports" :key="`coc-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group" v-if="aobReports.length > 0">
        <h3>AOB Mitigation Contract</h3>
        <li v-for="(report, i) in aobReports" :key="`aob-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group" v-if="sketchReports.length > 0">
        <h3>Sketch Reports</h3>
        <li v-for="(report, i) in sketchReports" :key="`sketch-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group" v-if="chartReports.length > 0">
        <h3>Chart Reports</h3>
        <li v-for="(report, i) in chartReports" :key="`chart-${i}`">
          {{report ? report.JobId : null}} / <span class="text-capitalize">{{report ? report.ReportType : null}}</span> <button type="submit"
            @click="submitForm(report)" class="button button--normal">Submit</button>
        </li>
      </ul>
      <ul class="profile__group block-group" v-if="logReports.length > 0">
        <h3>Logs</h3>
        <div class="block-group--grid">
          <li v-for="(report, i) in logReports" :key="`logs-${i}`" class="reports-wrapper__data block-group__col" :class="!report.hasOwnProperty('key') && $nuxt.isOffline ? 'hidden' : 'show'">
            <nuxt-link :to="`/profile/${report.formType}/${report.JobId}`" :class="{ disabled: !report.hasOwnProperty('key') && $nuxt.isOffline }">
              <p>{{report.JobId}}</p>
              <p>{{report.formType}}</p>
            </nuxt-link>
          </li>
        </div>       
      </ul>
      <ul class="profile__group block-group" v-if="moistureMaps.length > 0">
        <h3>Moisture Maps</h3>
        <div class="block-group--grid">
          <li v-for="(report, i) in moistureMaps" :key="`logs-${i}`" class="reports-wrapper__data block-group__col" :class="!report.hasOwnProperty('key') && $nuxt.isOffline ? 'hidden' : 'show'">
            <nuxt-link :to="`/profile/${report.formType}/${report.JobId}`" :class="{ disabled: !report.hasOwnProperty('key') && $nuxt.isOffline }">
              <p>{{report.JobId}}</p>
              <p>{{report.formType}}</p>
            </nuxt-link>
          </li>
        </div>       
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
    head() {
      return {
        title: "Profile"
      }
    },
    data() {
      return {
        savedReports: [],
        message: "",
        employees: [],
        filesUploading: []
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
      },
      sketchReports() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType == 'sketch-report'
        })
      },
      logReports() {
        var savedLogs = this.getSavedReports.filter((v) => {
          return v.ReportType == 'logs-report'
        })
        var concatlogs = savedLogs.concat(this.$store.state.logreports)
        let checkKeyPresenceInArray = key => this.$store.state.logreports.some(obj => Object.keys(obj).includes(key));
        if (checkKeyPresenceInArray('_id') && this.$nuxt.isOnline) {
          const result = Array.from(new Set(concatlogs.map(s => s._id)))
            .map(id => {
              return {
                _id: id,
                JobId: concatlogs.find(s => s._id === id).JobId,
                formType: concatlogs.find(s => s._id === id).formType
              }
            });
            return result
        }
        return concatlogs
      },
      chartReports() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType === 'chart-report'
        })
      },
      moistureMaps() {
        return this.getSavedReports.filter((v) => {
          return v.ReportType === 'moisture-map'
        })
      },
      isOnline() {
        return this.$nuxt.isOnline
      }
    },
    watch: {
      isOnline(val) {
        if (val) {
          this.fetchLogs(this.$fire.auth.currentUser)
        } else {
          this.checkStorage()
        }
      }
    },
    mounted() {
      this.checkStorage()
      this.fetchLogs(this.$fire.auth.currentUser)
    },
    methods: {
      ...mapActions({
        checkStorage: 'indexDb/checkStorage',
        deleteReport: 'indexDb/deleteReport',
        fetchLogs: 'fetchLogs'
      }),
      submitForm(post) {
         try {           
          this.$axios.$post(`/api/${post.ReportType}/new`, post).then((res) => {
            if (res.errors) {
              this.message = "Something went wrong"
              return;
            }
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
            this.fetchReports()
          })         
        } catch (e) {
          this.message = e
        }        
      },
      submitFiles(report, uploadarr, element) {
        const today = new Date()
        const date = (today.getMonth() + 1)+'-'+today.getDay()+'-'+today.getFullYear();
        uploadarr.forEach((file) => {
            var storageRef = this.$fire.storage.ref()
            
            switch (element) {
              case "Job files":
                var uploadRef = storageRef.child(`${report.JobId}/${date}/${file.name}`)
                var uploadTask = uploadRef.put(file)
                break;
              case "Card Images":
                var uploadRef = storageRef.child(`${report.cardNumber}/${file.name}`)
                var uploadTask = uploadRef.put(file)
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
    margin-bottom:10px;
    li {
      padding-bottom:10px;
    }
  }
}
</style>