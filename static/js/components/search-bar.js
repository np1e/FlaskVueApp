Vue.component("search-bar", {
  data() {
    return {
      query: "",
      error: null
    };
  },
  methods: {
    submit() {
      return null;
    },
    search() {
        return null;
    }
  },
  template: `
    <form class = "navbar-form navbar-left" @submit-prevent="submit">
        <div class="input-group form-group">
          <input type="text" v-model="query" class="form-control mr-sm-2" placeholder="Search" name="query">
          <span class="input-group-btn">
            <button type="submit" class="btn btn-default"><i class="glyphicon glyphicon-search"></i></button>
          </span>
        </div>
    </form>
    `
})
