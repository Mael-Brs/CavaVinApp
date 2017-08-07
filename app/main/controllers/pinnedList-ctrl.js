'use strict';
angular
.module('main')
.controller('pinnedListCtrl', pinnedListCtrl);

pinnedListCtrl.$inject = ['$translate', '$scope', '$state', 'PinnedVintage', 'Principal', '$ionicPopup','Cellar', 'User', 'CacheService', '$ionicListDelegate', 'CommonServices'];


function pinnedListCtrl ($translate, $scope, $state, PinnedVintage, Principal, $ionicPopup, Cellar, User, CacheService, $ionicListDelegate, CommonServices) {
  var vm = this;
  vm.wines;
  var cellar;
  var user;
  vm.openFilter = openFilter;
  vm.isWineInCellarFilter = false;
  vm.sortWine = 'vintage.wine.name'; // set the default sort color
  vm.sortReverse = false;

  $scope.$on('$ionicView.enter', function() {
    $ionicListDelegate.closeOptionButtons();
    cellar = CacheService.get('activeCellar');

    Principal.identity().then(function(account) {
      user = account;
      if(!cellar){
          cellar = User.cellars({ref:account.id},function(){
            loadAll();
          });
      } else {
        loadAll();
      }
    });
  });

  /**
   * Set les variables du scope
   */
  function loadAll() {
    vm.wines = CacheService.get('pinnedVintages');
    if(!vm.wines){
      getPinnedVintages();
    } else {
      buildFilterOptions();
    }
  }

  /**
   * Fonction de suppression du vin au click sur le bouton
   * @param  {number} id id du vin
   */
  vm.removePinned = function(id){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Supprimer le vin',
      template: 'Etes-vous sûr de vouloir supprimer ce vin ?'
    });
    confirmPopup.then(function(res) {
      if(res) {
          PinnedVintage.delete({id: id}, function successCallback() {
              CacheService.remove('pinnedVintages');
              loadAll();
          }, function(){
              CommonServices.showAlert('error.deleteWine');
          });
       }
     });
  };

  vm.addToCellar = function (pinnedVintage){
    CacheService.put('selectedVintage', pinnedVintage.vintage);
    $state.go('addToCellar');
  };

  /**
   * Appelle le ws getPinnedVintages et les met en cache
   */
  function getPinnedVintages(){
    User.pinnedVintages({ref:user.id}, function(pinnedVintages){
      CacheService.put('pinnedVintages', pinnedVintages);
      vm.wines = pinnedVintages;
      buildFilterOptions();      
    }, function(){
      CommonServices.showAlert('error.getWines');
    });
  }

  function openFilter(){
    $ionicPopup.show({
      templateUrl: 'main/templates/filterPopup.html',
      title: 'Filtrer les vins',
      scope: $scope,
      buttons: [
        { text: $translate.instant('entity.action.close'),
          type: 'button-positive'
        }
      ]
    });
  }

  function buildFilterOptions(){
    vm.wineByRegion = [];
    vm.wineByColor = [];

    for (var i = 0 ; i < vm.wines.length ; i++){
      var region = vm.wines[i].vintage.wine.region.regionName;
      var color = vm.wines[i].vintage.wine.color.colorName;
      var regions = {};
      var colors = {};

      if(!regions[region]){
          regions[region] = true;
          vm.wineByRegion.push({region:region});
      }

      if(!colors[color]){
          colors[color] = true;
          vm.wineByColor.push({color:color});
      }
    }
  };

}
