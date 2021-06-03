<template>
  <div class="folder-contents-wrapper">
    <UiBreadcrumbs page="storage" />
    <FolderContents :path="`${repId}/${subfolder}`" />
  </div>
</template>
<script>
export default {
  data: () => ({
    files: []
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
  async asyncData({
    params, $axios
  }) {
    const repId = params.slug
    const subfolder = params.id
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