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
            '/api/search/'+this.query,
            () => {
                this.$router.push({ name: 'search-results', params: { title: 123 }})
            },
            error => {
                this.error = error.response.msg;
                console.log(this.error);
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
