<template>
    <LazyLoginForm v-if="!authUser" />
    <div class="form-wrapper" v-else>
        <h1 class="text-center">Water Emergency Services Incorporated</h1>
        <h2 class="text-center">Psychrometric Charting</h2>
        <ValidationObserver v-slot="{passes}">
            <p class="font-weight-bold">{{submittedMessage}}</p>
            <h3 class="alert alert--error">{{errorMessage}}</h3>
            <form ref="form" class="form" @submit.prevent="passes(onSubmit)">
                <div class="form__form-group">
                    <ValidationProvider vid="JobId" v-slot="{errors, ariaMsg}" name="Job ID" class="form__input--input-group">
                        <input type="hidden" v-model="selectedJobId" />
                        <label class="form__label">Job ID:</label>
                        <select class="form__select" v-model="selectedJobId">
                            <option disabled value="">Please select a Job ID</option>
                            <option v-for="(item, i) in $store.state.jobids" :key="`jobids-${i}`">{{item}}</option>
                        </select>
                        <span class="form__input--error" v-bind="ariaMsg">{{ errors.msg }}</span>
                    </ValidationProvider>
                </div>
                <div class="form__form-group">
                    <LazyChartPad />
                    <!-- <img :src="bgimage" />
                    <canvas id="chart" width=800 height=700></canvas> -->
                    <!-- <VueSignaturePad id="charting" width="800px" height="700px" ref="chartPad" @load="onInit" :images="bgimage" :options="{ onBegin }" /> -->
                </div>               
            </form>
        </ValidationObserver>
    </div>
</template>
<script>

export default {
    data() {
        return {
            authUser:false,
            submittedMessage: "",
            errorMessage: "",
            selectedJobId: "",
            chartSketch: {
                isEmpty: true,
                data: null
            },
            bgimage: "https://images.prismic.io/wateremergencyservices-pwa/f4073fed-21fa-41f6-9bfe-4a37485a97cb_PsychrometricChartImage-1200x675.png?auto=compress,format"
        }
    },
    head() {
        return {
            title: "Psychrometric Charting"
        }
    },
    methods: {
        /* save() {
            const { isEmpty, data } = this.$refs.chartPad.saveSignature();
            this.chartSketch.data = data;
            this.chartSketch.isEmpty = isEmpty
        },
        onBegin() {
            
        },
        onInit() {
            console.log(this.$refs.chartPad.getPropImagesAndCacheImages())
        } */
    },
    mounted() {
        
        //this.$refs.chartPad.addImages(this.bgimage[0])
        this.$nextTick(() => {
            
            /* var signaturePad = new SignaturePad(document.getElementById('chart'), {
                backgroundColor: 'rgba(255, 255, 255, 0)',
                penColor: 'rgb(0, 0, 0)'
            }); */

            this.authUser = this.$fire.auth.currentUser ? true : false
        })
    }
}
</script>
<style lang="scss">
.chart {
    //max-width:1200px;
}
</style>