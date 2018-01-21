(function () {
  'use strict';
  angular
  .module('main')
  .controller('WineCatalogCtrl', WineCatalogCtrl);

  WineCatalogCtrl.$inject = ['$log', '$scope', '$state', 'WineSearch', '$ionicPopup', 'CacheService', 'CommonServices'];

  function WineCatalogCtrl ($log, $scope, $state, WineSearch, $ionicPopup, CacheService, CommonServices) {
    var vm = this;

    vm.submit = submit;
    vm.openSearch = openSearch;
    vm.loadPage = loadPage;
    vm.page = 0;
    vm.itemsPerPage = 20;
    vm.sort = "_score,asc";
    vm.lastPage = 0;
    var regExp = new RegExp(/(?:page=)(\d)/);

    $scope.$on('$ionicView.enter', function() { 
      vm.query = "";
      vm.result = [];
      openSearch();
    });
    
    function submit() {
      WineSearch.query({
          query: vm.query,
          page: vm.page,
          size: vm.itemsPerPage,
          sort: null
      }, function(result, headers) {
        getLastPage(headers('link'));
        for (let i = 0; i < result.length; i++) {
            vm.result.push(result[i]);
        };
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function(){
          CommonServices.showAlert('error.searchWine');
      });
    }

    function getLastPage(header){
      var array = header.split(",");
      for(var i = 0 ; i < array.length ; i++){
        if(array[i].indexOf("last") > -1){
          vm.lastPage = regExp.exec(array[i])[1];
        }
      }
    }

    vm.createWine = function(id){
      $state.go('form',{wineId:id});
    };

    vm.selectVintage = function(wine){
      CacheService.put('selectedWine', wine);
      $state.go('selectVintage',{wineId:wine.id});
    };


    function openSearch(){
      var myPopup = $ionicPopup.show({
        templateUrl: 'main/templates/searchPopup.html',
        title: 'Recherche de vin',
        scope: $scope,
        buttons: [
          { text: 'Annuler' },
          {
            text: '<b>Rechercher</b>',
            type: 'button-positive',
            onTap: function(e) {
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

    function loadPage(page) {
      vm.page = page;
      vm.submit();
    }

  }
}) ();