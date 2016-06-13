batsAdminHome
			.directive(
					'speedMeter',
				function() {
					return {
						restrict : 'C',
						replace : true,
						scope : {
							items : '='
						},
						controller : function($scope, $element, $attrs) {
						},
						template : '<div id="container" style="margin: 0 auto">not working</div>',
						link : function(scope, element, attrs) {
							var chart = new Highcharts.Chart({

								chart : {
									renderTo : 'container',
									type : 'gauge',
									width : '300',
									height : '300'

								},

								title : {
									text : devIDval
								},

								pane : {
									startAngle : -150,
									endAngle : 150,
									background : [
											{
												backgroundColor : {
													linearGradient : {
														x1 : 0,
														y1 : 0,
														x2 : 0,
														y2 : 1
													},
													stops : [ [ 0, '#FFF' ],
															[ 1, '#333' ] ]
												},
												borderWidth : 0,
												outerRadius : '100%'
											},
											{
												backgroundColor : {
													linearGradient : {
														x1 : 0,
														y1 : 0,
														x2 : 0,
														y2 : 1
													},
													stops : [ [ 0, '#333' ],
															[ 1, '#FFF' ] ]
												},
												borderWidth : 1,
												outerRadius : '107%'
											}, {
											// default background
											}, {
												backgroundColor : '#DDD',
												borderWidth : 0,
												outerRadius : '105%',
												innerRadius : '103%'
											} ]
								},

								// the value axis
								yAxis : {
									min : 0,
									max : 200,

									minorTickInterval : 'auto',
									minorTickWidth : 1,
									minorTickLength : 10,
									minorTickPosition : 'inside',
									minorTickColor : '#666',

									tickPixelInterval : 30,
									tickWidth : 2,
									tickPosition : 'inside',
									tickLength : 10,
									tickColor : '#666',
									labels : {
										step : 2,
										rotation : 'auto'
									},
									title : {
										text : 'km/h'
									},
									plotBands : [ {
										from : 0,
										to : 120,
										color : '#55BF3B' // green
									}, {
										from : 120,
										to : 160,
										color : '#DDDF0D' // yellow
									}, {
										from : 160,
										to : 200,
										color : '#DF5353' // red
									} ]
								},

								series : [ {
									name : 'Speed',
									data : [speedValue],
									tooltip : {
										valueSuffix : ' km/h'
									}
								} ]
							});
						}
					};
				});