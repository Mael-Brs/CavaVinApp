'use strict';
(function() {
  angular
    .module('main')
    .factory('Cellar', Cellar);

  Cellar.$inject = ['$resource', 'Config'];

  function Cellar($resource, Config) {
    const resourceUrl = Config.ENV.SERVER_URL + 'api/cellars/:id/:subResource';

    return $resource(resourceUrl, {}, {
      'query': { method: 'GET', isArray: true },
      'get': {
        method: 'GET',
        transformResponse: function(data) {
          if (data) {
            data = angular.fromJson(data);
          }
          return data;
        }
      },
      'update': { method: 'PUT' }
    });
  }
})();
