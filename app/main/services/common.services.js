(function() {
    'use strict';
    angular
    .module('main')
    .factory('CommonServices', CommonServices);

    CommonServices.$inject = ['CacheService', '$ionicPopup', '$translate', 'Cellar', '$q'];

    function CommonServices (CacheService, $ionicPopup, $translate, Cellar, $q){
        var services = {
            updateCellarDetails:updateCellarDetails,
            addWinesInCache:addWinesInCache,
            updateWineInCellar:updateWineInCellar,
            showAlert:showAlert,
            getCellar:getCellar
        };
        return services;

        /**
         * Met à jour les stats de la cave dans le cache
         */
        function updateCellarDetails() {
            var wineInCellars = CacheService.get('wineInCellars');
            var cellar = CacheService.get('activeCellar');

            if(cellar && wineInCellars){
                var sumOfWine = 0;
                var wineByRegion = [];
                var wineByColor = [];
                var wineByYear = [];
                var sumByRegion = {};
                var sumByColor = {};
                var sumByYear = {};


                for (var i = 0 ; i < wineInCellars.length ; i++){
                    var quantity = wineInCellars[i].quantity;
                    var region = wineInCellars[i].vintage.wine.region.regionName;
                    var color = wineInCellars[i].vintage.wine.color.colorName;
                    var year = wineInCellars[i].vintage.year;

                    sumOfWine += quantity;

                    if(!sumByRegion[region]){
                        sumByRegion[region] = quantity;
                    } else {
                        sumByRegion[region] += quantity;
                    }

                    if(!sumByColor[color]){
                        sumByColor[color] = quantity;
                    } else {
                        sumByColor[color] += quantity;
                    }

                    if(!sumByYear[year]){
                        sumByYear[year] = quantity;
                    } else {
                        sumByYear[year] += quantity;
                    }
                }

                for(var regionName in sumByRegion){
                    if(sumByRegion.hasOwnProperty(regionName)){
                      wineByRegion.push({region:regionName, sum:sumByRegion[regionName]});
                    }
                }

                for(var colorName in sumByColor){
                	if(sumByColor.hasOwnProperty(colorName)){
                    	wineByColor.push({color:colorName, sum:sumByColor[colorName]});
                	}
                }

                for(var yearNumber in sumByYear){
                	if(sumByYear.hasOwnProperty(yearNumber)){
	                    wineByYear.push({year:yearNumber, sum:sumByYear[yearNumber]});
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
         * Ajoute les vins en cache en les mappant par id
         * @param {List<WineInCellar>} wines Liste des vins dans la cave de l'utilisateur
         */
        function addWinesInCache(wines){
            var wineInCellars = [];

            for (var i = 0 ; i < wines.length ; i++){
                var wine = wines[i];
                wineInCellars[wine.id] = wine;
            }
            CacheService.put('wineInCellars', wineInCellars);
        }

        /**
         * Recherche et met à jour le vin dans le cache
         * @param  {WineInCellar} wineInCellar vin
         */
        function updateWineInCellar(wineInCellar){
            var wineInCellars = CacheService.get('wineInCellars');

            for (var i = 0 ; i < wineInCellars.length ; i++){
                if(wineInCellars[i].id === wineInCellar.id){
                    wineInCellars[i] = wineInCellar;
                    break;
                }
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
        function getCellar(){
            var deferred = $q.defer();
            var cellar = CacheService.get('activeCellar');
            
            if(!cellar){
                Cellar.query(function(result){
                    cellar = result[0];
                    deferred.resolve(cellar);
                }, function(){
                    this.showAlert('error.getCellar');
                });
            } else {
                deferred.resolve(cellar);
            }
            return deferred.promise;
        }
    }
})();
