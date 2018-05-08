'use strict';
(function() {
  angular
    .module('main')
    .factory('CommonServices', CommonServices);

  CommonServices.$inject = ['CacheService', '$ionicPopup', '$translate', 'Cellar', '$q', 'User', 'WineInCellarSearch'];

  function CommonServices(CacheService, $ionicPopup, $translate, Cellar, $q, User, WineInCellarSearch) {
    const services = {
      updateCellarDetails: updateCellarDetails,
      updateWineInCellar: updateWineInCellar,
      showAlert: showAlert,
      getCellar: getCellar,
      getPinnedWines: getPinnedWines,
      addPinnedWineInCache: addPinnedWineInCache,
      getWinesInCellar: getWinesInCellar
    };
    return services;

    /**
     * Met à jour les stats de la cave dans le cache
     */
    function updateCellarDetails() {
      const wineInCellars = CacheService.get('wineInCellars');
      const cellar = CacheService.get('activeCellar');

      if (cellar && wineInCellars) {
        let sumOfWine = 0;
        const wineByRegion = [];
        const wineByColor = [];
        const wineByYear = [];
        const sumByRegion = {};
        const sumByColor = {};
        const sumByYear = {};


        for (let i = 0; i < wineInCellars.length; i++) {
          const quantity = wineInCellars[i].quantity;
          const region = wineInCellars[i].vintage.wine.region.regionName;
          const color = wineInCellars[i].vintage.wine.color.colorName;
          const year = wineInCellars[i].vintage.year;

          sumOfWine += quantity;

          if (!sumByRegion[region]) {
            sumByRegion[region] = quantity;
          } else {
            sumByRegion[region] += quantity;
          }

          if (!sumByColor[color]) {
            sumByColor[color] = quantity;
          } else {
            sumByColor[color] += quantity;
          }

          if (!sumByYear[year]) {
            sumByYear[year] = quantity;
          } else {
            sumByYear[year] += quantity;
          }
        }

        for (const regionName in sumByRegion) {
          if (sumByRegion.hasOwnProperty(regionName)) {
            wineByRegion.push({ region: regionName, sum: sumByRegion[regionName] });
          }
        }

        for (const colorName in sumByColor) {
          if (sumByColor.hasOwnProperty(colorName)) {
            wineByColor.push({ color: colorName, sum: sumByColor[colorName] });
          }
        }

        for (const yearNumber in sumByYear) {
          if (sumByYear.hasOwnProperty(yearNumber)) {
            wineByYear.push({ year: yearNumber, sum: sumByYear[yearNumber] });
          }
        }

        cellar.sumOfWine = sumOfWine;
        cellar.wineByRegion = wineByRegion;
        cellar.wineByColor = wineByColor;
        cellar.wineByYear = wineByYear;
        CacheService.put('activeCellar', cellar);
      }
    }

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
     */
    function getCellar() {
      const deferred = $q.defer();
      let cellar = CacheService.get('activeCellar');

      if (!cellar) {
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
     * @returns Promise
     */
    function getWinesInCellar() {
      const deferred = $q.defer();
      let wines = CacheService.get('wineInCellars');

      if (!wines) {
        WineInCellarSearch.query({sort: 'apogee,asc', query: '*'}, function(result) {
          wines = result;
          CacheService.put('wineInCellars', wines);
          //Update cache
          updateCellarDetails();
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
