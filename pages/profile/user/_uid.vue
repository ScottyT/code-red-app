<template>
    <div class="user-page px-5">
        <v-card light color="white" max-width="344" elevation="2" class="user-card">
            <h4 class="user-card__name"></h4>
            <p class="text">{{user.email}}</p>
            <form enctype="multipart/form-data" @submit.prevent="uploadFile">
                <UiImageUpload v-model="avatar" :errorText="error" :email="user.email" :maxSize="1024" uploadFieldName="avatar" class="user-card__actions">
                <template v-slot:activator>
                    <v-avatar size="150px" v-ripple v-if="Object.keys(avatar).length === 0 && avatarurl === null" class="grey lighten-3 mb-3">
                        Click to add avatar
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else-if="Object.keys(avatar).length > 0" class="mb-3">
                        <img :src="avatar.imageUrl" />
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else-if="Object.keys(avatarurl).length === 0" class="mb-3">
                        <img :src="avatarfromauth" />
                    </v-avatar>
                    
                    <v-avatar size="150px" v-ripple v-else class="mb-3">
                        <!-- <img :src="`data:${avatar.contentType};base64,${avatar.img}`" />  -->
                        <img :src="avatarurl" />
                    </v-avatar>
                </template>
                </UiImageUpload>
                <v-slide-x-transition>
                    <div v-if="Object.keys(avatar).length > 0">
                        <v-btn class="primary button--normal" type="submit" :loading="saving">Save Avatar</v-btn>
                    </div>
                </v-slide-x-transition>  
            </form>
        </v-card>
        <button @click="refreshReports" class="button--normal">Refresh</button>
        <p v-if="loading">Fetching reports...</p>
        <div class="block-group" v-else>
            <LayoutReports :reports="reports" theme="dark" />
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, computed, onMounted, defineComponent, useStore, useFetch, watch, useContext } from '@nuxtjs/composition-api'
import { userReports } from '@/composable/userReports'
export default defineComponent({
    async middleware({store, redirect}) {
        if (Object.keys(store.state.users.user).length === 0) {
            return redirect('/')
        }
    },
    setup(props, context) {
        const { $axios, $fire } = useContext()
        const { reports, loading, fetchUserReports } = userReports()
        const authUser = $fire.auth.currentUser
        const email = context.root.$route.params.uid
        const store = useStore()
        const saving = ref(false)
        const saved = ref(false)
        const avatar = ref({})
        const error = ref('')
        const avatarfromauth = ref("")
        const user = computed(() => store.getters['users/getUser'])
        const avatarurl = store.getters['users/getAvatar']
        const refreshReports = async () => {
            await fetchUserReports()
        }
        const fetchAvatar = () => {
            if (Object.keys(avatarurl).length === 0) {
                avatarfromauth.value = $fire.auth.currentUser.photoURL
            }
        }
        const savedAvatar = () => {
            saving.value = false
            saved.value = true
        }
        const uploadImage = (image) => {
            console.log(image)
            store.commit('users/setAvatar', image)
            savedAvatar()
            avatar.value = {}
            avatarfromauth.value = image
        }
        fetchUserReports()
        onMounted(fetchAvatar)
        
        return {
            loading,
            reports: computed(() => reports.value),
            uploadImage,
            savedAvatar,
            avatarurl,
            avatar,
            avatarfromauth,
            saving,
            saved,
            user,
            error,
            fetchUserReports,
            refreshReports
        }
    },
    methods: {
        uploadFile() {
            this.avatar.formData.append('teamMember', this.user.email)
            this.avatar.formData.append('name', 'avatar__'+this.avatar.imageName)
            this.saving = true
            axios.post(`${process.env.serverUrl}/api/avatar/new`, this.avatar.formData, {headers: {'Content-Type': 'multipart/form-data'}}).then((res) => {
                this.uploadImage(res.data)
            }).catch((err) => {
                this.error = err
            })
        }
    }
})
</script>
<style lang="scss">
.user-page {
    max-width:1200px;
    margin:auto;
    margin-top:40px;
}
.user-card {
    padding:10px 15px;
}
</style>