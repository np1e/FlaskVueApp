/**
 * Komponente wird global registriert und kann dann ganz entspannt im Template
 * von anonymer Komponente verwendet werden um im <router-view> angezeigt zu werden.
 * Gleichzeitig muss der globale Namensraum nicht mit Variablen vollgemüllt werden.
 */
Vue.component("user-editor", {
  data() {
    let data = {
      success: null,
      error: null,
      user: null
    };
    if (!this.isUpdate) {
      data.user = {
        username: "",
        email: "",
        password: ""
      };
    }
    return data;
  },
  props: ["isUpdate"],
  methods: {
    submit() {
      if (this.isUpdate) {
        this.updateUser();
      } else {
        this.createUser();
      }
    },
    refresh() {
      api.get(`/api/users/${this.user.id}`, data => {
        this.user = data.user;
      });
    },
    updateUser() {
      api.put(
        `/api/users/${this.user.id}`,
        this.user,
        data => {
          this.user = data.user;
          this.success = "User successfully updated.";
        },
        error => {
          this.onError(error);
          this.refresh();
        }
      );
    },
    createUser() {
      api.post(
        `/api/users`,
        this.user,
        () => this.$router.push("/login"),
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
    api.get(`/api/users/${to.params.id}`, data => {
      next(vm => (vm.user = data.user));
    });
  },
  /**
   * Template ist mit v-if nur sichtbar, wenn ein User gesetzt ist.
   *
   * @submit fängt das normale Submitverhalten ab und tauscht es durch
   * eine eigene JavaScript-Funktion aus.
   */
  template: `<form @submit.prevent="submit" @keydown="clearMessages()" v-if='user'>
    <span class="error" v-if='error'>{{ error }}</span>
    <span class="success" v-if='success'>{{ success }}</span>
    <div>
      <label for="username">Username:</label>
      <input id="username" type="text" name="username" v-model='user.username'>
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" name="email" v-model='user.email'>
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" name="password" v-model='user.password'>
    </div>
    <input type="submit" :value="isUpdate ? 'update' : 'register'">
  </form>
  `
});
