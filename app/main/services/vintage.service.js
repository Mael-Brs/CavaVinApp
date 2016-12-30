(function() {
    'use strict';
    angular
        .module('CavaVin')
        .factory('Vintage', Vintage);

    Vintage.$inject = ['$resource'];

    function Vintage ($resource) {
        var resourceUrl =  'api/vintages/:id';

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
