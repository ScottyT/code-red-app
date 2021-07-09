<template>
    <div class="form-wrapper create-user">
        <div class="create-user__box">
            <h1>Create User</h1>
            <div v-for="(message, i) in submittedMessage" :key="i">
                <p class="font-weight-bold">{{message}}</p>
            </div>
            <p>{{successMessage}}</p>
            <p class="alert alert--error">{{errorMessage}}</p>
            <ValidationObserver ref="createUser" v-slot="{ passes }">
                <form class="form" @submit.prevent="passes(onSubmit)">
                    <ValidationProvider vid="fname" name="First name" v-slot="{errors}" class="form__input--input-group-simple">
                        <input v-model="fname" type="text" placeholder="First name" class="form__input" />
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="lname" name="Last name" v-slot="{errors}" class="form__input--input-group-simple">
                        <input v-model="lname" type="text" placeholder="Last name" class="form__input" />
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="email" name="Email" v-slot="{errors}" class="form__input--input-group-simple">
                        <input v-model="email" type="text" placeholder="Email" class="form__input" />
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="id" name="ID" v-slot="{errors}" class="form__input--input-group-simple">
                        <input v-model="id" type="number" placeholder="ID" class="form__input" />
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="password" name="Password" v-slot="{errors}" class="form__input--input-group-simple">
                        <div class="form__input form__input--password-input">
                            <input v-model="password" :type="passwordVisibility ? 'text' : 'password'" placeholder="Password" class="form-input" />
                            <i :class="`form__input--icon mdi ${passwordVisibility ? 'mdi-eye-off' : 'mdi-eye'}`" @click="passwordVisibility = !passwordVisibility"></i>
                        </div>
                        <span class="form__input--error">{{ errors.msg }}</span>
                    </ValidationProvider>
                    <ValidationProvider vid="role" name="Role" v-slot="{errors}" class="form__input--input-group-simple">
                        <input v-model="role" type="text" placeholder="Role" class="form__input" />
                        <span class="form__input--error">{{ errors[0] }}</span>
                    </ValidationProvider>
                    <button type="submit" class="button button--normal">Create</button>
                </form>
            </ValidationObserver>
        </div>
    </div>
</template>
<script>
import { defineComponent, ref, useContext, useMeta } from '@nuxtjs/composition-api';
import { folder } from 'jszip';
export default defineComponent({
    head: {},
    setup(props, {refs}) {
        useMeta({ title: 'Create Employee'})
        const { $axios } = useContext()
        const errorMessage = ref('')
        const fname = ref('')
        const lname = ref('')
        const email = ref('')
        const id = ref('')
        const role = ref('')
        const submittedMessage = ref([])
        const password = ref('')
        const passwordVisibility = ref(false)
        const successMessage = ref('')

        const signupUser = async () => {
            return await $axios.$post("/api/auth/signup", {
                name: fname.value + " " + lname.value,
                email: email.value,
                password: password.value
            }).then((res) => {
                if (res.error) {
                    errorMessage.value = res.error
                    return false;
                }
                submittedMessage.value.push(`Successfully registered ${res.displayName}`)
                return true
            })
        }
        const onSubmit = async () => {
            var post = {
                fname: fname.value,
                lname: lname.value,
                email: email.value,
                id: id.value,
                role: role.value
            }
            var userSignedUp = await signupUser()
            if (userSignedUp) {
                $axios.$post("/api/employee/new", post).then((res) => {
                    if (res.errors) {
                        refs.createUser.setErrors({
                            fname: res.errors.find(obj => obj.param === 'fname'),
                            lname: res.errors.find(obj => obj.param === 'lname'),
                            email: res.errors.find(obj => obj.param === 'email'),
                            id: res.errors.find(obj => obj.param === 'id')
                        })
                        return;
                    }
                    submittedMessage.value.push("Successfully added new user to database")
                })
            }
        }

        return {
            fname, lname, email, password, errorMessage, submittedMessage, successMessage, role, id, passwordVisibility,
            onSubmit
        }
    }
})
</script>