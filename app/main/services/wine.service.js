(function() {
    'use strict';
    angular
        .module('main')
        .factory('Wine', Wine);

    Wine.$inject = ['$resource', 'Config'];

    function Wine ($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/wines/:id/:subResource';

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
            'update': { method:'PUT' },
            'vintages' : {  // The `comments` action definition:
                params: {subResource: 'vintages'},
                method: 'GET', 
                isArray: true
            }
        });
    }
})();
