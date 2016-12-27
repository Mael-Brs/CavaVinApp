(function() {
    'use strict';
    angular
        .module('CavaVin')
        .factory('Year', Year);

    Year.$inject = ['$resource'];

    function Year ($resource) {
        var resourceUrl =  'api/years/:id';

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
