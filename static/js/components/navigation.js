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
  <nav class="navbar">
        <div class="container-fluid">
          <div class="navbar">
            <ul class="nav navbar-nav navbar-left">
              <li class="nav-item"><router-link to="/">Home</router-link></li>
              <div v-if='api.isLoggedIn'>
                <li class="nav-item"><router-link :to="{name: 'user', params: {id: api.id}}">My Profile</router-link></li>
                <li class="nav-item"><a href="#" v-on:click='logout()'>Log Out</a></li>
                <li class="nav-item"><router-link to="/create">Create post</router-link></li>
              </div>
              <div v-else>
                <li class="nav-item"><router-link to="/login">Log In</router-link></li>
                <li class="nav-item"><router-link to="/register">Register</router-link></li>
              </div>
              <div v-if="api.isAdmin">
                <li class="dropdown nav-item">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button">Admin<span class="caret"></span></a>
                  <ul class="dropdown-menu">
                    <li><router-link to="/user-table">Users</router-link></li>
                    <li><router-link to="/admin-panel">Reviewpanel <span class="badge">5</span></router-link></li>

                  </ul>
                </li>
              </div>
            </ul>
            <!--<search-bar></search-bar>-->
          </div>
        </div>
      </nav>
  `
})
