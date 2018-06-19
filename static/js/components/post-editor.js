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
          this.success = "User successfully updated";
        },
        error => {
          this.onError(error);
          this.refresh();
        }
      );
    },
    createPost() {
      api.post(
        '/api/posts',
        this.post,
        () => this.$router.push('/'),
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
      next(vm => (vm.author = data.author ? vm.api.id === data.author : return false));
    });
  },
  template: `
    <div class="col-sm-8 col-sm-offset-2 edit-post">
      <form @submit-prevent="submit" @keydown="clearMessages()">
        <message v-if="success" message="'success': this.success"></message>
        <message v-if="error" message="'error': this.error"></message>
        <div class="form-group">
          <label for="content">Content</label>
          <textarea class="form-control" name="content" v-model="post.content"></textarea>
        </div>
        <div class="form-group">
          <input class="btn btn-primary" type="submit" value="isUpdate ? Edit : Create">
        </div>
      </form>
    </div>
  `
})
