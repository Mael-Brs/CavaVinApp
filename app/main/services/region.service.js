(function() {
    'use strict';
    angular
        .module('CavaVin')
        .factory('Region', Region);

    Region.$inject = ['$resource', 'Config'];

    function Region ($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/regions/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
