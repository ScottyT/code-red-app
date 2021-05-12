<template>
    <p v-if="$fetchState.pending">Fetching content...</p>
    <div v-else class="pdf-content" slot="pdf-content">
        <section class="pdf-item">
            <h1 class="text-center">{{company}}</h1>
            <h2 class="text-center">{{formName}}</h2>
            <h2 v-show="updateMessage !== ''">{{updateMessage}}</h2>
            
            <div class="pdf-item__row" style="margin-bottom:10px;">
                <div class="pdf-item__inline">
                    <label>Job ID: </label>
                    <span>{{report.JobId}}</span>
                </div>
                <div class="pdf-item__inline" v-if="report.formType === 'moisture-map'">
                    <label>Initial Eval Date: </label>
                    <span>{{report.initialEvalDate}}</span>
                </div>
                <div class="pdf-item__inline" v-if="report.formType !== 'moisture-map'">
                    <label>Initial Start Date: </label>
                    <span>{{report.startDate}}</span>
                </div>
                <div class="pdf-item__inline" v-if="report.formType !== 'moisture-map'">
                    <label>End Date: </label>
                    <span>{{report.endDate}}</span>
                </div>
                <div class="pdf-item__inline address-box" v-if="report.hasOwnProperty('location')">
                    <div class="pdf-item__data">
                        <label>Address:</label>
                        <span>{{report.location.address}}</span>
                    </div>
                    <div class="pdf-item__data">
                        <label>City, State, Zip:</label>
                        <span>{{report.location.cityStateZip}}</span>
                    </div>
                </div>
            </div>
            <div class="pdf-item__row" v-if="report.notes !== undefined">
                <label>Notes: </label>
                <div class="pdf-item__textbox">{{report.notes}}</div>
            </div>
            <div class="pdf-item__table moisture-data" v-if="report.formType === 'moisture-map'">
                <div class="pdf-item__table moisture-data--rows">
                    <div class="pdf-item__table moisture-data--cols">
                        <div>DATE:</div>
                    </div>                   
                    <div class="pdf-item__table moisture-data--cols" v-for="n in areaCols" :key="n">
                        <label class="form__label">Area {{n}}</label>
                    </div>
                </div>
                <div class="pdf-item__table moisture-data--rows" v-for="(row, i) in report.readingsRow" :key="`row-${i}`">
                    <div class="moisture-data--cols">
                        <input type="text" v-mask="'##/##/####'" v-model="row.date" class="form__input" />
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaA" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaB" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaC" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaD" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaE" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaF" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaG" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaH" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaI" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaSub1" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaSub2" class="form__input" /></span>%
                    </div>
                    <div class="moisture-data--cols">
                        <span class="number-input"><input type="text" maxlength="3" v-model="row.areaSub3" class="form__input" /></span>%
                    </div>
                </div>
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
                        <input type="number" class="pdf-item__table--data" :readonly="report.quantityData[i].day[j].value !== '' ? true : false"
                            v-model="newdata.quantityData[i].day[j].value" />
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.checkData" :key="`checkbox-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`checkbox-col-${j}`">
                        <input type="checkbox" class="pdf-item__table--data" :readonly="report.checkData[i].day[j].value !== '' ? true : false"
                            v-model="newdata.checkData[i].day[j].value" />
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.categoryData" :key="`category-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`category-col-${j}`">
                        <input type="text" class="pdf-item__table--data" :readonly="report.categoryData[i].day[j].value !== '' ? true : false"
                            v-model="newdata.categoryData[i].day[j].value" />
                    </div>
                </div>
            </div>
            <div class="pdf-item__table logs-pdf" v-if="report.formType === 'atmospheric-readings'">
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
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.readingsLog" :key="`row-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`cols-${j}`">
                        <input type="text" class="pdf-item__table--data" :readonly="report.readingsLog[i].day[j].value !== '' ? true : false"
                            v-model="newdata.readingsLog[i].day[j].value" />
                    </div>
                </div>
                
                <span v-if="report.formType === 'atmospheric-readings'" class="loss-classification">
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
                        <input type="text" class="pdf-item__table--data" :readonly="report.lossClassification[i].day[j].value !== '' ? true : false" 
                            v-model="newdata.lossClassification[i].day[j].value" />
                    </div>
                </div>
                </span>
            </div>           
        </section>
        <v-btn class="button mt-4" @click="updateReport" v-show="$route.name == 'saved-reports-formType-id'">Update</v-btn>
    </div>
</template>
<script>
export default {
    props: ['formType', 'formName', 'reportType', 'report', 'company'],
    data() {
        return {
            editing: false,
            updateMessage: '',
            newdata: {},
            updated: false,
            errorMessage: "",
            areaCols: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "SUB-1", "SUB-2", "SUB-3"],
        }
    },
    async fetch() {
        this.newdata = await this.$axios.$get(`/api/logs-report/${this.formType}/${this.report.JobId}`)
    },
    methods: {
        updateReport() {
            // use indexDb for offline support here
            this.$axios.$post(`/api/logs-report/${this.formType}/${this.report.JobId}/update`, this.newdata).then((res) => {
                if (res.errors) {
                    this.errorMessage = res.errors
                    return;                
                }
                this.updateMessage = res.message
                setTimeout(() => {
                    this.updateMessage = ""
                    this.$router.push("/saved-reports")
                }, 5000)
            })
        }
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
        grid-template-rows:repeat(13, 23px);
        padding:10px;
        background-color:$color-white;
        color:$color-black;
    }
    .inventory-logs {
        grid-template-rows:repeat(40, 23px);
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
            grid-template-rows:23px;
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
        &.moisture-data {
            background:$color-white;
            color:$color-black;
            
            &--rows {
                grid-template-columns:130px repeat(12, 1fr);
            }
        }
    }
}
.pdf-sig {
    
}
.number-input {
    display:inline-block;
    
    width:36px;
    input[type=text] {
        padding:2px 4px;
    }
}
</style>