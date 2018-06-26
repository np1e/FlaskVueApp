Vue.component("feed", {
  data (){
    return {
      posts : null,
      id : api.state.id,
      follower : null
    };
  },
  mounted() {
    this.getFeed()
  },
  methods: {
    get_follower(){
      api.get(`/api/following/${this.id}`, data => {
        this.following = data.following;
      });
    },
    getFeed(){
      this.get_follower();
      for (x in this.following) {
        this.posts += getPosts(x.id);
      }
    },
    getPosts(id){
      api.get(`/api/posts/users/${id}`, data => {
        return data.posts;
      });
    }
  },

  template: `
  <div class="col-sm-8 posts">
    <post v-for="post in posts" :key="post.id" v-bind:post="post"></post>
  </div>
  `
});
