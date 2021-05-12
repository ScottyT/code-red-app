<template>
    <div class="breadcrumb-wrapper">
        <div class="breadcrumb-wrapper__back">
            <a class="button button--normal" @click="$router.back()">
                <v-icon>mdi-chevron-left</v-icon>Go back
            </a>
        </div>
        <nav class="breadcrumb-wrapper__breadcrumb" aria-label="breadcrumbs" v-if="displayStrip">
            <ul>
                <li v-for="(item, i) in crumbs" :key="`breadcrumb-${i}`" :class="item.classes">
                    <nuxt-link :to="item.to" exact>{{item.name}}</nuxt-link>
                    <v-icon class="breadcrumb-wrapper__breadcrumb--icon">mdi-chevron-right</v-icon>
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
export default {
  name: "Breadcrumbs",
  props: {
    page: {
      type: String,
      required: true
    },
    displayStrip: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  computed: {
    crumbs() {
      const pathArray = this.$route.path.split('/')
      pathArray.shift()
      var breadcrumbs = pathArray.reduce((crumbs, path, index) => {
        crumbs.push({
          path: path,
          name: path.charAt(0).toUpperCase() + path.slice(1),
          to: crumbs[index - 1] ? "/" + crumbs[index - 1].path + "/" + path : "/" + path,
          classes: index === pathArray.length - 1 ? 'is-active' : ''
        })
        
        return crumbs
      }, [])
      
      return breadcrumbs
    }
  }
}
</script>
<style lang="scss">
.breadcrumb-wrapper {
  display: grid;
  grid-template-columns: 200px 1fr;
  margin-bottom:30px;

  &__back {
    padding-right: 20px;
  }

  &__breadcrumb {
    >ul {
      display: flex;
    }

    li {
      margin-right: 10px;

      &:last-child {
        .breadcrumb-wrapper__breadcrumb--icon {
          display: none;
        }
      }
      &.is-active {
          color:grey;
          pointer-events: none;
      }
    }

    &--icon {
      display: block;
    }

  }
}
</style>