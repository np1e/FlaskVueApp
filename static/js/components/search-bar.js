Vue.component("search-bar", {
    data() {
        return {
            query: "",
            error: null
        };
    },
    methods: {
        search() {
            api.get(
                `/api/search/${this.query}`, data => {
                    console.log("searched");
                    this.$router.push({ name: 'search-results', params: { results: data.resultposts }});
                },
                error => {
                    this.error = error.response.msg;
                    console.log(this.error);
                    this.$router.push({ name: 'search-results', params: { error: "No matching posts found" }});
                }
            );
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
