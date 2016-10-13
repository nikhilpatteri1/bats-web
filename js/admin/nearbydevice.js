batsAdminHome.controller('batsNearbyDevices',function($scope,$http,NgMap,
		$localStorage){
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
	NgMap.getMap({
		id : 'nearbyId'
	}).then(function(map) {
		$scope.map = map
		console.log($scope.map);
	});
	var infowindows = [];
	$scope.hist = {
		"searchGroupModel" : ""
	};
	$scope.hist.searchDeviceModel = "";
	//$scope.token = token;
	$scope.noData = true;
	$scope.yoData = false;
	$scope.noNearbyDevice = true;
	var directionsDisplay = new google.maps.DirectionsRenderer();
	var directionsService = new google.maps.DirectionsService();
	var centerVal = 21.0000 + "," + 78.0000;
	$scope.nearByMap = {
		center : centerVal,
		zoom : 4
	};
	$scope.customer = {};
	$scope.customer.token = $scope.token;
	$http({
		method : 'POST',
		url : apiURL + 'group/list',
		data : JSON.stringify($scope.customer),
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function(data) {
		listGroup(data);
	}).error(function(data, status, headers, config) {
		if (data.err == "Expired Session") {
			$('#updateDeviceModal').modal('hide');
			expiredSession();
			$localStorage.$reset();
		} else if (data.err == "Invalid User") {
			$('#updateDeviceModal').modal('hide');
			invalidUser();
			$localStorage.$reset();
		}
		// alert(data.err);
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
		// console.log($scope.groupList);
	}
	/**
	 * fetch device list based on group id
	 */
	$scope.fetchDevicelist = function(groupID) {
		$scope.httpLoading=true;
		// console.log(groupID);
		$('#clearTextDevice span.select2-chosen').empty();  
		$('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -"); 
		$scope.hist.searchDeviceModel = "";
		$scope.yoData = false;
		$scope.noNearbyDevice = true;
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
			$scope.groupDevice = data.devlist;
			// console.log(JSON.stringify(data));
			listDevice(data);
		}).error(function(data, status, headers, config) {
			if (data.err == "Expired Session") {
				$('#updateDeviceModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				$('#updateDeviceModal').modal('hide');
				invalidUser();
				$localStorage.$reset();
			}
			// alert(data.err);
			swal({title:data.data});
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		}).finally(function(){		
			$scope.httpLoading=false;
		});
	};
	/**
	 * ------------------dev list ends----------------------------*
	 */
	function listDevice(deviceData) {
		var dev_len = deviceData.devlist.length;
		$scope.deviceList = [];
		for ( var inc = 0; inc < dev_len; inc++) {
			$scope.deviceList.push(deviceData.devlist[inc].devid);
		}
	}
	$scope.deviceSelected = function(deviceId) {
		$scope.httpLoading=true;
		//console.log(deviceId);
		closeInfoWindows();
		directionsDisplay.setDirections({
			routes : []
		});
		$scope.nearbyJSON = {};
		$scope.nearbyJSON.token = $scope.token;
		$scope.nearbyJSON.devid = deviceId;
		// console.log(JSON.stringify($scope.nearbyJSON));
		$http({
			method : 'POST',
			url : apiURL + 'app/get_nearby_devices',
			data : JSON.stringify($scope.nearbyJSON),
			header : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			 console.log(JSON.stringify(data));
			var length_nearby = data.res_data.length;
			$scope.nearbyData = data;
			if (length_nearby == 0) {
				$scope.yoData = false;
				$scope.noNearbyDevice = false;
			} else {
				$scope.noNearbyDevice = true;
				displayNearbyDevices();
			}
		}).error(function(data, status, headers, config) {
			if (data.err == "Expired Session") {
				$('#updateDeviceModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				$('#updateDeviceModal').modal('hide');
				invalidUser();
				$localStorage.$reset();
			}
			swal({title:data.data});
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		}).finally(function(){		
			$scope.httpLoading=false;
		});
		/**
		 * function to display nearby devices
		 */
		function displayNearbyDevices() {
			$scope.yoData = true;
			var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
			var nearData = $scope.nearbyData.res_data;
			var reqData = $scope.nearbyData.req_data;
			var nearObj = [];
			var devVal = {};
			$scope.startlt = $scope.nearbyData.req_data.lat;
			$scope.startlg = $scope.nearbyData.req_data.long;
			devVal.lat = Number($scope.nearbyData.req_data.lat);
			devVal.lg = Number($scope.nearbyData.req_data.long);
			devVal.devid = $scope.nearbyData.req_data.devid;
			devVal.icon = "start";
			devVal.dist = "Your Device";
			nearObj.push(devVal);
			for ( var inc = 0; inc < nearData.length; inc++) {
				var arr = {};
				arr.lat = Number(nearData[inc].lat);
				arr.lg = Number(nearData[inc].long);
				arr.devid = nearData[inc].devid;
				arr.vehicle_num=nearData[inc].vehicle_num;
				arr.veh_model=nearData[inc].vehicle_model;
				arr.icon = "near";
				arr.dist = nearData[inc].km;
				nearObj.push(arr);
				lat_tot += Number(nearData[inc].lat);
				lg_tot += Number(nearData[inc].long);
			}
			lt_avg = lat_tot / nearData.length;
			lg_avg = lg_tot / nearData.length;
			var centerVal = lt_avg + "," + lg_avg;
			/*$scope.nearByMap = {
				center : centerVal,
				zoom : 12
			};*/
			$scope.nearByMap.devices = nearObj;
			//console.log(JSON.stringify($scope.nearByMap.devices.length));
			var bounds = new google.maps.LatLngBounds();
			var dev_count=$scope.nearByMap.devices.length;
			for(var j=0;j<dev_count;j++){
				//console.log($scope.nearByMap.devices[j].lat);
				 var latlng = new google.maps.LatLng($scope.nearByMap.devices[j].lat,$scope.nearByMap.devices[j].lg);
				 bounds.extend(latlng);
			}
	    		    			    		          
			 NgMap.getMap({id : 'nearbyId'}).then(function(map) {
				 //console.log(bounds.getCenter());
			      map.setCenter(bounds.getCenter());
			      map.fitBounds(bounds);
			    });
		}
	};
	$scope.showInfo = function(event, dev) {
		var center = new google.maps.LatLng(dev.lat, dev.lg);
		closeInfoWindows();
		// console.log(JSON.stringify(dev));
		infowindow = new google.maps.InfoWindow();
		//console.log(dev.dist);
			$scope.destlt = dev.lat;
			$scope.destlg = dev.lg;
			var source=$scope.startlt+","+$scope.startlg;
			var destination=$scope.destlt+","+$scope.destlg;			
			calcDistance(source,destination,function(){
				//console.log($scope.distance);
				if(dev.dist == "Your Device"){setInfoWindow(dev,0);}
				else{setInfoWindow(dev,1);}
				var vehicleDistance=$scope.distance;
				if(vehicleDistance>2){
					/*----------
					 * 		showing the distance with driving mode if more than 2 KM distance
					 * 		between two devices/vehicles	
					 * -------------*/
					calcRoute("DRIVING");
				}
				else{
					/*----------
					 * 		showing the distance with walking mode if less than 2 KM distance
					 * 		between two devices/vehicles	
					 * -------------*/
					calcRoute("WALKING");
				}
			});			
	};
	function setInfoWindow(dev,count){
		var geocoder = new google.maps.Geocoder();
		var center = new google.maps.LatLng(dev.lat, dev.lg);
		var latlng = new google.maps.LatLng(dev.lat, dev.lg);
		var formatted_address = '';
		var flag = 0;
		var request = {
			latLng : latlng
		};
		geocoder.geocode(request, function(data, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if(count>0){
					if (data[0] != null) {
						// alert("address is: " + data[0].formatted_address);
						//console.log(data[0].formatted_address);
						infowindow.setContent('<label>Device ID:' + dev.devid
								+ '</label><br/><label>Vehicle No:' + dev.vehicle_num
								+ '</label><br/><label>Vehicle Model:' + dev.veh_model
								+ '</label><br/><p>Distance :'
								+ $scope.distance
								+ '</p><br/><label>Address</label><p>'
								+ data[0].formatted_address + '</p>');
					} else {
						// alert("No address available");
						cb(formatted_address = "No address available");
					}
				}
				else{
					infowindow.setContent('<label>Its Your Vehicle</label>');
				}
				
				NgMap.getMap({
					id : 'nearbyId'
				}).then(function(map) {
					infowindow.setPosition(center);
					infowindow.open($scope.map);
					infowindows.push(infowindow);
				});
			}
		});
	}
	function calcRoute(travel_mode) {
		NgMap.getMap({
			id : 'nearbyId'
		}).then(function(map) {
			$scope.map = map
			// console.log($scope.map);

			directionsDisplay.setDirections({
				routes : []
			});
			directionsDisplay.setMap($scope.map);
			displayDirection(directionsService, directionsDisplay,travel_mode);
		});
	}
	 function calcDistance(source,destination,callback){
 		 //*********DISTANCE AND DURATION**********************//
 		console.log(source,destination);
 		var distance;
 	    var service = new google.maps.DistanceMatrixService();
 	    service.getDistanceMatrix({
 	        origins: [source],
 	        destinations: [destination],
 	        travelMode: google.maps.TravelMode.DRIVING,
 	        unitSystem: google.maps.UnitSystem.METRIC,
 	        avoidHighways: false,
 	        avoidTolls: false
 	    }, function (response, status) {
 	        if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
 	            distance = response.rows[0].elements[0].distance.text;       
 	           //alert( distance);
 	           $scope.distance=distance;
 	          console.log($scope.distance);
 	         callback();
 	        } else {
 	            //alert("Unable to find the distance via road.");
 	           $scope.distance="Unable to find the distance via road.";
 	          callback();
 	        }
 	    });
 	    
 	}
	function displayDirection(directionsService, directionsDisplay,travel_mode) {
		var start = $scope.startlt + "," + $scope.startlg;
		var end = $scope.destlt + "," + $scope.destlg;
		directionsService.route({
			origin : start,
			destination : end,
			travelMode : google.maps.TravelMode[travel_mode]
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setOptions({
					suppressMarkers : true
				});
				directionsDisplay.setDirections(response);
			} else {
				alert('Directions request failed due to ' + status);
			}
		});
	}

	/**
	 * function to close infowindow
	 */
	function closeInfoWindows() {
		for ( var i = 0; i < infowindows.length; i++) {
			infowindows[i].close();
		}
	}
	/**
	 * On URL change clear map infowindow and path
	 */
	$scope.$on('$locationChangeStart', function() {
		// alert("test");
		directionsDisplay.setDirections({
			routes : []
		});
		closeInfoWindows();
	});
	/**
	 * Select Group/Device dropdown based on jquery 
	* */	
		$(document).ready(function() {
			$.getScript('../assets/select_filter/select2.min.js', function() {
				$("#selectGroup").select2({});
				$("#selectDevice").select2({});
				$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
				$('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
			});// script
		});

});