<template>
    <div class="credit-card">
        <div class="credit-card__inner" @click="flipCard" :class="{ 'credit-card__flipped': showBack }">
            <div class="credit-card__front card-front">
                <img class="credit-card__image" :src="backgroundImage" alt="front card" />
                <img class="credit-card__chip" src="/chip.png" alt="chip" />
                <img v-if="symbolImage !== ''" class="credit-card__symbol" :src="symbolImage" alt="company" />

                <div class="card-front__info">
                    <div class="card-front__card-number">
                        <p>card number</p>
                        <p class="value--cardnumber">{{cardNumber}}</p>
                    </div>
                    <div class="card-front__cardholder">
                        <p>cardholder name</p>
                        <p class="value">{{cardName}}</p>
                    </div>
                    <div class="card-front__expiration">
                        <p>expiration</p>
                        <span>VALID THRU</span>
                        <p class="value">{{expdate}}</p>
                    </div>
                </div>
            </div>
            <div class="credit-card__back card-back">
                <img class="credit-card__image" :src="backgroundImage" alt="back card" />
                <div aria-label="Credit card stripe" class="card-back__stripe"></div>
                <div class="card-back__info">
                    <div class="card-back__signature">{{cardName}}</div>
                    <div class="card-back__cvv">{{securityCode}}</div>
                    <span>security code</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { computed, defineComponent, onMounted, ref, toRefs, watch } from '@nuxtjs/composition-api'

export default defineComponent({
    props: {
        cardNumber:String,
        expirationDate: String,
        cvv: String,
        cardName: String,
        symbolImage: String
    },
    setup(props, {root}) {
        const { cardNumber, expirationDate, cvv } = toRefs(props)
        const showBack = ref(false);
        const cardnumber = ref("0123 4567 8910 1112");
        const expdate = ref("01/23");
        const securityCode = ref("985")
        const backgroundImage = ref('');
        const randomCard = () => {
            backgroundImage.value = `/card-${Math.floor(Math.random() * 3) + 1}.jpg`;
        }
        const setPlaceholders = (value, property, placeholder) => {
            if (value === "") { value = placeholder }
            property.value = value
        }
        function flipCard() {
            showBack.value = !showBack.value
        }

        onMounted(randomCard)
        watch(cardNumber, (val) => setPlaceholders(val, cardnumber, "0123 4567 8910 1112"))
        watch(expirationDate, (val) => setPlaceholders(val, expdate, "01/23"))
        watch(cvv, (val) => setPlaceholders(val, securityCode, "985"))
        return {
            backgroundImage, showBack, flipCard, cardnumber, expdate, securityCode, cardNumber
        }
    },
})
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');
$x-space: 24px;
$y-space:16px;
.credit-card {
    font-family: "Source Code Pro", monospace;
    width:100%;
    max-width:420px;
    height:309px;
    padding:20px;
    perspective: 1000px;
    display:inline-block;
    margin:auto;
    & > img {
        object-fit:contain;
    }
    &__flipped {
        -webkit-transform:rotateY(180deg);
        transform:rotateY(180deg);
    }
    &__inner {
        transition: transform .6s;
        width:100%;
        height:100%;
        position:relative;
        transform-style:preserve-3d;
        text-align:center;
    }
    &__front, &__back {
        position:absolute;
        backface-visibility: hidden;
        color:$color-white;
        z-index:100;
    }
    &__back {
        transform:rotateY(180deg);
    }
    &__image {
        border-radius:16px;
    }
    &__chip {
        position:absolute;
        top:25px;
        left:$x-space;
        width:60px;
        height:auto;
    }
    &__symbol {
        position:absolute;
        top:25px;
        right:25px;
        width:90px;
        height:auto;
    }
}
.card-front {
    &__info {
        display:grid;
        grid-template-columns:1fr 115px;
        grid-template-rows:60px 47px;
        position:absolute;
        bottom:19px;
        width:100%;
        padding:0 $x-space;
        text-align:left;
        row-gap:10px;
        p {
            font-size:.85em;
            margin-bottom:0px;
            &.value {
                font-size:1em;
                &--cardnumber {
                    font-size:1.6em;
                    font-weight:700;
                    letter-spacing:1px;
                }
            }
        }
    }
    &__card-number {
        grid-column:1/2 span;
    }
    &__expiration {
        span {
            font-size:.6em;
            width:37px;
            display:block;
            float:left;
            font-weight:300;
        }
    }
}
.card-back {
    &__info {
        display:grid;
        grid-template-areas: 'signature signature signature cvv'
            '. . tooltip tooltip';
        grid-template-rows:40px 1fr;
        grid-template-columns:repeat(4, 1fr);
        width:100%;
        padding:0 $x-space;
        position:absolute;
        top:95px;
    }
    &__signature {
        background-color:$color-white;
        grid-area:signature;
        font-family:'Rock Salt', cursive;
        color:black;
        line-height:40px;
    }
    &__stripe {
        width:100%;
        height:40px;
        background-color:$color-black;
        opacity:.88;
        position:absolute;
        top:25px;
        left:0;
    }
    &__cvv {
        background-color:$color-grey;
        grid-area:cvv;
        color:$color-black;
        line-height:40px;
    }
    span {
        grid-area:tooltip;
        text-align:right;
    }
}
</style>