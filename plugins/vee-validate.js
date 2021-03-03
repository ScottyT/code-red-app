import Vue from 'vue';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import { required, email, numeric, regex, image, ext, mimes } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: '{_field_} is required',
})
extend('email', {
  ...email,
  message: '{_field_} must be a valid email',
})
extend('numeric', {
  ...numeric,
  message: '{_field_} must only contain numbers',
})
extend('regex', regex)
extend('image', {
  ...image,
  message: '{_field_} must be an image',
})
extend('mimes', {
  ...mimes,
  message: '{_field_} must have a valid file type'
})
extend('ext', {
  ...ext,
  message: '{_field_} must have a valid file type'
})
Vue.component("ValidationObserver", ValidationObserver)
Vue.component("ValidationProvider", ValidationProvider)