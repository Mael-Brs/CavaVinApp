(function() {
    'use strict';
    angular
        .module('main')
        .factory('Color', Color);

    Color.$inject = ['$resource', 'Config'];

    function Color ($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/colors/:id';

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
