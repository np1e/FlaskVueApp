/**
 * Zeigt die Registrierung an und verwendet dazu den User-Editor wieder.
 */
Vue.component("registration", {
  template: `
    <div id="registration">
      <user-editor :isUpdate='false'></user-editor>
      <router-link class="login-register" to="/login">Already have an account? Click to login.</router-link>
    </div>
    `
});
