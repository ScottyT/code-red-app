/* eslint-disable */
import Vue from 'vue'
import {
  MglMap,
  MglGeolocateControl
} from 'vue-mapbox'
import MglGeocoderControl from 'vue-mapbox-geocoder'
import Mapbox from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'

Vue.component('MglMap', MglMap)
Vue.component('MglGeocoderControl', MglGeocoderControl)
Vue.component('MglGeolocateControl', MglGeolocateControl)

Vue.prototype.$mapbox = Mapbox
Vue.prototype.$mapbox = MapboxGeocoder
