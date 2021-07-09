<template>

    <!-- <div :id="geocoderid" :ref="geocoderef" class="form__geocoder form__input" @change="locationUpdated"></div> -->
    <div class="map-holder" v-if="mapView">
        <div class="map-holder__map" :id="mapid"></div>
    </div>
    <div v-else :id="geocoderid" :ref="geocoderef" class="form__geocoder form__input" @change="locationUpdated"></div>
   <!--  <input type="text" class="location-control" :value="location" /> -->
</template>
<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, toRefs } from '@nuxtjs/composition-api'
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
export default defineComponent({
    props: {
        mapid: String,
        geocoderid: String,
        geocoderef: String,
        mapView:Boolean
    },
    setup(props, {refs, emit}) {
        const { geocoderef, mapid, mapView } = toRefs(props)
        const address = ref('')
        const cityStateZip = ref('')
        const map = ref({})
        const center = ref([-95,37])
        const createMap = async () => {
            try {
                mapboxgl.accessToken = process.env.mapboxKey
                map.value = new mapboxgl.Map({
                    container: mapid.value,
                    style: "mapbox://styles/mapbox/streets-v11",
                    center: center.value,
                    zoom: 4,
                });
                let geocoder = new MapboxGeocoder({
                    accessToken: process.env.mapboxKey,
                    mapboxgl: mapboxgl,
                    marker: false
                })
                map.value.addControl(geocoder)
                geocoder.on("result", (e) => {
                    const marker = new mapboxgl.Marker({
                        draggable: true,
                        color:"#D80739"
                    }).setLngLat(e.result.center).addTo(map.value)
                    center.value = e.result.center
                    marker.on("draged", (e) => {
                        center.value = Object.values(e.target.getLngLat());
                    });
                    address.value = e.result.address + " " + e.result.text
                    emit("sendAddress", address.value)
                });
            } catch (err) {
                console.log("map error", err)
            }
        }
        const createGeocoder = () => {
            const geocoder = new MapboxGeocoder({
                accessToken: process.env.mapboxKey,
                types: 'region,place,postcode,address',
                placeholder: 'Search for address...',
            })
            geocoder.setTypes('address').addTo('.form__geocoder')
        }
        const locationUpdated = (e) => {
            const property = refs[geocoderef.value]
            var element = property.firstChild.childNodes[1]
            var location = element.value.split(',', 3)
            let city
            let stateZip
            if (element.value !== '' && location.length > 1) {
                city = location[1].trim()
                stateZip = location[2].trim()
                address.value = location[0].trim()
                cityStateZip.value = city + ', ' + stateZip
            } else {
                city = ''
                stateZip = ''
                element.value = ''
                /* this.location.cityStateZip = ''
                this.location.address = '' */
            }
            emit('sendAddress', { address: address.value, cityStateZip: cityStateZip.value })
        }
   
        if (mapView.value) {
            onMounted(createMap)
        } else {
            onMounted(createGeocoder)
        }
        //onBeforeUnmount(createGeocoder)
        return {
            address,
            locationUpdated
        }
    },
})
</script>
<style lang="scss">
.map-holder {
    max-width:350px;
    width:100%;

    &__map {
        height:300px;
    
    }
}
</style>