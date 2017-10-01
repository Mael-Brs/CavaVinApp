(function() {
    'use strict';
    angular
        .module('main')
        .factory('PinnedWine', PinnedWine);

    PinnedWine.$inject = ['$resource', 'Config'];

    function PinnedWine ($resource, Config) {
        var resourceUrl =  Config.ENV.SERVER_URL + 'api/pinned-wines/:id';

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
