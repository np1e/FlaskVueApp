Vue.component("user", {
  data() {
    return {
      user: null,
      id: null,
      api: api.state,
      follower: null,
      posts: null,
      imageURL: "/static/img/default.gif"
    };
  },
  mounted() {
    this.fetchData()
  },
  created() {
    this.id = this.$route.params.id;
  },
  methods: {
    fetchData() {
      api.get(`/api/users/${this.id}`, data => {
        this.user = data.user;
        this.posts = data.posts;
      });
      api.get(`/api/follower/${this.id}`, data => {
        this.follower = data.follower;
        console.log(data.follower);
      })
      console.log(this.posts);
    },
    follow() {

    },
    unfollow() {

    }
  },
  computed: {
    imageUrl: function() {
      if(this.user.avatar == 1) {
        this.imageURL = "/static/img/" + this.user.id;
      }
      return imageURL;
    },
    follows: function() {
      let x;
        for(x in this.follower) {
          if(api.id == x.id) {
            return true;
          }
        }
      return false;
    }
  },
  template: `
  <div>
    <div class="col-sm-4 user-profile">
      <img v-if="this.user.avatar === 1" :src="{ imgUrl }">
      <img v-else src="/static/img/default.gif">
      Username: {{ this.user.username }}<br>
      <span v-if="this.user.descrip">Description: {{ this.user.descrip }}</span><br>
      <router-link v-if="api.id === this.user.id" class="action" :to="{name: 'userEdit', params: {id: api.id}}">Edit your profile</router-link>
      <span>Follower: {{ this.follower.length }}</span>
      <a v-if="api.id !== user.id && !{ follows }" class="action" v-on:click="follow()">Follow</a>
      <a v-else-if="api.id !== user.id && { follows }" class="action" v-on:click="unfollow()">Unfollow</a>
    </div>
    <div class="col-sm-8 posts">
      <post v-for="post in posts" :key="post.id"></post>
    </div>
  </div>
    `
});
