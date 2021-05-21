<template>
    <div class="user-page px-5">
        <v-card light color="white" max-width="344" elevation="2" class="user-card">
            <h4 class="user-card__name"></h4>
            <p class="text">{{userEmail}}</p>
            <form enctype="multipart/form-data" @submit.prevent="uploadFile">
                <UiImageUpload v-model="avatar" :email="userEmail" :maxSize="1024" uploadFieldName="avatar" class="user-card__actions">
                <template v-slot:activator>
                    <v-avatar size="150px" v-ripple v-if="!avatar" class="grey lighten-3 mb-3">
                        Click to add avatar
                    </v-avatar>
                    <v-avatar size="150px" v-ripple v-else class="mb-3">
                        <img :src="avatar.imageUrl" />
                    </v-avatar>
                </template>
                </UiImageUpload>
                <v-slide-x-transition>
                    <div v-if="avatar && saved == false">
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
import { ref, computed, onMounted } from '@vue/composition-api'
export default {
    setup(props, {root}) {
        const userEmail = root.context.$fire.auth.currentUser.email
        const avatar = ref(null)
        const saving = ref(false)
        const saved = ref(false)
        const user = computed(() => root.$store.getters.getUser)
        const { reports, fetchReports } = useReports();
        onMounted(() => fetchReports());
        const userReports = computed(() => {
            return reports.value.filter(report => {
                return report.teamMember.email === userEmail
            })
        })

        const savedAvatar = () => {
            saving.value = false
            saved.value = true
        }
        const uploadImage = () => {
            saving.value = true

            setTimeout(() => savedAvatar(), 1000)
        }
        return {
            userReports,
            userEmail,
            uploadImage,
            savedAvatar,
            avatar,
            saving,
            saved,
            userObj: user.value
        }
    },
    methods: {
        uploadFile() {
            this.avatar.formData.append('teamMember', this.userObj)
            this.avatar.formData.append('name', 'avatar__'+this.avatar.imageName)
            axios.post(`${process.env.serverUrl}/api/avatar/new`, this.avatar.formData, {}).then((res) => {
                this.saving = true
                console.log(res)
                setTimeout(() => {
                    this.savedAvatar()
                }, 1000)
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