<template>
  <div class="big-hero">
    <img :src="slice.primary.hero_image.url" />
  </div>
</template>
<script>
export default {
  name: 'BigHero',
  props: ['slice'],
}
</script>
<style lang="scss">
.big-hero {
  height: 40vh;
  position: relative;
}
</style>
