(function( $ ) {

  var filterContainer = {};

  filterContainer.upperFilter = function(object) {
    $(object).css({'text-transform':'uppercase'}).blur(function() {
      $(this).val($(this).val().toLocaleUpperCase());
    });
  };

  filterContainer.regexFilter = function(object, regex) {
    var regex = regex || $(object).attr('data-regex') || '\W';
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
    filterContainer.regexFilter(object, '[^-a-zA-Z0-9]');
  };

  filterContainer.numericFilter = function(object) {
    filterContainer.regexFilter(object, '[^0-9]');
  };

  filterContainer.dateFilter = function (object) {    
    var trigger = $(object).data('trigger');
    $(object).datepicker({
      language: 'ru',
      todayBtn: 'linked',
      autoclose: true,
      format: 'd.mm.yyyy',
      showOnFocus: trigger ? false : true,
          todayBtn: true,
          todayHighlight: true
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
        var filters = $(this).attr('data-format').split(' '), i, filterFunction;
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

}(jQuery));
