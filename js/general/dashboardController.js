batsGeneralHome.controller('dashboardController', function($scope, $http, $rootScope,$localStorage,$interval,commonAppService){
	$interval.cancel($rootScope.callAlarmApi);
	$scope.token = $localStorage.data;
	$rootScope.menuPos=9;
	$scope.hideTripTable=true;
	$scope.tab = 1;
	var requestTime = 12;

	$scope.setTab = function(newTab) {
		if(newTab==1){
			$interval.cancel($rootScope.callAlarmApi);
			$scope.getTripData();
			$rootScope.callAlarmApi = $interval($scope.getTripData ,requestTime * 1000);
		}
		$scope.tab = newTab;
	};

	$scope.isSet = function(tabNum) {
	   return $scope.tab === tabNum;
	};

	/* $scope.totalDevices=commonAppService.plotValues(); */
	$scope.TrackerCount;
	$scope.TrackerActList;

	$scope.getTripData = function(){
		commonAppService.tracker(function(result) {
			$scope.TrackerCount = result;		
			$scope.getPercentage = function(a, b){
				return ((b * 100) / a).toFixed(2);
			}
		});
	};
	
	
	$scope.getTripData();
	$rootScope.callAlarmApi = $interval($scope.getTripData ,requestTime * 1000);
	
	var status;
	$scope.getList = function(state){
		status = state;
		commonAppService.trackerList(status,function(result){
	    	if(result.data!="Trackers data not available for this status "+status){
				$scope.hideTripTable=false;
				$scope.TrackerActList = result;
			}else{
				$scope.hideTripTable=true;
			}
	    });
	}

	$scope.gotoElement=function(eID){
    	commonAppService.scrollTo(eID);
    }
    
	$scope.getTimeFormat = function(ts){
		return commonAppService.showTime(ts); 
	}
	
});
/**
 * *
 * -------------------------------------------------------Dashboard TRIP controller--------------------------------------------------
 *  * 
 * */
