'use strict';
(function() {

  angular
    .module('main')
    .factory('ColorSearch', ColorSearch);

  ColorSearch.$inject = ['$resource', 'Config'];

  function ColorSearch($resource, Config) {
    const resourceUrl = Config.ENV.SERVER_URL + 'api/_search/colors/:id';

    return $resource(resourceUrl, {}, {
      'query': { method: 'GET', isArray: true }
    });
  }
})();
