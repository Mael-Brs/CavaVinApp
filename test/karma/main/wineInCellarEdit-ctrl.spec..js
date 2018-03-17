'use strict';

describe('module: main, controller: wineInCellarEditCtrl', function() {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var wineInCellarEditCtrl;
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    var $controller = _$controller_;
    var $rootScope = _$rootScope_;
    var $scope = $rootScope.$new();
    wineInCellarEditCtrl = $controller('wineInCellarEditCtrl', {$scope: $scope});
  }));

  describe('init', function() {
    it('Controller should be set', function() {
      expect(wineInCellarEditCtrl).toBeDefined();
    });
  });

});
