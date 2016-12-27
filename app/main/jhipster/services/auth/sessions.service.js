(function() {
    'use strict';

    angular
        .module('CavaVin')
        .factory('Sessions', Sessions);

    Sessions.$inject = ['$resource', 'Config'];

    function Sessions ($resource, Config) {
        return $resource(Config.ENV.SERVER_URL + 'api/account/sessions/:series', {}, {
            'getAll': { method: 'GET', isArray: true}
        });
    }
})();