batsGeneralHome.controller('dashboardTripController', function($scope, $http, $rootScope,$localStorage,$interval,commonAppService,commonFactory){
	$interval.cancel($rootScope.callAlarmApi);
	var requestTime = 12;
	$scope.hideTripTable=true;

	angular.element(document).ready(function () {
		map = new google.maps.Map(document.getElementById('TripMap'), {
			zoom : 14,
			center : {
				lat : 12.849857,
				lng : 77.658968
			}
		});
	});

	$scope.getTripDetailsData=function(){
		commonAppService.getTripData(function(result){
			if(result.data!="trips not found"){
				$scope.scheduled=result.res_data.scheduled;
				$scope.running=result.res_data.running;
				$scope.completed=result.res_data.completed;
				$scope.cancelled=result.res_data.cancelled;
				$scope.dropped=result.res_data.dropped;
				$scope.delay_count=result.res_data.delay_count;
				var data1={"trip_id": "tripid1","values" : {"ts" : "1488564205000", "long" : 77.660444, "lat" : 12.848834, "Velocity" :100, "Vol" : 10}};
				var data2={"trip_id": "tripid2","values" : {"ts" : "1488564205000", "long" : 74.784771, "lat" : 20.697141, "Velocity" :100, "Vol" : 10}}
				var dummyData=[];
				dummyData.push(data1);
				dummyData.push(data2);
				plotVehicleMarker(result.trip_running);

				function plotVehicleMarker(vehicleData){
					var carIcon ="M25.762,8.510 L20.921,2.204 C20.921,2.204 25.252,2.647 25.885,8.065 C26.517,13.483 25.762,8.510 25.762,8.510 ZM15.160,2.706 C12.355,2.772 10.092,2.853 10.085,2.450 C10.076,2.165 12.353,1.834 15.164,1.816 C17.968,1.902 20.240,2.220 20.248,2.466 C20.253,2.846 17.967,2.761 15.160,2.706 ZM4.815,8.074 C5.443,2.668 9.749,2.226 9.749,2.226 L4.937,8.518 C4.937,8.518 4.187,13.481 4.815,8.074 ZM5.000,47.349 L4.562,21.574 C4.562,21.574 9.613,34.691 5.000,47.349 ZM18.688,30.281 L11.875,30.281 L11.875,27.781 L18.688,27.781 L18.688,30.281 ZM7.721,44.433 C7.885,44.231 8.225,44.075 8.463,44.081 C12.577,44.174 17.922,44.176 21.827,44.145 C21.842,44.145 21.860,44.151 21.875,44.152 L22.632,26.355 C22.585,26.368 22.537,26.385 22.495,26.383 C18.058,26.218 12.293,26.214 8.082,26.268 C8.038,26.269 7.987,26.251 7.938,26.235 L8.688,44.076 L8.565,44.081 L7.813,26.219 L7.873,26.217 C7.663,26.123 7.433,25.909 7.299,25.650 C6.246,23.582 5.784,21.256 5.737,19.294 C5.700,18.027 6.392,17.124 7.323,16.364 C8.266,15.625 9.448,15.028 10.664,14.841 C13.663,14.447 16.725,14.440 19.798,14.794 C22.228,15.233 24.825,17.000 24.814,19.411 C24.761,21.376 24.325,23.625 23.296,25.754 C23.156,26.038 22.901,26.265 22.673,26.346 L22.757,26.350 L22.000,44.169 C22.199,44.218 22.424,44.341 22.553,44.491 C23.529,45.647 23.957,46.947 24.001,48.043 C24.035,48.752 23.394,49.256 22.531,49.681 C21.656,50.094 20.560,50.428 19.432,50.532 C16.652,50.752 13.813,50.756 10.964,50.558 C8.711,50.313 6.303,49.325 6.313,47.978 C6.362,46.880 6.766,45.623 7.721,44.433 ZM25.937,21.591 L25.500,47.392 C20.891,34.722 25.937,21.591 25.937,21.591 Z";
					var markers=[];
					var icon = {
						path: carIcon,
						scale: .7,
						strokeColor: 'white',
						strokeWeight: 0,
						fillOpacity: 1,
						fillColor: '#000000',
						offset: '5%',
						anchor: new google.maps.Point(10, 25) 
					};
					var infoWindow = new google.maps.InfoWindow(),marker;
					var bounds = new google.maps.LatLngBounds();
					function createMarker(tripID,lt,lg,vel,vol,ts){
						var contentString; 
						marker = new google.maps.Marker({
							position: new google.maps.LatLng(lt,lg),
							map: map,
							title: tripID, 
							icon:icon,       
							zIndex: Math.round(lt*-100000)<<5
						});
						marker.myname = tripID;
						markers.push(marker);
						contentString="'<b><label>Trip ID:</label> '"+tripID+"'</b><br><br><b><label>Speed:</label>'"+vel+"'KmpH</b>'";
						google.maps.event.addListener(marker,'click',( function(marker){
							return function(){
								infoWindow.setContent(contentString); 
								infoWindow.open(map,marker);
							}		    	   		       
						})(marker));	
					}
					
					var data_len=vehicleData.length;
					for(var i=0;i<data_len;i++){			
						createMarker(vehicleData[i].trip_id,vehicleData[i].values.lat,vehicleData[i].values.long,vehicleData[i].values.Velocity,vehicleData[i].values.Vol,vehicleData[i].values.ts);
						var myLatLng = new google.maps.LatLng(vehicleData[i].values.lat,vehicleData[i].values.long);
						bounds.extend(myLatLng);
					}
					//map.setCenter(bounds.getCenter());		
					map.fitBounds(bounds);
				}
			}else{
				$scope.scheduled=0;
				$scope.running=0;
				$scope.completed=0;
				$scope.cancelled=0;
				$scope.dropped=0;
				$scope.delay_count=0;
				commonAppService.initMap();
			}		
		});
	};
	
	$scope.getTripDetailsData();   
	$rootScope.callAlarmApi = $interval($scope.getTripDetailsData ,requestTime * 1000);
	
	$scope.getTripDataByStatus=function(status){
		commonAppService.getTripsByStatus(status,function(result){
			if(result.data!="trips not found"){
				$scope.hideTripTable=false;
				$scope.tripData=result;
			}else{
				$scope.hideTripTable=true;
			}				   
		});
	};
	
	$scope.givelt=function(lt,lg){
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lt,lg);
		geocoder.geocode({       
			latLng: latLng     
		},function(responses){     
			if (responses && responses.length > 0){        
				swal(responses[0].formatted_address);     
			}else{       
				swal('Not getting Any address for given latitude and longitude.');     
			}   
		});
	}

	$scope.gotoElement=function(eID){
    	commonAppService.scrollTo(eID);
	}

});
/**
 * *
 * -------------------------------------------------------End of Dashboard TRIP controller--------------------------------------------------
 *  * 
 * */

