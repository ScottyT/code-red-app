<template>
    <div class="accordion__item" :class="{'is-active': item.active}">
        <div class="accordion__title">
            <button @click="toggle" class="accordion__item--trigger" v-if="!titleIsArray">             
                <h2 class="accordion__title--text">{{item.title}}</h2>
                <span class="accordion__item--trigger-icon"></span>
            </button>
            <slot name="category" v-if="titleIsArray"></slot>
        </div>
        <transition name="accordion-item" 
            @enter="startTransition" 
            @after-enter="endTransition" 
            @before-leave="startTransition" 
            @after-leave="endTransition"
            v-if="titleIsArray">
            <div class="accordion-item__details" v-if="item.active">
                <slot name="details"></slot>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: "AccordionItem",
    props: {
        item: {
            type: Object,
            required: true
        },
        titleIsArray: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array
        }
    },
    methods: {
        toggle(event) {
            this.item.active = !this.item.active
        },
        startTransition(el) {
            el.style.height = el.scrollHeight + 'px'
        },
        endTransition(el) {
            el.style.height = ''
        }
    }
}
</script>
<style lang="scss">
.accordion {
    padding:0;
    &__item {
        &--trigger {
            width:100%;
            text-align:left;
            background-color:transparent;
            border:none;
        }
        &--trigger-icon {
            $size: 10px;
            display:block;
            position:absolute;
            top:0;
            right: 1.25rem;
            bottom:0;
            margin:auto;
            width:$size;
            height:$size;
            border-right: 2px solid #363636;
            border-bottom: 2px solid #363636;
            transform: translateY(-$size / 4) rotate(45deg);
            transition: transform 0.2s ease;

            .is-active & {
                transform:translateY($size / 4) rotate(225deg);
            }
        }
    }
    &__title {
        position:relative;
        &--text {
            padding-right:20px;
        }
    }
}
.accordion-item {
    &__details {
        overflow: hidden;
        background-color:whitesmoke;
    }
    &:not(:last-child) {
        border-bottom: 1px solid rgba(10, 10, 10, 0.1);
    }
    &:last-child .accordion-item__details {
        border-radius:5px;
    }
}
.accordion-item-enter-active, .accordion-item-leave-active {
    will-change: height;
    transition: height 0.2s ease;
}
.accordion-item-enter, .accordion-item-leave-to {
    height: 0 !important;
}
</style>