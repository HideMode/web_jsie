define("components/snackbar/service", ["angular", "jquery", "underscore", "snackbar"], function(angular, $, _) {

  return angular
    .module('app.services.snackbar', [])
    .factory('Snackbar', Snackbar);

  /**
   * @namespace Snackbar
   */
  function Snackbar() {
    /**
     * @name Snackbar
     * @desc The factory to be returned
     */
    var Snackbar = {
      error: error,
      show: show
    };

    return Snackbar;

    ////////////////////

    /**
     * @name _snackbar
     * @desc Display a snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function _snackbar(content, options) {
      options = _.extend({
        timeout: 3000,
        htmlAllowed: true
      }, options);
      options.content = content;
      $.snackbar(options);
    }


    /**
     * @name error
     * @desc Display an error snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function error(content, options) {
      _snackbar('错误: ' + content, options);
    }


    /**
     * @name show
     * @desc Display a standard snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function show(content, options) {
      _snackbar(content, options);
    }
  }
})