/**
 * *
 * -------------------------------------------------------Dashboard DRIVER controller--------------------------------------------------
 *  * 
 * */
batsGeneralHome.controller('dashboardDriverController', function($scope, $rootScope, $interval, $localStorage, commonAppService){
	$interval.cancel($rootScope.callAlarmApi);
	commonAppService.getDriversData(function(result){
		if(result.data == "drivers not found"){
			$scope.totalDrivers= 0;
			$scope.availableDrivers= 0;
			$scope.onTrip=0;
			$scope.driverData='' ;
			$scope.nodriver = 100 ;	
			var data=[{name: "Available", y: 0, color: '#00af81' },
		              {name: "On Trip", y: 0, color: '#43aae5'}]
			commonAppService.donutChart('DriverContainer',data); 
		}else{
			$scope.totalDrivers=result.total_drivers;
			$scope.availableDrivers=result.idle_drivers;
			$scope.onTrip=result.drivers_on_trip;
			$scope.driverData=result.drv_details;
			var data=[{name: "Available",y: result.idle_drivers, color: '#00af81' },
					{name: "On Trip",y: result.drivers_on_trip, color: '#43aae5'}]
			commonAppService.donutChart('DriverContainer',data);
		}
	});

	$scope.getPercentage=function(a,b){
		return commonAppService.getPercentage(a,b)
	}

	$scope.gotoElement=function(eID){
    	commonAppService.scrollTo(eID);
    }
	
});
/**
 * *
 * -------------------------------------------------------End of Dashboard DRIVER controller--------------------------------------------------
 *  * 
 * */
/**
 * *
 * -------------------------------------------------------Dashboard Vehicle controller--------------------------------------------------
 *  * 
 * */
batsGeneralHome.controller('dashboardVehicleController', function($scope,$localStorage,$rootScope,$interval,commonAppService){
	$interval.cancel($rootScope.callAlarmApi);
	$scope.hideVehiclesTable=true;
	var requestTime = 12;

	$scope.getVehicleData=function(){
		commonAppService.getVehicleData(function(result){
			$scope.totalPanic=result.panic;
			$scope.totaloverspeed=result.overspeed;
			$scope.totalgeofence=result.geofence;
			$scope.totalongoing_trip=result.ongoing_trip;
			$scope.totalmax_lmt_cross=result.max_lmt_cross;
		});
	};
	
	$scope.getVehicleData();
	$rootScope.callAlarmApi = $interval($scope.getVehicleData ,requestTime * 1000);
	
	$scope.getVehiclesDataByStatus=function(status){
		commonAppService.getVehiclesByStatus(status,function(result){
			if(result.data!="data not found"){
				$scope.hideVehiclesTable=false;
				$scope.vehiclesData=result;
			}else{
				$scope.hideVehiclesTable=true;
			}		   
		});
	};
	
	$scope.givelt=function(lt,lg){
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lt,lg);
		geocoder.geocode({       
		    latLng: latLng     
		},function(responses){     
			if (responses && responses.length > 0){        
				swal(responses[0].formatted_address);     
			}else{       
				swal('Not getting Any address for given latitude and longitude.');     
			}   
		});
	};
	
	$(function() {
		$('.dashbHover,#ActiveThird-ring1,#NotActiveThird-ring1,#BatteryThird-ring1,#TamperedThird-ring1,.TripOuterCircle').hover(function() {
			$(this).append('<p id="passopt">Click Me!</p>');
			$(this).css("text-decoration","none");
			$(this).css("font-size","12px");
		},function(){
			$(this).children('#passopt').remove();
		});
	});
	
	$(function() {
		$('.vehicleHoverClass').hover(function() {
			$(this).append('<p id="vehicleHover">Click Me!</p>');
			$(this).css("text-decoration","none");
			$(this).css("font-size","12px");
		},function(){
			$(this).children('#vehicleHover').remove();
		});
	});

	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var output = d.getFullYear() + '/' +
	    (month<10 ? '0' : '') + month + '/' +
	    (day<10 ? '0' : '') + day;
	$scope.currdate = output; 

	$scope.gotoElement=function(eID){
    	commonAppService.scrollTo(eID);
    }
	
});
/**
 * *
 * -------------------------------------------------------End of Dashboard Vehicle controller--------------------------------------------------
 *  * 
 * */