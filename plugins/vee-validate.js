import Vue from 'vue';
import { extend, ValidationObserver, ValidationProvider } from 'vee-validate'
import { required, email, numeric, regex, image, ext, mimes, digits, alpha, length, max, alpha_num, alpha_spaces, min, between } from 'vee-validate/dist/rules'

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
extend('regex', {
  ...regex,
  message: '{_field_} must be in the given format' 
})
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
extend('alpha', {
  ...alpha,
  message: '{_field_} must only contain letters'
})
extend('length', {
  ...length,
  message: '{_field_} must be exactly {length} characters'
})
extend('alpha_num', {
  ...alpha_num,
  message: '{_field_} must only contain numbers and letters'
})
extend('alpha_spaces', {
  ...alpha_spaces,
  message: '{_field_} only white spaces and letters are allowed'
})
extend('min', {
  ...min,
  message: '{_field_} must be longer than {length}'
})
extend('max', {
  ...max,
  message: '{_field} must be shorter than {length}'
})
extend('between', {
  ...between
})
Vue.component("ValidationObserver", ValidationObserver)
Vue.component("ValidationProvider", ValidationProvider)