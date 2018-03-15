(function () {
  'use strict';
  angular
    .module('main')
    .controller('WineCatalogCtrl', WineCatalogCtrl);

  WineCatalogCtrl.$inject = ['$log', '$scope', '$state', '$translate', 'WineSearch', '$ionicPopup', 'CacheService', 'CommonServices'];

  function WineCatalogCtrl($log, $scope, $state, $translate, WineSearch, $ionicPopup, CacheService, CommonServices) {
    var vm = this;

    vm.submit = submit;
    vm.openSearch = openSearch;
    vm.loadPage = loadPage;
    vm.page = 0;
    vm.itemsPerPage = 20;
    vm.sort = '_score,asc';
    vm.lastPage = 0;
    var regExp = new RegExp(/(?:page=)(\d)/);

    $scope.$on('$ionicView.enter', function () {
      vm.query = '';
      vm.result = [];
      vm.noContent = false;
      openSearch();
    });

    function submit() {
      WineSearch.query({
        query: vm.query,
        page: vm.page,
        size: vm.itemsPerPage,
        sort: null
      }, function (result, headers) {
        getLastPage(headers('link'));
        for (var i = 0; i < result.length; i++) {
          vm.result.push(result[i]);
        }
        vm.noContent = vm.result.length === 0;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function () {
        CommonServices.showAlert('error.searchWine');
      });
    }

    function getLastPage(header) {
      var array = header.split(',');
      for (var i = 0; i < array.length; i++) {
        if (array[i].indexOf('last') > -1) {
          vm.lastPage = regExp.exec(array[i])[1];
        }
      }
    }

    vm.createWine = function (id) {
      $state.go('form', { wineId: id });
    };

    vm.selectVintage = function (wine) {
      CacheService.put('selectedWine', wine);
      $state.go('selectVintage', { wineId: wine.id });
    };

    /**
     * Ouvre la pop pup de recherche
     */
    function openSearch() {
      $ionicPopup.show({
        templateUrl: 'main/templates/searchPopup.html',
        title: $translate.instant('cavaVinApp.wine.home.search'),
        scope: $scope,
        buttons: [
          { text: $translate.instant('entity.action.cancel') },
          {
            text: $translate.instant('entity.action.search'),
            type: 'button-positive',
            onTap: function (e) {
              if (!vm.query) {
                //don't allow the user to close unless he enters an input
                e.preventDefault();
              } else {
                vm.submit();
              }
            }
          }
        ]
      });
    }

    /**
     * Charge la page en paramètre
     * @param {Number} page Numero de la page à charger
     */
    function loadPage(page) {
      vm.page = page;
      vm.submit();
    }

  }
})();