'use strict';

describe('module: main, controller: WineInCellarEditCtrl', function() {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var WineInCellarEditCtrl;
  beforeEach(inject(function(_$controller_, _$rootScope_) {
    var $controller = _$controller_;
    var $rootScope = _$rootScope_;
    var $scope = $rootScope.$new();
    WineInCellarEditCtrl = $controller('WineInCellarEditCtrl', {$scope: $scope});
  }));

  describe('init', function() {
    it('Controller should be set', function() {
      expect(WineInCellarEditCtrl).toBeDefined();
    });
  });

});
