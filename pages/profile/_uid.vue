<template>
    <div class="user-page px-5">
        <v-card light color="white" max-width="344" elevation="2" class="user-card">
            <h4 class="user-card__name"></h4>
            <p class="text">{{user.email}}</p>
            <form enctype="multipart/form-data" @submit.prevent="uploadFile">
                <UiImageUpload v-model="avatar" :email="user.email" :maxSize="1024" uploadFieldName="avatar" class="user-card__actions">
                <template v-slot:activator>
                    <v-avatar size="150px" v-ripple v-if="Object.keys(avatar).length === 0 && Object.keys(avatarurl).length === 0" class="grey lighten-3 mb-3">
                        Click to add avatar
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else-if="Object.keys(avatar).length > 0" class="mb-3">
                        <img :src="avatar.imageUrl" />
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else class="mb-3">
                        <!-- <img :src="`data:${avatar.contentType};base64,${avatar.img}`" /> -->
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
    </div>
</template>
<script>
import axios from 'axios';
import useReports from '@/composable/reports'
import useUsers from '@/composable/users'
import { ref, computed, onMounted } from '@vue/composition-api'
import { useGetters, useState } from 'vuex-composition-helpers'
export default {
    setup(props, {root}) {
        const userEmail = root.context.$fire.auth.currentUser.email
        const saving = ref(false)
        const saved = ref(false)
        const avatar = ref({})
        /* const { user } = useGetters({
            user: 'getUser'
        }) */
        const { avatarurl } = useState(['avatarurl'])
       // const { reports, fetchReports } = useReports();
        const { user, fetchUser } = useUsers();

        onMounted(() => fetchUser(userEmail));
        //onMounted(() => fetchReports());

        const savedAvatar = () => {
            saving.value = false
            saved.value = true
        }
        const uploadImage = (item) => {
            root.$store.dispatch('fetchAvatar', item)
            savedAvatar()
            avatar.value = {}
        }
        return {
            uploadImage,
            savedAvatar,
            avatarurl,
            avatar,
            saving,
            saved,
            user
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
                console.log(err)
            })
        }
    }
}
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