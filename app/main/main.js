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
        .state('cellarDetails', {
            parent: 'app',
            url: '/cellarDetails',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
              'pageContent': {
                templateUrl: 'main/templates/cellarDetails.html',
                controller:'CellarDetailsCtrl as vm'
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
                  controller:'ListCtrl as vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('list');
                    $translatePartialLoader.addPart('wineInCellar');
                    $translatePartialLoader.addPart('wine');
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
                    controller: 'FormCtrl as vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('wineInCellar');
                    $translatePartialLoader.addPart('wine');
                    return $translate.refresh();
                }]
            }
        })

        .state('wineCatalog', {
            parent: 'app',
            url: '/wineCatalog',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/wineCatalog.html',
                    controller: 'WineCatalogCtrl as vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('wine');
                    return $translate.refresh();
                }]
            }
        })
        .state('addToCellar', {
            parent: 'app',
            url: '/addToCellar',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/addToCellar.html',
                    controller: 'addToCellarCtrl as vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        })
        .state('selectVintage', {
            parent: 'app',
            url: '/selectVintage/:wineId',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/selectVintage.html',
                    controller: 'SelectVintage as vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('selectVintage');
                    return $translate.refresh();
                }]
            }
        })
        .state('editWine', {
            parent: 'app',
            url: '/editWine/:wineId',
            data: {
                authorities: ['ROLE_USER']
            },
            views: {
                'pageContent': {
                    templateUrl: 'main/templates/editWine.html',
                    controller: 'editWineCtrl as vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    return $translate.refresh();
                }]
            }
        });
});
