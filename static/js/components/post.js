Vue.component("post", {
  data () {
    return {
      author: null,
      api : api.state
    };
  },
  methods: {
    fetchPost(id) {
      api.get(`/api/posts/${id}`, data => {
        this.post = data.post
      });
    },
    deletePost(id){
      api.del(`/api/posts/${id}`, data => {
        //this.$parent.$options.methods.refresh();
        this.$emit('update', id)
      });
    }
  },
  props: ['post'],
  beforeRouteEnter(to, from, next) {
    api.get(`/api/posts/${to.params.id}`, data => {
      next(vm => {
        vm.post = data.post;
        vm.author = data.author;
      });
    });
  },
  computed: {
    imageUrl: function() {
      if(this.user.avatar == 1) {
        this.imageURL = "/static/img/" + this.user.id;
      }
      return imageURL;
    }
  },
  template: `
  <div class="post panel panel-default">
    <div class="panel-heading">
      <!--<img v-if="user.avatar === 1" :src="{ imgUrl }">
      <img v-else src="/static/img/default.gif">-->
      <router-link :to="{name: 'user', params: {id: post.author_id}}"><h1>{{ post.author }}</h1></router-link>
      <p class="clearfix">{{ post.created.toString() }}</p>
      <a v-if="post.reviewed === 1" class="btn btn-success" v-on:click="releasePost(post.id)" href="#">Release</a>
      <a v-if="api.admin === 1" class="btn btn-danger" v-on:click="deletePost(post.id)" href="#">Delete</a>
      <a v-else-if="api.id === post.author_id" class="btn btn-danger" v-on:click="deletePost(post.id)" >Delete</a>
    </div>
    <div class="panel-body">
      {{ post.content }}
    </div>
  </div>
  `
})
