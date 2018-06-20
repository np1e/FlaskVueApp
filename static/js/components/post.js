Vue.component("post", {
  data () {
    return {
      post: null,
      author: null,
      api : api.state
    };
  },
  methods: {
    fetchPost(id) {
      api.get(`/api/posts/${id}`, data => {
        this.post = data.post
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    api.get(`/api/posts/${to.params.id}`, data => {
      next(vm => {
        vm.post = data.post;
        vm.author = data.author;
      });
    });
  },
  template: `
  <div class="post panel panel-default">
    <div class="panel-heading">
      <div v-if="author.avatar === 1">
        <img src="/static/img/{{ author.id }}.jpg">
      </div>
      <div v-else>
        <img src="/static/img/default.gif">
      </div>
      <router-link :to="{name: 'profile', params: {id: author.id}}"><h1>{{ author.username }}</h1></router-link>
      <p class="clearfix">{{ post.created.toString() }}</p>
      <a v-if="post.reviewed === 1" class="btn btn-success" v-on:click="releasePost(post.id)" href="#">Release</a>
      <a v-if:"api.admin === 1" class="btn btn-danger" v-on:click="deletePost(post.id)" href="#">Delete</a>
      <a v-else-if="api.id === author.id" class="btn btn-danger" v-on:click="deletePost(post.id)" href="#">Delete</a>
    </div>
    <div class="panel-body">
      {{ post.content }}
    </div>
  </div>
  `
})
