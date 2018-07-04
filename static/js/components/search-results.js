Vue.component("search-results", {
    data() {
        return {
            query: "",
            order: "desc",
            error: null,
            user_error: null,
            resultposts: null,
            resultusers: null
        };
    },
    methods: {
      sync(id) {
        let newPosts = this.resultposts.filter(function(el) {
          return el.id !== id;
        });
      },
      search() {
        json = {"query":this.query, "order":this.order};
        api.post(
            `/api/posts/search`, json , data => {
                console.log("searched");
                this.resultposts = data.resultposts;
                this.error = null;
                //this.$router.push({ name: 'search-results', params: { results: data.resultposts }});
            },
            error => {
                this.error = error.response.msg;
                this.resultposts = null;
                //this.$router.push({ name: 'search-results', params: { error: "No matching posts found" }});
            }
        );
        api.post(
            `/api/users/search`, json , data => {
                console.log("user gesucht");
                this.resultusers = data.resultusers;
                this.user_error = null;
                //this.$router.push({ name: 'search-results', params: { user_results: data.resultusers }});
            },
            user_error => {
                this.user_error = user_error.response.msg;
                this.resultusers = null;
                //this.$router.push({ name: 'search-results', params: { user_error: "No matching users found" }});
            }
        );
      }
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

    <form class = "navbar-form navbar-left" @submit.prevent="search">
        <div class="input-group form-group">
          <input type="text" v-model="query" class="form-control mr-sm-2" placeholder="Search" name="query">
          <span class="input-group-btn">
            <button type="submit" class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button>
          </span>
        </div>
    </form>
    <br><br>
    <h1>Found Users:</h1>
    {{ user_error }}
    <router-link v-for="user in resultusers" :to="{name: 'user', params: {id: user.id}}"">{{ user.username }}<br></router-link>
    <hr/>
    <h1>Found Posts:</h1>
    {{ error }}
    <post v-for="post in resultposts" :key="post.id" @update="sync" v-bind:post="post"></post>
  </div>
  `
})
