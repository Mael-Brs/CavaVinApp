(function() {
  'use strict';

  angular
    .module('main')
    .factory('DateUtils', DateUtils);

  DateUtils.$inject = ['$filter'];

  function DateUtils($filter) {

    const service = {
      convertDateTimeFromServer: convertDateTimeFromServer,
      convertLocalDateFromServer: convertLocalDateFromServer,
      convertLocalDateToServer: convertLocalDateToServer,
      dateformat: dateformat
    };

    return service;

    function convertDateTimeFromServer(date) {
      if (date) {
        return new Date(date);
      } else {
        return null;
      }
    }

    function convertLocalDateFromServer(date) {
      if (date) {
        const dateString = date.split('-');
        return new Date(dateString[0], dateString[1] - 1, dateString[2]);
      }
      return null;
    }

    function convertLocalDateToServer(date) {
      if (date) {
        return $filter('date')(date, 'yyyy-MM-dd');
      } else {
        return null;
      }
    }

    function dateformat() {
      return 'yyyy-MM-dd';
    }
  }

})();
