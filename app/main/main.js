'use strict';
angular.module('main', [
        'ionic',
        'ngCordova',
        'ui.router',
        'ui.bootstrap',
        'ngStorage',
        'ngResource',
        'ngCookies',
        'ngAria',
        'ngCacheBuster', 
        'tmh.dynamicLocale',
        'pascalprecht.translate', 
        'infinite-scroll'
        // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/app/home');
    $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'main/templates/menu.html',
        controller: 'MenuCtrl as vm',
        resolve: {
            authorize: ['Auth',
                function (Auth) {
                    return Auth.authorize();
                }
            ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
        }
    })
    .state('login', {
        parent: 'app',
        url: '/login',
        data: {
            authorities: []
        },
        views: {
            'pageContent': {
                // templateUrl: 'main/services/login/login.html',
                controller: 'LoginCtrl as vm'
            }
        },
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('login');
                return $translate.refresh();
            }]
        }
    })
        .state('home', {
            parent: 'app',
            url: '/home',
            data: {
                authorities: []
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/home.html',
                    controller: 'HomeCtrl as vm'
                }
            },
            resolve: {
                TranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                    $translatePartialLoader.addPart('home');
                    return $translate.refresh();
                }]
            }
        })
        .state('dashboard', {
            parent: 'app',
            url: '/dashboard',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
              'pageContent': {
                templateUrl: 'main/templates/dashboard.html',
                controller:'dashboardController'
              }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        })

        .state('list', {
            parent: 'app',
            url: '/list',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                  templateUrl: 'main/templates/list.html',
                  controller:'ListCtrl'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        })

        .state('form', {
            parent: 'app',
            url: '/form/:wineId',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/form.html',
                    controller: 'FormCtrl'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        })

        .state('wineSearch', {
            parent: 'app',
            url: '/wineSearch',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/wineSearch.html',
                    controller: 'wineSearchCtrl'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        })
        .state('addToCellar', {
            parent: 'app',
            url: '/addToCellar/:wineId',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/addToCellar.html',
                    controller: 'addToCellarCtrl'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        });
});
