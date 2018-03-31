'use strict';
(function() {

  angular
    .module('main')
    .factory('RegionSearch', RegionSearch);

  RegionSearch.$inject = ['$resource', 'Config'];

  function RegionSearch($resource, Config) {
    const resourceUrl = Config.ENV.SERVER_URL + 'api/_search/regions/:id';

    return $resource(resourceUrl, {}, {
      'query': { method: 'GET', isArray: true }
    });
  }
})();
