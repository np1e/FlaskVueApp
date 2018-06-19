Vue.component("search-bar", {
  data() {
    return {
      query: "",
      error: null
    };
  },
  methods: {
    search() {
        return null;
    }
  },
  template: `
    <form class = "navbar-form navbar-right" method='post'">
        <div class="input-group form-group">
          <input type="text" v-model="query" class="form-control mr-sm-2" placeholder="Search" name="query">
          <span class="input-group-btn">
            <button v-on:click="search()" type="submit" class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button>
          </span>
        </div>
    </form>
    `
})
