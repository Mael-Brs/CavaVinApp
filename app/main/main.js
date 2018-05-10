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
  .config(function($stateProvider, $urlRouterProvider) {

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
            function(Auth) {
              return Auth.authorize();
            }
          ],
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('global');
            $translatePartialLoader.addPart('error');
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
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
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
          TranslatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
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
            controller: 'CellarDetailsCtrl as vm'
          }
        },
        resolve: {
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate) {
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
            controller: 'ListCtrl as vm'
          }
        },
        resolve: {
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('list');
            $translatePartialLoader.addPart('wineInCellar');
            $translatePartialLoader.addPart('wine');
            return $translate.refresh();
          }]
        }
      })

      .state('wineInCellarFullEdit', {
        parent: 'app',
        url: '/wineInCellarFullEdit/:wineId',
        data: {
          authorities: ['ROLE_USER']
        },
        views: {
          'pageContent': {
            templateUrl: 'main/templates/wineInCellarFullEdit.html',
            controller: 'WineInCellarFullEditCtrl as vm'
          }
        },
        resolve: {
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('wineInCellar');
            $translatePartialLoader.addPart('wine');
            $translatePartialLoader.addPart('wineInCellarFullEdit');
            $translatePartialLoader.addPart('wineInCellarEdit');
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
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('wine');
            return $translate.refresh();
          }]
        }
      })
      .state('wineInCellarEdit', {
        parent: 'app',
        url: '/wineInCellarEdit/:wineId',
        data: {
          authorities: ['ROLE_USER']
        },
        views: {
          'pageContent': {
            templateUrl: 'main/templates/wineInCellarEdit.html',
            controller: 'WineInCellarEditCtrl as vm'
          }
        },
        resolve: {
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('wineInCellar');
            $translatePartialLoader.addPart('wine');
            $translatePartialLoader.addPart('wineInCellarEdit');
            return $translate.refresh();
          }]
        }
      })
      .state('selectVintage', {
        parent: 'app',
        url: '/selectVintage/:wineId/:from',
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
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('selectVintage');
            $translatePartialLoader.addPart('wine');
            return $translate.refresh();
          }]
        }
      })
      .state('pinnedList', {
        parent: 'app',
        url: '/pinnedList',
        data: {
          authorities: ['ROLE_USER']
        },
        views: {
          'pageContent': {
            templateUrl: 'main/templates/pinnedList.html',
            controller: 'pinnedListCtrl as vm'
          }
        },
        resolve: {
          translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
            $translatePartialLoader.addPart('wineInCellar');
            $translatePartialLoader.addPart('wine');
            $translatePartialLoader.addPart('list');
            return $translate.refresh();
          }]
        }
      });
  });
