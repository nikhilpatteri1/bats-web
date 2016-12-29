batstravelDeskHome.controller('tripManagement', function($scope, $localStorage,$http,travelDeskFactory,travelDeskService) {
	$scope.token = $localStorage.data;
	var pathWays;
	var destinations;
	$scope.trip_create={};
	$scope.updateTrip={};
	
	/*=========================BASIC FUNCTIONS==============================*/
	$scope.token = $localStorage.data;
	var map;
	var myPlace = {lat: 12.850167, lng: 77.660329}; 
	var marker;
	var labeld="D";
	var end;
	var directionsDisplay;
	var directionsService;
	var triplist_map;
	
	
	$scope.initMap =function() {
		marker=""
		$scope.trip_create.spoint="Crowne Plaza Bengaluru"
		$scope.trip_create.epoint="Crowne Plaza Bengaluru"
		directionsService = new google.maps.DirectionsService();
		
		
		
		directionsDisplay = new google.maps.DirectionsRenderer({
			draggable : true,
			map : map,
			panel:document.getElementById('right-panel')
		});
		map = new google.maps.Map(document.getElementById('map'), {
			zoom : 14,
			center : {
				lat : 12.849857,
				lng : 77.658968
			}
		});
		
	   directionsDisplay.setMap(map);
	   google.maps.event.addListener(map, 'click', function(event) {
		   end=event.latLng;
		   addMarker(event.latLng);
		   calcRoute();
		   
	   });
	   directionsDisplay.addListener('directions_changed', function() {
			computeTotalDistance(directionsDisplay.getDirections());
		});
	   
	   $("#startTimeid").val(travelDeskService.getDateTime(new Date().getTime()));
	   $("#endTimeid").val(travelDeskService.getDateTime(new Date().getTime()));
	
	}

	$('#createTripModal').on('shown.bs.modal', function() {		
		resizeCreateMap();
	});
	function resizeCreateMap() {
		   if(typeof map =="undefined") return;
		   var center = myPlace;
		   google.maps.event.trigger(map, "resize");
		   map.setCenter(center); 
	};
	
	 $scope.undoMap  = function(){
			marker.setMap(null);
			directionsDisplay.setMap(null);
			marker="";
			$scope.pathwaysArray = '';
		}

	
	function calcRoute() {
		var start = new google.maps.LatLng(myPlace.lat,myPlace.lng);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);
		
		travelDeskService.convertAddress(end,function(result){
			console.log(result);
			destinations= result;
			document.getElementById("destinationSelected").value="";
			document.getElementById("destinationSelected").value=result;
			$scope.trip_create.dest=result;
			})
			
		map.fitBounds(bounds);
		var request = {
			origin : start,
			destination : end,
			travelMode : google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setMap(map);
				directionsDisplay.setOptions({suppressMarkers:true});
			} else {
				alert("Directions not available for the selected location");
				$scope.undoMap();
				initMap();
			}
		});
	}
	function addMarker(location) {
	    // Add the marker at the clicked location, and add the next-available label
	    // from the array of alphabetical characters.    
		if(!marker || !marker.setPosition){
			marker = new google.maps.Marker({
				position:location,
				label: labeld,
				draggable:true,
				map:map
			});
			
			/*$scope.createTripForm.dest = getReverseGeocodingData(location);
			console.log($scope.createTripForm.dest);*/
			
		}
		else { 
			marker.setPosition(location);
		}
		marker.addListener('dragend', function(event){		  
			  end=event.latLng;
			  calcRoute();
		  });
		
		
	}	
	function computeTotalDistance(result) {
		var pointsArray = [];
		pointsArray = result.routes[0].overview_path;
		$scope.pathwaysArray = [];
		for(var n=0;n<pointsArray.length;n++){
			var patha = [];
			var a = pointsArray[n].lat();
			var b = pointsArray[n].lng();
			patha.push(a);
			patha.push(b);
			$scope.pathwaysArray.push(patha);
			
		}
		
	}
	
	$(document).on('click', '#startTimePicker', function(){
	$('#startTimePicker').datetimepicker({
		format: 'DD/MM/YYYY hh:mm a',
		defaultDate:'now',        
        minDate: 'now',        		
		ignoreReadonly:true,
    });	
	});			
	$(document).on('click', '#endTimePicker', function(){
		$('#endTimePicker').datetimepicker({
			format: 'DD/MM/YYYY hh:mm a',
			defaultDate:'now',	        
	        minDate: 'now',
			ignoreReadonly:true,
		});
	});
	$(document).on('click', '#startTimePickerU', function(){
		 $('#startTimePickerU').datetimepicker({
			 format: 'DD/MM/YYYY hh:mm a',
			 defaultDate:'now',
		     minDate: 'now',
			 ignoreReadonly:true,
	    });
	});
	$(document).on('click', '#endTimePickerU', function(){
		$('#endTimePickerU').datetimepicker({
			format: 'DD/MM/YYYY hh:mm a',
			defaultDate:'now',	       
	        minDate: 'now',	        		
			ignoreReadonly:true,
		 });
	});
	$scope.trip_create.customers = [{}];
	$scope.addNewCustomer = function() {
	  $scope.trip_create.customers.push({});
	  console.log($scope.trip_create.customers);
	  
	  if($scope.trip_create.customers.length == 4){
	  $scope.hide_btn = true;
	  }
	  if($scope.trip_create.customers.length > 1){
			$scope.hide_remove = true;
		}
	};  
	$scope.removeCustomer = function(val) {
	  console.log(val);	  
	  $scope.trip_create.customers.splice(val);
	  if($scope.trip_create.customers.length < 4){
	  $scope.hide_btn = false;
	  }
	  if($scope.trip_create.customers.length == 1){
			$scope.hide_remove = false;
		}
	};
	
	$scope.getTimeFormat = function(ts){
		return travelDeskService.showTime(ts);
	}
	
	
	$scope.reset = function(){
		document.getElementById("createTripf").reset();
		$scope.trip_create = {};
		$scope.createTripData ={};
		$scope.devlistObject = {};
		$("#pathWay").text("");
		$scope.createTripForm.$setPristine();
		$scope.createTripForm.$setUntouched();
		$scope.trip_create.customers=[{}];
		$scope.resetTimeValidation();
		
		  $("#startTimeid").val(travelDeskService.getDateTime(new Date().getTime()));
		  $("#endTimeid").val(travelDeskService.getDateTime(new Date().getTime()));
		
	}
	
	$(function(){
		var active = true;
		  $('#accordion').on('show.bs.collapse', function () {			 
		        if (active) $('#accordion .in').collapse('hide');
		    });
	});
	
	/*======================BASIC FUNCTION=========================*/
	
	/*===========================API FUNCTION========================*/
	
	$scope.tripList = function(){
		//console.log("entered the trip");
		$scope.listToken ={};
		$scope.listToken.token = $scope.token;
		travelDeskFactory.callApi("POST",apiURL+"trip/list",$scope.listToken,function(result){
			if(result.status == "trips not available"){
				swal({title:"No Trips Created Yet"});
			}
			else{
		      $scope.triplistObject= result.list;
		      $scope.httpLoading=false;
			}
		});
	}
	
	$scope.grouplist = function(){
		$scope.groupdata = {};
		$scope.groupdata.token = $scope.token;
		travelDeskFactory.callApi("POST",apiURL+"group/list",$scope.groupdata,function(result){
			$scope.grouplist = result.glist;
		})
		
	}
	
	$scope.fetchDevicelist=function(groupname){
		$scope.deviceId="";
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
		$scope.httpLoading=true;
		$scope.listDeviceJson={};
		$scope.listDeviceJson.token=$scope.token;
		$scope.listDeviceJson.gid=groupname;
		travelDeskFactory.callApi("POST",apiURL+"traveldesk/devices_with_driver",$scope.listDeviceJson,function(result){
		      //console.log(result);	
		      $scope.devlistObject=result;
		      $scope.httpLoading=false;
		});
	}
	$scope.resetTimeValidation=function(){
		$scope.StartTimeNotSelected=false;
		$scope.EndTimeNotSelected=false;
	}
	
	$scope.createTrip = function(){
		var flag=false;
		if($("#startTimeid").val()==""){
			$scope.StartTimeNotSelected=true;
			flag=false;
		}
		else{
			$scope.StartTimeNotSelected=false;
			flag=true;
		}
		if($("#endTimeid").val()==""){
			$scope.EndTimeNotSelected=true;
			flag=false;
		}
		else{
			$scope.EndTimeNotSelected=false;
			flag=true;
		}
		if(flag){
			if(travelDeskService.getTsOverTime($("#startTimeid").val())<travelDeskService.getTsOverTime($("#endTimeid").val())){
				$scope.createTripData ={};
				$scope.createTripData.token = $scope.token;
				console.log($scope.trip_create.devid);
				$scope.createTripData.devid= $scope.trip_create.devid;
				$scope.createTripData.start_point ={};
				$scope.createTripData.start_point.name= "Crowne Plaza Bengaluru";
				$scope.createTripData.start_point.lat= 12.850167;
				$scope.createTripData.start_point.long= 77.660329;
				$scope.createTripData.end_point ={};
				$scope.createTripData.end_point.name="Crowne Plaza Bengaluru" ;
				$scope.createTripData.end_point.lat= 12.850167;
				$scope.createTripData.end_point.long= 77.660329;
				$scope.createTripData.destination= destinations;
				$scope.createTripData.path_way = $scope.pathwaysArray;
				$scope.createTripData.apprx_start_time=travelDeskService.getTsOverTime($("#startTimeid").val());
				$scope.createTripData.apprx_end_time=travelDeskService.getTsOverTime($("#endTimeid").val());	
				$scope.createTripData.customers=$scope.trip_create.customers;
				/*console.log(JSON.stringify($scope.createTripData));*/
				
				
				travelDeskFactory.callApi("POST",apiURL+"trip/create",$scope.createTripData,function(result){
				      console.log(result);	
				      if(result.status == "success"){
				    	  
				    	  swal({title: "Trip Created Successfully",
				   			   text: "Success!",   
				   			   type: "success",   
				   			   confirmButtonColor: "#9afb29",   
				   			   closeOnConfirm: true }, 
				   			   function(){   
				   				$('#createTripModal').modal('hide');
				   			    $scope.trip_create.customers=[{}];
								$scope.tripList();
								$scope.reset();
				   		 });
				    	  
				      }
				      else if(result.msg == "Trip already exist for this vehicle and driver"){
				    	  swal({title:"Trip already exist for this vehicle and driver"});
				      }
				      else{}
				      $scope.httpLoading=false;
				});
			}
			else{
				swal({title:"Check end time and date"});
			}
		}
	}
	
	$scope.initTriplistMap = function(tripdetail){
		marker="";
		directionsService = new google.maps.DirectionsService();
		triplist_map = new google.maps.Map(document.getElementById('triplist_map'+tripdetail.trip_id), {
			zoom : 14,
			center : myPlace
		});
		directionsDisplay = new google.maps.DirectionsRenderer({
			draggable : false,
			map : triplist_map
		});
		var endArray=tripdetail.path_way.slice(-1)[0];
		var start = new google.maps.LatLng(myPlace.lat,myPlace.lng);
		var end=new google.maps.LatLng(endArray[0],endArray[1]);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);
		triplist_map.fitBounds(bounds);
		if(!marker || !marker.setPosition){
			marker = new google.maps.Marker({
				position:end,
				label: labeld,
				draggable:false,
				map:triplist_map
			});	
		}
		else { 
			marker.setPosition(end);
		}
		
		var request = {
				origin : start,
				destination : end,
				travelMode : google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					directionsDisplay.setMap(triplist_map);
					directionsDisplay.setOptions({suppressMarkers:true});
				} else {
					alert("Directions not available for the selected location");
					undoMap();
				}
			});		
			resizeTriplistMap(tripdetail.trip_id);	
	}
	function resizeTriplistMap(id) {
		   if(typeof triplist_map =="undefined") return;
		   var center = myPlace;
		   google.maps.event.trigger(triplist_map, "resize");
		   triplist_map.setCenter(center);
	};
	
	
	/*==========================API FUNCTION===============================*/
	

	/*===========================================>>>>>>> Madhavan Trip Update <<<<<<<======================================================*/
	$scope.updateTrip.Customers = [{}];
	$scope.addNewChoice = function() {
		$scope.updateTrip.Customers.push({});
	  if($scope.updateTrip.Customers.length == 4){
	  $scope.hide_btn = true;
	  }
	  if($scope.updateTrip.Customers.length > 1){
			$scope.hide_remove = true;
		}
	};  
	$scope.removeChoice = function(val) {
		console.log(val);	  
		$scope.updateTrip.Customers.splice(val);
	  if($scope.updateTrip.Customers.length < 4){
	  $scope.hide_btn = false;
	  }
	  if($scope.updateTrip.Customers.length == 1){
			$scope.hide_remove = false;
		}
	};
	$scope.fetchTripInfo=function(trip_id){
		$scope.tripInfoJson={};
		$scope.tripInfoJson.token=$scope.token;
		$scope.tripInfoJson.trip_id=trip_id;
		travelDeskFactory.callApi("POST",apiURL+"trip/detail",$scope.tripInfoJson,function(result){
			updateTripForm(result);
		});
	}
	$scope.initUpdateMap=function(){
		marker=""
		directionsService = new google.maps.DirectionsService();
		updateMap = new google.maps.Map(document.getElementById('updateMap'), {
			zoom : 14,
			center : myPlace
		});
		directionsDisplay = new google.maps.DirectionsRenderer({
			draggable : true,
			map : updateMap
		});
		
	   directionsDisplay.setMap(updateMap);
	   google.maps.event.addListener(updateMap, 'click', function(event) {
		   end=event.latLng;
		   updateMarker(event.latLng);
		   updateRoute(end);
	   });
	   directionsDisplay.addListener('directions_changed', function() {
			computeTotalDistance(directionsDisplay.getDirections());
		});	   
	}
	function updateMarker(location) {
	    // Add the marker at the clicked location, and add the next-available label
	    // from the array of alphabetical characters.    
		if(!marker || !marker.setPosition){
			marker = new google.maps.Marker({
				position:location,
				label: labeld,
				draggable:true,
				map:updateMap
			});
			
			/*$scope.createTripForm.dest = getReverseGeocodingData(location);
			console.log($scope.createTripForm.dest);*/
			
		}
		else { 
			marker.setPosition(location);
		}
		marker.addListener('dragend', function(event){		  
			  end=event.latLng;
			  updateRoute(end);
		  });
		
		
	}	
	function updateRoute(end) {
		var start = new google.maps.LatLng(myPlace.lat,myPlace.lng);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);
		
		travelDeskService.convertAddress(end,function(result){			
			destinations= result;
			document.getElementById("updateDestination").value="";
			document.getElementById("updateDestination").value=result;
			$scope.updateTrip.dest=result;
			})
			
		updateMap.fitBounds(bounds);
		var request = {
			origin : start,
			destination : end,
			travelMode : google.maps.TravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				directionsDisplay.setMap(updateMap);
				directionsDisplay.setOptions({suppressMarkers:true});
			} else {
				alert("Directions not available for the selected location");
				$scope.undoMap();
				initUpdateMap();
			}
		});
	}	
	
	function updateTripForm(result){
		$scope.updateTrip.trip_id=result.data.trip_id;
		$scope.updateTrip.stime=travelDeskService.getDateTime(result.data.apprx_start_time);
		$scope.updateTrip.etime=travelDeskService.getDateTime(result.data.apprx_end_time);
		//$scope.updateTrip.gname=result.data.gname;
		$scope.updateTrip.vno=result.data.devid;
		$scope.updateTrip.spoint=result.data.start_point.name
		$scope.updateTrip.epoint=result.data.end_point.name
		$scope.updateTrip.dest=result.data.destination;
		$scope.updateTrip.Customers=result.data.customers;
		var endArray=result.data.path_way.slice(-1)[0];
		var start = new google.maps.LatLng(myPlace.lat,myPlace.lng);
		var end=new google.maps.LatLng(endArray[0],endArray[1]);
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(start);
		bounds.extend(end);
		updateMap.fitBounds(bounds);
		updateMarker(end);
		var request = {
				origin : start,
				destination : end,
				travelMode : google.maps.TravelMode.DRIVING
			};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					directionsDisplay.setMap(updateMap);
					directionsDisplay.setOptions({suppressMarkers:true});
				} else {
					alert("Directions not available for the selected location");
					undoMap();
					initUpdateMap();
				}
			});
	}
	$scope.postUpdateTrip=function(){
		//$scope.updateTrip.stime=travelDeskService.getTsOverTime($scope.updateTrip.stime);
		//$scope.updateTrip.etime=travelDeskService.getTsOverTime($scope.updateTrip.etime);
		if(travelDeskService.getTsOverTime($("#updateStartTime").val())<travelDeskService.getTsOverTime($("#updateEndTime").val())){
			$scope.updateTripJson={};
			$scope.updateTripJson.token=$scope.token;
			$scope.updateTripJson.start_point={};
			$scope.updateTripJson.start_point.name= "Crowne Plaza Bengaluru";
			$scope.updateTripJson.start_point.lat= 12.850167;
			$scope.updateTripJson.start_point.long= 77.660329;
			$scope.updateTripJson.end_point={};
			$scope.updateTripJson.end_point.name= "Crowne Plaza Bengaluru";
			$scope.updateTripJson.end_point.lat= 12.850167;
			$scope.updateTripJson.end_point.long= 77.660329;
			$scope.updateTripJson.path_way=$scope.pathwaysArray;
			
			$scope.updateTripJson.apprx_start_time=travelDeskService.getTsOverTime($("#updateStartTime").val());		
			$scope.updateTripJson.apprx_end_time=travelDeskService.getTsOverTime($("#updateEndTime").val());
			$scope.updateTripJson.customers=$scope.updateTrip.Customers;
			$scope.updateTripJson.destination=$scope.updateTrip.dest;
			$scope.updateTripJson.trip_id=$scope.updateTrip.trip_id;
			//console.log(JSON.stringify($scope.updateTripJson));
			travelDeskFactory.callApi("POST",apiURL+"trip/update",$scope.updateTripJson,function(result){
			      console.log(result);	
			      if(result.status == "success"){
			    	  
			    	  swal({title: "Trip updated Successfully",
			   			   text: "Success!",   
			   			   type: "success",   
			   			   confirmButtonColor: "#9afb29",   
			   			   closeOnConfirm: true }, 
			   			   function(){   
			   				$('#updateTripModal').modal('hide');
			   			    $scope.trip_create.customers=[{}];
							$scope.tripList();
							$scope.reset();
			   		 });
			    	  
			      }
			      else if(result.msg == "Trip already exist for this vehicle and driver"){
			    	  swal({title:"Trip already exist for this vehicle and driver"});
			      }
			      else{}
			      $scope.httpLoading=false;
			});
		}
		else{
			swal({title:"Check end time and date"});
		}
		
	}
	$('#updateTripModal').on('shown.bs.modal', function() {		
		   resizeUpdateMap();
	});
	function resizeUpdateMap() {
		   if(typeof updateMap =="undefined") return;
		   var center = myPlace;
		   google.maps.event.trigger(updateMap, "resize");
		   updateMap.setCenter(center);  
	};

	$scope.cancelTrip = function(trip_id) {
		 swal({   title: "Are you sure?",   
	         	text: "You want to cancel this trip?",   
	         	type: "warning",   
	         	showCancelButton: true,   
	         	confirmButtonColor: "#DD6B55",   
	         	confirmButtonText: "Yes, cancel it!",   
	         	cancelButtonText: "No",   
	         	closeOnConfirm: false,   
	         	closeOnCancel: false }, 
	         	function(isConfirm){
	         		if (isConfirm) {
	         			$scope.cancelTripInfoJson ={};
	         			$scope.cancelTripInfoJson.token=$scope.token;
	         			$scope.cancelTripInfoJson.trip_id=trip_id;
	         			travelDeskFactory.callApi("POST",apiURL+"trip/cancel",$scope.cancelTripInfoJson,function(result){
	         				console.log(result);
	         				
	         				if(result.msg == "trip cancelled successfully"){
	         					swal({title: "Trip Cancelled Successfully",
	         			   			   text: "Success!",   
	         			   			   type: "success",   
	         			   			   confirmButtonColor: "#9afb29",   
	         			   			   closeOnConfirm: true }, 
	         			   			   function(){
	         			   			   $scope.tripList();	
	         			   		 });
	         				}
	         			});
	         		}
	         		else{
	         			swal("Cancelled", "You have cancelled :)", "error");
        			}
	         	})
		
	}
	
		/*===========================================>>>>>>> End Madhavan Trip Update  <<<<<<<=================================================*/	
	
	
});


