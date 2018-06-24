/**
 * Etwas unordentlicher Code um HTTP-Requests abzusetzen ohne gleiche
 * eine Bibliothek dafür einbinden zu müssen.
 *
 * Basiert auf:
 * https://plainjs.com/javascript/ajax/send-ajax-get-and-post-requests-47/
 * https://stackoverflow.com/a/24468752
 *
 * Alternativ kann selbstverständlich auch sowas wie Axios eingesetzt werden:
 * https://github.com/axios/axios
 */

/**
 * Schickt einen asychronen GET Request.
 *
 * @param {String} url Url die aufgerufen werden soll
 * @param {Object} headers HTTP-Header die zusätzlich übertragen werden sollen
 * @param {Function} success_callback Callback, das im Erfolgsfall aufgerufen wird
 * @param {Function} error_callback Callback, das im Fehlerfall aufgerufen wird
 */
function getJson(url, headers, success_callback, error_callback) {
  let xhr = init_xhr("GET", url, headers);
  xhr.onreadystatechange = build_xhr_handler(xhr, success_callback, error_callback)
  xhr.send();
}

/**
 * Schickt einen asychronen POST Request.
 *
 * @param {String} url Url die aufgerufen werden soll
 * @param {Object} data Daten die als JSON übertragen werden sollen
 * @param {Object} headers HTTP-Header die zusätzlich übertragen werden sollen
 * @param {Function} success_callback Callback, das im Erfolgsfall aufgerufen wird
 * @param {Function} error_callback Callback, das im Fehlerfall aufgerufen wird
 */
function postJson(url, data, headers, success_callback, error_callback) {
  let xhr = init_xhr("POST", url, headers);
  xhr.onreadystatechange = build_xhr_handler(xhr, success_callback, error_callback)
  var json = JSON.stringify(data);
  xhr.send(json);
}

/**
 * Schickt einen asychronen PUT Request.
 *
 * @param {String} url Url die aufgerufen werden soll
 * @param {Object} data Daten die als JSON übertragen werden sollen
 * @param {Object} headers HTTP-Header die zusätzlich übertragen werden sollen
 * @param {Function} success_callback Callback, das im Erfolgsfall aufgerufen wird
 * @param {Function} error_callback Callback, das im Fehlerfall aufgerufen wird
 */
function putJson(url, data, headers, success_callback, error_callback) {
  let xhr = init_xhr("PUT", url, headers);
  xhr.onreadystatechange = build_xhr_handler(xhr, success_callback, error_callback)
  console.log(data);
  var json = JSON.stringify(data);
  console.log(json);
  xhr.send(json);
}

/**
 * Schickt einen asychronen DELETE Request.
 *
 * @param {String} url Url die aufgerufen werden soll
 * @param {Object} headers HTTP-Header die zusätzlich übertragen werden sollen
 * @param {Function} success_callback Callback, das im Erfolgsfall aufgerufen wird
 * @param {Function} error_callback Callback, das im Fehlerfall aufgerufen wird
 */
function deleteJson(url, headers, success_callback, error_callback) {
  let xhr = init_xhr("DELETE", url, headers);
  xhr.onreadystatechange = build_xhr_handler(xhr, success_callback, error_callback)
  xhr.send();
}

/**
 * Erzeugt einen XMLHttRequest für die gewünschte Kombination aus
 * Methode und URL und fügt zusätzliche HTTP Header hinzu.
 *
 * @param {String} method HTTP-Methode, die verwendet werden soll
 * @param {String} url Url die aufgerufen werden soll
 * @param {Object} headers HTTP-Header die zusätzlich übertragen werden sollen
 */
function init_xhr(method, url, headers) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Content-Type", "application/json");
  for (let key in headers) {
    // nur Properties berücksichtigen, die direkt auf dem Objekt definiert wurden
    if (headers.hasOwnProperty(key)) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }
  return xhr;
}

/**
 * Erzeugt das Callback für den XMLHttpRequest.
 *
 * @param {XMLHttpRequest} xhr Request für den das Callback erzeugt werden soll
 * @param {Function} success_callback Callback, das im Erfolgsfall aufgerufen wird
 * @param {Function} error_callback Callback, das im Fehlerfall aufgerufen wird
 */
function build_xhr_handler(xhr, success_callback, error_callback){
  return function() {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300 ) {
        result = JSON.parse(xhr.responseText);
        success_callback(result);
      } else if (error_callback) {
        error_callback({
          status: xhr.status,
          response: JSON.parse(xhr.responseText)
        });
      }
    }
  }
}
