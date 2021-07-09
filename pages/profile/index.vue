<template>
  <div class="profile">
    <h1 class="profile__title">Welcome back {{user.name}}</h1>
  </div>
</template>
<script>
import { defineComponent, onMounted, useContext, computed, ref, useRouter, useStore } from "@nuxtjs/composition-api";

export default defineComponent({
  /* async middleware({redirect, store}) {
    if (email === null) {
      return redirect("/")
    }
  }, */
  setup(props, context) {
    const { $fire } = useContext()
    const router = useRouter()
    const store = useStore()
    const user = computed(() => store.getters['users/getUser'])
    console.log(user)
    const checkIfUser = () => {
      if ($fire.auth.currentUser === null) {
        console.log("not logged in")
        router.push('/')
      } else {
        console.log("logged in")
      }
    }
    
    
    onMounted(checkIfUser)
    return {
      checkIfUser,
      user
    }
  }
})
</script>
<style lang="scss">
.profile {
  display:grid;
  grid-template-columns:1fr 1fr 1fr;
  grid-template-rows:100px 1fr;
  &__title {
    grid-column:1/4;
  }
  &__group {
    margin-bottom:10px;
    li {
      padding-bottom:10px;
    }
  }
}
</style>