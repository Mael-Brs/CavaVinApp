'use strict';
(function() {

  angular
    .module('main')
    .factory('WineSearch', WineSearch);

  WineSearch.$inject = ['$resource', 'Config'];

  function WineSearch($resource, Config) {
    const resourceUrl = Config.ENV.SERVER_URL + 'api/_search/wines/:id';

    return $resource(resourceUrl, {}, {
      'query': { method: 'GET', isArray: true }
    });
  }
})();
