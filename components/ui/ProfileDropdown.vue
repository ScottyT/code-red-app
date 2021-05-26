<template>
    <div class="profile-menu" v-click-outside="onClickOutside">
        <div class="profile-menu__dropdown-trigger" @click="() => hidden = !hidden" >
            <span class="text text-right">{{user.name}}</span>
            <span class="profile-menu__pfp" v-if="Object.keys(avatarurl).length === 0">
                <v-icon size="45">mdi-account-circle</v-icon>              
            </span>
            <span class="profile-menu__pfp" v-else>
                <img :src="avatarurl.image" />
            </span>
            <i :class="`mdi-triangle mdi profile-menu__arrow ${hidden ? '' : 'open'}`"></i>
            <span class="text text--subtitle text-right">{{user.email}}</span>
        </div>
        <div :class="`profile-menu__dropdown-menu ${hidden ? 'hide' : 'show'}`">
            <span class="text text--subtitle text-uppercase">My stuff</span>
            <nuxt-link class="profile-menu__dropdown-menu--item" to="/profile/savedreports">
                <v-icon>mdi-apps</v-icon>
                <p>Saved reports</p>
            </nuxt-link>
            <nuxt-link class="profile-menu__dropdown-menu--item" :to="`/profile/${user.email}`">
                <v-icon>mdi-contacts</v-icon>
                <p>Profile</p>
            </nuxt-link>
            <a class="profile-menu__dropdown-menu--item" @click="auth">
                <v-icon>{{user ? 'mdi-logout-variant' : 'mdi-login-variant'}}</v-icon>
                <p>{{$fire.auth.currentUser !== null ? "Logout" : "Login"}}</p>
            </a>
            <span class="text text--subtitle text-uppercase">Pdfs</span>
            <nuxt-link class="profile-menu__dropdown-menu--item" to="/saved-aob-contracts">
                <v-icon>mdi-pdf-box</v-icon>
                <p>AOB & Mitigation Contracts</p>
            </nuxt-link>
            <nuxt-link class="profile-menu__dropdown-menu--item" to="/completed-jobs">
                <v-icon>mdi-pdf-box</v-icon>
                <p>Certificates of completion</p>
            </nuxt-link>
        </div>
    </div>
</template>
<script>
import { computed, ref, onMounted, watch } from '@vue/composition-api'

export default {
    setup(props, { root }) {
        const auth = () => {
            root.$store.dispatch('users/signout')
        }
        const fetchAvatar = () => { root.$store.dispatch('users/fetchAvatar') }
        const avatarurl = computed(() => root.$store.getters['users/getAvatar'])
        const user = computed(() => root.$store.getters['users/getUser'])
    
        const hidden = ref(true)
        const onClickOutside = () => {
            hidden.value = true
        }    
        //fetchAvatar(user.email)
        return {
            user,
            avatarurl,
            hidden,
            auth,
            fetchAvatar,
            onClickOutside
        }
    },
}
</script>
<style lang="scss" scoped>
.profile-menu {
    display:flex;
    flex-direction:column;
    position:relative;
    width:330px;
    
    &__dropdown-trigger {
        cursor:pointer;
        display:grid;
        grid-template-rows:1fr 1fr;
        grid-template-columns:1fr 40px 20px;
        column-gap:15px;
    }
    &__pfp {
        border-radius:50%;
        overflow:hidden;
        width:45px;
        height:45px;
        background-color:$dark-primary-1;
        grid-row:2 span;
    }
    &__arrow {
        grid-row:2 span;
        align-items:center;
        display:flex;
        font-size:18px;
        transform:rotate(180deg);
        transition: transform .3s ease-in-out;
        &.open {
            transform:rotate(0);
            transition: transform .3s ease-in-out;
        }
    }
    &__dropdown-menu {
        position:absolute;
        top:63px;
        background-color:#333;
        padding:5px 10px;
        width:100%;
        &.hide {
            display:none;
        }
        &.show {
            display:block;
        }
        &--item {
            font-size:1.1em;
            padding:10px 5px;
            display:flex;
            background-color:transparent;
            transition:background-color .3s ease-in-out;
            p {
                width:100%;
                margin-left:10px;
            }
            &:hover {
                background-color:$color-red;
                transition:background-color .3s ease-in-out;
            }
        }
    }
}
</style>