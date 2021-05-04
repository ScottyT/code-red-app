<template>
    <div class="pdf-content">
        <v-dialog class="modal" v-model="alertDialog" width="500">
            <div class="modal__content">
                <p>You are about to fully submit this report. Doing this will delete it from the saved reports area. Are you sure you want to continue?</p>
            </div>
            <div class="modal__footer">
                <v-btn class="button--normal" text @click="alertDialog = false">Yes, continue</v-btn>
                <v-btn class="button--normal" text @click="alertDialog = false">No</v-btn>
            </div>
        </v-dialog>
        <p v-if="$fetchState.pending">Fetching content...</p>
        <section class="pdf-item" v-else>
            <LazyBreadcrumbs page="saved-reports" />
            <h1 class="text-center">{{company}}</h1>
            <h2 class="text-center">{{formName}}</h2>
            
            <div class="pdf-item__row" style="margin-bottom:10px;">
                <div class="pdf-item__inline">
                    <label>Job ID: </label>
                    <span>{{report.JobId}}</span>
                </div>
                <div class="pdf-item__inline">
                    <label>Initial Start Date: </label>
                    <span>{{report.startDate}}</span>
                </div>
                <div class="pdf-item__inline">
                    <label>End Date: </label>
                    <span>{{report.endDate}}</span>
                </div>
            </div>
            <div class="pdf-item__row" v-if="report.notes !== undefined">
                <label>Notes: </label>
                <div class="pdf-item__textbox">{{report.notes}}</div>
            </div>
            <div class="pdf-item__table inventory-logs" v-if="report.formType === 'quantity-inventory-logs'">
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <div>Description</div>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="n">
                        <p class="pdf-item__table--data-heading">Day {{n}}</p>
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <label>Tech ID #</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="`techids-col-${n}`">
                        <input type="number" class="pdf-item__table--data" readonly v-model="report.teamMember.id" />
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.quantityData" :key="`unitquanitity-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`unit-col-${j}`">
                        <input type="number" class="pdf-item__table--data"
                            v-model="report.quantityData[i].day[j].value" />
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.checkData" :key="`checkbox-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`checkbox-col-${j}`">
                        <input type="checkbox" class="pdf-item__table--data" 
                            v-model="report.checkData[i].day[j].value" />
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.categoryData" :key="`category-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`category-col-${j}`">
                        <input type="text" class="pdf-item__table--data" 
                            v-model="report.categoryData[i].day[j].value" />
                    </div>
                </div>
            </div>
            <div class="pdf-item__table logs-pdf" v-else>
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <div>Description</div>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="n">
                        <p class="pdf-item__table--data-heading">Day {{n}}</p>
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <label>Tech ID #</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="`techids-col-${n}`">
                        <input type="number" class="pdf-item__table--data" v-model="$store.state.user.id" readonly />
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.readingsLog" :key="`row-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`cols-${j}`">
                        <input type="text" class="pdf-item__table--data" 
                            v-model="report.readingsLog[i].day[j].value" />
                    </div>
                </div>
                              
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <div>Loss Classification</div>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="n">
                        <p class="pdf-item__table--data-heading">4</p>
                    </div>
                </div>
                
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.lossClassification" :key="`loss-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`loss-cols-${j}`">
                        <input type="number" class="pdf-item__table--data"
                            v-model="report.lossClassification[i].day[j].value" />
                    </div>
                </div>
            </div>
        </section>
        <v-btn class="button mt-4" @click="updateReport">Update</v-btn>
        <!-- <v-btn class="button mt-4" @click="submitReport" v-if="$nuxt.isOnline">Update</v-btn> -->
        
        <v-btn class="button mt-4" @click="submitReport" >Submit</v-btn>
        <h2 v-show="updateMessage !== ''">{{updateMessage}}</h2>
        <h2 v-show="errorMessage !== ''">{{errorMessage}}</h2>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    name: "SavedLogReports",
    props: ['formName', 'formType','report', 'reportType', 'company'],
    data() {
        return {
            updateMessage: "",
            errorMessage: "",
            savedreport: {},
            alertDialog: false,
            newreport: false,
            //rep: {}
        }
    },
    computed: {
        ...mapGetters({
            savedReports: 'indexDb/getSavedReports',
            getReports: 'getReports',
        }),
        showSubmit() {
            return this.$nuxt.isOnline && this.currentDate === this.savedreport.endDate
        },
        /* savedreport() {
            var logReports = this.getReports.filter((v) => {
                return v.ReportType === 'logs-report'
            })
            return logReports.filter((v) => {
                return v.formType === this.$route.params.formType && v.JobId === this.$route.params.id
            })
        }, */
        currentDate() {
            var date = new Date().toISOString().substr(0, 10)
            return this.formatDate(date)
        },
        isOnline() {
            return this.$nuxt.isOnline
        }
    },
    async fetch() {
        await this.$axios.$get(`/api/logs-report/${this.$route.params.formType}/${this.$route.params.id}`).then((res) => {
            if (res.error) {
                this.newreport = true
                this.savedreport = this.savedReports.find((v) => {
                    return v.formType === this.$route.params.formType && v.JobId === this.$route.params.id
                })
                return
            }
            this.savedreport = res
            this.newreport = false
        }).catch((err) => {
            this.savedreport = this.savedReports.find((v) => {
                return v.formType === this.$route.params.formType && v.JobId === this.$route.params.id
            })
        })
    },
    methods: {
        ...mapActions({
            addReport: 'indexDb/addReport',
            deleteRep: 'indexDb/deleteReport',
            checkStorage: 'indexDb/checkStorage'
        }),
        submitReport() {
            this.alertDialog = !this.alertDialog
            this.$axios.$post(`/api/logs-report/${this.formType}/${this.report.JobId}/update`, this.report).then((res) => {
                if (res.errors) {
                    this.errorMessage = res.errors
                    return;                
                }
                this.updateMessage = res.message
                setTimeout(() => {
                    this.updateMessage = ""
                    this.deleteRep(this.report)
                    this.$router.push("/saved-reports")
                }, 5000)
            })          
        },
        updateReport() {
            try {
                this.addReport(this.report).then(() => {
                    if (this.$nuxt.isOnline && this.newreport) {
                        this.$axios.$post(`/api/logs-report/new`, this.report).then((res) => {
                            if (res.errors) {
                                this.errorMessage = res.errors
                                return;                
                            }
                            this.updateMessage = res.message
                        })
                    } else {
                        this.$axios.$post(`/api/logs-report/${this.formType}/${this.report.JobId}/update`, this.report).then((res) => {
                            if (res.errors) {
                                this.errorMessage = res.errors
                                return;                
                            }
                            this.updateMessage = res.message
                        })
                    }
                    this.updateMessage = "Form was updated successfully"           
                    setTimeout(() => {
                        this.$router.go(-1)
                        this.updateMessage = ""
                    }, 2000)
                })
                
            } catch (e) {
                this.errorMessage = e
            }
        },
        formatDate(dateReturned) {
            if (!dateReturned) return null
            const [year, month, day] = dateReturned.split('-')
            return `${month}/${day}/${year}`
        }
    },
    mounted() {
        this.checkStorage()
    }
}
</script>
<style lang="scss" scoped>
.pdf-content {
    margin:auto;
    max-width:870px;
    width:100%;
}
.pdf-item {
    position:relative;
    .text-center {
        text-align:center;
    }
    .logs-pdf {
        grid-template-rows:repeat(18, 1fr);
        padding:10px;
        background-color:$color-white;
        color:$color-black;
    }
    .inventory-logs {
        grid-template-rows:repeat(40, 1fr);
        padding:10px;
        background-color:$color-white;
        color:$color-black;
    }
    &__company-logo {
        width:100px;        
        margin:0 auto;
    }
    &__inline {
        display:inline-block;
    }
    &__row {
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        margin-top:20px;
    }
    &__textbox {
        height:150px;
        width:100%;
        padding-left:7px;
    }
    &__table {
        display:grid;
        &--rows {
            grid-template-columns:1.8fr repeat(7, 1fr);
            grid-template-rows:35px;
            width:100%;
            &:not(:first-child) {
                .pdf-item__table--cols {
                    border-bottom:1px solid;
                    border-top:1px solid;
                }
            }
        }
        &--cols {
            border-color:black;
            border-top:2px solid;
            border-bottom:1px solid;
            label {
                padding:2px;
                display:inline-block;
                font-size:.8em;
            }
            &:not(:first-child) {
                border-right:1px solid;
            }
            &:not(:last-child) {
                border-left:1px solid;
            }
            &:first-child {
                border-left:2px solid;
                border-right:1px solid;
            }
            &:last-child {
                border-left:1px solid;
                border-right:2px solid;
            }
        }
        &--data {
            text-align:center;
            display:block;
            width:100%;
            height:100%;
        }
        &--data-heading {
            text-align:center;
        }
    }
}
.pdf-sig {
    
}
</style>