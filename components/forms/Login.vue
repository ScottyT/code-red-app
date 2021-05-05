<template>
    <div class="login-page form-wrapper form-wrapper__login-page">
      <div class="login-form-box">       
        <h1>Login!</h1>
        <p v-show="errorMessage">{{errorMessage}}</p>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form ref="loginForm" class="form" method="post" @submit.prevent="handleSubmit(signIn)">
            <div class="form__form-group--block">
              <ValidationProvider v-slot="{ errors }" name="Email" rules="required|email" class="form__input--input-group-simple">
                <label for="email" class="form__label">Email</label>
                <input type="text" class="form__input" name="email" id="email" v-model="email" />
                <span class="form__input--error">{{errors[0]}}</span>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="pass" rules="required" class="form__input--input-group-simple">
                <label for="pass" class="form__label">Password</label>
                <div class="form__input form__input--password-input">
                  <input :type="passwordVisibility ? 'text' : 'password'" class="form-input" id="pass" name="Password" v-model="password" />
                  <i :class="`form__input--icon mdi ${passwordVisibility ? 'mdi-eye-off' : 'mdi-eye'}`" @click="passwordVisibility = !passwordVisibility"></i>
                </div>
                <span class="form__input--error">{{errors[0]}}</span>
              </ValidationProvider>
            </div>
            <div class="submit-btn">
              <v-btn type="submit" :dark="matchUrl ? true : false">{{ submitting ? 'Logging In' : 'Login' }}</v-btn>
            </div>
          </form>
        </ValidationObserver>
      </div>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    data() {
        return {
            submitted: false,
            submitting: false,
            message: '',
            idNumber: '',
            password: '',
            email: '',
            passwordVisibility: false,
            errorMessage: ""
        }
    },
    head() {
      return {
        title: "Login"
      }
    },
    computed: {
        ...mapGetters(["getUser"]),
        matchUrl() {
            return this.$route.path.match(/^(?:^|\W)reports(?:$|\W)(?:\/(?=$))?/gm)
        },
    },
    methods: {
        async signIn() {
            this.submitted = false
            this.submitting = true
            this.errorMessage = ""
            await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
                this.$router.go()
            }).catch(err => {
                this.errorMessage = err.message
                this.submitting = false
            })
        }
    }
}
</script>