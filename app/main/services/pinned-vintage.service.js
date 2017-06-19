(function() {
    'use strict';
    angular
        .module('main')
        .factory('PinnedVintage', PinnedVintage);

    PinnedVintage.$inject = ['$resource'];

    function PinnedVintage ($resource) {
        var resourceUrl =  'api/pinned-vintages/:id';

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
