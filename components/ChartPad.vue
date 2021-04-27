<template>
    <div class="chart-wrapper">
        <span>
            <img class="chart-wrapper__bgimage" :src="bgimage" />
            <canvas id="chart" :width="$vuetify.breakpoint.width < 991 ? 780 : 920" height=540></canvas>
        </span>
        <v-btn class="button--normal" id="save">Save</v-btn>
    </div>
</template>
<script>
import SignaturePad from 'signature_pad'
export default {
    name: "ChartPad",
    data() {
        return {
            bgimage: "https://images.prismic.io/wateremergencyservices-pwa/f4073fed-21fa-41f6-9bfe-4a37485a97cb_PsychrometricChartImage-1200x675.png?auto=compress,format"
        }
    },
    mounted() {
        var canvas = document.getElementById('chart');
        //var ctx = canvas.getContext('2d');
        var signaturePad = new SignaturePad(canvas);
        signaturePad.penColor = "rgb(0, 0, 0)";
        signaturePad.maxWidth = 2;
        /* function resizeCanvas() {
            var ratio =  Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            
        }

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas(); */
        var saveButton = document.getElementById('save');
        saveButton.addEventListener('click', (event) => {
            var data = signaturePad.toDataURL('image/png')
            console.log(data)
        })
    }
}
</script>
<style lang="scss">
.chart-wrapper {
    display:flex;
    flex-direction: column;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width:100%;
    &__bgimage {
        position:absolute;
        top:0;
        left:0;
        object-fit:contain;
    }
    & > span {
        position:relative;
        width:100%;
        height:540px;
        max-width:780px;
        @include respond(tabletLarge) {
            max-width:920px;
        }
    }
}
#chart {
    height:540px;
    position:absolute;
    top:0;
    left:0;
}
</style>