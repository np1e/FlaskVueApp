Vue.component("feed", {
  data (){
    return {
      posts : null,
      id : api.state.id,
      following : ""
    };
  },
  mounted() {
    this.get_follower()
  },
  methods: {
    get_follower(){
      api.get(`/api/following/${this.id}`, data => {
        this.following = data.following;
        this.getFeed();
      });
    },
    getFeed(){
        ids = [];
        for (i = 0; i < this.following.length; i++) {
          ids[i] = (this.following[i].id);
        }
        console.log(ids);
        api.post(`/api/posts/users/`, ids, data => {
          console.log(data.posts);
          this.posts = data.posts;
          return this.posts;
        });
    }
        /*
      for (i = 0; i < this.following.length; i++) {
        this.getPosts(this.following[i].id);
      }
    },
    getPosts(id){
      api.get(`/api/posts/users/${id}`, data => {
        console.log(data.posts);
        this.posts = data.posts;
        return this.posts;
      });
    }*/
  },

  template: `
  <div class="col-sm-8 posts">
    <post v-for="post in posts" :key="post.id" v-bind:post="post"></post>
  </div>
  `
});
