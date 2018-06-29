Vue.component("search-results", {
    data() {
        return {
            resultusers : this.$route.params.user_results,
            resultposts : this.$route.params.results,
            error: this.$route.params.error,
            user_error: this.$route.params.user_error
        };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.resultusers = vm.$route.params.user_results;
        vm.resultposts = vm.$route.params.results;
        vm.error= vm.$route.params.error;
        vm.user_error= vm.$route.params.user_error;
      });
    },
    template: `
    <div>
      <h1>Found Users:</h1>
      {{ user_error }}
      <router-link v-for="user in resultusers" :to="{name: 'user', params: {id: user.id}}"">{{ user.username }}<br></router-link>
      <hr/>
      <h1>Found Posts:</h1>
      {{ error }}
      <post v-for="post in resultposts" :key="post.id" v-bind:post="post"></post>
    </div>
    `
})
