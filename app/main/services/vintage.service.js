'use strict';
(function() {
  angular
    .module('main')
    .factory('Vintage', Vintage);

  Vintage.$inject = ['$resource', 'Config'];

  function Vintage($resource, Config) {
    var resourceUrl = Config.ENV.SERVER_URL + 'api/vintages/:id';

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
