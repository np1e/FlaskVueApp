Vue.component("user", {
  data() {
    return {
      Username: null,
      id: null,
      api: api.state,
      follower: null,
      posts: null,
      success: "",
      error: "",
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
    sync() {
        this.fetchData();
    },
    fetchData() {
      api.get(`/api/users/${this.id}`, data => {
        this.user = data.user;
        this.posts = data.posts;
        console.log(data.posts);
      });
      api.get(`/api/follower/${this.id}`, data => {
        this.follower = data.follower;
        console.log(data.follower);
      });
      console.log(this.posts);
    },
    beforeRouteEnter(to, from, next) {
      api.get(`/api/users/${to.params.id}`, data => {
        next(vm => {
          vm.user = data.user;
          vm.posts = data.posts;
          //vm.follower = data.follower;
        });
      });
    },
    refresh(){
      window.location.reload(true);
    },
    setFollow() {

      console.log("follow")
      if(!this.follows) {
        json = {"type": "add", "id": this.api.id};
        api.put(
          `/api/follower/${this.id}`,
          json,
          () => {
            this.success = "Now following user " + this.user.username;
            this.refresh();
          },
          error => {
            this.onError(error);
            this.refresh();
          }
        );
      } else {
        json = {"type": "delete", "id": this.api.id};
        api.put(
          `/api/follower/${this.id}`,
          json,
          () => {
            this.success = "No longer following " + this.user.username;
            this.refresh();
          },
          error => {
            this.onError(error);
            this.refresh();
          }
        );
      }
    },
    refresh() {
      this.fetchData();
    },
    onError(error) {
      this.error = error.response.msg;
    },
  },
  props: ['user'],
  computed: {
    imageUrl: function() {
      if(this.user.avatar == 1) {
        this.imageURL = "/static/img/" + this.user.id;
      }
      return imageURL;
    },
    follows: function() {
      let follows = null;
      this.follower.forEach(function(f) {
        console.log(this.is)
        if(api.state.id == f.id) {
          console.log(f.id + " follows " + this.id);
          follows= true;
          return;
        }
        follows= false;
        return;
      });
      return follows;
    }
  },
  template: `
  <div>
    <div class="col-sm-4 user-profile">
      <img v-if="user.avatar === 1" :src="{ imgUrl }">
      <img v-else src="/static/img/default.gif">
      Username: {{ user.username }}<br>
      <span v-if="user.descrip">Description: {{ user.descrip }}</span><br>
      <router-link v-if="api.id === user.id" class="action" :to="{name: 'userEdit', params: {id: api.id}}">Edit your profile</router-link>
      <span>Follower: {{ follower.length }}</span>
      <button v-if="api.id !== user.id" class="btn" v-on:click="setFollow()">{{ follows ? 'Unfollow' : 'Follow'}}</button>
      <button v-else-if="api.id !== user.id && follows" class="btn" v-on:click="unfollow()">Unfollow</button>
    </div>
    <div class="col-sm-8 posts">
      <post v-for="post in posts" @update="sync" :key="post.id" v-bind:post="post"></post>
    </div>
  </div>
    `
});
