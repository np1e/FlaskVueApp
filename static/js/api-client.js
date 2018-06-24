/**
 * Zustandsbehafter Client für den Zugriff auf die API. Kann asynchrone
 * HTTP-Requests ausführen und speichert das JWT-Token, dass der User
 * beim Login erhalten hat. Das Token wird automatisch in alle Requests
 * eingebaut, die nach dem Login ausgeführt werden.
 *
 * Da die HTTP-Requests asynchron abgearbeitet werden, akzeptieren alle
 * Methoden Callbacks für den Erfolgs- und Fehlerfall. Wie diese verwendet
 * kann in der UserTable- und der Navigationskomponente nachvollzogen werden.
 *
 * Folgt lose dem Store Pattern, wie in der Vue-Dokumentation beschrieben
 * https://vuejs.org/v2/guide/state-management.html.
 *
 */
class ApiClient {
  constructor() {
    this.state = {};
    this.loadState();
  }

  /**
   * Schickt einen GET-Request an den Server.
   *
   * @param {String} Adresse der API-Resource
   * @param {Function} success_callback Funktion die bei Erfolg
   *                                    aufgerufen werden soll
   * @param {Function} error_callback Funktion die bei Fehlern
   *                                  aufgerufen werden soll
   */
  get(url, success_callback, error_callback) {
    getJson(url, this.headers, success_callback, error_callback);
  }

  /**
   * Schickt einen POST-Request an den Server und übergibt ein
   * Objekt. Das Objekt wird automatisch zu JSON serialisiert.
   *
   * @param {String} Adresse der API-Resource
   * @param {Object} Daten die als JSON übertragen werden sollen
   * @param {Function} success_callback Funktion die bei Erfolg
   *                                    aufgerufen werden soll
   * @param {Function} error_callback Funktion die bei Fehlern
   *                                  aufgerufen werden soll
   */
  post(url, data, success_callback, error_callback) {
    postJson(url, data, this.headers, success_callback, error_callback);
  }

  /**
   * Schickt einen PUT-Request an den Server und übergibt ein
   * Objekt. Das Objekt wird automatisch zu JSON serialisiert.
   *
   * @param {String} Adresse der API-Resource
   * @param {Object} Daten die als JSON übertragen werden sollen
   * @param {Function} success_callback Funktion die bei Erfolg
   *                                    aufgerufen werden soll
   * @param {Function} error_callback Funktion die bei Fehlern
   *                                  aufgerufen werden soll
   */
  put(url, data, success_callback, error_callback) {
    putJson(url, data, this.headers, success_callback, error_callback);
  }

  /**
   * Schickt einen DELETE-Request an den Server und übergibt ein
   * Objekt. Das Objekt wird automatisch zu JSON serialisiert.
   *
   * Die Methode heißt del, weil "delete" ein reserviertes
   * JavaScript Keyword ist.
   *
   * @param {String} Adresse der API-Resource
   * @param {Object} Daten die als JSON übertragen werden sollen
   * @param {Function} success_callback Funktion die bei Erfolg
   *                                    aufgerufen werden soll
   * @param {Function} error_callback Funktion die bei Fehlern
   *                                  aufgerufen werden soll
   */
  del(url, success_callback, error_callback) {
    deleteJson(url, this.headers, success_callback, error_callback);
  }

  /**
   * Authentifiziert den User an der API und speichert das erhaltene
   * JSON Web Token.
   *
   * @param {*} username
   * @param {*} password
   * @param {Function} success_callback Funktion die bei Erfolg
   *                                    aufgerufen werden soll
   * @param {Function} error_callback Funktion die bei Fehlern
   *                                  aufgerufen werden soll
   */
  login(username, password, success_callback, error_callback) {
    let credentials = {
      username,
      password
    };
    postJson(
      "/api/login",
      credentials,
      this.headers,
      data => {
        this.state.token = data.access_token;
        var payloadObj = KJUR.jws.JWS.readSafeJSONString(b64toutf8(this.state.token.split(".")[1]));
        this.state.isAdmin = true ? payloadObj.user_claims.admin == 1 : false;
        this.state.isRestricted = true ? payloadObj.user_claims.restricted == 1 : false;
        console.log("admin: " + this.state.isAdmin + " // " + "restricted: " + this.state.isRestricted);
        this.state.username = username;
        this.state.id = payloadObj.user_claims.id;
        this.state.isLoggedIn = true;
        this.storeState();
        success_callback();
      },
      error_callback
    );
  }

  /**
   * Loggt sich aus, indem der gehaltene Zustand zurückgesetzt wird.
   * Theoretisch ist das Token weiterhin gültig. Um den Logout
   * fachlich korrekt durchzuführen, müsste das Token invalidiert
   * werden. Der Einfachheithalber wird darauf hier verzichtet.
   */
  logout() {
    if (this.isLoggedIn) {
      this.clearState();
    }
  }

  /**
   * Stellt den alten Zustand aus dem Session-Storage wieder her.
   */
  loadState() {
    let storedState = window.sessionStorage.getItem("myapp-api-state");
    if (storedState) {
      let state = JSON.parse(storedState);
      Object.assign(this.state, state);
    }
  }

  /**
   * Speichert Login-Zustand im Session-Storage des Browsers.
   */
  storeState() {
    window.sessionStorage.setItem(
      "myapp-api-state",
      JSON.stringify(this.state)
    );
  }

  /**
   * Setzt den Zustand zurück und loggt den User dadurch aus.
   */
  clearState() {
    window.sessionStorage.removeItem("myapp-api-state");
    Object.assign(this.state, {
      username: undefined,
      token: undefined,
      isLoggedIn: false
    });
  }

  /**
   * Convenience-Funktion, die ein Objekt mit zusätzlichen HTTP-Headern aufbaut.
   * Kann bei Bedarf erweitert werden.
   */
  get headers() {
    let headers = {};
    if (this.isLoggedIn) {
      headers["Authorization"] = `Bearer ${this.state.token}`;
    }
    return headers;
  }

  /**
   * Convenience-Funktion zur Abfrage des Login-Zustands.
   */
  get isLoggedIn() {
    return this.state.isLoggedIn;
  }

  get isAdmin() {
    return this.state.isAdmin;
  }
}

/**
 * Wird als globales Objekt verwendet, nicht schön, aber mangels alternative OK.
 *  Ausgewachsene Vue-Applikationen würden weitere Bibliotheken wie Vuex zum
 * State-Management verwenden.
 */
api = new ApiClient();
