(function() {

  angular
    .module('main')
    .controller('ListCtrl', ListCtrl);

  ListCtrl.$inject = ['$scope', '$translate', '$state', 'WineInCellar', 'Principal', '$ionicPopup', 'Cellar', 'User', 'CacheService', '$ionicModal', '$ionicListDelegate', 'CommonServices', 'PinnedWine'];


  function ListCtrl($scope, $translate, $state, WineInCellar, Principal, $ionicPopup, Cellar, User, CacheService, $ionicModal, $ionicListDelegate, CommonServices, PinnedWine) {
    const date = new Date();
    const regExp = new RegExp(/(?:page=)(\d)/);
    let cellar;
    const vm = this;
    vm.wines = [];
    vm.showForm = false;
    //paramètres de tri
    vm.sortWine = vm.newSortWine = 'apogeeYear'; // set the default sort color
    vm.sortReverse = false;
    vm.isWineInCellarFilter = true;
    vm.isLoading = true;
    vm.page = 0;
    vm.itemsPerPage = 20;
    vm.lastPage = 0;
    vm.thisYear = date.getFullYear();
    vm.yearRatio = (date.getMonth() + 1) / 12;
    vm.query = '';
    vm.searchRegion = null;
    vm.searchColor = null;
    vm.searchWine = null;

    vm.openModal = openModal;
    vm.openFilter = openFilter;
    vm.updateQuantity = updateQuantity;
    vm.loadPage = loadPage;
    vm.clearFilter = clearFilter;
    vm.sort = sort;
    vm.removeWine = removeWine;
    vm.editWine = editWine;

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
    function removeWine(id) {
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
    }

    /**
     * Ouvre l'écran d'édition du vin
     * @param wineInCellar vin à mettre à jour
     */
    function editWine(wineInCellar) {
      if (wineInCellar.vintage.wine.creatorId === cellar.userId) {
        $state.go('wineInCellarFullEdit', { wineId: wineInCellar.id });
      } else {
        CacheService.put('selectedWineInCellar', wineInCellar);
        $state.go('wineInCellarEdit', { wineId: wineInCellar.id });
      }
    }

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
          WineInCellar.update(wineInCellar, function() {
            updateCacheData();
          }, function() {
            CommonServices.showAlert('error.updateWine');
          });

        }
      }
    }

    /**
     * Met à jour les données de vin en cache
     */
    function updateCacheData() {
      CommonServices.getWinesInCellar(true);
      CommonServices.getCellar(true);
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
      vm.newSearchColor = vm.searchColor;
      vm.newSearchRegion = vm.searchRegion;
      vm.newSearchWine = vm.searchWine;
      vm.newSortWine = vm.sortWine;
      $ionicPopup.show({
        templateUrl: 'main/templates/filterPopup.html',
        title: 'Filtrer les vins',
        scope: $scope,
        buttons: [
          {
            text: $translate.instant('entity.action.filter'),
            type: 'button-positive',
            onTap: function() {
              buildQuery();
            }
          },
          {
            text: $translate.instant('entity.action.close')
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
     * @param wineInCellar le vin à épingler
     */
    function savePinnedWine(wineInCellar) {
      PinnedWine.save({ wine: wineInCellar.vintage.wine, userId: cellar.userId }, function successCallback(result) {
        vm.removeWine(wineInCellar.id);
        CommonServices.addPinnedWineInCache(result);
      }, function() {
        CommonServices.showAlert('error.createPinnedWine');
      });
    }

    /**
     * Charge la page en paramètre
     * @param {Number} page Numero de la page à charger
     */
    function loadPage(page) {
      vm.page = page;
      search();
    }

    /**
     * Lance la requête eleasticSearch
     */
    function search() {
      WineInCellar.query({
        'keywords': vm.searchWine,
        'region.equals': vm.searchRegion,
        'color.equals': vm.searchColor,
        'page': vm.page,
        'size': vm.itemsPerPage,
        'sort': vm.sortWine + (vm.sortReverse ? ',desc' : ',asc'),
        'cellarId.equals': cellar.id
      }, function(result, headers) {
        getLastPage(headers('link'));
        vm.wines = vm.wines.concat(result);

        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function() {
        CommonServices.showAlert('error.searchWine');
      });
    }

    /**
     * Récupère l'index de la dernière page dans les headers
     * @param header
     */
    function getLastPage(header) {
      const array = header.split(',');
      for (let i = 0; i < array.length; i++) {
        if (array[i].indexOf('last') > -1) {
          vm.lastPage = regExp.exec(array[i])[1];
        }
      }
    }

    /**
     * Construit la query elasticSearch
     */
    function buildQuery() {
      let isNewSearch = false;
      if (vm.newSearchRegion) {
        isNewSearch = true;
        vm.searchRegion = vm.newSearchRegion;
      }
      if (vm.newSearchColor) {
        isNewSearch = true;
        vm.searchColor = vm.newSearchColor;
      }
      if (vm.newSearchWine) {
        isNewSearch = true;
        vm.searchWine = vm.newSearchWine;
      }
      if (isNewSearch || vm.newSortWine !== vm.sortWine) {
        vm.sortWine = vm.newSortWine;
        vm.wines = [];
        loadPage(0);
      }
    }

    /**
     * Déclenche le changement du sens de tri
     * @param sortReverse
     */
    function sort(sortReverse) {
      vm.sortReverse = sortReverse;
      vm.wines = [];
      loadPage(0);
    }

    /**
     * Efface les filtres actifs
     */
    function clearFilter() {
      vm.searchRegion = vm.searchColor = vm.searchWine = null;
      vm.wines = [];
      loadPage(0);
    }

  }
})();
