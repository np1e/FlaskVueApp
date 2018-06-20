/* global Vue, VueRouter, api */

/**
 * Die Konstruktion mit der anonymen Funktion und "use strict" beschützt unseren
 * globalen Namensraum (window) vor ungewollt deklarierten globalen Variablen.
 */
(function() {
  "use strict";
  /**
   * Routen innerhalb der Applikation mit zugehörigen Templates.
   * Mit der Funktion Vue.component können neue Komponenten registriert
   * aber auch bereits registrierte Komponenten referenziert werden.
   *
   * Das nutzen wir aus, um den globalen Namensraum nicht mit Komponenten
   * vollzumüllen.
   */
  const routes = [
    { path: "/", component: Vue.component("feed") },
    { path: "/login", component: Vue.component("login") },
    { path: "/register", component: Vue.component("registration") },
    {
      path: "/user/edit/:id",
      name: "user",
      component: Vue.component("user-editor"),
      props: { isUpdate: true }
    },
    {
      path: "/user/:id",
      name: "user",
      component: Vue.component("user")
    },
    { path: "/admin-panel", component: Vue.component("admin-panel") },
    { path: "/post/create", component: Vue.component("create")},
    {
      path: "/post/edit/:id",
      name: "post",
      component: Vue.component("post-editor"),
      props: { isUpdate: true }
    },
    {
      path: "/post/:id",
      name: "post",
      component: Vue.component("post")
    },
    { path: "/user-table", component: Vue.component("user-table")}
  ];
  /** Initalisierung des Routers, mit den vorher definierten Komponenten */
  const router = new VueRouter({
    routes
  });

  /**
   * Navigation wird immer überwacht. Wenn der Nutzer nicht mehr eingeloggt ist,
   * wird automatisch auf den Login umgeleitet. Das kann zum Beispiel passieren,
   * wenn der Link aus der Adresszeile per Copy-Paste übernommen wurde
   */
  router.beforeEach((to, from, next) => {
    let unprotected_routes = ["/login", "/register"];
    if (!api.isLoggedIn && unprotected_routes.indexOf(to.path) < 0) {
      // kein browsen ohne login
      next("/login");
    } else if (api.isLoggedIn && unprotected_routes.indexOf(to.path) > 0) {
      // kein login und keine registrierung wenn angemeldet
      next("/");
    } else {
      // ansonsten weiter browsen
      next();
    }
  });

  /**
   * Initialisierung der App. Die App überwacht auch den Login-Zustand der API
   * und blendet in Abhängigkeit davon die Navigation ein oder aus.
   */
  new Vue({
    data() {
      return {
        api: api.state
      };
    },
    el: "#vue-app",
    router: router,
    template: `
      <div class="container">
        <h2>NotTwitter</h2>
        <navigation></navigation>
        <message></message>
        <div>
          <router-view></router-view>
        </div>
      </div>`
  });
})();
