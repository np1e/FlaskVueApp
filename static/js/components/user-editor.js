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
        descrip: "",
        password_hash: "",
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

      console.log("registered")
      api.post(
        `/api/users`,
        this.user,
        () => {
          this.succes = "User successfully registered.";
          this.$router.push("/login");
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
  template: `
  <div class="col-sm-6 edit" v-if='user'>
    <div class="wrap">
      <h2>Account bearbeiten:</h2>
      <hr>
      <form @submit.prevent="submit" @keydown="clearMessages()">
        <message v-if="success" message="'success': this.success"></message>
        <message v-if="error" message="'error': this.error"></message>
        <div class="form-group">
          <label for="username">Username</label>
          <input class="form-control" id="username" type="text" name="username" v-model='user.username'>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input class="form-control" id="email" type="email" name="email" v-model='user.email'>
        </div>
        <div class="form-group"><br>
          <label for='desc'>Description</label>
          <textarea class="form-control" name='desc' id='desc' v-model="user.descrip"></textarea><br>
        </div>
        <div class="form-group">
          <label for="newPwd">New Password</label>
          <input class="form-control" id="newPwd" type="password" name="newPwd" v-model='user.password_hash'>
        </div>
        <div class="form-group" v-if="isUpdate">
          <label for="oldPwd">Old Password</label>
          <input class="form-control" id="oldPwd" type="password" name="oldPwd" v-model='user.oldPassword'>
        </div>
        <input type="submit" :value="isUpdate ? 'update' : 'register'">
      </form>
    </div>
  </div>
  `
});
