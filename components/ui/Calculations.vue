<template>
    <div class="form__form-group calculations">
        <div class="form__form-group--left-side" v-if="useClassFactor">
            <i class="form__select--icon icon--angle-down mdi" aria-label="icon"></i>
            <select class="form__input" v-model="selectedClass">
                <option disabled :value="{}" selected>Pick a class</option>
                <option v-for="(factor, i) in classFactors" :key="`class-${i}`" :value="factor">
                    {{factor.type}}
                </option>
            </select>
        </div>
        <div class="form__form-group--right-side" v-if="useClassFactor">
            <i class="form__select--icon icon--angle-down mdi" aria-label="icon"></i>
            <select class="form__input" v-model="selectedDehuType">
                <option disabled value="">Pick Dehumidifier Type</option>
                <option v-for="(deHu, i) in deHuTypes" :key="`dehu-${i}`" :value="deHu.value" :disabled="selectedClass.type === 'Class 4' && deHu.value === 'conventional'">
                    {{deHu.label}}
                </option>
            </select>
        </div>
        <div class="form__form-group--inline calculations__inputs align-center">
            <div class="form__input-group calculations__input">
                <label class="form__label">Length</label>
                <input id="length" type="number" placeholder="length" class="form__input form__input--short" v-model="length" />
            </div> X
            <div class="form__input-group calculations__input">
                <label class="form__label">Width</label>
                <input id="width" type="number" class="form__input form__input--short" placeholder="width" v-model="width" /> 
            </div> X
            
            <div class="form__input-group calculations__input" >
                
                <label class="form__label">Height</label>
                <input id="height" type="number" placeholder="height" class="form__input form__input--short" v-model="height" v-if="useCubicft" />
                <input type="number" v-model="volume" v-if="useSqft" />
            </div>
        </div>
        <div class="form__form-group--inline calculations__inputs align-center">
            <label class="form__label">{{selectedDehuType === 'desiccant' ? 'Total CFM' : 'Total PPD'}}</label>
            <span>{{cubicFootage}}</span><span class="mr-2 ml-2">/</span><span>{{chartFactor}} <span v-if="selectedDehuType === 'desiccant'"> ACH</span></span>
            <span class="mr-2 ml-2">=</span><span>{{selectedDehuType === 'desiccant' ? totalCFM : totalPPD}}</span><span class="mr-2 ml-2">X</span>
            <div class="form__input-group calculations__input">
                <label class="form__label">AHAM Rating</label>
                <input type="number" class="form__input" v-model="AHAMrating" />
            </div>          
            <span class="mr-2 ml-2">=</span> <span>{{numberOfDehus}} Dehumidifier(s)</span>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, computed, reactive, toRefs, watch } from '@nuxtjs/composition-api'

export default defineComponent({
    props: {
        useClassFactor: Boolean,
        useSqft: Boolean,
        useCubicft: Boolean
    },
    setup(props, { refs }) {
        const selectedClass = ref({})
        const selectedDehuType = ref("")
        const state = reactive({
            length: 0,
            width: 0,
            height: 0,
            chartFactor: 0,
            AHAMrating: 110,
            volume: 0 / 12
        })
        
        const classFactors = ref([
            {
                type: "Class 1",
                conventional: "100",
                lgr: 100,
                desiccant: 1
            },
            {
                type: "Class 2",
                conventional: "40",
                lgr: 50,
                desiccant: 2
            },
            {
                type: "Class 3",
                conventional: "30",
                lgr: 40,
                desiccant: 3
            },
            {
                type: "Class 4",
                conventional: 0,
                lgr: 40,
                desiccant: 3
            }
        ])
        const deHuTypes = ref([
            {
                label: "Conventional Refrigerant",
                value: "conventional",
                disabled: false
            },
            {
                label: "Low Grain Refrigerant",
                value: "lgr",
                disabled: false
            },
            {
                label: "Desiccant",
                value: "desiccant",
                disabled: false
            }
        ])
        const cubicFootage = computed(() => {
            return state.length * state.width * state.height
        })
        const totalPPD = computed(() => {
            return cubicFootage.value / state.chartFactor
        })
        const totalCFM = computed(() => {
            return cubicFootage.value * (state.chartFactor / 60)
        })

        const numberOfDehus = computed(() => {
            if (selectedDehuType.value === 'desiccant') {
                return Math.ceil(totalCFM.value / state.AHAMrating)
            }
            return Math.ceil(totalPPD.value / state.AHAMrating)
        })

        watch(selectedDehuType, (val) => {
            state.chartFactor = selectedClass.value[val]
        })
        watch(selectedClass, (val) => {
            if (Object.keys(selectedClass.value).length !== 0) {
                state.chartFactor = val[selectedDehuType.value]
            }
        })
        
        
        return {
            selectedClass,
            selectedDehuType,
            classFactors,
            deHuTypes,
            cubicFootage,
            totalPPD,
            totalCFM,
            numberOfDehus,
            ...toRefs(state)
        }
    },
})
</script>
<style lang="scss">
.calculations {
    max-width:800px;
    justify-content: space-between;
    position:relative;
    
    &__inputs {
        input[type=number] {
            width:90px;            
        }
    }
    &__input {
        padding:5px 5px 5px 0;
        &:not(:first-child) {
            margin:0 10px;
        }
        &:first-child {
            input[type=number] {
                margin-right:10px;
            }
        }
    }
}
</style>