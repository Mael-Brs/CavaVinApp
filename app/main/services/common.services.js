'use strict';
(function() {
  angular
    .module('main')
    .factory('CommonServices', CommonServices);

  CommonServices.$inject = ['CacheService', '$ionicPopup', '$translate', 'Cellar', '$q', 'User', 'WineInCellar'];

  function CommonServices(CacheService, $ionicPopup, $translate, Cellar, $q, User, WineInCellar) {
    const services = {
      updateWineInCellar: updateWineInCellar,
      showAlert: showAlert,
      getCellar: getCellar,
      getPinnedWines: getPinnedWines,
      addPinnedWineInCache: addPinnedWineInCache,
      getWinesInCellar: getWinesInCellar
    };
    return services;

    /**
     * Recherche et met à jour le vin dans le cache
     * @param  {WineInCellar} wineInCellar vin
     */
    function updateWineInCellar(wineInCellar) {
      const wineInCellars = CacheService.get('wineInCellars');
      let found = false;
      for (let i = 0; i < wineInCellars.length; i++) {
        if (wineInCellars[i].id === wineInCellar.id) {
          wineInCellars[i] = wineInCellar;
          found = true;
          break;
        }
      }
      if (found === false) {
        wineInCellars.push(wineInCellar);
      }
      CacheService.put('wineInCellars', wineInCellars);
    }

    /**
		 * Fonction affichant une popup d'alerte
		 * @param  {String} alertMessage message à afficher
		 */
    function showAlert(alertMessage) {
      $ionicPopup.alert({
        title: '<b>' + $translate.instant('error.title') + '</b>',
        template: $translate.instant(alertMessage)
      });
    }

    /**
     * Renvoie la cave depuis le cache ou le back
     * @param reload booléen force l'appel au back
     * @returns Promise
     */
    function getCellar(reload) {
      const deferred = $q.defer();
      let cellar = CacheService.get('activeCellar');

      if (!cellar || reload) {
        Cellar.query(function(result) {
          cellar = result[0];
          CacheService.put('activeCellar', cellar);
          deferred.resolve(cellar);
        }, function() {
          showAlert('error.getCellar');
          deferred.resolve();
        });
      } else {
        deferred.resolve(cellar);
      }
      return deferred.promise;
    }

    /**
     * Retourne les vins épinglés depuis le cache ou le back
     * @param userId identifiant de l'utilisateur
     * @returns Promise
     */
    function getPinnedWines(userId) {
      const deferred = $q.defer();
      let pinnedWines = CacheService.get('pinnedWines');

      if (!pinnedWines) {
        User.pinnedWines({ ref: userId }, function(result) {
          pinnedWines = result;
          deferred.resolve(pinnedWines);
        }, function() {
          showAlert('error.getWines');
          deferred.resolve();
        });
      } else {
        deferred.resolve(pinnedWines);
      }
      return deferred.promise;
    }

    /**
     * Ajoute un nouveau vin épinglé en cache si le cache existe
     * @param pinnedWine Vin épinglé
     */
    function addPinnedWineInCache(pinnedWine) {
      const pinnedWines = CacheService.get('pinnedWines');
      if (pinnedWines) {
        pinnedWines.push(pinnedWine);
        CacheService.put('pinnedWines', pinnedWines);
      }
    }

    /**
     * Retourne les vins épinglés depuis le cache ou le back
     * @param reload booléen force l'appel au back
     * @returns Promise
     */
    function getWinesInCellar(reload) {
      const deferred = $q.defer();
      let wines = CacheService.get('wineInCellars');

      if (!wines || reload) {
        WineInCellar.query({sort: 'apogeeYear,asc'}, function(result) {
          wines = result;
          CacheService.put('wineInCellars', wines);
          //Update view
          deferred.resolve(wines);
        }, function() {
          showAlert('error.getWines');
          deferred.resolve();
        });
      } else {
        deferred.resolve(wines);
      }
      return deferred.promise;
    }
  }
})();
