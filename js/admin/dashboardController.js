batsAdminHome.controller('dashboardController', function($scope, $http, $rootScope,$localStorage,commonAppService){	 
	$scope.token = $localStorage.data;
	$rootScope.menuPos=14;
	
	$scope.tab = 1;
	$scope.noUsers = false;
	$scope.setTab = function(newTab){
    	/*google.maps.event.trigger(map, 'resize');*///$scope.tripDetails="";
    	/*console.log("in setTab");*/
    	//clearField();
      $scope.tab = newTab;
    };
    
    $scope.isSet = function(tabNum){
    	//$scope.showTripDropDown=false;
    	//$scope.tripDetails="";
    	/*console.log("in isSetTab");*/
    	
      return $scope.tab === tabNum;
    };
	
	/*$scope.totalDevices=commonAppService.plotValues();*/
	$scope.TrackerCount;
	$scope.TrackerActList;
	
    commonAppService.tracker(function(result){
    	console.log(result);
    	$scope.TrackerCount = result;
    	console.log($scope.TrackerCount);
    	var data=[
  	            {name: "allocated",y: $scope.TrackerCount.allocated, color: '#008cdc'},
  	            {name: "unalloacted",y: $scope.TrackerCount.unallocated, color: '#b3b3b3'},
  	            {name: "Notworking",y: $scope.TrackerCount.nonworking, color: '#e54a4e' },          
  	           ];
    	commonAppService.donutChart('container',data);
    	
    	
    	
    	
    	
    	$scope.getPercentage = function (a,b) {
    	    return ((b * 100) / a).toFixed(2);
    	}
    	/*$scope.getTotal = function () {
    	    return $scope.allocatedTotal;
    	}*/
    	
    	
    });
    var status
    $scope.getList =function(state){
    	status = state;
    	
    	if(status == 0)
    	{
    		$scope.stateCheck="0";
    	}
    	else if(status == 1)
    	{
    		$scope.stateCheck="1";
    	}
    	else if(status == 2)
    	{
    		$scope.stateCheck="2";
    	}
    	else if(status == 3){
    		$scope.stateCheck="3";
    	}
    	else if(status == 4){
    		$scope.stateCheck="4";
    	}
    	else if(status == 5){
    		$scope.stateCheck="5";
    	}
    	commonAppService.trackerList(status,function(result){
    	console.log(result);
    	/*if(result.length == null){
    		alert("nolist");
    		$scope.noUsers = true;
    	}*/
    	$scope.TrackerActList = result;
    	console.log($scope.TrackerActList);
    	
    });
    }
    
    
    
});
/**
 * *
 * -------------------------------------------------------Dashboard TRIP controller--------------------------------------------------
 *  * 
 * */
batsAdminHome.controller('dashboardTripController', function($scope, $http, $rootScope,$localStorage,commonAppService,commonFactory){
	console.log("trip"); 
	$scope.hideTripTable=true;
	commonAppService.initMap();
	commonAppService.getTripData(function(result){
		console.log(JSON.stringify(result));
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
			//commonAppService.plotVehicleMarker(dummyData);
			commonAppService.plotVehicleMarker(result.trip_running);
		}
		else{
			$scope.scheduled=0;
			$scope.running=0;
			$scope.completed=0;
			$scope.cancelled=0;
			$scope.dropped=0;
			$scope.delay_count=0;		
		}		
	});
	$scope.getTripDataByStatus=function(status){
		if(status!='Ds'){
			commonAppService.getTripsByStatus(status,function(result){
				   console.log(result);
				   if(result.data!="trips not found"){
					   $scope.hideTripTable=false;
					   $scope.tripData=result;
				   }
				   else{
					   $scope.hideTripTable=true;
					   //alert(result.data);
				   }				   
			});
		}
		else{
			$scope.hideTripTable=true;
			alert("T B D");
		}
		
	};
	$scope.givelt=function(lt,lg){
		// alert("success");
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lt,lg);
		geocoder.geocode({       
		        latLng: latLng     
		        }, 
		        function(responses) 
		        {     
		           if (responses && responses.length > 0) 
		           {        
		               swal(responses[0].formatted_address);     
		           } 
		           else 
		           {       
		             swal('Not getting Any address for given latitude and longitude.');     
		           }   
		        }
		);
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
batsAdminHome.controller('dashboardDriverController', function($scope,$localStorage,commonAppService){
	commonAppService.getDriversData(function(result){
		$scope.totalDrivers=result.total_drivers;
		$scope.availableDrivers=result.idle_drivers;
		$scope.onTrip=result.drivers_on_trip;
		$scope.driverData=result.drv_details;
		var data=[
	              {name: "Available",y: result.idle_drivers, color: '#00af81' },
	              {name: "On Trip",y: result.drivers_on_trip, color: '#43aae5'},
	              ]
		commonAppService.donutChart('DriverContainer',data);
	});
	$scope.getPercentage=function(a,b){
		return commonAppService.getPercentage(a,b)
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
batsAdminHome.controller('dashboardVehicleController', function($scope,$localStorage,commonAppService){
	$scope.hideVehiclesTable=true;
	commonAppService.getVehicleData(function(result){
		console.log(result);
		$scope.totalPanic=result.panic;
		$scope.totaloverspeed=result.overspeed;
		$scope.totalgeofence=result.geofence;
		$scope.totalongoing_trip=result.ongoing_trip;
		$scope.totalmax_lmt_cross=result.max_lmt_cross;
	});
	$scope.getVehiclesDataByStatus=function(status){
		console.log(status);
			commonAppService.getVehiclesByStatus(status,function(result){
				
				   /*console.log(result);
				   $scope.vehiclesData=result;
				   console.log(JSON.stringify(result));
				   $scope.hideVehiclesTable=false;*/
				   if(result.data!="data not found"){
					   $scope.hideVehiclesTable=false;
					   $scope.vehiclesData=result;
				   }
				   else{
					   $scope.hideVehiclesTable=true;
					   /*alert(result.data);*/
				   }				   
			});		
	};
	$scope.givelt=function(lt,lg){
		// alert("success");
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lt,lg);
		geocoder.geocode({       
		        latLng: latLng     
		        }, 
		        function(responses) 
		        {     
		           if (responses && responses.length > 0) 
		           {        
		               swal(responses[0].formatted_address);     
		           } 
		           else 
		           {       
		             swal('Not getting Any address for given latitude and longitude.');     
		           }   
		        }
		);
	};
});
/**
 * *
 * -------------------------------------------------------End of Dashboard Vehicle controller--------------------------------------------------
 *  * 
 * */