batsGeneralHome.controller('vehicleHistory',function($scope, $http, $localStorage,uiGmapGoogleMapApi,uiGmapIsReady){
	$scope.yoData=false;
	$scope.noData=false;
	$scope.showDatepicker=true;
	$scope.showTimeSlot=false;
	$scope.token = $localStorage.data;
	$scope.todayDate=new Date();
	var dev={};
	var maploadedInterval;
	var directionDisplay;
    var directionsService;
	var map;
	var historypolyline = null;
	//$("#loading_icon").hide();
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
	//function initialize() {
	$scope.initialize=function () {		
		var styleMap = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#bee4f4"},{"visibility":"on"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"color":"#000000"}]}];
		var myOptions = {
	        zoom: 8,
	        styles: styleMap,
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    address = 'India';
	    //address = 'Trinidad and Tobago'
	    geocoder = new google.maps.Geocoder();
	    geocoder.geocode( { 'address': address}, function(results, status) {
	     map.fitBounds(results[0].geometry.viewport);

	    });	
	    map = new google.maps.Map(document.getElementById("history_map"),
	            myOptions);
	    google.maps.event.addListenerOnce(map, 'idle', function(){
	        // do something only the first time the map is loaded
	    	//console.log("map loaded");
	    });
	    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
	        //this part runs when the mapobject is created and rendered
	    	//console.log("Map Loaded");
	        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
	            //this part runs when the mapobject shown for the first time
	        	//console.log("Map with tiles and polylines loaded one time");        	
	        	
	        	//console.log("Hide Loading");
	        });
	    });
	    google.maps.event.addListener(map, 'tilesloaded', function() {
	    	  // Visible tiles loaded!
	    	//console.log("map loaded with tiles every time");
	    	//$("#loading_icon").hide();
	    	//$scope.httpLoading=false;
	    	});
	}
	

	/**
	 * on load fetch and fill group drop down menu
	 * */
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
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select  Vehicle No/Device - -");
		// document.getElementById("groupNamelist").blur();
		//console.log(groupID);
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
			$scope.httpLoading=false;
			$scope.groupDevice = data;
			$scope.devlistObject=$scope.groupDevice.devlist;
			$scope.deviceList = [];
			var dev_len = $scope.groupDevice.devlist.length;
			var devlist = $scope.groupDevice.devlist;
			for ( var i = 0; i < dev_len; i++) {
				$scope.deviceList.push(devlist[i].devid);
			}
			//console.log($scope.deviceList);
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
	};
	/**
	 * add selected device for fetching history
	 * */
	$scope.fetchDeviceDetailHistory=function(devID){
		$scope.showDatepicker=false;
		$('.md-datepicker-input').prop('readonly', true);
		dev.devid=devID;
		$scope.yoData=false;
		$scope.showTimeSlot=false;
		$scope.myDate = "";
		$scope.initialize();
	};
	
	$scope.myDateChange=function(myDate){
		$scope.initialize();
		$scope.yoData=false;
		$scope.showTimeSlot=true;
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
				}
				else{
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
	 * 1 for 00:00 - 05:59
	 * 2 for 06:00 - 11:59
	 * 3 for 12:00 - 17:59
	 * 4 for 18:00 - 23:59
	 * */
	$scope.slotHistory=function(slot_num,noDataVal){
		if(noDataVal!=0){
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
		else{swal("Kindly check for available slot(s)");}
	};
	function getTimestamp(hr,mins,sec){		
		var d=new Date($scope.myDate);
		d.setHours(hr);
		d.setMinutes(mins);
		d.setSeconds(sec);
		return d.getTime();
	}
	$scope.showHistory = function(mydate) {
		var sts=new Date(mydate).getTime();
		var d=new Date(mydate);
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		var ets=d.getTime();
		historyApiCall(sts,ets);
	};
	function historyApiCall(sts,ets){
		$scope.httpLoading=true;
		//$("#loading_icon").show();			
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
			//console.log(JSON.stringify(data.values));
			if($scope.histData.values.length>=1){
				$scope.httpLoading=false;
				displayHistory();				
			}
			else{
				$scope.httpLoading=false;
				//$("#loading_icon").hide();	
				$scope.yoData=false;
				//$scope.noData=true;
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
	1) Plot on Map History Path
	2) Display on Table
	-----------------------------------------------------------------------*/
	function displayHistory() {
		//console.log(JSON.stringify($scope.histData.values));
		
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
                //console.log(JSON.stringify(historyStatus));
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
				lat_tot += Number(historyStatus.latitude);
				lg_tot += Number(historyStatus.longitude);
		  	});
		  	
		  }
		function executeHisory(latitude,longitude,velocity,timestamp,mapHistory){
			//if(velocity>5){
				var historyStatus={"latitude":latitude,"longitude":longitude,"velocity":velocity,"timestamp":timestamp};
				mapHistory(historyStatus);
			//}
			//else{
				//console.log("less than 5");
			//}
		}
		//console.log(JSON.stringify(obj));
		/*console.log(JSON.stringify($scope.plottedData));*/
		//console.log(JSON.stringify(coordinates));
		
		if(polyPathArray.length == 0){
			//console.log("chk");
			$scope.yoData=false;
			//swal("No not available. Kindly check for another date");
		}
		else{
			console.log(JSON.stringify(polyPathArray));			
			var poly_len = polyPathArray.length;
			var iconsetngs = {
		            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
		        };
		        var polylineoptns = {
		            path: polyPathArray,
		            strokeOpacity: 0.8,
		            strokeWeight: 3,
		            map: map,		            
		            icons: [{
		                icon: iconsetngs,
		                repeat:'35px',
		                offset: '100%'}]
		        };
		      if(historypolyline!=null){
		    	  historypolyline.setMap(null);
		    	  historypolyline=null;
		      }
		      //console.log(historypolyline);
		      historypolyline = new google.maps.Polyline(polylineoptns);
		      var bounds = new google.maps.LatLngBounds();		      		    		
		    	
			    for(var j=0;j<poly_len;j++){
			    	 var latlng = new google.maps.LatLng(polyPathArray[j].lat,polyPathArray[j].lng);
			    	 bounds.extend(latlng);
			    }
			        map.fitBounds(bounds);	    
		}
	}
	function SortByts(x,y) {
		//console.log(x);
		//console.log(y);
		return ((x.ts == y.ts) ? 0 : ((x.ts > y.ts) ? 1 : -1 ));
	}
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
			$('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
		});// script
	});
	/**
	 * get Date formatted date based on TIMESTAMP
	 -----------------------------------------------------------------------*/
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
		//alert("success");
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