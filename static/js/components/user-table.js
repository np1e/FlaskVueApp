/**
 * Komponente wird global registriert und kann dann ganz entspannt im Template
 * von anonymer Komponente verwendet werden um im <router-view> angezeigt zu werden.
 * Gleichzeitig muss der globale Namensraum nicht mit Variablen vollgemüllt werden.
 */
Vue.component("user-table", {
  data() {
    return {
      users: null,
      error: "",
      api: api.state
    };
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    deleteUser(userId){
      /** api.del kommt aus api-client.js */
      api.del(`/api/users/${userId}`, data => {
        this.fetchData()
      });
    },
    fetchData() {
      /** api.get kommt aus api-client.js */
      api.get("/api/users", data => {
        this.users = data.users;
      });
    },
    promoteUser(userId) {
      let user = null;
      this.users.forEach(function(u) {
        if(u.id == userId) {
          user = u;
        }
      });
      user.admin==1 ? user.admin=0 : user.admin=1;
      console.log(user);
      api.put(`/api/users/${userId}`,
        user,
        data => {
          this.fetchData()
        },
        this.onError.bind(this)
      );
    },
    onError(error) {
      this.error = error.response.msg;
    },
    restrictUser(userId) {
      let user = null;
      this.users.forEach(function(u) {
        if(u.id == userId) {
          user = u;
        }
      });
      user.restricted == 1 ? user.restricted = 0 : user.restricted = 1;
      api.put(`/api/users/${userId}`,
        user,
        data => {
          this.fetchData()
        },
        this.onError.bind(this)
      );
    }
  },
  computed: {
    self: function() {
      return this.api.id;
    }
  },
  template: `
    <table class="table">
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th># follower</th>
            <th>Registered</th>
            <th>E-Mail</th>
            <th colspan="2">Tools</th>
        </tr>
        <tr v-for='user in users'>
            <td>{{user.id}}</td>
            <td >{{user.username}}</td>
            <td>user.followers.length</td>
            <td>{{user.registered}}</td>
            <td>{{user.email}}</td>
            <td><router-link class="btn" :to="{name: 'userEdit', params: {id: user.id}}" tag="button">edit</router-link></td>
            <td><button class="btn" type="butto" @click="promoteUser(user.id)" v-bind:disabled="user.restricted == 1">{{ user.admin == 1 ? 'Strip' : 'Promote'}}</button></td>
            <td><button class="btn" type="button" @click="restrictUser(user.id)" v-bind:disabled="user.admin == 1">{{ user.restricted == 1 ? 'Unrestrict' : 'Restrict'}}</button></td>
            <td><button class="btn btn-danger" type="button" @click="deleteUser(user.id)" v-bind:disabled="self == user.id">delete</button></td>
        </tr>
    </table>
    `
});
