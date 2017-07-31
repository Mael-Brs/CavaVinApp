(function () {
    'use strict';

    angular
        .module('main')
        .factory('User', User);

    User.$inject = ['$resource', 'Config'];

    function User ($resource, Config) {
        var service = $resource(Config.ENV.SERVER_URL + 'api/users/:ref/:subResource', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save': { method:'POST' },
            'update': { method:'PUT' },
            'delete':{ method:'DELETE'},
            'cellars':{
                params: {subResource: 'cellars'},
                method: 'GET'
            },
            'pinnedVintages':{
                params: {subResource: 'pinned-vintages'},
                method: 'GET', 
                isArray: true
            }
        });

        return service;
    }
})();
