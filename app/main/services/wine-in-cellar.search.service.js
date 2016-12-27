(function() {
    'use strict';

    angular
        .module('CavaVin')
        .factory('WineInCellarSearch', WineInCellarSearch);

    WineInCellarSearch.$inject = ['$resource'];

    function WineInCellarSearch($resource) {
        var resourceUrl =  'api/_search/wine-in-cellars/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
