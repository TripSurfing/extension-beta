/*
 * @getPersistentVisitorId: Generates a unique visitor ID that is persisted between visits.
 *
 * We assume we're in an iframe, so for Safari users we use localStorage,
 * and for everyone we use local domain cookies.
 */
var getPersistentVisitorId = (function() {
  var key = 'silp_visitorid';
  var method = allowsThirdPartyCookies() ? 'cookie' : 'localStorage';
  var persistor = {
    localStorage: {
      set: function(id) { store.set(key, id); },
      get: function() { return store.get(key); }
    },
    cookie: {
      set: function(id) { cookie.set(key, id, { expires: 7 }) },
      get: function() { return cookie.get(key); }
    }
  }[method];

  return function() {
    var id = persistor.get();
    if(!id) {
      id = guid();
      persistor.set(id);
    }
    return id;
  };

  function guid() {

    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  }

  // Basically checks for Safari, which we know doesn't allow third-party
  // cookies. If we were thorough, we should perform an actual check of
  // generating and fetching a 3rd party cookie. But since, to my knowledge,
  // Safari is the only browser that disables these per default, this check
  // suffices for now.
  function allowsThirdPartyCookies() {
    var re = /Version\/\d+\.\d+(\.\d+)?.*Safari/;
    return !re.test(navigator.userAgent);
  }

}());