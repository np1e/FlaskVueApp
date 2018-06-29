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
      api: api.state,
      sortOrder: "",
      sortBy: ""
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
    },
    dynamicSort(property) {
      var sortOrder = 1;
      this.sortOrder = "asc";
      this.sortBy = property;
      if(property[0] === "-") {
          this.sortOrder = "desc";
          sortOrder = -1;
          property = property.substr(1);
          this.sortBy = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      };
    },
    sort(property) {
      if(this.sortBy == property) {
        let prepend = "-" ? this.sortOrder == 'asc' : "";
        prepend += property;
      }
      this.users.sort(this.dynamicSort(property));
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
            <th>
              <button class="noBtn" @click="sort('id')">ID</button>
              <span v-if="this.sortBy == 'id' && this.sortOrder == 'asc'" class="glyphicon glyphicon-chevron-up"></span>
              <span v-if="this.sortBy == 'id' && this.sortOrder == 'desc'" class="glyphicon glyphicon-chevron-down"></span>
            </th>
            <th>
              <button class="noBtn" @click="sort('username')">Username</button>
              <span v-if="this.sortBy == 'username' && this.sortOrder == 'asc'" class="glyphicon glyphicon-chevron-up"></span>
              <span v-if="this.sortBy == 'username' && this.sortOrder == 'desc'" class="glyphicon glyphicon-chevron-down"></span>
            </th>
            <th>
              <button class="noBtn" @click="sort('followers')"># follower</button>
              <span v-if="this.sortBy == 'follower' && this.sortOrder == 'asc'" class="glyphicon glyphicon-chevron-up"></span>
              <span v-if="this.sortBy == 'id' && this.sortOrder == 'desc'" class="glyphicon glyphicon-chevron-down"></span>
            </th>
            <th>
              <button class="noBtn" @click="sort('registered')">Registered</button>
              <span v-if="this.sortBy == 'registered' && this.sortOrder == 'asc'" class="glyphicon glyphicon-chevron-up"></span>
              <span v-if="this.sortBy == 'registered' && this.sortOrder == 'desc'" class="glyphicon glyphicon-chevron-down"></span>
            </th>
            <th>
              <button class="noBtn" @click="sort('email')">E-Mail</button>
              <span v-if="this.sortBy == 'email' && this.sortOrder == 'asc'" class="glyphicon glyphicon-chevron-up"></span>
              <span v-if="this.sortBy == 'email' && this.sortOrder == 'desc'" class="glyphicon glyphicon-chevron-down"></span>
            </th>
            <th colspan="2">Tools</th>
        </tr>
        <tr v-for='user in users'>
            <td>{{user.id}}</td>
            <td><router-link :to="{name: 'user', params: {id: user.id}}">{{ user.username }}</router-link></td>
            <td>{{ user.followers }}</td>
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
