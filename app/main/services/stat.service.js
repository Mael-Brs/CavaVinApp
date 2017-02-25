(function() {
    'use strict';
    angular
    .module('main')
    .factory('StatService', StatService);

    StatService.$inject = ['CacheService'];

    function StatService (CacheService){
        var services = {
            updateCellarDetails:updateCellarDetails
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
    }
})();