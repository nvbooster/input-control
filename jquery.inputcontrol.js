(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (require('jquery-caret'),require('bootstrap-datepicker'),factory(require('jquery'))) :
  typeof define === 'function' && define.amd ? define(['jquery', 'bootstrap-datepicker', 'jquery-caret'], factory) :
  (factory(global.jQuery));
}(this, (function ($) {
  
  var config = this.inputcontrol = $.extend({
    locale: 'en'
  }, this.inputcontrol || {});

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  
  var filterContainer = {};

  filterContainer.upperFilter = function(object) {
    $(object).css({'text-transform':'uppercase'}).blur(function() {
      $(this).val($(this).val().toLocaleUpperCase());
    });
  };

  filterContainer.regexFilter = function(object, regex) {
    var regex = regex || $(object).data('regex') || '\W';
    $(object).bind({
      keydown: function() {
        $(this).data('pos', $(this).caret());
      },
      keyup: function() {
        var val = $(this).val().replace(new RegExp(regex, 'gi'), ''),
        pos = $(this).data('pos');

        if (val !== $(this).val()) {
          $(this).val(val);
          $(this).caret(pos);
        }
      }
    });
  };

  filterContainer.latinFilter = function(object) {
    filterContainer.regexFilter(object, '[^ -a-zA-Z0-9]');
  };

  filterContainer.numericFilter = function(object) {
    filterContainer.regexFilter(object, '[^0-9]');
  };

  filterContainer.dateFilter = function (object) {    
    var trigger = $(object).data('trigger');
    $(object).datepicker({
      language: $(object).data('locale') || config.locale,
      todayBtn: 'linked',
      autoclose: true,
      format: 'd.mm.yyyy',
      showOnFocus: trigger ? false : true,
      todayBtn: true,
      todayHighlight: true,
      zIndexOffset: 2000,
    });
    if (trigger) {
      $('#' + trigger).click(function(e) {
        e.preventDefault();
        $(object).datepicker('show');
      })
    }
  };

  $.fn.inputControl = function(method) {
    if (method == 'filter') {
      if (arguments[1]  && (typeof arguments[2] === 'function')) {
        filterContainer[arguments[1] + 'Filter'] = arguments[2];
      } else {
        $.error('Cannot set filter');
      }
      return $(this);
    } else {
      return this.each(function() {
        var filters = $(this).data('format').split(' '), i, filterFunction;
        for (i=0; i<filters.length; i++) {
          filterFunction = filters[i]+'Filter';
          if (typeof filterContainer[filterFunction] === 'function') {
            filterContainer[filterFunction](this);
          }
        }
        return this;
      });
    }
  };

})));
