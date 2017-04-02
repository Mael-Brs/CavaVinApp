(function() {
    'use strict';
    angular
        .module('main')
        .factory('Cellar', Cellar);

    Cellar.$inject = ['$resource' ,'Config'];

    function Cellar ($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/cellars/:id/:subResource';

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
            }
        });
    }
})();
