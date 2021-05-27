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
        <div>
            <!-- <p v-if="$fetchState.pending">Fetching reports...</p> -->
            <div>{{reports}}</div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { ref, computed, onMounted, defineComponent, useStore, useFetch } from '@nuxtjs/composition-api'
export default defineComponent({
    setup(props, {root}) {
        const authUser = root.$fire.auth.currentUser
        const store = useStore()
        const saving = ref(false)
        const saved = ref(false)
        const avatar = ref({})
        const error = ref('')
        const reports = computed(() => store.state.reports.all)
        const user = computed(() => store.getters['users/getUser'])
        const avatarurl = computed(() => store.getters['users/getAvatar'])
        async function fetchReports(user) { store.dispatch('reports/fetchReports', user)};
        /* const { fetch, fetchState } = useFetch(async () => {
            reports.value = await axios.get(`${process.env.serverUrl}/api/reports`, {headers: {authorization: `Bearer ${user.value.token}`}})
        }) */
        //const { user, fetchUser } = useUsers();
        /* fetch()
        fetchState */
        fetchReports(authUser)
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
            fetchReports,
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
}
.user-card {
    padding:10px 15px;
}
</style>