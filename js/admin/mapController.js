/*================== Map Script ===================*/
batsAdminHome.controller('smartcontroller', function($scope, $interval, $http, $uibModal,$rootScope,
	$localStorage,$window) {
	var reqTime=0;
	$scope.token = $localStorage.data;
	if (typeof $scope.token === "undefined") {
		swal({
			title : "Un Authorized Acces",
			text : "Kindly Login!",
			type : "warning",
			confirmButtonColor : "#ff0000",
			closeOnConfirm : false
		}, function() {
			$localStorage.$reset();
			window.location = apiURL;
		});

	}
	var map;
    var directionDisplay;
    var directionsService;
    var stepDisplay;
    var markerArray = [];
    var position;
    var marker = null;
    var polyline = null;
    var poly2 = null;
    var speed = 0.000005,
    wait = 1;
    var infowindow = null;
    var timerHandle = null;
	  var Colors = ["#FF0000", "#00FF00", "#0000FF"];
	  //function initialize(){
	  $scope.initialize=function () {    
		  infowindow = new google.maps.InfoWindow(
		    { 
		      size: new google.maps.Size(150,50)
		    });

		    var myOptions = {
		      zoom: 16,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };
		    //console.log(document.getElementById("map_canvas"));
		    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		    address = 'India';
		    //address = 'Trinidad and Tobago'
		    geocoder = new google.maps.Geocoder();
		    geocoder.geocode( { 'address': address}, function(results, status) {
		     map.fitBounds(results[0].geometry.viewport);

		    });	
		 // Instantiate a directions service.
		    directionsService = new google.maps.DirectionsService();
		 // Create a renderer for directions and bind it to the map.
	        var rendererOptions = {
	            map: map
	        };
	        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		    polyline = new google.maps.Polyline({
		        path: [],
		        strokeColor: '#FF0000',
		        strokeWeight: 0
		    });
		    poly2 = new google.maps.Polyline({
		        path: [],
		        strokeColor: '#FF0000',
		        strokeWeight: 0
		    });
		  }; 
	function createMarker(latlng, deviceID, html,type) {
		//console.log(deviceID+"=="+type);
		var contentString; 
		if(type==0){icon.fillColor='#f44336';}
		else if(type==1){icon.fillColor='#ffde01';}
		else if(type==2){icon.fillColor='#e59305';}
		else if(type==3){icon.fillColor='#000000';}
		else if(type==4){icon.fillColor='#0540E5';}
		var geocoder = new google.maps.Geocoder();		
		geocoder.geocode({       
		        latLng: latlng     
		        }, 
		        function(responses) 
		        {     
		           if (responses && responses.length > 0) 
		           {     	   
		        	   if(html.length==0){
		        		   //console.log(html.length);
		        		   html=responses[0].formatted_address;
		        		   contentString  = '<b>'+deviceID+'</b><br>'+html;//+'<br><button  onclick="showModal('+deviceID+')">show detail</button>';	
		        	   }		        	   		                    
		           } 
		           else 
		           {       
		             //swal('Not getting Any address for given latitude and longitude.');     
		           }   
		        }
		);
		if(html.length!=0){
			contentString  = '<b>'+deviceID+'</b><br>'+html;
		}
		
		    
		    var marker = new google.maps.Marker({
		        position: latlng,
		        map: map,
		        title: deviceID, 
		        icon:icon,       
		        zIndex: Math.round(latlng.lat()*-100000)<<5
		        });
		        marker.myname = deviceID;


		    google.maps.event.addListener(marker, 'click', function() {
		    	 /* calling map modal controller function from here using $emit
	        	  * ref links
	        	  * http://stackoverflow.com/questions/29467339/how-to-call-function-in-another-controller-in-angularjs
	        	  * http://stackoverflow.com/questions/21346565/how-to-pass-an-object-using-rootscope
	        	  */	        	
		        infowindow.setContent(contentString); 
		        infowindow.open(map,marker);
		       // $rootScope.$emit("deviceDetailModal",lg,deviceID);
		        $scope.open("lg",deviceID);
		        });
		    return marker;
		}
	
	/*
	 * -----------------------------------------code for vehicle icon movement---------------------------------------------------------------
	 * 
	 * */
	var latValue=0;
	$scope.calcRoute = function(dataVal) {    
	    if(latValue!=dataVal[0].values[0].lat){
	        console.log(">>>>>>>>>>>>>>>new value updated >>>>>>>>>>>>>>>>>"+latValue+"!="+dataVal[0].values[0].lat);
	        latValue=dataVal[0].values[0].lat;
	    /*}
	    if(latValue!=dataVal[0].values[0].lat){  */      
	        //console.log(dataVal);
	        //console.log(latValue+"!="+dataVal[0].values[0].lat);       
	        if (timerHandle) {
	            clearTimeout(timerHandle);
	        }
	        if (marker) {
	            marker.setMap(null);
	        }
	        polyline.setMap(null);
	        poly2.setMap(null);
	        directionsDisplay.setMap(null);
	        polyline = new google.maps.Polyline({
	            path: [],
	            strokeColor: '#FFFFFF',
	            strokeWeight: 0
	        });
	        poly2 = new google.maps.Polyline({
	            path: [],
	            strokeColor: '#FFFFFF',
	            strokeWeight: 0
	        });
	        // Create a renderer for directions and bind it to the map.
	        var rendererOptions = {
	            map: map
	        };
	        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

	        var start = new google.maps.LatLng({lat: Number(dataVal[0].values[1].lat), lng: Number(dataVal[0].values[1].long)}); //document.getElementById("start").value;
	        var end = new google.maps.LatLng({lat: Number(dataVal[0].values[0].lat), lng: Number(dataVal[0].values[0].long)}); //document.getElementById("end").value;
	        var travelMode = google.maps.DirectionsTravelMode.DRIVING;

	        var request = {
	            origin: start,
	            destination: end,
	            travelMode: travelMode
	        };

	        // Route the directions and pass the response to a
	        // function to create markers for each step.
	        directionsService.route(request, function (response, status) {
	            //console.log(response.routes[0]);
	            if (status == google.maps.DirectionsStatus.OK) {
	                //directionsDisplay.setDirections(response);

	                var bounds = new google.maps.LatLngBounds();
	                var route = response.routes[0];
	                startLocation = new Object();
	                endLocation = new Object();

	                // For each route, display summary information.
	                var path = response.routes[0].overview_path;
	                var legs = response.routes[0].legs;
	                for (i = 0; i < legs.length; i++) {
	                    if (i === 0) {
	                        //console.log(JSON.stringify(legs[i].start_location));
	                        startLocation.latlng = legs[i].start_location;
	                        startLocation.address = legs[i].start_address;
	                          marker = createMarker(legs[i].start_location, dataVal[i].devid, legs[i].start_address,dataVal[i].values[0].type);
	                      }
	                      endLocation.latlng = legs[i].end_location;
	                      endLocation.address = legs[i].end_address;
	                      var steps = legs[i].steps;
	                    //console.log(JSON.stringify(steps));
	                    for (j = 0; j < steps.length; j++) {
	                        var nextSegment = steps[j].path;
	                        for (k = 0; k < nextSegment.length; k++) {
	                            polyline.getPath().push(nextSegment[k]);
	                            bounds.extend(nextSegment[k]);
	                        }
	                    }
	                }
	                polyline.setMap(map);
	                map.fitBounds(bounds);
	                map.setZoom(18);
	                startAnimation();
	            }
	        });
	}
	else{ 
	    console.log("Vehicle is Idle!..."+latValue+"=="+dataVal[0].values[0].lat);

	}   
	};



	var step = 50; // 5; // metres
	var tick = 1000; // milliseconds
	var eol;
	var k = 0;
	var stepnum = 0;
	var speed = "";
	var lastVertex = 1;

	//=============== animation functions ======================
	function updatePoly(d) {
	    // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
	    if (poly2.getPath().getLength() > 20) {
	        poly2 = new google.maps.Polyline([polyline.getPath().getAt(lastVertex - 1)]);
	        // map.addOverlay(poly2)
	    }

	    if (polyline.GetIndexAtDistance(d) < lastVertex + 2) {
	        if (poly2.getPath().getLength() > 1) {
	            poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
	        }
	        poly2.getPath().insertAt(poly2.getPath().getLength(), polyline.GetPointAtDistance(d));
	    } else {
	        poly2.getPath().insertAt(poly2.getPath().getLength(), endLocation.latlng);
	    }
	}

	$scope.animate = function(d) {
	  //  console.log(d);
	  if (d > eol) {        
	    map.panTo(endLocation.latlng);
	    marker.setPosition(endLocation.latlng);
	    return;
	}
	var p = polyline.GetPointAtDistance(d);
	map.panTo(p);
	var lastPosn = marker.getPosition();
	marker.setPosition(p);
	var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
	icon.rotation = heading;
	marker.setIcon(icon);
	updatePoly(d);
	    //timerHandle = setTimeout("animate(" + (d + step) + ")", tick);
	    
	    timerHandle = setTimeout(function() {
	        $scope.animate(d + step);
	    }, tick);
	}

	function startAnimation() {
	    eol = polyline.Distance();
	    map.setCenter(polyline.getPath().getAt(0));
	   /*marker = new google.maps.Marker({
	        position: polyline.getPath().getAt(0),
	        map: map,
	        icon: icon
	    });*/

	    poly2 = new google.maps.Polyline({
	        path: [polyline.getPath().getAt(0)],
	        strokeColor: "#0000FF",
	        strokeWeight: 0
	    });
	    // map.addOverlay(poly2);
	    //setTimeout("animate(50)", 2000); // Allow time for the initial map display
	    
	    setTimeout(function() {
	        $scope.animate(50);
	    }, 2000);
	    

	}
	//----------------------------------------------------------------------------    
	//=============== ~animation funcitons =====================

	var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
	var icon = {
	    path: car,
	    scale: .7,
	    strokeColor: 'white',
	    strokeWeight: 0,
	    fillOpacity: 1,
	    fillColor: '#f44336',
	    offset: '5%',
	    // rotation: parseInt(heading[i]),
	    anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
	};

	/*********************************************************************\
	*                                                                     *
	* epolys.js                                          by Mike Williams *
	* updated to API v3                                  by Larry Ross    *
	*                                                                     *
	* A Google Maps API Extension                                         *
	*                                                                     *
	* Adds various Methods to google.maps.Polygon and google.maps.Polyline *
	*                                                                     *
	* .Contains(latlng) returns true is the poly contains the specified   *
	*                   GLatLng                                           *
	*                                                                     *
	* .Area()           returns the approximate area of a poly that is    *
	*                   not self-intersecting                             *
	*                                                                     *
	* .Distance()       returns the length of the poly path               *
	*                                                                     *
	* .Bounds()         returns a GLatLngBounds that bounds the poly      *
	*                                                                     *
	* .GetPointAtDistance() returns a GLatLng at the specified distance   *
	*                   along the path.                                   *
	*                   The distance is specified in metres               *
	*                   Reurns null if the path is shorter than that      *
	*                                                                     *
	* .GetPointsAtDistance() returns an array of GLatLngs at the          *
	*                   specified interval along the path.                *
	*                   The distance is specified in metres               *
	*                                                                     *
	* .GetIndexAtDistance() returns the vertex number at the specified    *
	*                   distance along the path.                          *
	*                   The distance is specified in metres               *
	*                   Returns null if the path is shorter than that      *
	*                                                                     *
	* .Bearing(v1?,v2?) returns the bearing between two vertices          *
	*                   if v1 is null, returns bearing from first to last *
	*                   if v2 is null, returns bearing from v1 to next    *
	*                                                                     *
	*                                                                     *
	***********************************************************************
	*                                                                     *
	*   This Javascript is provided by Mike Williams                      *
	*   Blackpool Community Church Javascript Team                        *
	*   http://www.blackpoolchurch.org/                                   *
	*   http://econym.org.uk/gmap/                                        *
	*                                                                     *
	*   This work is licenced under a Creative Commons Licence            *
	*   http://creativecommons.org/licenses/by/2.0/uk/                    *
	*                                                                     *
	***********************************************************************
	*                                                                     *
	* Version 1.1       6-Jun-2007                                        *
	* Version 1.2       1-Jul-2007 - fix: Bounds was omitting vertex zero *
	*                                add: Bearing                         *
	* Version 1.3       28-Nov-2008  add: GetPointsAtDistance()           *
	* Version 1.4       12-Jan-2009  fix: GetPointsAtDistance()           *
	* Version 3.0       11-Aug-2010  update to v3                         *
	*                                                                     *
	\*********************************************************************/

	// === first support methods that don't (yet) exist in v3
	google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
	    var EarthRadiusMeters = 6378137.0; // meters
	    var lat1 = this.lat();
	    var lon1 = this.lng();
	    var lat2 = newLatLng.lat();
	    var lon2 = newLatLng.lng();
	    var dLat = (lat2 - lat1) * Math.PI / 180;
	    var dLon = (lon2 - lon1) * Math.PI / 180;
	    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    var d = EarthRadiusMeters * c;
	    return d;
	}

	google.maps.LatLng.prototype.latRadians = function () {
	    return this.lat() * Math.PI / 180;
	}

	google.maps.LatLng.prototype.lngRadians = function () {
	    return this.lng() * Math.PI / 180;
	}

	// === A method which returns the length of a path in metres ===
	google.maps.Polygon.prototype.Distance = function () {
	    var dist = 0;
	    for (var i = 1; i < this.getPath().getLength(); i++) {
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	    }
	    return dist;
	}

	// === A method which returns a GLatLng of a point a given distance along the path ===
	// === Returns null if the path is shorter than the specified distance ===
	google.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
	    // some awkward special cases
	    if (metres == 0) return this.getPath().getAt(0);
	    if (metres < 0) return null;
	    if (this.getPath().getLength() < 2) return null;
	    var dist = 0;
	    var olddist = 0;
	    for (var i = 1;
	    (i < this.getPath().getLength() && dist < metres); i++) {
	        olddist = dist;
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	    }
	    if (dist < metres) {
	        return null;
	    }
	    var p1 = this.getPath().getAt(i - 2);
	    var p2 = this.getPath().getAt(i - 1);
	    var m = (metres - olddist) / (dist - olddist);
	    return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
	}

	// === A method which returns an array of GLatLngs of points a given interval along the path ===
	google.maps.Polygon.prototype.GetPointsAtDistance = function (metres) {
	    var next = metres;
	    var points = [];
	    // some awkward special cases
	    if (metres <= 0) return points;
	    var dist = 0;
	    var olddist = 0;
	    for (var i = 1;
	    (i < this.getPath().getLength()); i++) {
	        olddist = dist;
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	        while (dist > next) {
	            var p1 = this.getPath().getAt(i - 1);
	            var p2 = this.getPath().getAt(i);
	            var m = (next - olddist) / (dist - olddist);
	            points.push(new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m));
	            next += metres;
	        }
	    }
	    return points;
	}

	// === A method which returns the Vertex number at a given distance along the path ===
	// === Returns null if the path is shorter than the specified distance ===
	google.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
	    // some awkward special cases
	    if (metres == 0) return this.getPath().getAt(0);
	    if (metres < 0) return null;
	    var dist = 0;
	    var olddist = 0;
	    for (var i = 1;
	    (i < this.getPath().getLength() && dist < metres); i++) {
	        olddist = dist;
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	    }
	    if (dist < metres) {
	        return null;
	    }
	    return i;
	}
	// === Copy all the above functions to GPolyline ===
	google.maps.Polyline.prototype.Distance = google.maps.Polygon.prototype.Distance;
	google.maps.Polyline.prototype.GetPointAtDistance = google.maps.Polygon.prototype.GetPointAtDistance;
	google.maps.Polyline.prototype.GetPointsAtDistance = google.maps.Polygon.prototype.GetPointsAtDistance;
	google.maps.Polyline.prototype.GetIndexAtDistance = google.maps.Polygon.prototype.GetIndexAtDistance;
	
	/*
	 * -----------------------------------------the end for vehicle icon movement---------------------------------------------------------------
	 * 
	 * */
		
	$scope.singleDeviceZoomLevel=18;
	$scope.multipleDeviceZoomLevel=3;
	$scope.mars = 10;
	$scope.isZoomed = true;// reCenter button for group based
	$scope.singleDeviceZoomed = true;// reCenter button for single device based
	$scope.deviceList = [];
	var speedValue=0;									
	var devIDval="";
	var speedlimit="";
	
	$scope.chart;

	/*
	 * var MarkersOnload=[]; var mapPosOnload={}; var polygonOnload=[]; var
	 * scope = angular.element(document.getElementById("smartMap")).scope();
	 * scope.updateMap(MarkersOnload, mapPosOnload,polygonOnload);
	 */
	// Count of vehicle count
	var multiDeviceInterval, singleDeviceInterval;
	$scope.multiDevice = false;
	$scope.singleDevice = false;
	$scope.carCount = 0;
	$scope.jeepCount = 0;
	$scope.busCount = 0;
	$scope.truckCount = 0;
	$scope.admingroup = {};
	$scope.admingroup.token = $scope.token;
	// console.log($scope.admingroup);
	$http({
		method : 'POST',
		url : apiURL + 'group/list',
		data : JSON.stringify($scope.admingroup),
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function(data) {
		listGroup(data);
	}).error(function(data, status, headers, config) {
		console.log(data);
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
	    $('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
		storage_arr=[];//clearing the matched array on change of group id dropdown
		$scope.initialize();
		$scope.isZoomed = true;// reCenter button for group based
		$scope.singleDeviceZoomed = true;// reCenter button for single device
											// based
		// document.getElementById("groupNamelist").blur();
		// console.log(groupID);
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
			if (angular.isDefined(multiDeviceInterval)) {
				$interval.cancel(multiDeviceInterval);
			} else if (angular.isDefined(singleDeviceInterval)) {
				$interval.cancel(singleDeviceInterval);
			}
			$scope.groupDevice = data;
			// console.log(JSON.stringify($scope.groupDevice));
			$scope.carCount = $scope.groupDevice.carcount;
			$scope.jeepCount = $scope.groupDevice.jeepcount;
			$scope.busCount = $scope.groupDevice.buscount;
			$scope.truckCount = $scope.groupDevice.truckcount;
			var dev_len = $scope.groupDevice.devlist.length;
			var devlist = $scope.groupDevice.devlist;
			$scope.deviceList=[];
			for ( var i = 0; i < dev_len; i++) {
				$scope.deviceList.push(devlist[i].devid);
			}
			plotDevices();
			//multiDeviceInterval = $interval(plotDevices, reqTime * 1000);
			//console.log(multiDeviceInterval);
		}).error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
		geofenceAPI($scope.groupdevicejson);
	};
	/**
	 *  fetch device information
	 * */
	$scope.fetchDeviceDetail = function(gid, deviceId) {	
		$scope.initialize();
		$scope.isZoomed = true;// reCenter button for group based
		$scope.singleDeviceZoomed = true;// reCenter button for single device based		
		$scope.devIDval = deviceId;
		devIDval=deviceId;		
		$scope.multiDevice = false;
		$scope.singleDevice = true;		
		if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		} else if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		}
		var groupdevicejson = {};
		groupdevicejson.token = $scope.token;
		groupdevicejson.gid = $scope.groupdevicejson.gid;
		geofenceAPI(groupdevicejson);
		plotDevice();
		singleDeviceInterval = $interval(plotDevice,reqTime * 1000);		
	};
	
	/**----------------------------------------------------------------------------------------------------------------------------------------------------
	 * 
	 * 													plot group based device on the map
	 ---------------------------------------------------------------------------------------------------------------------------------------------------*/
	function geofenceAPI(groupdevicejson){
		/*
		 * get device info based on group ID
		 */
		$http({
			method : 'POST',
			url : apiURL + 'group/info',
			data : JSON.stringify(groupdevicejson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {			
			//console.log(data);			 
			reqTime = data.time_interval;
			maxSpeed = data.speed_limit;

			var geoJson = data.geofence;			
			var resultGeoJson = [];
			for ( var key in geoJson) {
				if (geoJson.hasOwnProperty(key)) {
					
					resultGeoJson.push({
						'lat' : geoJson[key].lat,
						'lng' : geoJson[key].long
					});
				}
			}
			//console.log(JSON.stringify(resultGeoJson));			
			var geofence_plot = resultGeoJson;
		    plotGeofence(geofence_plot);
		}).error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	}
	function plotGeofence(geofence_plot){
		//alert("Geofence");
		//alert(geofence_plot);	
		//console.log(JSON.stringify(geofence_plot));
		myPolygon = new google.maps.Polygon({
	        paths: geofence_plot,
	        //draggable: true, // turn off if it gets annoying
	        //editable: true,
	        strokeColor: '#FF0000',
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: '#FF0000',
	        fillOpacity: 0.35
	      });
	      myPolygon.setMap(map);
	}
	function plotDevices(){
		console.log("group");
		//console.log($scope.deviceList.length);
		$scope.devicejson = {};
		$scope.devicejson.token = $scope.token;	
		$scope.devicejson.devlist = $scope.deviceList;
		$http({
			method : 'POST',
			url : apiURL + 'device/currentdata',
			data : JSON.stringify($scope.devicejson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			//console.log(data);
			if($scope.deviceList.length==1){
				$scope.multiDevice = false;
				$scope.singleDevice = true;
				$scope.speedValue = data[0].values[0].Velocity;
				devIDval=$scope.deviceList[0];
				speedValue=data[0].values[0].Velocity;					
				speedlimit=data[0].speed_limit;
				updateSpeed();
			}
			else{
				$scope.multiDevice = true;
				$scope.singleDevice = false;
				displayData(data);
			}
			var bounds = new google.maps.LatLngBounds();
			for(var i=0;i<data.length;i++){	
			createMarker(new google.maps.LatLng(data[i].values[0].lat, data[i].values[0].long),data[i].devid,"",data[i].values[0].type);			 
			bounds.extend(new google.maps.LatLng(data[i].values[0].lat, data[i].values[0].long));						    
			}
			map.fitBounds(bounds);
		}).error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
		
	}
	function plotDevice(){
		console.log("single");
		$scope.deviceJson = {};
		$scope.deviceJson.token = $scope.token;
		var obj = [];
		obj.push(devIDval);
		$scope.deviceJson.devlist = obj;
		$scope.deviceJson.count = 2;
		$http({
			method : 'POST',
			url : apiURL + 'device/currentdata',
			data : JSON.stringify($scope.deviceJson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {			
			speedValue=data[0].values[0].Velocity;					
			speedlimit=data[0].speed_limit;				
			//request for geofence plotting			
			//vechile count updation based on type
			$scope.carCount = 0;
			$scope.jeepCount = 0;
			$scope.busCount = 0;
			$scope.truckCount = 0;
			if(data[0].devtype=="car"){				
				$scope.carCount = 1;
			}
			else if(data[0].devtype=="jeep"){
				$scope.jeepCount = 1;
			}else if(data[0].devtype=="bus"){
				$scope.busCount = 1;
			}else if(data[0].devtype=="truck"){
				$scope.busCount = 1;
			}
			else{$scope.carCount = 0;
			$scope.jeepCount = 0;
			$scope.busCount = 0;
			$scope.truckCount = 0;}
			updateSpeed();
			$scope.calcRoute(data);					
		}).error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	}
	/**
	 * function for recenter to re intiate the live tracking or request for
	 * current data
	 */
	$scope.reCenter = function() {
		map.zoom = $scope.multipleDeviceZoomLevel;
		$scope.isZoomed = true;
		multiDeviceInterval = $interval(getCurrentData, reqTime * 1000);
	};
	/**
	 * function for recenter the single device selection
	 */
	$scope.reCenterDevice = function() {
		console.log("Single Device Re Center");
		map.zoom = $scope.singleDeviceZoomLevel;
		$scope.singleDeviceZoomed = true;
		if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		} else if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		}
		singleDeviceInterval = $interval(plotSelectedDevice, reqTime * 1000);
	};
	
	/**
	 * function to display current speed of all devices in the selected group
	 * and display it in the table
	 */
	function displayData(deviceData) {
		//console.log(JSON.stringify(deviceData));
		$scope.devData = {};
		for ( var inc = 0; inc < deviceData.length; inc++) {
			// console.log(JSON.stringify(deviceData));
			var devId = deviceData[inc].devid;
			var devSpeed = deviceData[inc].values[0].Velocity;
			$scope.devData[devId] = devSpeed;
			$scope.speedlimit = deviceData[inc].speed_limit;
			// console.log($scope.speedlimit);
		}
		 
	}
	
	/*------------------------------------------------------------------------------------------------------------------------
	 * 
	 *                                           angular gauge speedometer 
	 *                                           
	 *------------------------------------------------------------------------------------------------------------------------ */
	/**
	 * function to update the speedometer
	 */
	function updateSpeed() {		
		$('#container').highcharts().setTitle({text: "<label>Device ID:</label><p>" + devIDval
			+ "</p><br/><br/><label>Speed Limit:</label><p><b>"
			+ speedlimit + "<b>KmpH</p>"});
		$('#container').highcharts().series[0].points[0].update(Number(speedValue));		
	}
	 $('#container').highcharts({
		 
	        chart: {
	            type: 'gauge',
	            plotBackgroundColor: null,
	            plotBackgroundImage: null,
	            plotBorderWidth: 0,
	            plotShadow: false,
	            width:'300',
	            height:'300'
	        },

	        title : {
				text : "<label>Device ID:</label><p>" + devIDval
						+ "</p><br/><br/><label>Speed Limit:</label><p><b>"
						+ speedlimit + "<b>KmpH</p>"
			},

	        pane: {
	            startAngle: -150,
	            endAngle: 150,
	            background: [{
	                backgroundColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	                    stops: [
	                        [0, '#FFF'],
	                        [1, '#333']
	                    ]
	                },
	                borderWidth: 0,
	                outerRadius: '109%'
	            }, {
	                backgroundColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	                    stops: [
	                        [0, '#333'],
	                        [1, '#FFF']
	                    ]
	                },
	                borderWidth: 1,
	                outerRadius: '107%'
	            }, {
	                // default background
	            }, {
	                backgroundColor: '#DDD',
	                borderWidth: 0,
	                outerRadius: '105%',
	                innerRadius: '103%'
	            }]
	        },

	        // the value axis
	        yAxis: {
	            min: 0,
	            max: 200,

	            minorTickInterval: 'auto',
	            minorTickWidth: 1,
	            minorTickLength: 10,
	            minorTickPosition: 'inside',
	            minorTickColor: '#666',

	            tickPixelInterval: 30,
	            tickWidth: 2,
	            tickPosition: 'inside',
	            tickLength: 10,
	            tickColor: '#666',
	            labels: {
	                step: 2,
	                rotation: 'auto'
	            },
	            title: {
	                text: 'km/h'
	            },
	            plotBands: [{
	                from: 0,
	                to: 120,
	                color: '#55BF3B' // green
	            }, {
	                from: 120,
	                to: 160,
	                color: '#DDDF0D' // yellow
	            }, {
	                from: 160,
	                to: 200,
	                color: '#DF5353' // red
	            }]
	        },

	        series: [{
	            name: 'Speed',
	            data: [Number(speedValue)],
	            tooltip: {
	                valueSuffix: ' km/h'
	            }
	        }]

	    },
	    // Add some life
	    function (chart) {	    	
	        if (!chart.renderer.forExport && chart.length>0) {
	            setInterval(function () {
	            	//console.log(speedlimit);
	            	chart.setTitle({text: "<label>Device ID:</label><p>" + devIDval
	    				+ "</p><br/><br/><label>Speed Limit:</label><p><b>"
	    				+ speedlimit + "<b>KmpH</p>"});
	                var point = chart.series[0].points[0],
	                    newVal,                    
	                    inc = Math.round((Math.random() - 0.5) * 20);	               								
	                newVal = point.y + inc;
	                if (newVal < 0 || newVal > 200) {
	                    newVal = point.y - inc;
	                }

	                point.update(Number(speedValue));

	            }, reqTime*1000);
	        }
	    });
	
	/*------------------------------------------------------------------------------------------------------------------------
	 * 
	 *                                           the end of angular gauge speedometer 
	 *                                           
	 *------------------------------------------------------------------------------------------------------------------------ */

	/**
	 * On load of customer name 1)Filter customer name 2)Select customer name
	 */
	// var tagsData = cname;
	// init jquery functions and plugins
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
			$('#clearTextDevice span.select2-chosen').text("- - Select Device - -");
		});// script
		$('.select2-input').on('input',function(){
			console.log("check");
		});
	});

	/**
	* Refresh map for particular time interval cancels on location change 
	*/
	$scope.$on('$locationChangeStart', function(){
		if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		} else if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		}
	});
	/**------------------------------------------------------------------------------------------------------------------------------------
	 *-------------------------------------------------------- device detail modal --------------------------------------------------------*/
	$scope.open = function(size, deviceId) {
		$scope.deviceInfojson = {};
		$scope.deviceInfojson.token = $scope.token;
		$scope.deviceInfojson.devid = deviceId;
		var devData;
		/*---------------------- Vechile Info API CALL -------------------------------------*/
		$http({
			method : 'POST',
			url : apiURL + 'device/info',
			data : JSON.stringify($scope.deviceInfojson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			var modalInstance = $uibModal.open({
				animation : $scope.animationsEnabled,
				templateUrl : '/html/admin/myModalContent.html',
				controller : 'ModalInstanceCtrl',
				directive:'phone',
				size : size,
				resolve : {
					dev : function() {
						return data;
					}
				}
			});
		}).error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	};
});

