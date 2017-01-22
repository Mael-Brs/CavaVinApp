'use strict';
angular
.module('main')
.controller('ListCtrl',ListCtrl);

ListCtrl.$inject = ['$log', '$scope', '$state', 'WineInCellar', 'Principal', '$ionicPopup','Cellar', 'User', 'CacheService', '$ionicModal'];


function ListCtrl ($log, $scope, $state, WineInCellar, Principal, $ionicPopup, Cellar, User, CacheService, $ionicModal) {
  var vm = this;
  vm.wines;
  vm.showForm = false;
  vm.sortColor = 'appellation'; // set the default sort color
  vm.sortReverse = false;
  vm.openModal = openModal;
  var account;
  var cellar;

  $scope.$on('$ionicView.enter', function(e) { 
    cellar = CacheService.getActiveCellar();
    if(!cellar){
      Principal.identity().then(function(account) {
        account = account;
        cellar = User.cellars({login:account.login},function(cellar){
          loadAll();
        });
      });
    } else {
      loadAll();
    }
  });

  function loadAll() {
    Cellar.wineInCellars({id:cellar.id}, function(wineInCellars){
      vm.wines = wineInCellars;
    });
  };
  
  vm.addWine = function(id){
    $state.go('wineSearch');
  };

  vm.removeWine = function(id){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Supprimer le vin',
      template: 'Etes-vous sûr de vouloir supprimer ce vin?'
    });
    confirmPopup.then(function(res) {
      if(res) {
          WineInCellar.delete({id: id}, function successCallback() {
              loadAll();
          });
       } 
     });
  };

  vm.editWine = function (id){
    $state.go('addToCellar',{wineId:id});
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
  
};
