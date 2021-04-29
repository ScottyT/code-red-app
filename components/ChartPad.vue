<template>
    <div class="chart-wrapper">
        <span>
            <canvas id="chart" width=943 height=642></canvas>
            <canvas id="copy" width=943 height=642></canvas>
        </span>
        <div class="button-wrapper">
            <v-btn class="button--normal" id="save">Save</v-btn>
            <v-btn class="button--normal" id="draw">Draw</v-btn>
            <v-btn class="button--normal" id="erase">Erase</v-btn>
            <v-btn class="button--normal" id="undo">Undo</v-btn>
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
        save() {
            this.$emit('chartimage')
        }
    },
    mounted() {
        var canvas = document.getElementById('chart');
        var copyCanvas = document.getElementById('copy');
        var ctx = canvas.getContext("2d");
        var storedImage = ""
        var signaturePad = new SignaturePad(canvas);        
        signaturePad.penColor = "rgb(0, 0, 0)";
        signaturePad.maxWidth = 1.5;

        //Draw image to canvas
        var img = new Image()
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight)
            storedImage = canvas.toDataURL()
        }
        img.crossOrigin = 'anonymous';
        img.src = this.bgimage
             
        var padData = null
        
        signaturePad.onEnd = function(event) {
            storedImage = signaturePad.toDataURL()
        }
        function resizeCanvas() {
            var ratio =  Math.max(window.devicePixelRatio || 1, 1);
            // This part causes the canvas to be cleared
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            copyCanvas.width = canvas.offsetWidth * ratio;
            copyCanvas.height = canvas.offsetHeight * ratio;

            canvas.getContext("2d").scale(ratio, ratio);
            copyCanvas.getContext("2d").scale(ratio, ratio);      
        }
        function drawCanvas() {
            resizeCanvas()
            signaturePad = new SignaturePad(canvas);
            if (storedImage !== "") {
                signaturePad.fromDataURL(storedImage);
            }
        }
        window.addEventListener("resize", drawCanvas);
        drawCanvas();

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
        function undo() {
            const data = signaturePad.toData();
            if (padData) {
                data.forEach(d => {
                    if (!padData.includes(d)) {
                        padData.push(d)
                    }
                })
            } else {
                padData = data
            }
            if (padData && padData.length !== 0) {
                data.pop()
                signaturePad.fromData(data)
                copyCanvas.getContext("2d").drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight)
                copyCanvas.getContext("2d").drawImage(canvas, 0, 0, canvas.clientWidth, canvas.clientHeight)
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                canvas.getContext("2d").drawImage(copyCanvas, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
                storedImage = canvas.toDataURL()
            }
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
            //download(data, "chart.png");
            this.storedimage.data = data
            this.$emit('chartimage', data)
        })
        document.getElementById('draw').addEventListener('click', () => {
            ctx.lineWidth = 1;
            ctx.globalCompositeOperation = 'source-over';
        })
        document.getElementById('erase').addEventListener('click', (event) => {
            ctx.lineWidth = 6
            ctx.globalCompositeOperation = 'destination-out';
        })
        document.getElementById('undo').addEventListener('click', () => {
            
            undo()
        })

        this.$nextTick(() => {
           // this.storedimage = signaturePad.toDataURL()
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
#copy {
    visibility: hidden;
}
</style>