(function() {
    'use strict';
    angular
    .module('main')
    .factory('CommonServices', CommonServices);

    CommonServices.$inject = ['CacheService'];

    function CommonServices (CacheService){
        var services = {
            updateCellarDetails:updateCellarDetails,
            addWinesInCache:addWinesInCache,
            updateWineInCellar:updateWineInCellar
        };
        return services;

        function updateCellarDetails() {
            var wineInCellars = CacheService.get('wineInCellars');
            var cellar = CacheService.get('activeCellar');
            
            if(cellar && wineInCellars){
                var sumOfWine = 0;
                var wineByRegion = [];
                var wineByColor = [];
                var sumByRegion = {};
                var sumByColor = {};

                for (var i = 0 ; i < wineInCellars.length ; i++){
                    var quantity = wineInCellars[i].quantity;
                    var region = wineInCellars[i].vintage.wine.region.regionName;
                    var color = wineInCellars[i].vintage.wine.color.colorName;

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
                }

                for(var regionName in sumByRegion){
                    wineByRegion.push({region:regionName, sum:sumByRegion[regionName]});
                }

                for(var colorName in sumByColor){
                    wineByColor.push({color:colorName, sum:sumByColor[colorName]});
                }

                cellar.sumOfWine = sumOfWine;
                cellar.wineByRegion = wineByRegion;
                cellar.wineByColor = wineByColor;
                CacheService.put('activeCellar', cellar);
            }
        }

        /**
         * Ajoute les vins en cache en les mappant par id
         * @param {[type]} wines [description]
         */
        function addWinesInCache(wines){
            var wineInCellars = [];

            for (var i = 0 ; i < wines.length ; i++){
                var wine = wines[i];
                wineInCellars[wine.id] = wine;
            }
            CacheService.put('wineInCellars', wineInCellars);
        }

        function updateWineInCellar(wineInCellar){
            var wineInCellars = CacheService.get('wineInCellars');

            for (var i = 0 ; i < wineInCellars.length ; i++){
                if(wineInCellars[i].id === wineInCellar.id){
                    wineInCellars[i] = wineInCellar;
                }
            }
            CacheService.put('wineInCellars', wineInCellars);
        }

    }
})();