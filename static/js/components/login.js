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
          console.log("logged in");
        },
        error => {
          this.error = error.response.msg;
          console.log(this.error);
        }
      );
    }
  },
  template:
    `
    <div>
      <div class="col-sm-6 login">
        <message v-if="error" type="error" v-bind:text="this.error"></message>
        <div class="wrap">
          <h2>Logge dich jetzt ein!</h2>
          <hr>
          <form @submit.prevent="login" @keydown='error = null'>
            <div class="form-group">
              <label for="username">Username:</label>
              <input type="text" id="username" v-model="username" placeholder="username">
            </div>
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" id="password" v-model="password_hash" placeholder="password">
            </div>
            <div class="form-group">
              <input class="btn btn-primary" type="submit" value="Login">
            </div>
          </form>
        </div>
      </div>
      <div class="col-sm-6 guide">
        <div class="wrap">
          <h2>Noch kein Account?</h2>
          <hr>
          <p><router-link to="/register">Klicke hier um dich zu registrieren!</router-link></p>
        </div>
      </div>
    </div>
    `
});
