batsAdminHome.controller('vehicleHistory', function($scope, $http, $localStorage){
	$scope.yoData=false;
	$scope.noData=false;
	$scope.showDatepicker=true;
	$scope.token = $localStorage.data;
	var dev={};	
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
		$scope.showDatepicker=true;
		$scope.noData = false;
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Device - -");
		// document.getElementById("groupNamelist").blur();
		console.log(groupID);
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
			$scope.deviceList = [];
			var dev_len = $scope.groupDevice.devlist.length;
			var devlist = $scope.groupDevice.devlist;
			for ( var i = 0; i < dev_len; i++) {
				$scope.deviceList.push(devlist[i].devid);
			}
			//console.log($scope.deviceList);
		}).error(function(data, status, headers, config) {
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
		$scope.myDate = "";
	};
	
	$scope.myDateChange=function(myDate){
		//console.log(new Date(myDate).getTime());
		var sts=new Date(myDate).getTime();
		var d=new Date(myDate);
		d.setHours(23);
		d.setMinutes(59);
		d.setSeconds(59);
		var ets=d.getTime();
		historyApiCall(sts,ets);
	};
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
			//console.log(data.values.length);
			if($scope.histData.values.length>=1){
				displayHistory();	
			}
			else{
				$scope.yoData=false;
				$scope.noData=true;
			}
		})
				.error(
						function(data, status, headers,
								config) {
							console.log(data);
							console.log(status);
							console.log(headers);
							console.log(config);
						});
	}
	/**
	1) Plot on Map History Path
	2) Display on Table
	-----------------------------------------------------------------------*/
	function displayHistory() {
		$scope.yoData=true;
		$scope.noData=false;
		var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
		var histData = $scope.histData.values;
		var hist_len = histData.length;
		var obj = [];
		$scope.plottedData=[];
		var coordinates = [];
		/*for ( var inc = 0; inc < hist_len; inc++) {
			var arr = {};
			var plottedObj={};
			console.log(JSON.stringify(histData));
			//if(histData[inc].Velocity>5){
				arr.latitude = Number(histData[inc].lat);
				arr.longitude = Number(histData[inc].long);
				plottedObj.lat=Number(histData[inc].lat);
				plottedObj.long=Number(histData[inc].long);
				plottedObj.Velocity=histData[inc].Velocity;
				plottedObj.ts=histData[inc].ts;
				obj.push(arr);
				$scope.plottedData.push(plottedObj);
				lat_tot += Number(histData[inc].lat);
				lg_tot += Number(histData[inc].long);
			}
			else{
				console.log("less than 50");
			}
			
		}*/
		
		for(var inc = 0; inc < hist_len; inc++){
		  	executeHisory(histData[inc].lat,histData[inc].long,histData[inc].Velocity,histData[inc].ts,
		  			function(historyStatus){
                //console.log(JSON.stringify(historyStatus));
                var arr = {};
    			var plottedObj={};
    			arr.latitude = Number(historyStatus.latitude);
				arr.longitude = Number(historyStatus.longitude);
				plottedObj.lat = Number(historyStatus.latitude);
				plottedObj.long = Number(historyStatus.longitude);
				plottedObj.Velocity = historyStatus.velocity;
				plottedObj.ts = historyStatus.timestamp;
				obj.push(arr);
				$scope.plottedData.push(plottedObj);
				lat_tot += Number(historyStatus.latitude);
				lg_tot += Number(historyStatus.longitude);
		  	});
		  	
		  }
		function executeHisory(latitude,longitude,velocity,timestamp,mapHistory){
			if(velocity>5){
				var historyStatus={"latitude":latitude,"longitude":longitude,"velocity":velocity,"timestamp":timestamp};
				mapHistory(historyStatus);
			}
			/*else{
				console.log("less than 5");
			}*/
		}
		console.log(JSON.stringify(obj));
		console.log(JSON.stringify($scope.plottedData));
		//console.log(JSON.stringify(coordinates));
		
		if(obj.length == 0){
			//console.log("chk");
			$scope.yoData=false;
			swal("No not available. Kindly check for another date");
		}
		
		var obj_len = obj.length;
		//console.log(obj);
		/*lt_avg = lat_tot / hist_len;
		lg_avg = lg_tot / hist_len;*/
		lt_avg = lat_tot / obj_len;
		lg_avg = lg_tot / obj_len;
		console.log(lt_avg + " " + lg_avg);

		$scope.historyMap = {
			center : {
				latitude : lt_avg,
				longitude : lg_avg
			},
			zoom : 12
		};
		//polyline for the history path
		$scope.historyMap.polylines = [];
		$scope.historyMap.polylines.push({
			id : 1,
			path : obj,
			stroke : {
				color : '#000000',
				weight : 3
			},
			editable : true,
			draggable : true,
			geodesic : true,
			visible : true
		});
	}
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
			$('#clearTextDevice span.select2-chosen').text("- - Select Device - -");
		});// script
	});
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
