(function() {
    'use strict';

    angular
        .module('CavaVin')
        .factory('ColorSearch', ColorSearch);

    ColorSearch.$inject = ['$resource', 'Config'];

    function ColorSearch($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/_search/colors/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
