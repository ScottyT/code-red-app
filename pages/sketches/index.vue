<template>
  <LazyLoginForm v-if="!$fire.auth.currentUser" />
  <div class="sketch-forms pa-6" v-else>
    <h1>Sketch Forms</h1>
    <ul class="menu-items">
      <li v-for="form in sketchForms" :key="form.value">
        <nuxt-link :to="`/sketches/${form.value}`">{{form.text}}</nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    layout: 'default',
    head() {
        return {
            title: "Sketch Forms"
        }
    },
    data() {
        return {
            sketchForms: [
                { value: 'moisture-sketch', text: 'Moisture Mapping Location and Sketch' },
                { value: 'measurements-sketch', text:'Measurements and Sketch' },
                { value: 'equipment-location-sketch', text: 'Equipment Location and Sketch' }
            ],
            authUser: false
        }
    },
    computed: {
        ...mapGetters({
            isLoggedIn: 'isLoggedIn'
        })
    }
}
</script>