

Vue.component('post', {
  props: {
    author: String,
    content: String
  },
  template: `
    <h3>{{ author }}</h3><br/>
    <p>{{ content }}</p><hr>`
});


vue = new Vue({
  el: "#vue-app",
  data() {
    return {
      posts: null,
      test: 'test'
    };
  },
  mounted() {
    getAjax("/api/posts", data => {
      this.posts = JSON.parse(data)["posts"];
    });
    console.log("mounted");
  },
  template: `
      <div>
        <p>{{ test }}</p>
        <post
        v-for="post in posts"
        v-bind:key="post.id"
        v-bind:author="post.author"
        v-bind:content="post.content"
        ></post>
      </div>
    `
});
