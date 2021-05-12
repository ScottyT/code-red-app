<template>
    <div class="form-wrapper create-user">
        <div class="create-user__box">
            <h1>Create User</h1>
            <p>{{submittedMessage}}</p>
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
                        <input v-model="password" type="password" placeholder="Password" class="form__input" />
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
export default {
    head() {
        return {
            title: "Create Employee"
        }
    },
    data() {
        return {
            errorMessage: '',
            fname: '',
            lname: '',
            email: '',
            id: '',
            role: '',
            submittedMessage: '',
            password: '',
            successMessage: ''
        }
    },
    /* async middleware({store, redirect}) {
        if (store.state.user.role !== 'admin') {
            return redirect('/login')
        }
    }, */
    methods: {
        onSubmit() {
            const post = {
                fname: this.fname,
                lname: this.lname,
                email: this.email,
                id: this.id,
                role: this.role
            }
            this.$axios.$post("/api/auth/signup", {
                name: this.fname + " " + this.lname,
                email: this.email,
                password: this.password
            }).then((res) => {
                this.successMessage = `Successfully created employee ${res.displayName}`
            })
            this.$axios.$post("/api/employee/new", post).then((res) => {
                if (res.errors) {
                    this.$refs.createUser.setErrors({
                        fname: res.errors.find(obj => obj.param === 'fname'),
                        lname: res.errors.find(obj => obj.param === 'lname'),
                        email: res.errors.find(obj => obj.param === 'email'),
                        id: res.errors.find(obj => obj.param === 'id')
                    })
                    
                    return;
                }
                this.submittedMessage = res.message
            })
        }
    }
}
</script>