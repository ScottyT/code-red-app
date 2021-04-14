<template>
    <div class="pdf-content" slot="pdf-content">
        <section class="pdf-item">
            <h1 class="text-center">{{company}}</h1>
            <h2 class="text-center">{{formName}}</h2>
            <div class="pdf-item__row">
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
        </section>
        <section class="pdf-item" style="margin-top:40px;">
            <div class="pdf-item__table inventory-logs" v-if="report.formType === 'quantity-inventory-logs'">
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <div>Description</div>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="n">
                        <div>Day {{n}}</div>
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.inventoryLog" :key="`inventory-${i}`">
                    <div class="pdf-item__table--cols">
                        <label>{{row.text}}</label>
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`inventory-col-${j}`">
                        <p class="pdf-item__table--data">{{col.value}}</p>
                    </div>
                </div>
            </div>
            <div class="pdf-item__table logs-pdf" v-else>
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <div>Description</div>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="n">
                        <div>Day {{n}}</div>
                    </div>
                </div>
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.readingsLog" :key="`row-${i}`">
                    <div class="pdf-item__table--cols">
                        {{row.text}}
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`cols-${j}`">
                        <span>{{col.value}}</span>
                    </div>
                </div>
                
                <span v-if="report.formType === 'atmospheric-readings'" class="loss-classification">
                <div class="pdf-item__table pdf-item__table--rows">
                    <div class="pdf-item__table--cols">
                        <div>Loss Classification</div>
                    </div>
                    <div class="pdf-item__table--cols" v-for="n in 7" :key="n">
                        <div>4</div>
                    </div>
                </div>
                
                <div class="pdf-item__table pdf-item__table--rows" v-for="(row, i) in report.lossClassification" :key="`loss-${i}`">
                    <div class="pdf-item__table--cols">
                        {{row.text}}
                    </div>
                    <div class="pdf-item__table--cols" v-for="(col, j) in row.day" :key="`loss-cols-${j}`">
                        <p>{{col.value}}</p>
                    </div>
                </div>
                </span>
            </div>
        </section>
    </div>
</template>
<script>
export default {
    name: "LogsPdf",
    props: ['formType', 'formName', 'reportType', 'report', 'company'],
    
}
</script>
<style lang="scss" scoped>
.pdf-content {
    margin:auto;
    max-width:800px;
    width:100%;
}
.pdf-item {
    position:relative;
    .text-center {
        text-align:center;
    }
    .logs-pdf {
        grid-template-rows:40px repeat(13, 1fr);
    }
    .inventory-logs {
        grid-template-rows:repeat(40, 25px);
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
        padding:5px;
        width:100%;
    }
    &__table {
        display:grid;
        &--rows {
            grid-template-columns:1.8fr repeat(7, 1fr);
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
        }
    }
}
.pdf-sig {
    
}
</style>