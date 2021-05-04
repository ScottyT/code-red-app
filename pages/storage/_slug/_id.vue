<template>
  <div class="folder-contents-wrapper">
    <breadcrumbs page="storage" />
    <folder-contents :path="`${repId}/${subfolder}`" />
  </div>
</template>
<script>
import FolderContents from '~/components/FolderContents.vue'
export default {
  components: { FolderContents },
  data: () => ({
    files: []
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
  async asyncData({
    params
  }) {
    const repId = params.slug
    const subfolder = params.id
    console.log("repId:", repId)
    return {
      repId,
      subfolder
    }
  },
  head() {
    return {
      title: `Report Folder - ${this.repId} Date - ${this.subfolder}`
    }
  }
}
</script>