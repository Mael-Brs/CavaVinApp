'use strict';

describe('module: main, controller: WineInCellarEditCtrl', function() {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  let WineInCellarEditCtrl;
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    const $controller = _$controller_;
    const $rootScope = _$rootScope_;
    const $scope = $rootScope.$new();
    WineInCellarEditCtrl = $controller('WineInCellarEditCtrl', {$scope: $scope});
  }));

  describe('init', function() {
    it('Controller should be set', function() {
      expect(WineInCellarEditCtrl).toBeDefined();
    });
  });

});
