/**
 * Zeigt die Registrierung an und verwendet dazu den User-Editor wieder.
 */
Vue.component("registration", {
  template: `
    <div id="registration">
      <user-editor :isUpdate='false'></user-editor>
    </div>
    `
});
