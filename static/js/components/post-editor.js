Vue.component("post-editor", {
  data() {
    let data = {
      success: null,
      error: null,
      post: null,
      author: null,
      api: api.state
    };
    if (!this.isUpdate) {
      data.post = {content: ""};
    }
    return data;
  },
  props: ["isUpdate"],
  methods: {
    submit() {
      console.log("submitted")
      if (this.isUpdate) {
        this.updatePost();
      } else {
        this.createPost();
      }
    },
    refresh() {
      api.get('/api/posts/${this.post.id}', data => {
        this.post = data.post;
      })
    },
    updatePost() {
      api.put(
        `/api/posts/${this.post.id}`,
        this.post,
        data => {
          this.post = data.post;
          this.success = "Post successfully updated";
        },
        error => {
          this.onError(error);
          this.refresh();
        }
      );
    },
    createPost() {
      console.log("created")
      api.post(
        '/api/posts',
        this.post,
        () => {
          this.success = "Post successfully updated."
          this.$router.push('/');
        },
        this.onError.bind(this)
      );
    },
    onError(error) {
      this.error = error.response.msg;
    },
    clearMessages() {
      this.error = null;
      this.success = null;
    }
  },
  beforeRouteEnter(to, from, next) {
    api.get(`/api/posts/${to.params.id}`, data => {
      console.log("TEst");
      next(vm => (vm.author = data.author ? vm.api.id === data.author : false));
    });
  },
  template: `
    <div class="col-sm-8 col-sm-offset-2 edit-post">
      <form @submit.prevent="submit" @keydown="clearMessages()">
        <message v-if="success" type="success" :text="this.success"></message>
        <message v-if="error" type="error" :text="this.error"></message>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea class="form-control" name="content" v-model="post.content"></textarea>
        </div>
        <!--<div class="form-group">-->
          <input type="submit" :value="isUpdate ? 'Edit' : 'Create'">
        <!--</div>-->
      </form>
    </div>
  `
})
