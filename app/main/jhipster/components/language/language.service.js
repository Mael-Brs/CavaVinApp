(function() {
  'use strict';

  angular
    .module('main')
    .factory('JhiLanguageService', JhiLanguageService);

  JhiLanguageService.$inject = ['$q', '$http', '$translate', 'LANGUAGES'];

  function JhiLanguageService($q, $http, $translate, LANGUAGES) {
    const service = {
      getAll: getAll,
      getCurrent: getCurrent
    };

    return service;

    function getAll() {
      const deferred = $q.defer();
      deferred.resolve(LANGUAGES);
      return deferred.promise;
    }

    function getCurrent() {
      const deferred = $q.defer();
      const language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');

      deferred.resolve(language);

      return deferred.promise;
    }
  }
})();
