'use strict';
angular
.module('main')
.controller('ListCtrl',ListCtrl);

ListCtrl.$inject = ['$translate', '$scope', '$state', 'WineInCellar', 'Principal', '$ionicPopup','Cellar', 'User', 'CacheService', '$ionicModal', '$ionicListDelegate', 'CommonServices', 'PinnedWine'];


function ListCtrl ($translate, $scope, $state, WineInCellar, Principal, $ionicPopup, Cellar, User, CacheService, $ionicModal, $ionicListDelegate, CommonServices, PinnedWine) {
  var vm = this;
  vm.wines;
  vm.showForm = false;
  //paramètres de tri
  vm.sortWine = 'apogee'; // set the default sort color
  vm.sortReverse = false;
  vm.isWineInCellarFilter = true;
  
  vm.openModal = openModal;
  vm.openFilter = openFilter;
  var date = new Date();
  vm.thisYear = date.getFullYear();
  vm.yearRatio = (date.getMonth() + 1) /12 ;
  var cellar;

  $scope.$on('$ionicView.enter', function() {
    $ionicListDelegate.closeOptionButtons();
    CommonServices.getCellar().then(function(result){
      cellar = result;
      loadAll();
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
        pinWine(wineInCellar);

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

  /**
   * Définition de la modale pour le détail du vin
   */
  $ionicModal.fromTemplateUrl('main/templates/wineInCellarDetails.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      vm.modal = modal;
  });

  /**
   * Fonction d'ouverture de la modale
   * @param  {WineInCellar} wine vin selectionné
   */
  function openModal(wine){
      vm.selected = wine;
      vm.modal.show();
  }

  /**
   * Ouvre la popup de filtrage de la liste
   */
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

  /**
   * Affiche une popup pour demander l'épinglage du vin
   * @param  {WineInCellar} wineInCellar vin sélectionné dans la liste
   */
  function pinWine(wineInCellar){
    var confirmPopup = $ionicPopup.confirm({
      title: $translate.instant('list.pinTitle'),
      template: $translate.instant('list.pinWine')
    });
    confirmPopup.then(function(res) {
      if(res) {
          PinnedWine.save({wine:wineInCellar.vintage.wine, userId:cellar.userId}, function successCallback() {
              getPinnedWines();
              vm.removeWine(wineInCellar.id);
          }, function(){
              CommonServices.showAlert('error.createPinnedWine');
          });
       } else {
        vm.removeWine(wineInCellar.id);
       }
     });
  }

  /**
   * Appelle le ws getPinnedWines et les met en cache
   */
  function getPinnedWines(){
    User.pinnedWines({ref:user.id}, function(pinnedWines){
      CacheService.put('pinnedWines', pinnedWines);
    }, function(){
      CommonServices.showAlert('error.getWines');
    });
  }

}
