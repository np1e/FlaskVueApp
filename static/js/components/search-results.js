Vue.component("search-results", {
    data() {
        return {
            resultposts : this.$route.params.results,
            error: this.$route.params.error,
        };
    },
    template: `
    <div>
      {{ error }}
      <post v-for="post in resultposts" :key="post.id" v-bind:post="post"></post>
    </div>
    `
})
