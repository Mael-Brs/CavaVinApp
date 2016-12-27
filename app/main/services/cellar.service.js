(function() {
    'use strict';
    angular
        .module('CavaVin')
        .factory('Cellar', Cellar);

    Cellar.$inject = ['$resource'];

    function Cellar ($resource) {
        var resourceUrl =  'api/cellars/:id/:subResource';

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
            'wineInCellars' : {  // The `comments` action definition:
                params: {subResource: 'wine-in-cellars'},
                method: 'GET', 
                isArray: true
            }
        });
    }
})();
