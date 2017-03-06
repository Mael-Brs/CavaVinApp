(function() {
    'use strict';

    angular
        .module('main')
        .factory('WineInCellarSearch', WineInCellarSearch);

    WineInCellarSearch.$inject = ['$resource', 'Config'];

    function WineInCellarSearch($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/_search/wine-in-cellars/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
