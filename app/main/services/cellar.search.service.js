'use strict';
(function() {

  angular
    .module('main')
    .factory('CellarSearch', CellarSearch);

  CellarSearch.$inject = ['$resource', 'Config'];

  function CellarSearch($resource, Config) {
    const resourceUrl = Config.ENV.SERVER_URL + 'api/_search/cellars/:id';

    return $resource(resourceUrl, {}, {
      'query': { method: 'GET', isArray: true }
    });
  }
})();
