<template>
  <div class="folder-contents-wrapper">
    <UiBreadcrumbs page="storage" />
    <FolderContents :path="this.$route.params.uid" subPath="" />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  layout: 'default',
  data: () => ({
    folders: [],
    subfolders: []
  }),
  async middleware({
    store,
    redirect,
    route
  }) {
    if (store.state.users.user.role !== "admin") {    
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