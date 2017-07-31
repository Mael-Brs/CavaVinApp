'use strict';
angular
.module('main')
.controller('ListCtrl',ListCtrl);

ListCtrl.$inject = ['$translate', '$scope', '$state', 'WineInCellar', 'Principal', '$ionicPopup','Cellar', 'User', 'CacheService', '$ionicModal', '$ionicListDelegate', 'CommonServices', 'PinnedVintage'];


function ListCtrl ($translate, $scope, $state, WineInCellar, Principal, $ionicPopup, Cellar, User, CacheService, $ionicModal, $ionicListDelegate, CommonServices, PinnedVintage) {
  var vm = this;
  vm.wines;
  vm.showForm = false;
  vm.sortWine = 'apogee'; // set the default sort color
  vm.sortReverse = false;
  vm.openModal = openModal;
  vm.openFilter = openFilter;
  vm.thisYear = new Date().getFullYear();
  var cellar;
  var user;

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
    vm.wineByRegion = cellar.wineByRegion;
    vm.wineByColor = cellar.wineByColor;
    vm.wines = CacheService.get('wineInCellars');
    if(!vm.wines){
      getWineInCellars();
    }
  }

/**
 * Fonction de suppression du vin au click sur le bouton
 * @param  {number} id id du vin
 */
  vm.removeWine = function(id){
    var confirmPopup = $ionicPopup.confirm({
      title: $translate.instant('list.deleteTitle'),
      template: '{{"list.deleteMessage" | translate}}'
    });
    confirmPopup.then(function(res) {
      if(res) {
          WineInCellar.delete({id: id}, function successCallback() {
              CacheService.remove('wineInCellars');
              loadAll();
          }, function(){
              CommonServices.showAlert('error.deleteWine');
          });
       }
     });
  };

  vm.editWine = function (wineInCellar){
    if(wineInCellar.vintage.wine.creatorId === cellar.userId){
      $state.go('form',{wineId:wineInCellar.id});
    } else {
      $state.go('editWine',{wineId:wineInCellar.id});
    }
  };

  vm.updateQuantity = function(wineInCellar, step){
    if(wineInCellar.quantity > 0 || step > 0){
      wineInCellar.quantity += step;

      if(wineInCellar.quantity === 0){
        pinVintage(wineInCellar);

      } else {
        WineInCellar.update(wineInCellar,function(wineInCellar) {
            var wineInCellars = CacheService.get('wineInCellars');

            if(wineInCellars){
              CommonServices.updateWineInCellar(wineInCellar);
              CommonServices.updateCellarDetails();
            } else {
              getWineInCellars();
            }

        }, function(){
            CommonServices.showAlert('error.updateWine');
        });

      }
    }
  }

  /**
   * Appelle le ws getWinInCellars et les met en cache
   */
  function getWineInCellars(){
    Cellar.wineInCellars({id:cellar.id}, function(wineInCellars){
      CacheService.put('wineInCellars', wineInCellars);
      //Update cache
      CommonServices.updateCellarDetails();
      //Update view
      vm.wines = wineInCellars;
    }, function(){
      CommonServices.showAlert('error.getWines');
    });
  }

  $ionicModal.fromTemplateUrl('main/templates/wineInCellarDetails.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      vm.modal = modal;
  });

  function openModal(wine){
      vm.selected = wine;
      vm.modal.show();
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

  function pinVintage(wineInCellar){
    var confirmPopup = $ionicPopup.confirm({
      title: $translate.instant('list.deleteTitle'),
      template: '{{"list.pinVintage" | translate}}'
    });
    confirmPopup.then(function(res) {
      if(res) {
          PinnedVintage.save({vintage:wineInCellar.vintage, userId:user.id}, function successCallback() {
              vm.removeWine(wineInCellar.id);
          }, function(){
              CommonServices.showAlert('error.createPinnedVintage');
          });
       }
     });
  };

}
