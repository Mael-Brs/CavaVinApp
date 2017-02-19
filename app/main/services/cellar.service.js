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
            'wineInCellars' : {  // Get all the wine for the specified id of cellar
                params: {subResource: 'wine-in-cellars'},
                method: 'GET', 
                isArray: true
            },
            'sumOfWine' : {  // Get the total number of wine in cellar
                params: {subResource: 'sum-of-wine'},
                method: 'GET'
            },
            'wineByRegion' : {  // Get the total number of wine in cellar
                params: {subResource: 'wine-by-region'},
                method: 'GET', 
                isArray: true
            },
            'wineByColor' : {  // Get the total number of wine in cellar
                params: {subResource: 'wine-by-color'},
                method: 'GET', 
                isArray: true
            }
        });
    }
})();
