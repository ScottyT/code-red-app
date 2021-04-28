<template>
    <div class="chart-wrapper">
        <!-- <span>
            
            <canvas id="chart" width=943 height=642></canvas>
        </span> -->
        <VueSignaturePad class="chart-wrapper__chart" :images="[bgimage]" ref="chart" width="100%" :height="$vuetify.breakpoint.width < 991 ? '657px':'642px'" :options="{onEnd}" />
        <div class="button-wrapper">
            <v-btn class="button--normal" id="save" @click="save">Save</v-btn>
            <v-btn class="button--normal" @click="draw" id="draw">Draw</v-btn>
            <v-btn class="button--normal" @click="erase" id="erase">Erase</v-btn>
        </div>
    </div>
</template>
<script>
import SignaturePad from 'signature_pad'
export default {
    name: "ChartPad",
    data() {
        return {
            bgimage: "https://images.prismic.io/wateremergencyservices-pwa/812c9310-c970-489b-a441-0243ff518aa6_messageImage_1619619411880.jpg?auto=compress,format",
            storedimage: {
                isEmpty: true,
                data: ""
            }
        }
    },
    methods: {
        onEnd() {
            const {isEmpty, data} = this.$refs.chart.saveSignature()
            this.storedimage.data = data
            this.storedimage.isEmpty = isEmpty
            console.log(this.storedimage.data)
        },
        onLoad() {
            var canvas = this.$refs.chart.$refs.signaturePadCanvas
            var ctx = canvas.getContext("2d")
            var img = new Image()
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            }
            
            img.crossOrigin = 'anonymous'
            img.src = this.bgimage
            console.log(this.$refs)
            //this.$refs.chart.addImages([this.bgimage])

        },
        save() {
            const {isEmpty, data} = this.$refs.chart.saveSignature()
            this.storedimage.data = data
            this.storedimage.isEmpty = isEmpty
        },
        erase() {        
            var canvas = this.$refs.chart.$refs.signaturePadCanvas
            var ctx = canvas.getContext("2d");
            ctx.lineWidth = 6
            ctx.globalCompositeOperation = 'destination-out';
        },
        draw() {
            var canvas = this.$refs.chart.$refs.signaturePadCanvas
            var ctx = canvas.getContext("2d");
            ctx.lineWidth = 1;
            ctx.globalCompositeOperation = 'source-over';
        },
        resizeHandler() {
            this.$refs.chart.fromDataURL(this.storedimage.data)
            this.$refs.chart.resizeCanvas()
            this.$nextTick(() => {
                //this.$refs.chart.signatureData = this.storedimage.data
                
            })
        }
    },
    /* created() {
        window.addEventListener("resize", this.resizeHandler)
    },*/
    destroyed() {
        window.removeEventListener("resize", this.resizeHandler)
    },
    mounted() {
        this.onLoad()
        window.addEventListener("resize", this.resizeHandler)
        /* var canvas = document.getElementById('chart');
        var ctx = canvas.getContext("2d");
        
        //Draw image to canvas
        var img = new Image()
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        img.crossOrigin = 'anonymous';
        img.src = this.bgimage
        
        var signaturePad = new SignaturePad(canvas);
        signaturePad.penColor = "rgb(0, 0, 0)";
        signaturePad.maxWidth = 2;
        var storedImage = ""
        
        signaturePad.onEnd = function(event) {
            storedImage = signaturePad.toDataURL()
        }
        
        function resizeCanvas() {
            if (signaturePad.isEmpty()) {
                return;
            }
            var ratio =  Math.max(window.devicePixelRatio || 1, 1);
            // This part causes the canvas to be cleared
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);

            signaturePad.fromDataURL(storedImage);
        }
        var timeout;
        window.addEventListener("resize", (e) => {
            if (!timeout) {
                timeout = setTimeout(() => {
                    timeout = null
                    resizeCanvas()
                }, 50);
            }
        }, false);
        resizeCanvas();

        function download(dataURL, filename) {
            var blob = dataURLToBlob(dataURL);
            var url = window.URL.createObjectURL(blob);

            var a = document.createElement("a");
            a.style = "display: none";
            a.href = url;
            a.download = filename;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
        }

        function dataURLToBlob(dataURL) {
            // Code taken from https://github.com/ebidel/filer.js
            var parts = dataURL.split(';base64,');
            var contentType = parts[0].split(":")[1];
            var raw = window.atob(parts[1]);
            var rawLength = raw.length;
            var uInt8Array = new Uint8Array(rawLength);

            for (var i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            return new Blob([uInt8Array], { type: contentType });
        }

        var saveButton = document.getElementById('save');
        saveButton.addEventListener('click', (event) => {
            var data = signaturePad.toDataURL()
            download(data, "chart.png");
            console.log(data)
            console.log("image:", img)
        })
        document.getElementById('draw').addEventListener('click', () => {
            ctx.lineWidth = 1;
            ctx.globalCompositeOperation = 'source-over';
        })
        document.getElementById('erase').addEventListener('click', (event) => {
            ctx.lineWidth = 6
            ctx.globalCompositeOperation = 'destination-out';
        }) */
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
        height:490px;
        max-width:719px;
        @include respond(tabletLarge) {
            max-width:943px;
            height:642px;
        }
    }
    &__chart {
        position:relative;
        width:100%;
        height:657px;
        max-width:719px;
        @include respond(tabletLarge) {
            max-width:943px;
            height:642px;
        }
    }
}
canvas {
    //height:100%;
    width:100%;
    position:absolute;
    top:0;
    left:0;
}
#chart {
    height:100%;
    width:100%;
    position:absolute;
    top:0;
    left:0;
}
</style>