batsAdminHome.controller('replayHistory', function($scope,$rootScope, $http, $localStorage){
	$scope.yoData=false;
	$scope.noData=false;
	$scope.showDatepicker=true;
	$scope.showTimeSlot=false;
	$scope.blankTable=true;
	$scope.token = $localStorage.data;
	$scope.todayDate=new Date();
	$scope.greyColor={
			color:"#637778"
	};
	$scope.whiteColor={
			color:"#fff"
	};
	var contentHeight=window.screen.availHeight-220;
	$scope.histcontentheight={
			"height":contentHeight
	}
	$rootScope.menuPos=15;
	var dev={};
	var maploadedInterval;
	var directionDisplay;
    var directionsService;
	var map;
	var historypolyline = null;
  var timerHandle = null;
  var step = 5; // metres
  var tick = 100; // milliseconds
  var poly;
  var poly2;
  var lastVertex = 0;
  var eol;
  var marker;
  var k=0;
  var markerIcon="M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
  //var markerIcon="M26.068,7.719 C27.423,21.657 26.941,35.659 26.801,49.660 C26.765,52.945 23.953,55.681 20.511,55.727 C16.978,55.770 13.462,55.778 9.929,55.738 C6.486,55.697 3.672,52.944 3.640,49.660 C3.516,35.659 3.113,21.657 4.657,7.719 C5.083,4.446 7.639,1.760 10.572,1.739 C13.630,1.721 16.881,1.721 20.018,1.739 C23.034,1.760 25.695,4.446 26.068,7.719 L26.068,7.719 Z";
  var icon = {
    		    path: markerIcon,
    		    scale: .7,
    		    strokeColor: 'white',
    		    strokeWeight: 0,
    		    fillOpacity: 1,
    		    fillColor: '#00000',
    		    offset: '5%',
    		    // rotation: parseInt(heading[i]),
    		    anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
  };     
  //To Change Replay Speed level
  $scope.updateSpeed=function(choice){
	  switch (choice) {
		case 0:
			step=5;
			tick=100;
			break;
		case 1:
			step=10;
			tick=50;
			break;
		case 2:
			step=50;
			tick=10;
			break;	
		
		}
  }
	// $("#loading_icon").hide();
	if(typeof $scope.token==="undefined"){
		swal({ 
			   title: "Un Authorized Access",
		  	   text: "Kindly Login!",   
		  	   type: "warning",   
		  	   confirmButtonColor: "#ff0000",   
		  	   closeOnConfirm: false }, 
		  	   function(){  
		  		 $localStorage.$reset();
		  		 window.location = apiURL;
		  });
		 
	}
	// function initialize() {
	$scope.initialize=function () {		
		var styleMap = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#bee4f4"},{"visibility":"on"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"color":"#000000"}]}];
	    var myOptions = {
	        zoom: 8,	   
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    address = 'India';
	    // address = 'Trinidad and Tobago'
	    geocoder = new google.maps.Geocoder();
	    geocoder.geocode( { 'address': address}, function(results, status) {
	     map.fitBounds(results[0].geometry.viewport);

	    });	
	    map = new google.maps.Map(document.getElementById("replay_map"),
	            myOptions);
	    google.maps.event.addListenerOnce(map, 'idle', function(){
	        // do something only the first time the map is loaded
	    	// console.log("map loaded");
	    });
	    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
	        // this part runs when the mapobject is created and rendered
	    	// console.log("Map Loaded");
	        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
	            // this part runs when the mapobject shown for the first time
	        	// console.log("Map with tiles and polylines loaded one time");
	        	
	        	// console.log("Hide Loading");
	        });
	    });
	    google.maps.event.addListener(map, 'tilesloaded', function() {
	    	  // Visible tiles loaded!
	    	// console.log("map loaded with tiles every time");
	    	// $("#loading_icon").hide();
	    	// $scope.httpLoading=true;
	    	});
	    poly = new google.maps.Polyline({
	        path: [],
	        strokeColor: '#97dcc9',
	        strokeWeight: 5
	    });
	    poly2 = new google.maps.Polyline({
	        path: [],
	        strokeColor: '#FF0000',
	        strokeOpacity: 0.00001,
	        strokeWeight: 0
	    });  
	}
	

	/**
	 * on load fetch and fill group drop down menu
	 */
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
		if (data.err == "Expired Session") {
			$('#updateDeviceModal').modal('hide');
			expiredSession();
			$localStorage.$reset();
		} else if (data.err == "Invalid User") {
			$('#updateDeviceModal').modal('hide');
			invalidUser();
			$localStorage.$reset();
		}
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
	$scope.fetchDevicelistHistory = function(groupID) {
		$scope.httpLoading=true;
		$scope.showDatepicker=true;
		$scope.noData = false;
		$scope.showTimeSlot=false;
		$scope.blankTable=false;
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("Select Vehicle No/Device");
		// document.getElementById("groupNamelist").blur();
		// console.log(groupID);
	    $scope.initialize();
	    $scope.yoData=false;
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
			$scope.devlistObject=$scope.groupDevice.devlist;
			$scope.deviceList = [];
			var dev_len = $scope.groupDevice.devlist.length;
			var devlist = $scope.groupDevice.devlist;
			for ( var i = 0; i < dev_len; i++) {
				$scope.deviceList.push(devlist[i].devid);
			}
			// console.log($scope.deviceList);
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
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		}).finally(function(){		
			$scope.httpLoading=false;
		});
	};
	/**
	 * add selected device for fetching history
	 */
	$scope.fetchDeviceDetailHistory=function(devID){
		$scope.showDatepicker=false;
		$scope.showTimeSlot=false;
		$('.md-datepicker-input').prop('readonly', true);
		dev.devid=devID;
		$scope.yoData=false; 
		$scope.myDate = "";
		$scope.initialize();
	};
	
	$(document).on('click', '#trvelRouteHstTimePic', function(){
		$('#trvelRouteHstTimePic').datetimepicker({
			/*
			 * inline: true, sideBySide: true,
			 */
			format: 'DD/MM/YYYY',
	        maxDate: 'now',        		
			ignoreReadonly:true,
	            }).on("dp.change",function (e) {
	            	// $("#startDateMaxKm").blur();
	            	// closeResult();
	            	console.log(e);
	            	console.log(e.date);
	            	console.log(e.date._d);
	            	$scope.MyDate = e.date._d;
	            	$scope.myDateChange();
	            	$scope.activeMenu = '5';
	            });
		// startDateMaxKmError.style.display = 'none';
		var dt=new Date().getTime();
		$('#trvelRouteHstTime').val(showTime(dt));
	});
	
	function showTime (ts) {
		// console.log(ts);
		var d = new Date(Number(ts));
		var day = d.getDate();
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		var hours = d.getHours();
		var minutes = d.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = day+"/"+month+"/"+year;
		// console.log(strTime);
		return strTime;
	};
	
	function startDate(getStartDateMinMax){
		var datetimeVal=getStartDateMinMax;
		console.log(getStartDateMinMax);
		/* strArra=datetimeVal.split(" "); */
		var dateArray=datetimeVal.split("/");
		var newStDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
		var sts=new Date(newStDate);
		return sts.getTime();
	}
	
	$scope.myDateChange=function(){
		console.log("datechange");
		$scope.yoData=false;
		$scope.httpLoading=true;
		$scope.initialize();
		$scope.showTimeSlot=true;
		// check for vehicle history available slots
		$scope.slotCheckjson={};
		$scope.slotCheckjson.token=$scope.token;
		$scope.slotCheckjson.devid=dev.devid;
		$scope.slotCheckjson.slots=[];
		
		$scope.slotCheckjson.slots.push({"sts":getTimestamp(0,0,0),"ets":getTimestamp(5,59,0)},
										{"sts":getTimestamp(6,0,0),"ets":getTimestamp(11,59,0)},
										{"sts":getTimestamp(12,0,0),"ets":getTimestamp(17,59,0)},
										{"sts":getTimestamp(18,0,0),"ets":getTimestamp(23,59,0)});
		$http({
			method:'POST',
			url:apiURL+'device/history_data_exist',
			data:JSON.stringify($scope.slotCheckjson),	
			headers:{'Content-Type' : 'application/json'}
		}).success(function(data) {
				console.log(data.values);
				$scope.slotA=data.values[0].data ? '1' : '0';
				$scope.slotB=data.values[1].data ? '1' : '0';
				$scope.slotC=data.values[2].data ? '1' : '0';
				$scope.slotD=data.values[3].data ? '1' : '0';
					if(data.values[0].data!=true && data.values[1].data!=true&&data.values[2].data!=true&&data.values[3].data!=true){						
						$scope.showTimeSlot=false;
						swal({title:"No history available for the selected date"});
						$scope.no_history=false;
					}
					else{
						$scope.no_history=true;
						$scope.showTimeSlot=true;
					}
		}).error(function(data, status, headers,config) {
					if (data.err == "Expired Session") {
						$('#updateDeviceModal').modal('hide');
						expiredSession();
						$localStorage.$reset();
					} else if (data.err == "Invalid User") {
						$('#updateDeviceModal').modal('hide');
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
		
	};
	
	/**
	 * 1 for 00:00 - 05:59 2 for 06:00 - 11:59 3 for 12:00 - 17:59 4 for 18:00 -
	 * 23:59
	 */
	$scope.slotHistory=function(slot_num,noDataVal){
		if(noDataVal!=0){
			// $scope.no_history=true;
			if(slot_num==1){			
			historyApiCall(getTimestamp(0,0,0),getTimestamp(5,59,0));
		}
		else if(slot_num==2){			
			historyApiCall(getTimestamp(6,0,0),getTimestamp(11,59,0));
		}
		else if(slot_num==3){			
			historyApiCall(getTimestamp(12,0,0),getTimestamp(17,59,0));
		}
		else if(slot_num==4){			
			console.log(getTimestamp(18,0,0),getTimestamp(23,59,0));
			historyApiCall(getTimestamp(18,0,0),getTimestamp(23,59,0));
		}
			}
		else{swal("Kindly check for available slot(s)");
		// $scope.no_history=false;
		}
		
	};
	function getTimestamp(hr,mins,sec){		
		var trvelRouteHstTime=document.getElementById('trvelRouteHstTime').value;
		var selectDateTS=startDate(trvelRouteHstTime);
		var timeStamp=new Date(selectDateTS);
		timeStamp.setHours(hr);
		timeStamp.setMinutes(mins);
		timeStamp.setSeconds(sec);
		return timeStamp.getTime();
	}
	$scope.showHistory = function(mydate) {
		console.log(mydate);
		var sts=new Date(mydate).getTime();
		var d=new Date(mydate);
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		var ets=d.getTime();
		console.log(ets);
		historyApiCall(sts,ets);
	};
	function historyApiCall(sts,ets){
		$scope.httpLoading=true;
		// $("#loading_icon").show();
		$scope.deviceHistoryjson = {};
		$scope.deviceHistoryjson.token = $scope.token;
		$scope.deviceHistoryjson.devid = dev.devid;
		$scope.deviceHistoryjson.sts = sts;
		$scope.deviceHistoryjson.ets = ets;
		$http(
				{
					method : 'POST',
					url : apiURL + 'device/history',
					data : JSON
							.stringify($scope.deviceHistoryjson),
					headers : {
						'Content-Type' : 'application/json'
					}
				}).success(function(data) {
			$scope.histData = data;
			console.log(JSON.stringify(data.values));
			if($scope.histData.values.length>=1){
				$scope.httpLoading=false;
				displayHistory();				
			}
			else{
				$scope.httpLoading=false;
				// $("#loading_icon").hide();
				$scope.yoData=false;
				// $scope.noData=true;
				$scope.initialize();
				swal("Kindly check for available slot(s)");
				$scope.activeMenu=5;
			}
		})
				.error(
						function(data, status, headers,
								config) {
							if (data.err == "Expired Session") {
								$('#updateDeviceModal').modal('hide');
								expiredSession();
								$localStorage.$reset();
							} else if (data.err == "Invalid User") {
								$('#updateDeviceModal').modal('hide');
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
	function checkMaploaded(){
		console.log($scope.historyMap);
		if($scope.historyMap){
			$interval.cancel(maploadedInterval);		
		}
		else{			
		}
	}
	/**
	 * 1) Plot on Map History Path 2) Display on Table
	 * -----------------------------------------------------------------------
	 */
	function displayHistory() {
		$scope.yoData=true;
		$scope.noData=false;
		var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
		var histData = $scope.histData.values;
		histData=histData.sort(SortByts);
		var hist_len = histData.length;
		var polyPathArray = [];
		$scope.plottedData=[];
		var coordinates = [];		
		
		for(var inc = 0; inc < hist_len; inc++){
		  	executeHisory(histData[inc].lat,histData[inc].long,histData[inc].Velocity,histData[inc].ts,
		  			function(historyStatus){
                // console.log(JSON.stringify(historyStatus));
                var arr = {};
    			var plottedObj={};
    			arr.lat = Number(historyStatus.latitude);
				arr.lng = Number(historyStatus.longitude);
				plottedObj.lat = Number(historyStatus.latitude);
				plottedObj.long = Number(historyStatus.longitude);
				plottedObj.Velocity = historyStatus.velocity;
				plottedObj.ts = historyStatus.timestamp;
				polyPathArray.push(arr);
				$scope.plottedData.push(plottedObj);
				// console.log($scope.plottedData.length);
				/*
				 * if($scope.plottedData.length <= 1){ swal({title:"Vehicle in
				 * stationary"}); } else{ //nothing }
				 */
				
				lat_tot += Number(historyStatus.latitude);
				lg_tot += Number(historyStatus.longitude);
		  	});
		  	
		  }
		if($scope.plottedData.length <= 1){
			swal({title:"Stationary Vehicle"});
		}
		else{
			// nothing
		}
		console.log($scope.plottedData.length);
		function executeHisory(latitude,longitude,velocity,timestamp,mapHistory){
			// if(velocity>5){
				var historyStatus={"latitude":latitude,"longitude":longitude,"velocity":velocity,"timestamp":timestamp};
				mapHistory(historyStatus);
			/*
			 * } else{ console.log("less than 5"); }
			 */
		}
		// console.log(JSON.stringify(obj));
		/* console.log(JSON.stringify($scope.plottedData)); */
		// console.log(JSON.stringify(coordinates));
		
		if(polyPathArray.length == 0){
			// console.log("chk");
			$scope.yoData=false;
			// swal("No not available. Kindly check for another date");
		}
		else{
			clearMap();
			console.log(JSON.stringify(polyPathArray));
			 bounds = new google.maps.LatLngBounds();
			var pts=[];
    	    var length = 0;
            var point = null;
            for(var i=0;i<polyPathArray.length;i++){
            	pts[i]=new google.maps.LatLng(polyPathArray[i].lat,polyPathArray[i].lng)
            	if(i>0){
            		length += pts[i-1].distanceFrom(pts[i]);
            		if (isNaN(length)) { alert("["+i+"] length="+length+" segment="+pts[i-1].distanceFrom(pts[i])) };
            	}
            	bounds.extend(pts[i]);
            	point = pts[parseInt(i/2)];
            }
            poly = new google.maps.Polyline({
            	map:map,
    	        path: pts,
    	        strokeColor: '#97dcc9',
    	        strokeWeight: 5
    	    });
    	    map.setZoom(16);
            map.fitBounds(bounds);
            startAnimation();  
		}
	}
	function clearMap(){
		poly.setMap(null);
		poly2.setMap(null);
	}
	 function startAnimation() {   	  
         if (timerHandle) clearInterval(timerHandle);
         eol=poly.Distance();
         map.setCenter(poly.getPath().getAt(0));
         // map.addOverlay(new google.maps.Marker(polyline.getAt(0),G_START_ICON));
         // map.addOverlay(new GMarker(polyline.getVertex(polyline.getVertexCount()-1),G_END_ICON));
         if (marker) { 
            marker.setMap(null);
            delete marker;
            marker = null;
         }          
         if (!marker) marker = new google.maps.Marker({position:poly.getPath().getAt(0), map:map,icon:icon});
         // map.addOverlay(marker);
         poly2 = new google.maps.Polyline({path: [poly.getPath().getAt(0)], strokeColor:"#0000FF",strokeOpacity: 0.00001, strokeWeight:0});
         // map.addOverlay(poly2);
         //setTimeout("animate(50)",2000);  // Allow time for the initial map display
         setTimeout(function() {
 	        $scope.animate(50);
 	    }, 2000);
	 }
	 function updatePoly(d) {
	        // Spawn a new polyline every 20 vertices, because updating a 100-vertex poly is too slow
	        if (poly2.getPath().getLength() > 20) {
	          poly2= new google.maps.Polyline([poly.getPath().getAt(lastVertex - 1)]);
	          /* console.log(poly.getPath().getAt(lastVertex - 1).lat); */
	          //map.addOverlay(poly2)
	          poly2.setMap(map);
	        }

	        if (poly.GetIndexAtDistance(d) < lastVertex+2) {
	           if (poly2.getPath().getLength()>1) {
	        	   poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
	           }
	           /* poly2.insertVertex(poly2.getVertexCount(),poly.GetPointAtDistance(d)); */
	           poly2.getPath().insertAt(poly2.getPath().getLength(), poly.GetPointAtDistance(d));
	        } else {
	          /* poly2.insertVertex(poly2.getPath().getLength(),poly.getVertex(lastVertex++)); */         
	          poly2.getPath().insertAt(poly2.getPath().getLength(), poly.getPath().getAt(lastVertex++));
	        }
	      }
	 $scope.animate = function(d) {
	        if (d>eol) {	          
	          return;
	        }
	        var p = poly.GetPointAtDistance(d);
	      //  if (k++>=180/step) {
	          map.panTo(p);
	        /*    k=0;
	        } */ 
	        var lastPosn = marker.getPosition();	        
	    	marker.setPosition(p);
	    	var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
	    	icon.rotation = heading;
	    	marker.setIcon(icon);        
	        updatePoly(d);
	        //timerHandle = setTimeout("animate("+(d+step)+")", tick);
	        timerHandle = setTimeout(function() {
		        $scope.animate(d + step);
		    }, tick);
	      }
	 //----------------------------------------------------------------------------
		// =============== ~animation funcitons =====================
		/***************************************************************************
		 * *******************************************************************\ *
		 * epolys.js by Mike Williams * updated to API v3 by Larry Ross * * A Google
		 * Maps API Extension * * Adds various Methods to google.maps.Polygon and
		 * google.maps.Polyline * * .Contains(latlng) returns true is the poly
		 * contains the specified * GLatLng * * .Area() returns the approximate area
		 * of a poly that is * not self-intersecting * * .Distance() returns the
		 * length of the poly path * * .Bounds() returns a GLatLngBounds that bounds
		 * the poly * * .GetPointAtDistance() returns a GLatLng at the specified
		 * distance * along the path. * The distance is specified in metres * Reurns
		 * null if the path is shorter than that * * .GetPointsAtDistance() returns
		 * an array of GLatLngs at the * specified interval along the path. * The
		 * distance is specified in metres * * .GetIndexAtDistance() returns the
		 * vertex number at the specified * distance along the path. * The distance
		 * is specified in metres * Returns null if the path is shorter than that * *
		 * .Bearing(v1?,v2?) returns the bearing between two vertices * if v1 is
		 * null, returns bearing from first to last * if v2 is null, returns bearing
		 * from v1 to next * * *
		 * ********************************************************************** *
		 * This Javascript is provided by Mike Williams * Blackpool Community Church
		 * Javascript Team * http://www.blackpoolchurch.org/ *
		 * http://econym.org.uk/gmap/ * * This work is licenced under a Creative
		 * Commons Licence * http://creativecommons.org/licenses/by/2.0/uk/ * *
		 * ********************************************************************** *
		 * Version 1.1 6-Jun-2007 * Version 1.2 1-Jul-2007 - fix: Bounds was
		 * omitting vertex zero * add: Bearing * Version 1.3 28-Nov-2008 add:
		 * GetPointsAtDistance() * Version 1.4 12-Jan-2009 fix:
		 * GetPointsAtDistance() * Version 3.0 11-Aug-2010 update to v3 * * \
		 **************************************************************************/

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

		// === A method which returns a GLatLng of a point a given distance along
		// the path ===
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

		// === A method which returns an array of GLatLngs of points a given
		// interval along the path ===
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

		// === A method which returns the Vertex number at a given distance along
		// the path ===
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
		 * -----------------------------------------the end for vehicle icon
		 * movement---------------------------------------------------------------
		 * 
		 */
	function SortByts(x,y) {
		// console.log(x);
		// console.log(y);
		return ((x.ts == y.ts) ? 0 : ((x.ts > y.ts) ? 1 : -1 ));
	}
	$(document).ready(function() {
		
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("Select Group");
			$('#clearTextDevice span.select2-chosen').text("Select Vehicle No/Device");
		});// script
	});
	/**
	 * get Date formatted date based on TIMESTAMP
	 * -----------------------------------------------------------------------
	 */
	$scope.showTime = function(ts) {
		 var d = new Date(Number(ts));	 	
	 	  var hours = d.getHours();
	 	  var minutes = d.getMinutes();
	 	  var ampm = hours >= 12 ? 'pm' : 'am';
	 	  hours = hours % 12;
	 	  hours = hours ? hours : 12; // the hour '0' should be '12'
	 	  minutes = minutes < 10 ? '0'+minutes : minutes;
	 	  var strTime = hours + ':' + minutes + ' ' + ampm;
	 	  return strTime;
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
	$(".spdCtrl").click(function() {
		$(".spdCtrl").removeClass("activeCtrl");
		// $(".tab").addClass("active"); // instead of this do the below 
		$(this).addClass("activeCtrl");
	});
});
