vue = new Vue({
  el: "#vue-app",
  data() {
    return {
      users: null
    };
  },
  mounted() {
    getAjax("/api/users", data => {
      this.users = JSON.parse(data)["users"];
    });
  },
  template: `
    <table>
        <tr>
            <th>Username</th>
            <th>E-Mail</th>
        </tr>
        <tr v-for='user in users'>
            <td>{{user.username}}</td>
            <td>{{user.email}}</td>
        </tr>
    </table>
    `
});
