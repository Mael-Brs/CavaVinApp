(function() {
  'use strict';

  angular
    .module('main')
    .directive('showValidation', showValidation);

  function showValidation() {
    const directive = {
      restrict: 'A',
      require: 'form',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs, formCtrl) {
      element.find('.form-group').each(function() {
        const $formGroup = angular.element(this);
        const $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

        if ($inputs.length > 0) {
          $inputs.each(function() {
            const $input = angular.element(this);
            const inputName = $input.attr('name');
            scope.$watch(function() {
              return formCtrl[inputName].$invalid && formCtrl[inputName].$dirty;
            }, function(isInvalid) {
              $formGroup.toggleClass('has-error', isInvalid);
            });
          });
        }
      });
    }
  }
})();
