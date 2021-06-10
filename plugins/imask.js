import Vue from 'vue';
import { IMaskDirective } from 'vue-imask';
import {IMaskComponent} from 'vue-imask';

Vue.directive('imask', IMaskDirective);
Vue.component('imask-input', IMaskComponent);