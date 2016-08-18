batsAdminHome.controller('batsAnalytics', function($scope, $http,$localStorage) {

	$scope.token = $localStorage.data;
	if (typeof $scope.token === "undefined") {
		swal({
			title : "Un Authorized Access",
			text : "Kindly Login!",
			type : "warning",
			confirmButtonColor : "#ff0000",
			closeOnConfirm : false
		}, function() {
			$localStorage.$reset();
			window.location = apiURL;
		});

	}

	//$scope.token = token;
	$scope.customer = {};
	$scope.customer.token =$scope.token;
	$scope.deviceSelected=false;
	$scope.yoData=true;
	$scope.noData=true;
	$scope.groupSelection=true;//disabled until group selected
	$scope.noanalyticsData=false;//show message that no analysis data
	$scope.speedAnalytics=false;//hide the speed analytics graph
	$scope.distanceanalytics=false;//hide the distance covered graph
	$scope.selectSpeed=true;//for show/hide of speed analysis granularity part
	$scope.selectDistance=true;//for show/hide of distance analysis granularity part
	$scope.weeklyChoice=true;//for show/hide of month calendar of weekly choice
	$scope.monthlyChoice=true;//for show/hide of from/to month calendar for monthly choice
	/**--------------------------------------------------------------------------------------------
		setting useUTC false for the highcharts is to show the time in 24hrs format and avoid UTC
							ref link : http://api.highcharts.com/highcharts#global
	--------------------------------------------------------------------------------------------*/
	Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    /**--------------------------------------------------------------------------------------------
    					basic settings for the HIGHCHARTS via this json
    						ref link http://jsfiddle.net/pablojim/cp73s/
    --------------------------------------------------------------------------------------------*/
	$http({
		method : 'POST',
		url : apiURL + 'group/list',
		data : JSON.stringify($scope.customer),
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function(data) {
		listGroup(data);
		//console.log(data);
		// console.log(JSON.stringify($scope.glist));
	}).error(function(data, status, headers, config) {
		//alert("group list>>>>>"+data.err);
		if (data.err == "Expired Session") {
			expiredSession();
			$localStorage.$reset();
		} else if (data.err == "Invalid User") {
			invalidUser();
			$localStorage.$reset();
		}
		console.log(data.err);
		console.log(status);
		console.log(headers);
		console.log(config);
	});
	/**
	 * function to list the group id and name
	 */

	 function listGroup(data) {
	 	var glist = [];
	 	for ( var inc = 0; inc < data.glist.length; inc++) {
	 		glist.push(data.glist[inc]);
	 	}
	 	$scope.groupList = glist;
		 //console.log(JSON.stringify($scope.groupList));
	}
	/**
	 * fetch device list based on group id
	 */
	 $scope.fetchDevicelist = function(groupID) {
		$scope.selDate = {"value":""};
		$scope.selMonth = {"value":""};
		$scope.stMonth = {"value":""};
		$scope.edMonth = {"value":""};
	 	/*document.getElementById("selectedDate").value='';
	 	document.getElementById("selectedMonth").value='';
	 	document.getElementById("startMonth").value='';
	 	document.getElementById("endMonth").value='';*/
	 	$scope.groupSelection=false;
		// console.log(groupID);
	 	$scope.highchartsNG = {};
	 	$scope.highchartsDG = {};
	 	$scope.speedAnalytics=false;
	 	$scope.distanceanalytics=false;
		$scope.groupdevicejson = {};
		$scope.groupdevicejson.token = $scope.token;
		$scope.groupdevicejson.gid = groupID;
		/**
		 * get device list based on group ID
		 */

		 $http({
		 	method : 'POST',
		 	url : apiURL + 'group/devlist',
		 	data : JSON.stringify($scope.groupdevicejson),
		 	headers : {
		 		'Content-Type' : 'application/json'
		 	}
		 }).success(function(data) {
		 	$scope.groupDevice = data;
		 	listDevice(data);
		 }).error(function(data, status, headers, config) {
		 	//alert("group/devlist>>>>>>>>>"+data.err);
			 if (data.err == "Expired Session") {
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {
					invalidUser();
					$localStorage.$reset();
			}
		 	console.log(data);
		 	console.log(status);
		 	console.log(headers);
		 	console.log(config);
		 });
		};
	/**
	 * ------------------dev list ends----------------------------*
	 */
		var devicelist;
	 function listDevice(deviceData) {
	 	var dev_len = deviceData.devlist.length;
	 	$scope.deviceList = [];
	 	devicelist = $scope.deviceList;
	 	for ( var inc = 0; inc < dev_len; inc++) {
	 		$scope.deviceList.push(deviceData.devlist[inc].devid);
	 	}
	 }

	 /**
	 	Analysis Choice based API call
	 	1)Speed Analytics Report
	 	2)Distance Analytics Report
*/
	$scope.analysis={};
	$scope.analysis.token=$scope.token;
	$scope.analysisChoice=function(choice){
		$scope.noanalyticsData=false;
		$scope.speedAnalytics=false;
		$scope.distanceanalytics=false;
			//1)Speed Analytics Report API
		if(choice==1){
			$scope.analysis.devlist=$scope.deviceList;
			$scope.selectSpeed=false;
			$scope.selectDistance=true;
			$scope.weeklyChoice=true;
			$scope.monthlyChoice=true;
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			} 

			if(mm<10) {
			    mm='0'+mm
			} 

			today = dd+'-'+mm+'-'+yyyy;
			document.getElementById("selectedDate").value=today;
		}
			 //2)Distance Analytics Report API
		else{
			$scope.analysis.devlist=$scope.deviceList;
			$scope.selectSpeed=true;
			$scope.selectDistance=false;
			if($scope.durationChoiceRadio==1){
				$scope.weeklyChoice=false;
				$scope.monthlyChoice=true;
			}
			else if($scope.durationChoiceRadio==2){
				$scope.weeklyChoice=true;
				$scope.monthlyChoice=false;
			}
		}
	};	
	//after selection of date analysis json is added with selected date's start and end TIMESTAMP
	$scope.addTS=function(count){
		//console.log(count);
		//speed analysis 
		if(count=="1"){
			var selDt=document.getElementById("selectedDate").value;
			var dtArray=selDt.split("-")
			selDt=dtArray[1]+"-"+dtArray[0]+"-"+dtArray[2];
			$scope.analysis.sts=getSTS(selDt);//start timestamp for selected date set with 12:00AM 
		
			$scope.analysis.ets=getETS(selDt);//end timestamp for selected date set with 12:59PM 
			$scope.analysis.gran=0;
			speedAnalysis();
		}
		//distance covered -- weekly gran	
		else if(count=="2"){
			var selMnth=document.getElementById("selectedMonth").value;
			var dtArray=selMnth.split("-")
			selMnth=dtArray[1]+"-"+dtArray[0];
			var date = new Date(selMnth);
	 		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	 		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			$scope.analysis.sts=getSTS(firstDay);//start timestamp for month set with 12:00AM 
		
			$scope.analysis.ets=getETS(lastDay);//end timestamp for month set with 12:59PM 

			$scope.analysis.gran=0;
			distanceAnalysis();
		}
		//distance covered -- monthly gran
		else if(count=="3"){
			var stMnth=document.getElementById("startMonth").value;
			var edMnth=document.getElementById("endMonth").value;
			console.log(stMnth+" "+edMnth);
			var stArray=stMnth.split("-")
			stMnth=stArray[1]+"-"+stArray[0];
			var edArray=edMnth.split("-")
			edMnth=edArray[1]+"-"+edArray[0];
			var date1 = new Date(stMnth);
			var date2 = new Date(edMnth);
	 		var firstDay = new Date(date1.getFullYear(), date1.getMonth(), 1);
	 		var lastDay = new Date(date2.getFullYear(), date2.getMonth() + 1, 0);
			$scope.analysis.sts=getSTS(firstDay);//start timestamp for month set with 12:00AM 
		
			$scope.analysis.ets=getETS(lastDay);//end timestamp for month set with 12:59PM 

			$scope.analysis.gran=1;
			distanceAnalysis();
		}
		
	};
	function getSTS(dt){
		var st=new Date(dt);
			st.setHours(0);
			st.setMinutes(0);
			st.setSeconds(0);
			return st.getTime();
	}
	function getETS(dt){
		var st=new Date(dt);
			st.setHours(23);
			st.setMinutes(59);
			st.setSeconds(59);
			return st.getTime();
	}
	/**---------------------------------------------------------------------------------------------------------------------------
															for km covered
	---------------------------------------------------------------------------------------------------------------------------*/
	$scope.durationChoice=function(duration){
		   //alert(duration);
	 		//weekly selection
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd
		} 

		if(mm<10) {
		    mm='0'+mm
		} 

		today = mm+'-'+yyyy;
		$scope.noanalyticsData=false;
		$scope.speedAnalytics=false;
		$scope.distanceanalytics=false;
	 		if(duration=="1"){
	 			$scope.weeklyChoice=false;//for show/hide of month calendar of weekly choice
				$scope.monthlyChoice=true;//for show/hide of from/to month calendar for monthly choice
	 			$scope.analysis.gran=0;
	 			
	 			document.getElementById("selectedMonth").value=today;
			}
	 		//current month
	 		else if(duration=="2"){
	 			$scope.weeklyChoice=true;//for show/hide of month calendar of weekly choice
				$scope.monthlyChoice=false;//for show/hide of from/to month calendar for monthly choice	
	 			$scope.analysis.gran=1;	
	 			document.getElementById("startMonth").value=today;
	 		 	document.getElementById("endMonth").value=today;
			}
	};

	 /*
	 	-----------------------------------------------speedAnalysisAPI-----------------------------------------------
	 		*/
	 function speedAnalysis(){
		 //var devid=["BATS-09"]
		 	//alert($scope.searchGroupModel);
		 		$scope.analysis.devlist = devicelist;
		 		$scope.analysis.gid=$scope.searchGroupModel;
		 		//console.log(JSON.stringify($scope.analysis));
		 		$scope.httpLoading=true;
	 			$http({
	 				method : 'POST',
	 				url : apiURL + 'app/speed_analytic_report',
	 				data : JSON.stringify($scope.analysis),
	 				headers : {
	 					'Content-Type' : 'application/json'
	 				}
	 			}).success(function(data) {
		 	//console.log(JSON.stringify(data));
		 	plotSpeedGraph(data);
		 	/*screen.lockOrientation('landscape');
			$scope.modal.show();*/
		 }).error(function(data, status, headers, config) {
		 	//alert("speed analysis>>>>>>>>"+data.err);
			 if (data.err == "Expired Session") {
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {
					invalidUser();
					$localStorage.$reset();
				}
		 	console.log(data);
		 	console.log(status);
		 	console.log(headers);
		 	console.log(config);
		 }).finally(function(){		
			 $scope.httpLoading=false;
		 });
	}
	 function plotSpeedGraph(dataVal){
			//console.log(JSON.stringify(dataVal));
			  $scope.highchartsNG = {
			          options: {
			            chart: {
			              type: 'spline',
			              zoomType: 'xy'
			            }, 
			            xAxis: {
			                  type: 'datetime',
			                  dateTimeLabelFormats: { // don't display the dummy year
			                    second: '%H:%M:%S',
			                    minute: '%H:%M',
			                    day: '%e of %b',
			                    month:'%b \'%y',
			                    year: '%y'
			                }
			              },
			            yAxis: {
			                  title: {
			                    text: 'Snow depth (m)'
			                  },
			                  min: 0
			                  ,
			                  plotLines: [{
			                      value: 70,
			                      color: 'green',
			                      dashStyle: 'shortdash',
			                      width: 2,
			                      label: {
			                          text: 'SPEED LIMIT FOR GROUP'
			                      }
			                  }]
			                },
			                title: {
			                  text: 'Date'
			                },
			                plotOptions: {
			                  spline: {
			                    marker: {
			                      enabled: true
			                    }
			                  }
			                }
			            },
			          title: {text: 'Hello'},
			          loading: false
			        };
				var series=[];
				var flag=false;
				var speed_limit;
			for(var inc=0;inc<dataVal.length;inc++){				
				var perDevice={};
				var data=[];					
					perDevice.id=dataVal[inc].vehicle_num;
					perDevice.name=dataVal[inc].vehicle_num;
					speed_limit=dataVal[inc].speed_limit;
					var values=dataVal[inc].values;
					for(var j=0;j<values.length;j++){
						var speedTSVal=[];
						speedTSVal.push(values[j].ts,values[j].Velocity);
						data.push(speedTSVal);
						flag=true;
					}					
				perDevice.data=data;
				series.push(perDevice);		
					
				}
				if(flag){
					$scope.noanalyticsData=false;
					$scope.speedAnalytics=true;
					$scope.distanceanalytics=false;
						
				}
				else{
					$scope.noanalyticsData=true;
					$scope.speedAnalytics=false;
					$scope.distanceanalytics=false;
					}
				
				//console.log(flag);
				$scope.highchartsNG.title.text="SPEED Analysis"
				$scope.highchartsNG.options.yAxis.title.text="Velocity in KMpH";
				$scope.highchartsNG.options.yAxis.plotLines[0].value=speed_limit;
				$scope.highchartsNG.series=series;
				console.log(JSON.stringify($scope.highchartsNG));
		}
	 		/*
	 		-----------------------------------------------distanceAnalysisAPI-----------------------------------------------
	 		*/
	 function distanceAnalysis()
	 {			$scope.httpLoading=true;
		 		$scope.analysis.devlist = devicelist;
		 		//console.log(JSON.stringify($scope.analysis.devlist));
	 			console.log(JSON.stringify($scope.analysis));
	 			$http({
	 				method : 'POST',
	 				url : apiURL + 'app/km_covered_analytic_report',
	 				data : JSON.stringify($scope.analysis),
	 				headers : {
	 					'Content-Type' : 'application/json'
	 				}
	 			}).success(function(data) {
	 				console.log(JSON.stringify(data));
	 				plotDistanceGraph(data);
	 				/*screen.lockOrientation('landscape');
					$scope.modal.show();*/
	 			}).error(function(data, status, headers, config) {
	 				//alert("distance analysis>>>>>>>>>>>>>"+data.err);
	 				  if (data.err == "Expired Session") {
							expiredSession();
							$localStorage.$reset();
						} else if (data.err == "Invalid User") {
							invalidUser();
							$localStorage.$reset();
						}
	 				console.log(data);
	 				console.log(status);
	 				console.log(headers);
	 				console.log(config);
	 			}).finally(function(){		
	 				$scope.httpLoading=false;
	 			});
	 }
	 
	 function plotDistanceGraph(dataVal){		 
		 $scope.highchartsDG = {
		          options: {
		            chart: {
		              type: 'column'
		            }, 
		            xAxis: {
		              categories: [
		              'W1[1/7 to 7/7]',
		              'W1[1/7 to 7/7]',
		              'W1[1/7 to 7/7]',
		              'W1[1/7 to 7/7]'
		              ],
		              crosshair: true
		            },
		            yAxis: {
		              min: 0,
		              title: {
		                text: 'Rainfall (mm)'
		              }
		            },
		            title: {
		               text: 'Monthly Average Rainfall'
		            },
		            plotOptions: {
		              column: {
		            	minPointLength: 3,
		                pointPadding: 0.2,
		                borderWidth: 0
		            }
		            },
		        tooltip: {
		            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
		            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
		                '<td style="padding:0"><b>{point.y:.1f} km</b></td></tr>',
		            footerFormat: '</table>',
		            shared: true,
		            useHTML: true
		        }
		          },
		          series: [
		          {
		            name: 'Tokyo',
		            data: [49.9, 71.5, 106.4, 129.2]

		        }, {
		            name: 'New York',
		            data: [83.6, 78.8, 98.5, 93.4]

		        }, {
		            name: 'London',
		            data: [48.9, 38.8, 39.3, 41.4]

		        }, {
		            name: 'Berlin',
		            data: [42.4, 33.2, 34.5, 39.7]

		        }
		          ],
		          title: {text: 'Hello'},
		          loading: false}
			//console.log(JSON.stringify(dataVal));
			if(dataVal.length>0){
				$scope.noanalyticsData=false;
				$scope.speedAnalytics=false;
				$scope.distanceanalytics=true;
				var categories=[];
				var series=[];
				var perDevice={};
				for(var inc=0;inc<dataVal.length;inc++){
					if($scope.analysis.gran==0){
						if(getStDate(dataVal[inc].sts)===getEdDate(dataVal[inc].ets)){
							//console.log("Week "+Number(inc+1)+" "+getStDate(dataVal[inc].sts));
							categories.push("Week "+Number(inc+1)+"<br> Date:"+getStDate(dataVal[inc].sts));
						}
						else{
							//console.log("Week "+Number(inc+1)+" "+getStDate(dataVal[inc].sts)+"-"+getEdDate(dataVal[inc].ets));
							categories.push("Week "+Number(inc+1)+"<br>[Date:"+getStDate(dataVal[inc].sts)+"-"+getEdDate(dataVal[inc].ets)+"]");
						}
					}
					else{
						if(getStDate(dataVal[inc].sts)===getEdDate(dataVal[inc].ets)){
							//console.log("Week "+Number(inc+1)+" "+getStDate(dataVal[inc].sts));
							categories.push(getMonth(dataVal[inc].sts)+"<br> Date:"+getStDate(dataVal[inc].sts));
						}
						else{
							//console.log("Week "+Number(inc+1)+" "+getStDate(dataVal[inc].sts)+"-"+getEdDate(dataVal[inc].ets));
							categories.push(getMonth(dataVal[inc].sts)+"<br>[Date:"+getStDate(dataVal[inc].sts)+"-"+getEdDate(dataVal[inc].ets)+"]");
						}	
					}
					
					if(series.length){
				        for(var n =0; n < dataVal[inc].values.length; n++){
				          for(var k = 0; k < series.length; k++){
				            if(series[k].name == dataVal[inc].values[n].vehicle_num){
				              series[k].data.push( Number(dataVal[inc].values[n].distance));
				            }

				          }
				        }     

				      } else {
				        for(var j = 0 ; j < dataVal[inc].values.length; j++){
				          var obj = {"name": dataVal[inc].values[j].vehicle_num, "data":[Number(dataVal[inc].values[j].distance)]};
				          series.push(obj);
				        //console.log(JSON.stringify(series));
				      }
				    }
				}
				$scope.highchartsDG.options.yAxis.title.text="Distance in KM";
				$scope.highchartsDG.options.title="Distance Coverered"
				$scope.highchartsDG.title.text="DISTANCE Analysis";
				$scope.highchartsDG.options.xAxis.categories=categories;
			    $scope.highchartsDG.series=series;
				//console.log(JSON.stringify(categories));
				//console.log(JSON.stringify(series));
				//console.log(JSON.stringify($scope.highchartsDG));
			}
			else{
				$scope.noanalyticsData=true;
				$scope.speedAnalytics=false;
				$scope.distanceanalytics=false;
			}
			
		}
	 	function getMonth(ts){
	 		var month = new Array();
	 		month[0] = "Jan";
	 		month[1] = "Feb";
	 		month[2] = "Mar";
	 		month[3] = "Apr";
	 		month[4] = "May";
	 		month[5] = "Jun";
	 		month[6] = "Jul";
	 		month[7] = "Aug";
	 		month[8] = "Sep";
	 		month[9] = "Oct";
	 		month[10] = "Nov";
	 		month[11] = "Dec";
	 		var dt=new Date(ts);
	 		var monthName = month[dt.getMonth()];
			return monthName;
	 	}
		function getStDate(sts){
			var dt=new Date(sts);
			var dateVal=dt.getDate();
			return dateVal;
		}
		function getEdDate(ets){
			var dt=new Date(ets);
			var dateVal=dt.getDate();
			return dateVal;
		}
		// Load the fonts
		Highcharts.createElement('link', {
		   href: '//fonts.googleapis.com/css?family=Signika:400,700',
		   rel: 'stylesheet',
		   type: 'text/css'
		}, null, document.getElementsByTagName('head')[0]);

		// Add the background image to the container
		/*Highcharts.wrap(Highcharts.Chart.prototype, 'getContainer', function (proceed) {
		   proceed.call(this);
		   this.container.style.background = 'url(http://www.highcharts.com/samples/graphics/sand.png)';
		});*/

		Highcharts.theme = {
		   /*colors: ["#f45b5b", "#8085e9", "#8d4654", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee",
		      "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],*/
		   chart: {
		      backgroundColor: "rgba(255,255,255,0.8)",
		      style: {
		         fontFamily: "Signika, serif"
		      }
		   },
		   title: {
		      style: {
		         color: '#03A9F4',
		         fontSize: '16px',
		         fontWeight: 'bold'
		      }
		   },
		   subtitle: {
		      style: {
		         color: 'black'
		      }
		   },
		   tooltip: {
		      borderWidth: 0
		   },
		   legend: {
		      itemStyle: {
		         fontWeight: 'bold',
		         fontSize: '13px'
		      }
		   },
		   xAxis: {
			  lineColor: '#000000',
		      labels: {
		         style: {
		            color: '#000000'
		         }
		      }
		   },
		   yAxis: {
			  gridLineWidth: 1,
			  gridLineColor: '#000000',
			  title: {
	                style: {
	                    color: '#03A9F4'
	                }
	            },
		      labels: {
		         style: {
		            color: '#000000'
		         }
		      }
		   },
		   plotOptions: {
		      series: {
		         shadow: true
		      },
		      candlestick: {
		         lineColor: '#404048'
		      },
		      map: {
		         shadow: false
		      }
		   },

		   // Highstock specific
		   navigator: {
		      xAxis: {
		         gridLineColor: '#D0D0D8'
		      }
		   },
		   rangeSelector: {
		      buttonTheme: {
		         fill: 'white',
		         stroke: '#C0C0C8',
		         'stroke-width': 1,
		         states: {
		            select: {
		               fill: '#D0D0D8'
		            }
		         }
		      }
		   },
		   scrollbar: {
		      trackBorderColor: '#C0C0C8'
		   },

		   // General
		   background2: '#E0E0E8'

		};

		// Apply the theme
		Highcharts.setOptions(Highcharts.theme);


/**
 * Clear DatePicker textbox value
*/
$scope.clearDate = function(){
	$scope.selDate = {"value":""};
	$scope.selMonth = {"value":""};
	$scope.stMonth = {"value":""};
	$scope.edMonth = {"value":""};
}
/**
 * Select Group/Device dropdown based on jquery 
* */	
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
			$('#clearTextDevice span.select2-chosen').text("- - Select Device - -");
		});// script
	});


});


