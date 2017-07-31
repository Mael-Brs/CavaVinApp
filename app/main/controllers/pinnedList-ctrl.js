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

  $scope.$on('$ionicView.enter', function() {
    $ionicListDelegate.closeOptionButtons();
    cellar = CacheService.get('activeCellar');

    Principal.identity().then(function(account) {
      user = account;
      if(!cellar){
          cellar = User.cellars({login:account.login},function(){
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
   * Appelle le ws getWinInCellars et les met en cache
   */
  function getPinnedVintages(){
    User.pinnedVintages({login:user.id}, function(pinnedVintages){
      CacheService.put('pinnedVintages', pinnedVintages);
      vm.wines = pinnedVintages;
    }, function(){
      CommonServices.showAlert('error.getWines');
    });
  }


}
