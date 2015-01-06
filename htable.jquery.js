;(function ( $, window, document, undefined ) {

    var pluginName = "htable";

    var counter = 1;

    var defaults = {
        addCallback: function(element, value) {
            alert('not implemented - addCallback');
        },
        loadCallback: function(element, pos) {
            alert('not implemented - loadCallback');
        }
    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function() {
            var self = this;
            $(this.element).find('[htable-action-add]').click(function() {
                self.addElement();
            });
            $(this.element).find('[htable-action-del]').hide();
            $(this.element).find('[htable-content]').empty();
        },

        addElement: function(value) {
            var self = this;
            var lastElement = $(this.element).find('[htable-col]').last();
            var newElement = lastElement.clone();
            newElement.find('[htable-action-add]').remove();
            $(newElement).find('[htable-action-del]').show();
            $(newElement).find('[htable-action-del]').click(function() {
                self.removeElement(this);
            });
            this.settings.addCallback.call(this, newElement.find('[htable-content]'), value);
            lastElement.before(newElement);
        },

        removeElement: function(element) {
            $(element).closest('[htable-col]').remove();
        },

        load: function() {
            var self = this;

            var result = new Array();
            $.each($(this.element).find('[htable-content]'),
                function(pos, element) {
                    if (!$(element).is(':empty')) {
                        var obj = self.settings.loadCallback.call(self, element, pos);
                        if (obj != null) {
                            result.push(obj);
                        }
                    }
                }
            );

            return result;
        },

        fill: function(values) {
            var self = this;
            if (values != null && values instanceof Array) {
                $.each(values, function(i, value) {
                    self.addElement(value);
                });
            }
        }
    });

    $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function() {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Plugin && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                  $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };

})( jQuery, window, document );
