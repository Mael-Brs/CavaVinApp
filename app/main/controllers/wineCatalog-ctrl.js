'use strict';
angular
.module('main')
.controller('WineCatalogCtrl', WineCatalogCtrl);

WineCatalogCtrl.$inject = ['$log', '$scope', '$state', 'WineSearch', '$ionicPopup', 'CacheService', 'CommonServices'];

function WineCatalogCtrl ($log, $scope, $state, WineSearch, $ionicPopup, CacheService, CommonServices) {
  var vm = this;

  vm.submit = submit;
  vm.openSearch = openSearch;

  $scope.$on('$ionicView.enter', function() { 
    vm.query = "";
    vm.result = {};
    openSearch();
  });
  
  function submit(query) {
    WineSearch.query({query: query}, function(result) {
        vm.result = result;
    }, function(){
        CommonServices.showAlert('error.searchWine');
    });
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
              vm.submit(vm.query);
            }
          }
        }
      ]
    });
  }

}
