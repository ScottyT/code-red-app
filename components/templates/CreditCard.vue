<template>
    <div class="credit-card">
        <div class="credit-card__inner" @click="flipCard" :class="{ 'credit-card__flipped': showBack }">
            <div class="credit-card__front card-front">
                <img class="credit-card__image" :src="backgroundImage" />
            </div>
            <div class="credit-card__back card-back">
                <img class="credit-card__image" :src="backgroundImage" />
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@nuxtjs/composition-api'

export default defineComponent({
    props: {
        cardNumber: String,
        expirationDate: String,
        cvv: String,
        name: String,
        symbolImage: String
    },
    setup(props, {root}) {
        const showBack = ref(false);
        const backgroundImage = ref('');
        const randomCard = () => {
            backgroundImage.value = `/card-${Math.floor(Math.random() * 3) + 1}.jpg`;
        }
        function flipCard() {
            showBack.value = !showBack.value
        }
        onMounted(randomCard)
        return {
            backgroundImage, showBack, flipCard
        }
    },
})
</script>
<style lang="scss">
.credit-card {
    width:100%;
    max-width:420px;
    height:288px;
    padding:20px;
    perspective: 1000px;
    display:inline-block;
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
        &:hover {
            
        }
    }
    &__image {
        border-radius:16px;
    }
}
</style>