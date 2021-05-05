<template>
    <div class="autocomplete" :class="{ 'is-focused': inputFocused === true }">
        <label class="autocomplete__placeholder" for="searchbox">{{placeholderText}}</label>
        <input class="autocomplete__input" :class="theme === 'light' ? 'autocomplete__input--light' : 'autocomplete__input--dark'" 
            ref="searchText" @change="sendReportsToParent" placeholder="Search..." type="text" v-model="search" />    
    </div>
</template>
<script>
export default {
    name: 'autocomplete',
    props: {
        items: {
            type: Array,
            required: true
        },
        placeholderText: {
            type: String,
            required: false
        },
        theme: {
            type: String,
            default: 'dark'
        }
    },
    data() {
        return {
            inputFocused: false,
            search:'',
            results:[],
            isOpen:false,
            isLoading: false,
            arrowCounter: -1
        }
    },
    computed: {
        filteredItems() {          
           return this.items.filter((x) => {
               return x.JobId.indexOf(this.search) >= 0;
           })
        }
    },
    methods: {
        sendReportsToParent() {
            this.$emit('sendReportsToParent', this.filteredItems)
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    destroyed() {
        document.removeEventListener('click', this.handleClickOutside);
    }
}
</script>
<style lang="scss">
.autocomplete {
    display:flex;
    align-items:flex-start;
    flex:1 1 auto;
    max-width:100%;
    text-align:left;
    position:relative;
    height:35px;
    margin-bottom:20px;

    &:before {
        position:absolute;
        content:"";
        bottom:-1px;
        left:0;
        //border:1px solid $color-black;
        border-width:thin 0 0;
        border-style:solid;
        width:100%;
    }
    &:after {
        position:absolute;
        content: "";
        bottom:-1px;
        left:0;
        border:1px solid #1976d2;
        border-width:thin 0;
        width:0;
        transition:all 0.5s cubic-bezier(0.61, 0.03, 0.36, 1.06);
        transform:scaleX(0);
    }
    &.is-focused {
        &::after {
            width:100%;
            transition:all 0.5s cubic-bezier(0.61, 0.03, 0.36, 1.06);
            transform:scaleX(1)
        }
        .autocomplete__placeholder {
            transform:translateY(-18px) scale(.75);
            color:#1976d2;
            transition:all 0.3s cubic-bezier(0.15, 0.72, 0.38, 1.03);
        }
    }
    &__results {
        padding:0;
        overflow:auto;
        position:absolute;
        top:35px;
        width:100%;
        background:$color-black;
        color:$color-white;
        z-index:1;
    }
    &__result {
        list-style:none;
        text-align:left;
        cursor:pointer;
        position:relative;
        padding-left:20px;
        a {
            width:100%;
            height:100%;
            display:flex;
            flex-direction:column;
            padding:8px 0px;
        }
        &:before {
            position:absolute;
            top:0;
            left:0;
            right:0;
            pointer-events:none;
            transition:.3s ease-in;
            content:'';
            background-color:#f7f7f7;
            width:100%;
            height:100%;
            opacity:0;
        }
        &:hover:before {
            opacity:.1;
        }
        &.is-active:before {
            opacity:.1;
        }
        &--subtitle {
            font-size:.9em;
            color:rgba($color-white, .6);
        }
    }
    &__input {
        width:100%;
        padding:5px 0;
        position:absolute;
        left:0;
        color:white;
        &:focus {
            outline:none;
        }
        &--light {
            color:black;
        }
    }
    &__placeholder {
        color:rgba(0,0,0, .6);
        transform-origin:top left;
        position:absolute;
        left:0;
        top:8px;
        transition:all .5s cubic-bezier(0.61, 0.03, 0.36, 1.06);
    }
}
</style>