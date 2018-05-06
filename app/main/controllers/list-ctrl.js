(function() {

  angular
    .module('main')
    .controller('ListCtrl', ListCtrl);

  ListCtrl.$inject = ['$scope', '$translate', '$state', 'WineInCellar', 'Principal', '$ionicPopup', 'Cellar', 'User', 'CacheService', '$ionicModal', '$ionicListDelegate', 'CommonServices', 'PinnedWine'];


  function ListCtrl($scope, $translate, $state, WineInCellar, Principal, $ionicPopup, Cellar, User, CacheService, $ionicModal, $ionicListDelegate, CommonServices, PinnedWine) {
    const vm = this;
    vm.wines;
    vm.showForm = false;
    //paramètres de tri
    vm.sortWine = 'apogee'; // set the default sort color
    vm.sortReverse = false;
    vm.isWineInCellarFilter = true;
    vm.isLoading = true;

    vm.openModal = openModal;
    vm.openFilter = openFilter;
    vm.updateQuantity = updateQuantity;
    const date = new Date();
    vm.thisYear = date.getFullYear();
    vm.yearRatio = (date.getMonth() + 1) / 12;
    let cellar;

    $scope.$on('$ionicView.enter', function() {
      $ionicListDelegate.closeOptionButtons();
      CommonServices.getCellar().then(function(result) {
        cellar = result;
        vm.wineByRegion = cellar.wineByRegion;
        vm.wineByColor = cellar.wineByColor;
      });
      getWinesInCellar();
    });

    /**
     * Set les variables du scope
     */
    function getWinesInCellar() {
      CommonServices.getWinesInCellar().then(wineInCellars => {
        vm.wines = wineInCellars;
        vm.isLoading = false;
      });
    }

    /**
    * Fonction de suppression du vin au click sur le bouton
    * @param  {number} id id du vin
    */
    vm.removeWine = function(id) {
      const confirmPopup = $ionicPopup.confirm({
        title: $translate.instant('list.deleteTitle'),
        template: $translate.instant('list.deleteMessage'),
        cancelText: $translate.instant('entity.action.cancel'),
        okText: $translate.instant('entity.action.delete')
      });
      confirmPopup.then(function(res) {
        if (res) {
          WineInCellar.delete({ id: id }, function successCallback() {
            CacheService.remove('wineInCellars');
            getWinesInCellar();
          }, function() {
            CommonServices.showAlert('error.deleteWine');
          });
        }
      });
    };

    /**
     * Ouvre l'écran d'édition du vin
     * @param wineInCellar vin à mettre à jour
     */
    vm.editWine = function(wineInCellar) {
      if (wineInCellar.vintage.wine.creatorId === cellar.userId) {
        $state.go('wineInCellarFullEdit', { wineId: wineInCellar.id });
      } else {
        CacheService.put('selectedWineInCellar', wineInCellar);
        $state.go('wineInCellarEdit', { wineId: wineInCellar.id });
      }
    };

    /**
     * Met à jour la quantité du vin en cave
     * @param wineInCellar vin à mettre  à jour
     * @param step incrément de la quantité
     */
    function updateQuantity(wineInCellar, step) {
      if (wineInCellar.quantity > 0 || step > 0) {
        wineInCellar.quantity += step;

        if (wineInCellar.quantity === 0) {
          pinWine(wineInCellar);

        } else {
          WineInCellar.update(wineInCellar, function(wineInCellar) {
            updateCacheData(wineInCellar);
          }, function() {
            CommonServices.showAlert('error.updateWine');
          });

        }
      }
    }

    /**
     * Met à jour les données de vin en cache
     * @param wineInCellar vin mis à jour
     */
    function updateCacheData(wineInCellar) {
      CommonServices.getWinesInCellar().then(wineInCellars => {
        if (wineInCellars) {
          CommonServices.updateWineInCellar(wineInCellar);
          CommonServices.updateCellarDetails();
        }
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
    function openModal(wine) {
      vm.selected = wine;
      vm.modal.show();
    }

    /**
     * Ouvre la popup de filtrage de la liste
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
     * Affiche une popup pour demander l'épinglage du vin
     * @param  {WineInCellar} wineInCellar vin sélectionné dans la liste
     */
    function pinWine(wineInCellar) {
      const confirmPopup = $ionicPopup.confirm({
        title: $translate.instant('list.pinTitle'),
        template: $translate.instant('list.pinWine'),
        cancelText: $translate.instant('entity.action.cancel'),
        okText: $translate.instant('entity.action.pin')
      });
      confirmPopup.then(function(res) {
        if (res) {
          savePinnedWine(wineInCellar);
        } else {
          vm.removeWine(wineInCellar.id);
        }
      });
    }

    /**
     * Sauvegarde le nouveau vin épinglé
     * @param {le vin à épingler} wineInCellar
     */
    function savePinnedWine(wineInCellar) {
      PinnedWine.save({ wine: wineInCellar.vintage.wine, userId: cellar.userId }, function successCallback(result) {
        vm.removeWine(wineInCellar.id);
        CommonServices.addPinnedWineInCache(result);
      }, function() {
        CommonServices.showAlert('error.createPinnedWine');
      });
    }

  }
})();
