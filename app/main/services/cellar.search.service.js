(function() {
    'use strict';

    angular
        .module('CavaVin')
        .factory('CellarSearch', CellarSearch);

    CellarSearch.$inject = ['$resource'];

    function CellarSearch($resource) {
        var resourceUrl =  'api/_search/cellars/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
