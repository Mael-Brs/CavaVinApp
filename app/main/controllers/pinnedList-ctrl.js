(function () {
  'use strict';
  angular
    .module('main')
    .controller('pinnedListCtrl', pinnedListCtrl);

  pinnedListCtrl.$inject = ['$translate', '$scope', '$state', 'PinnedWine', 'Principal', '$ionicPopup', 'User', 'CacheService', '$ionicListDelegate', 'CommonServices'];


  function pinnedListCtrl($translate, $scope, $state, PinnedWine, Principal, $ionicPopup, User, CacheService, $ionicListDelegate, CommonServices) {
    var vm = this;
    vm.wines = null;
    vm.isWineInCellarFilter = false;
    vm.sortWine = 'wine.name'; // set the default sort color
    vm.sortReverse = false;
    vm.openFilter = openFilter;
    vm.removePinned = removePinned;
    vm.wineInCellarEdit = wineInCellarEdit;

    var user;

    $scope.$on('$ionicView.enter', function () {
      $ionicListDelegate.closeOptionButtons();

      Principal.identity().then(function (account) {
        user = account;
        loadAll();
      });
    });

    /**
     * Set les variables du scope
     */
    function loadAll() {
      CommonServices.getPinnedWines(user.id).then(function (pinnedWines){
        vm.wines = pinnedWines;
        CacheService.put('pinnedWines', pinnedWines);
        buildFilterOptions();
      });
    }

    /**
     * Fonction de suppression du vin au click sur le bouton
     * @param  {number} id id du vin
     */
    function removePinned(id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Supprimer le vin',
        template: 'Etes-vous sûr de vouloir supprimer ce vin ?',
        cancelText: $translate.instant('entity.action.cancel'),
        okText: $translate.instant('entity.action.delete')
      });
      confirmPopup.then(function (res) {
        if (res) {
          PinnedWine.delete({ id: id }, function successCallback() {
            CacheService.remove('pinnedWines');
            loadAll();
          }, function () {
            CommonServices.showAlert('error.deleteWine');
          });
        }
      });
    }

    /**
     * Ouvre l'écran de sélection d'un millésime
     * @param {vin à ajouter à la cave} pinnedWine
     */
    function wineInCellarEdit(pinnedWine) {
      CacheService.put('selectedWine', pinnedWine.wine);
      $state.go('selectVintage', { wineId: pinnedWine.wine.id, from: 'pinnedList' });
    }

    /**
     * Ouvre la popup de filtrage dela lsite
     */
    function openFilter() {
      $ionicPopup.show({
        templateUrl: 'main/templates/filterPopup.html',
        title: 'Filtrer les vins',
        scope: $scope,
        buttons: [
          {
            text: $translate.instant('entity.action.close'),
            type: 'button-positive'
          }
        ]
      });
    }

    /**
     * Construitles options de la popup de filtrage
     */
    function buildFilterOptions() {
      vm.wineByRegion = [];
      vm.wineByColor = [];

      for (var i = 0; i < vm.wines.length; i++) {
        var region = vm.wines[i].wine.region.regionName;
        var color = vm.wines[i].wine.color.colorName;
        var regions = {};
        var colors = {};

        if (!regions[region]) {
          regions[region] = true;
          vm.wineByRegion.push({ region: region });
        }

        if (!colors[color]) {
          colors[color] = true;
          vm.wineByColor.push({ color: color });
        }
      }
    }

  }
})();