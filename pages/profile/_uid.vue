<template>
    <div class="user-page px-5">
        <v-card light color="white" max-width="344" elevation="2" class="user-card">
            <h4 class="user-card__name"></h4>
            <p class="text">{{user.email}}</p>
            <form enctype="multipart/form-data" @submit.prevent="uploadFile">
                <UiImageUpload v-model="avatar" :errorText="error" :email="user.email" :maxSize="1024" uploadFieldName="avatar" class="user-card__actions">
                <template v-slot:activator>
                    <v-avatar size="150px" v-ripple v-if="Object.keys(avatar).length === 0 && Object.keys(avatarurl).length === 0" class="grey lighten-3 mb-3">
                        Click to add avatar
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else-if="Object.keys(avatar).length > 0" class="mb-3">
                        <img :src="avatar.imageUrl" />
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else class="mb-3">
                        <!-- <img :src="`data:${avatar.contentType};base64,${avatar.img}`" />  -->
                        <img :src="avatarurl.image" />
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
        <!-- <p v-if="$fetchState.pending">Fetching reports...</p> -->
        <div class="block-group">
            <!-- <LayoutReports :reports="reports" theme="dark" /> -->
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, computed, onMounted, defineComponent, useStore, useFetch } from '@nuxtjs/composition-api'
import { userReports } from '@/composable/userReports'
//import { reportStore } from '@/store/userReports/index'
export default defineComponent({
    setup(props, context) {
        const authUser = context.root.$fire.auth.currentUser
        const email = context.root.$route.params.uid
        const store = useStore()
        const saving = ref(false)
        const saved = ref(false)
        const avatar = ref({})
        const error = ref('')
        const reports = ref([])
        /* const fetch = () => {
            reports.value = reportStore.loadReports(email)
        }
        fetch() */
        const user = computed(() => store.getters['users/getUser'])
        const avatarurl = computed(() => store.getters['users/getAvatar'])
       // const data = computed(() => reports.value)
        //const fetchReports = () => { store.dispatch('userReports/loadReports') }
        /* const { reports, fetchUserReports } = userReports(authUser.email)
        fetchUserReports() */
        //fetchReports(email)
        
        const savedAvatar = () => {
            saving.value = false
            saved.value = true
        }
        const uploadImage = (item) => {
            root.$store.dispatch('users/fetchAvatar', item)
            savedAvatar()
            avatar.value = {}
        }
        return {
            
            reports,
            //fetchReports,
            uploadImage,
            savedAvatar,
            avatarurl,
            avatar,
            saving,
            saved,
            user,
            error
        }
    },
    methods: {
        uploadFile() {
            this.avatar.formData.append('teamMember', this.user.email)
            this.avatar.formData.append('name', 'avatar__'+this.avatar.imageName)
            this.saving = true
            axios.post(`${process.env.serverUrl}/api/avatar/new`, this.avatar.formData, {}).then((res) => {
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