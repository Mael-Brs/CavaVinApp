'use strict';

describe('module: main, service: CommonServices', function() {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  let CommonServices;
  let CacheService;
  let cellar;
  const wineInCellar = [];
  beforeEach(inject(function(_CommonServices_, _CacheService_) {
    CommonServices = _CommonServices_;
    CacheService = _CacheService_;
  }));

  describe('init cache data', function() {
    beforeEach(function() {
      cellar = { sumOfWine: null, wineByRegion: null, wineByColor: null, wineByYear: null};
      CacheService.put('activeCellar', cellar);
      wineInCellar.push(createWineInCellar(2017, 'Bordeaux', 'Rouge', 1));
      wineInCellar.push(createWineInCellar(2010, 'Bordeaux', 'Rouge', 1));
      wineInCellar.push(createWineInCellar(2017, 'Vallée de la Loire', 'Blanc', 5));
      CacheService.put('wineInCellars', wineInCellar);
    });

    it('should update cellar in cache', function() {
      expect(CacheService.get('activeCellar').sumOfWine).toBeNull();
      CommonServices.updateCellarDetails();
      expect(CacheService.get('activeCellar').sumOfWine).toEqual(7);
      expect(CacheService.get('activeCellar').wineByRegion.length).toEqual(2);
      expect(CacheService.get('activeCellar').wineByColor.length).toEqual(2);
      expect(CacheService.get('activeCellar').wineByYear.length).toEqual(2);
    });
  });

  function createWineInCellar(year, regionName, colorName, quantity) {
    return {
      'quantity': quantity,
      'vintage': {
        'year': year,
        'wine': {
          'region': {
            'regionName': regionName
          },
          'color': {
            'colorName': colorName
          }
        }
      }
    };
  }

});
