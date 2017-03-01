(function() {
    'use strict';
    angular
        .module('CavaVin')
        .factory('WineInCellar', WineInCellar);

    WineInCellar.$inject = ['$resource', 'Config'];

    function WineInCellar ($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/wine-in-cellars/:id';

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
