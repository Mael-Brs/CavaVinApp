'use strict';
angular
.module('main')
.controller('WineSearchCtrl', WineSearchCtrl);

WineSearchCtrl.$inject = ['$log', '$scope', '$state', 'Principal', 'WineSearch','Cellar', 'User', '$ionicModal'];

function WineSearchCtrl ($log, $scope, $state, Principal, WineSearch,Cellar,User, $ionicModal) {
  var vm = this;
  var account;
  var cellar;
  vm.submit = submit;
/*  vm.openModal = openModal;
*/
  Principal.identity().then(function(account) {
    account = account;
    cellar = User.cellars({login:account.login},function(cellar){

    });
  });
  
  function submit (query) {
    if (typeof query != 'undefined') {
      WineSearch.query({query: query}, function(result) {
          vm.result = result;
      });
    }
  };

  /*$ionicModal.fromTemplateUrl('main/templates/selectVintage.html', {
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function(modal) {
      vm.modal = modal;
  });

  function openModal(){
      vm.modal.show();
  }*/

  vm.addToCellar = function(id){
    $state.go('addToCellar',{wineId:id});
  };
  
  vm.editWine = function(id){
    $state.go('form',{wineId:id});
  };

  vm.selectVintage = function(id){
    $state.go('selectVintage',{wineId:id});
  }

};
