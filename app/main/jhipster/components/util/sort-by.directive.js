(function() {
  'use strict';

  angular
    .module('main')
    .directive('jhSortBy', jhSortBy);

  function jhSortBy() {
    const directive = {
      restrict: 'A',
      scope: false,
      require: '^jhSort',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs, parentCtrl) {
      element.bind('click', function() {
        parentCtrl.sort(attrs.jhSortBy);
      });
    }
  }
})();
