(function($) {

    $.theChart = "";
    $.containerId = "";
    $.theme = "";
    $.dimensions = "";
    $.title = "";
    $.dateFormat = "";
    $.defaultOperator = "=";
    $.generator = "";

    $.fn.amFilter = function(options) {

        var config = $.extend({
            chartObject: "",
            debug: false,
            filterContainer: this.selector,
            theme: "",
            dimensions: [],
            title: "",
            dateFormat: "",
            generator: "",

        }, options);

        $.theChart = config.chartObject;
        $.filterContainer = config.filterContainer;
        $.theme = config.theme;
        $.dimensions = config.dimensions;
        $.title = config.title;
        $.dateFormat = config.dateFormat;
        $.generator = config.generator;

        $('head').append('<link rel="stylesheet" type="text/css" href="' + $.theme + '">');

        if (!$.theChart) {
            if (config.debug === true) {
                console.debug("Missing chartObject property!");
            }
            return false;
        } else {
            $.theChart.addListener("rendered", $.buildFilter);
        }

    };

    $.buildActionButton = function() {

        $.button = '<input type="button" name="clear" value="Clear filter" class="jqaf-action-button">&nbsp;<input type="submit" name="apply" value="Apply filter" class="jqaf-action-button">';
        return $.button;

    };

    $.buildGrid = function() {

        $.row = "";
        $.value = "";
        $.dimension = "";

        for ($.item in $.dimensions) {
            // console.log($.dimensions[$.item].name);

            if (typeof $.dimensions[$.item].operator !== "undefined") {
                $.operator = '<input type="hidden" name="operator[]" value="' + $.dimensions[$.item].operator + '">';
            } else {
                $.operator = '<input type="hidden" name="operator[]" value="' + $.defaultOperator + '">';
            }

            $.dimension = '<input type="hidden" name="dimension[]" value="' + $.dimensions[$.item].dimension + '">';

            if ($.dimensions[$.item].type == 'date') {
                $.value = '<input type="text" name="value[]" class="date-field jqaf-field">';
            } else {
                $.value = '<input type="text" name="value[]" class="jqaf-field">'
            }

            $.row += '<div class="jqaf-tr"><div class="jqaf-tc">' + $.dimensions[$.item].name + '</div><div class="jqaf-tc">' + $.dimension + $.operator + $.value + '</div></div>';

        }

        return $.row;

    };

    $.buildHTML = function() {

        var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        var uniqid = randLetter + Date.now();

        var html = '<form method="post" id="jqaf-' + uniqid + '" action="' + $.generator + '" target="_blank" onSubmit="return $.sendRequest(this.id)">';
        html += '<input type="hidden" name="filter" value="true">';
        html += '<div class="jqaf"><div class="jqaf-title"><div class="jqaf-tc">' + $.title + '</div></div><div class="jqaf-table-container"><div class="jqaf-table"><div class="jqaf-th"><div class="jqaf-tc">Dimension</div><div class="jqaf-tc">Selected value</div></div>' + $.buildGrid() + '</div>' + $.buildActionButton() + '</div></div>';
        html += '</form>';

        return html;
    };

    $.sendRequest = function(form) {
        $.ajax({
            type: "POST",
            url: $("#" + form).attr('action'),
            data: $("#" + form).serialize(),
            success: function(response) {
                $.theChart.dataProvider = response;
                $.theChart.validateData();
            }
        });
        return false;
    };
	
    $.buildFilter = function() {
        $.buildGrid();
        $.containerId = $.theChart.div.id;
        $($.filterContainer).html($.buildHTML());
        $('.date-field').datepicker({
            dateFormat: $.dateFormat
        });
    };

}(jQuery));