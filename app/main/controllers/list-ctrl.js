'use strict';
angular
.module('main')
.controller('ListCtrl',ListCtrl);

ListCtrl.$inject = ['$log', '$scope', '$state', 'WineInCellar', 'Principal', '$ionicPopup','Cellar', 'User', 'CacheService', '$ionicModal', '$ionicListDelegate'];


function ListCtrl ($log, $scope, $state, WineInCellar, Principal, $ionicPopup, Cellar, User, CacheService, $ionicModal, $ionicListDelegate) {
  var vm = this;
  vm.wines;
  vm.showForm = false;
  vm.sortWine = 'apogee'; // set the default sort color
  vm.sortReverse = false;
  vm.openModal = openModal;
  vm.openFilter = openFilter;
  var cellar;

  $scope.$on('$ionicView.enter', function() { 
    $ionicListDelegate.closeOptionButtons();
    cellar = CacheService.get('activeCellar');
    // TODO Use cache in get function
    if(!cellar){
      Principal.identity().then(function(account) {
        account = account;
        cellar = User.cellars({login:account.login},function(){
          loadAll();
        });
      });
    } else {
      loadAll();
    }
  });

  function loadAll() {
    vm.wines = CacheService.get('wineInCellars');
    if(!vm.wines){
      Cellar.wineInCellars({id:cellar.id}, function(wineInCellars){
        vm.wines = wineInCellars;
        CacheService.put('wineInCellars', wineInCellars);
      });
    }
  }
  
  vm.addWine = function(){
    $state.go('form',{wineId:-1});
  };

  vm.removeWine = function(id){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Supprimer le vin',
      template: 'Etes-vous sûr de vouloir supprimer ce vin?'
    });
    confirmPopup.then(function(res) {
      if(res) {
          WineInCellar.delete({id: id}, function successCallback() {
              CacheService.remove('wineInCellars');
              loadAll();
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
    var myPopup = $ionicPopup.show({
      templateUrl: 'main/templates/filterPopup.html',
      title: 'Filtrer les vins',
      scope: $scope,
      buttons: [
        { text: 'Fermer',
          type: 'button-positive' 
        }
      ]
    });
  }
  
}
