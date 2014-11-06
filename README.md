Example usage
=============

// Create the chart

var chartData = AmCharts.loadJSON("PATH_TO_JSON.php");

var chart = AmCharts.makeChart("chart-container", {
    "type": "serial",
    "theme": "none",
    "pathToImages": "http://www.amcharts.com/lib/3/images/",
    "dataProvider": chartData,
    "valueAxes": [{
        "axisAlpha": 0.2,
        "dashLength": 1,
        "position": "left"
    }],
    "mouseWheelZoomEnabled": true,
    "graphs": [{
        "id": "g1",
        "balloonText": "[[category]]<br /><b><span style='font-size:14px;'>value: [[value]]</span></b>",
        "bullet": "round",
        "bulletBorderAlpha": 1,
        "bulletColor": "#FFFFFF",
        "hideBulletsCount": 50,
        "title": "red line",
        "valueField": "visits",
        "useLineColorForBulletBorder": true
    }],
    "chartScrollbar": {
        "autoGridCount": true,
        "graph": "g1",
        "scrollbarHeight": 40
    },
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "categoryField": "date",
    "categoryAxis": {
        "parseDates": true,
        "axisColor": "#DADADA",
        "dashLength": 1,
        "minorGridEnabled": true
    },
    "exportConfig": {
        menuRight: '20px',
        menuBottom: '30px',
        menuItems: [{
            icon: 'http://www.amcharts.com/lib/3/images/export.png',
            format: 'png'
        }]
    }
});

// Initialize the plugin

$(".filter").amFilter({
    chartObject: chart,
    debug: false,
    theme: "PATH_TO_THEME_FILE.css",
    title: 'Filter',
    dateFormat: 'yy-mm-dd',
    generator: 'PATH_TO_JSON.php',
    dimensions: [{
        name: "Date from",
        dimension: "date",
        type: "date",
        operator: ">"
    }, {
        name: "Date to",
        dimension: "date",
        type: "date",
        operator: "<"
    }, {
        name: "Dimension",
        dimension: "dimension",
        type: "string"

    }]
});

// In the jSON.php file

if (isset($_POST['filter'])) {
	$dimension = $_POST['dimension'];
	$operator = $_POST['operator'];
	$value = $_POST['value'];
	$params = array();
	for ($i = 0; $i < count($dimension); $i++) {
		if ($value[$i]!="") {
			$params[] = $dimension[$i]." ".$operator[$i]." '".$value[$i]."'";
		}
	}
	$paramString = implode(" AND ", $params);
	$query = "SELECT * FROM table WHERE ".$paramString;
}
else {
	$query = "SELECT * FROM table ";
}
