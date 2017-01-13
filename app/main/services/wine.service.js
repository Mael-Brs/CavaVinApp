(function() {
    'use strict';
    angular
        .module('CavaVin')
        .factory('Wine', Wine);

    Wine.$inject = ['$resource'];

    function Wine ($resource) {
        var resourceUrl =  'api/wines/:id/:subResource';

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
