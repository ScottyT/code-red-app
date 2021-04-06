<template>
    <div class="form-wrapper">
        <h1>{{formname}}</h1>
        <lazy-signature-pad-modal :sigData="sketchData" />
    </div>
</template>
<script>
export default {
    name: "SketchForms",
    props: ['formname'],
    data() {
        return {
            sketchData: {
                data: '',
                isEmpty: true
            }
        }
    }
}
</script>