/**
 * Komponente wird global registriert und kann dann ganz entspannt im Template
 * von anonymer Komponente verwendet werden um im <router-view> angezeigt zu werden.
 * Gleichzeitig muss der globale Namensraum nicht mit Variablen vollgemüllt werden.
 */
Vue.component("user-table", {
  data() {
    return {
      users: null
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
      })
    },
    fetchData() {
      /** api.get kommt aus api-client.js */
      api.get("/api/users", data => {
        this.users = data.users;
      });
    }
  },
  template: `
    <table class="user-table">
        <tr>
            <th>Username</th>
            <th>E-Mail</th>
            <th colspan="2">Tools</th>
        </tr>
        <tr v-for='user in users'>
            <td>{{user.username}}</td>
            <td>{{user.email}}</td>
            <td><router-link :to="{name: 'user', params: {id: user.id}}" tag="button">edit</router-link></td>
            <td><button type="button" @click="deleteUser(user.id)">delete</button></td>
        </tr>
    </table>
    `
});
