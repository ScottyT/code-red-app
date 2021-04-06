<template>
    <div class="form-wrapper create-user">
        <div class="create-user__box">
            <h1>Create User</h1>
            <p>{{submittedMessage}}</p>
            <p class="alert alert--error">{{errorMessage}}</p>
            <ValidationObserver ref="createUser" v-slot="{ passes }">
                <form class="form" @submit.prevent="passes(onSubmit)">
                    <ValidationProvider vid="name" name="Name" v-slot="{errors}" class="form__input--input-group-simple">
                        <input v-model="name" type="text" placeholder="Name" class="form__input" />
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
            name: '',
            email: '',
            id: '',
            role: '',
            submittedMessage: ''
        }
    },
    async middleware({store, redirect}) {
        if (store.state.user.role !== 'admin') {
            return redirect('/login')
        }
    },
    methods: {
        onSubmit() {
            const post = {
                name: this.name,
                email: this.email,
                id: this.id,
                role: this.role
            }
            this.$axios.$post("/api/employee/new", post).then((res) => {
                if (res.errors) {
                    this.$refs.createUser.setErrors({
                        name: res.errors.find(obj => obj.param === 'name'),
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