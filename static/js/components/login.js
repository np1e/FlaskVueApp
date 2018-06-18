/**
 * Zeigt ein simples Formular für den Login an ist das Bindeglied zum
 * API-Client (api-client.js).
 */
Vue.component("login", {
  data() {
    return {
      username: "",
      password: "",
      error: null
    };
  },
  methods: {
    login() {
      api.login(
        this.username,
        this.password,
        () => {
          this.$router.push("/");
        },
        error => {
          this.error = error.response.msg;
        }
      );
    }
  },
  template: `
    <div id="login">
      <span class="error" v-if='error'>{{ error }}</span>
      <form @submit.prevent="login" @keydown='error = null'>
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" placeholder="username">
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" placeholder="password">
        </div>
        <div>
          <input type="submit" value="login">
        </div>
      </form>
      <router-link class="login-register" to="/register">Don' have an account? Click to register.</router-link>
    </div>
    `
});
