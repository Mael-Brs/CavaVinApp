(function() {
    'use strict';

    angular
        .module('CavaVin')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('sessions', {
            parent: 'app',
            url: '/sessions',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'global.menu.account.sessions'
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/jhipster/account/sessions/sessions.html',
                    controller: 'SessionsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('sessions');
                    return $translate.refresh();
                }]
            }
        });
    }
})();
