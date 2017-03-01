(function() {
    'use strict';

    angular
        .module('CavaVin')
        .factory('RegionSearch', RegionSearch);

    RegionSearch.$inject = ['$resource', 'Config'];

    function RegionSearch($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/_search/regions/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
