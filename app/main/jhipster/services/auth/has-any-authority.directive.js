(function() {
  'use strict';

  angular
    .module('main')
    .directive('hasAnyAuthority', hasAnyAuthority);

  hasAnyAuthority.$inject = ['Principal'];

  function hasAnyAuthority(Principal) {
    const directive = {
      restrict: 'A',
      link: linkFunc
    };

    return directive;

    function linkFunc(scope, element, attrs) {
      const authorities = attrs.hasAnyAuthority.replace(/\s+/g, '').split(',');

      let setVisible = function() {
          element.removeClass('hidden');
        },
        setHidden = function() {
          element.addClass('hidden');
        },
        defineVisibility = function(reset) {
          let result;
          if (reset) {
            setVisible();
          }

          result = Principal.hasAnyAuthority(authorities);
          if (result) {
            setVisible();
          } else {
            setHidden();
          }
        };

      if (authorities.length > 0) {
        defineVisibility(true);

        scope.$watch(function() {
          return Principal.isAuthenticated();
        }, function() {
          defineVisibility(true);
        });
      }
    }
  }
})();