/*
 * ----------------------------------------------------- end of map controller ----------------------------------------------------------------------
 * */
batsAdminHome.controller('dateCtrl', function($scope) {
	$scope.myDate = new Date();
	$scope.minDate = new Date($scope.myDate.getFullYear(), $scope.myDate
			.getMonth() - 2, $scope.myDate.getDate());
	$scope.maxDate = new Date($scope.myDate.getFullYear(), $scope.myDate
			.getMonth() + 2, $scope.myDate.getDate());
	$scope.onlyWeekendsPredicate = function(date) {
		var day = date.getDay();
		return day === 0 || day === 6;
	};
	$scope.myDateChange = function(mydate) {
	};
});

batsAdminHome.controller('AdminController', function($scope, $interval, $http,
		$localStorage) {
	$scope.getGrouplist = function() {
		/**
		 * Load Group list 1) on load of page load the Group_name, Country,
		 * State in the dropdown 2) Load Group details in grid
		 */
		$scope.token = $localStorage.data;
		if (typeof $scope.token === "undefined") {
			swal({
				title : "Un Authorized Acces",
				text : "Kindly Login!",
				type : "warning",
				confirmButtonColor : "#ff0000",
				closeOnConfirm : false
			}, function() {
				$localStorage.$reset();
				window.location = apiURL;
			});

		}
		$scope.customer = {};
		$scope.customer.token = $scope.token;
		// $scope.customer.id = $scope.token;
		// console.log(JSON.stringify($scope.customer));
		$http({
			method : 'POST',
			url : apiURL + 'group/list',
			data : JSON.stringify($scope.customer),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			$scope.glist = data.glist;
			// console.log(JSON.stringify($scope.glist));
		}).error(function(data, status, headers, config) {
			// console.log(data.err);
			if (data.err == "Expired Session") {
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
			console.log(status);
			console.log(headers);
			console.log(config);
		});

	};
	

	
});

/**
 * ------------------------------------------------------------------------------------------------------------------------------------------
 * 																ModalInstanceCtrl
 * ------------------------------------------------------------------------------------------------------------------------------------------
 * */
//Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular
		.module('batsAdminHome')
		.controller(
				'ModalInstanceCtrl',
				function($scope, $http, $uibModalInstance, dev, $localStorage) {
					// for history tab hide the map and table part intially
					$scope.token = $localStorage.data;
					$scope.dev = dev;
					$scope.ok = function() {
						$uibModalInstance.close($scope.selected.item);
					};

					$scope.cancel = function() {
						$uibModalInstance.dismiss('cancel');
					};
					/**
					 * get Date formatted date based on TIMESTAMP
					 -----------------------------------------------------------------------*/
					$scope.getDate = function(ts) {
						var d = new Date(Number(ts));
						// console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
						var monthVal = d.getMonth() + 1;
						// Hours part from the timestamp
						var hours = d.getHours();
						// Minutes part from the timestamp
						var minutes = "0" + d.getMinutes();
						// Seconds part from the timestamp
						var seconds = "0" + d.getSeconds();

						// Will display time in 10:30:23 format
						var formattedTime = hours + ':'
								+ minutes.substr(-2) + ':'
								+ seconds.substr(-2);
						return d.getDate() + "-" + monthVal + "-"
								+ d.getFullYear() + " / "
								+ formattedTime;
					}
					/**
					Change Image of Device based on device Type
					-----------------------------------------------------------------------------*/
					$scope.whatVehicle = function() {
						if ($scope.dev.devtype == "car") {
							$scope.url = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQnBx8Czkt93BZhCcIWGh-3eHuv8CH613GrTCpah6RP9b7LyxIJjw';
						} else if ($scope.dev.devtype == "bus") {
							$scope.url = 'http://www.myiconfinder.com/uploads/iconsets/256-256-3ac514df5b4f36e2d8d525fe7f63b83c.png'
						} else if ($scope.dev.devtype == "jeep") {
							$scope.url = 'https://www.google.co.in/imgres?imgurl=https://cdn4.iconfinder.com/data/icons/transportation-front-view/80/Transportation_cars-01-512.png&imgrefurl=https://www.iconfinder.com/icons/215247/4x4_automobile_cars_front_view_jeep_machine_quadro_transportation_travel_vehicle_icon&h=512&w=512&tbnid=o3WW9QtjG1UktM:&docid=CoqPwHHUjs97UM&ei=EJeMVt2QOZKiugTW-JOYCw&tbm=isch&ved=0ahUKEwjd2Njgq5TKAhUSkY4KHVb8BLMQMwgkKAkwCQ';
						} else if ($scope.dev.devtype == "truck") {
							$scope.url = 'http://www.wpclipart.com/transportation/car/icons_BW/flatbed_truck_BW_icon.png';
						}
					}
					/**
					API Call for Device History 
					---------------------------------------------------------------------------*/
					$scope.myDate = new Date();
					$scope.minDate = new Date($scope.myDate.getFullYear(),
							$scope.myDate.getMonth() - 2, $scope.myDate
									.getDate());
					$scope.maxDate = new Date($scope.myDate.getFullYear(),
							$scope.myDate.getMonth() + 2, $scope.myDate
									.getDate());
					$scope.onlyWeekendsPredicate = function(date) {
						var day = date.getDay();
						return day === 0 || day === 6;
					};
					
					/**
					Current Data API Call from here-------------------------------------------*/
					$scope.showCurrentData = function() {
						$scope.deviceCurrentDatajson = {};
						$scope.devIdobj = [];
						$scope.deviceCurrentDatajson.token = $scope.token;
						$scope.devIdobj.push(dev.devid);
						$scope.deviceCurrentDatajson.devlist = $scope.devIdobj;
						//$scope.deviceCurrentDatajson.devlist = dev.devid;
						$scope.deviceCurrentDatajson.count = 10;
						//console.log($scope.deviceCurrentDatajson);
						$http(
								{
									method : 'POST',
									url : apiURL + 'device/currentdata',
									data : JSON
											.stringify($scope.deviceCurrentDatajson),
									headers : {
										'Content-Type' : 'application/json'
									}
								})
								.success(
										function(data) {
											$scope.currData = data[0];
										}).error(
										function(data, status, headers,
												config) {
											console.log(data);
											console.log(status);
											console.log(headers);
											console.log(config);
										});
					};
					/**
					Device Settings API CALL Made here---------------------------*/
					$scope.device = {};
					$scope.submitSettings = function() {
						$scope.device.token = $scope.token;
						$scope.device.devid = dev.devid;
						var obj = [];
						obj.push($scope.device.contact_num)
						delete $scope.device['contact_num'];
						$scope.device.contact_num = obj;
						console.log($scope.device);
						$http({
							method : 'POST',
							url : apiURL + 'device/easyupdate',
							data : JSON.stringify($scope.device),
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function(data) {
							//console.log(JSON.stringify(data));
							swal({title: "Settings Changed Successfully",
								   text: "Success!",   
								   type: "success",   
								   confirmButtonColor: "#9afb29",   
								   closeOnConfirm: false }, 
								   function(){   
									   $scope.data = data;
									   console.log(JSON.stringify($scope.data));
									   location.reload();
							});
						})
								.error(
										function(data, status, headers,
												config) {
											console.log(data);
											console.log(status);
											console.log(headers);
											console.log(config);
										});
					};

				}).directive('phone', function() {
				    return {
				        restrice: 'A',
				        require: 'ngModel',
				        link: function(scope, element, attrs, ctrl) {
				            angular.element(element).bind('blur', function() {
				                var value = this.value;
				                if(PHONE_REGEXP.test(value)) {
				                    // Valid input
				                    //console.log("valid phone number"+value);
				                    angular.element(this).next().next().css('display','none');
				                    scope.btnDisabled = true;
				                } else {
				                	scope.btnDisabled = true;
				                    // Invalid input  
				                    console.log("invalid phone number"+value);
				                    scope.mobstatus="invalid phone number";
				                    angular.element(this).next().next().css('display','block');
				                    console.log(angular.element(this).children().find('span'));
				                    /* 
				                        Looks like at this point ctrl is not available,
				                        so I can't user the following method to display the error node:
				                        ctrl.$setValidity('currencyField', false); 
				                    */                    
				                }
				            });              
				        }            
				    };        
				});