<template>
  <div class="folder-contents-wrapper">
    <breadcrumbs page="storage" />
    <folder-contents :path="this.$route.params.uid" />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import FolderContents from '~/components/FolderContents.vue'
export default {
  components: { FolderContents },
  data: () => ({
    folders: [],
    subfolders: []
  }),
  async middleware({
    store,
    redirect,
    route
  }) {
    if (store.state.user.role !== "admin") {    
      return redirect("/")
    }
  },
  head() {
      return {
          title: `Report Folder - ${this.$route.params.uid}`
      }
  }
}
</script>