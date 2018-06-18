/**
 * Einfache Navigationskomponente, die den Namen des angemeldeten Nutzers
 * und einen Button zum abmelden anzeigt. Nach dem Logout wird über den
 * Vue-Router wieder das Login-Formular angezeigt.
 */
Vue.component('navigation', {
  data () {
    return {
      api : api.state
    }
  },
  methods: {
    logout () {
      api.logout()
      this.$router.replace('/login')
    }
  },
  template: `<div id="navigation">
    <router-link to='/'>Users</router-link>
    <span class="account-info">
      {{api.username}} - <button type='button' @click='logout'>logout</button>
    </span>
  </div>
  `
})