<template>

    <!-- <div :id="geocoderid" :ref="geocoderef" class="form__geocoder form__input" @change="locationUpdated"></div> -->
    <div class="map-holder">
        <div class="map-holder__map" :id="mapid"></div>
    </div>
   <!--  <input type="text" class="location-control" :value="location" /> -->
</template>
<script>
import { defineComponent, onMounted, ref, toRefs } from '@nuxtjs/composition-api'
import mapboxgl from "mapbox-gl"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
export default defineComponent({
    props: {
        mapid: String,
        geocoderid: String,
        geocoderef: String
    },
    setup(props, {refs, emit}) {
        const { geocoderef, mapid } = toRefs(props)
        const address = ref('')
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
        const locationUpdated = (e) => {
            const property = refs[geocoderef.value]
            var element = property.firstChild.childNodes[1]
            var location = element.value.split(',', 3)
            address.value = location[0].trim()
        }

        onMounted(createMap)
        return {
            address,
            locationUpdated
        }
    },
})
</script>
<style lang="scss">
.map-holder {
    max-width:330px;
    width:100%;

    &__map {
        height:300px;
    
    }
}
</style>