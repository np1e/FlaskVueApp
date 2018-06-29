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
  template: `
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <router-link to="/" class="navbar-brand" href="#">DefinitelyNotTwitter</router-link>
              <ul class="nav navbar-nav">
                <li v-if='api.isLoggedIn'><router-link to="/">Home</router-link></li>
                <li v-if='api.isLoggedIn'><router-link :to="{name: 'user', params: {id: api.id}}">My Profile</router-link></li>
                <li v-if='api.isLoggedIn'><router-link to="/post/create">Create post</router-link></li>
                <li v-if='api.isLoggedIn'><router-link to="/search-results">Search</router-link></li>
                <li v-if='!api.isLoggedIn'><router-link to="/">Home</router-link></li>
                <li v-if='!api.isLoggedIn'><router-link to="/login">Log In</router-link></li>
                <li v-if='!api.isLoggedIn'><router-link to="/register">Register</router-link></li>
                <li v-if='api.isAdmin' class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">Admin<span class="caret"></span></a>
                  <ul class="dropdown-menu">
                    <li><router-link to="/user-table">Users</router-link></li>
                    <li><router-link to="/admin-panel">Reviewpanel <span class="badge">5</span></router-link></li>
                  </ul>
                </li>
              </ul>
              <ul class="nav navbar-nav navbar-right">
                <li><span class="navbar-text">{{ api.username }}</span></li>
                <li v-if='api.isLoggedIn'><a href="#" v-on:click='logout()'>Log Out</a></li>
              </ul>

          </div>
        </div>
      </nav>
  `
})
