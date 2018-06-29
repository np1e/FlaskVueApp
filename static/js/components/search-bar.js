Vue.component("search-bar", {
    data() {
        return {
            query: "",
            order: "desc",
            error: null,
            user_error: null,
            resultposts: null,
            reusltusers: null
        };
    },
    methods: {
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
            this.$router.push({ name: "search-results", params: {user_results: this.resultusers, results: this.resultposts, user_error: this.user_error, error: this.error }});
        }
    },
    template: `
    <form class = "navbar-form navbar-left" @submit.prevent="search">
        <div class="input-group form-group">
          <input type="text" v-model="query" class="form-control mr-sm-2" placeholder="Search" name="query">
          <span class="input-group-btn">
            <button type="submit" class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button>
          </span>
        </div>
    </form>
    `
})
