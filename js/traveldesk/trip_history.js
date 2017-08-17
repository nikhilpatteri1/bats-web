/**
 * Module Name: Trip History
 * Module Purpose:User can view the trip history data based on two choices
 * 		a) Vehicle based history
 *  	b) Driver based history
 *  
 * There are following basic method on controller load 
 *  	a) verify token
 *  	b) keep readio default selected (driver based) - basedOn
 *  	c) intialize map - initMap
 *  	d) based on user choice change filter view - granChoice
 * 		e) getTimeStamp for the selected date and passed hr,mins,sec
 * 	Jquery functions:
 * 
 *  	a) open filter on click of '+' symbol
 *  	b) to opem date picker inside the filters on click of calendar input group
 *  	c) showhistory data in a modal on click of arrow up
 *  
 * API calls and functions inside controller
 * 		a) /driver/list
 * 		b) /group/list
 * 		c) /traveldesk/getgroupdevices
 * 		d) /trip/history
 *  
 * This module uses following services
 * 		a) localStorage in built serivice
 * 		b) travelDeskFactory (custom factory) for Rest API calls($http method)  
 * */
batstravelDeskHome.controller('tripHistory', function($rootScope,$scope, $localStorage,travelDeskFactory,travelDeskService,$interval) {
	$rootScope.menuPos = 2;
	$scope.token = $localStorage.data;//for token
	$scope.driverBased=true;//on choice of driver based history
	$scope.vehicleBased=false;//on choice of vehicle based history
	$scope.trip={};
	$scope.todayDate=new Date();
	$scope.startBouncing=false;
	$scope.showTripDropDown=false;
	$scope.showUpBtn=false;
	$('.md-datepicker-input').prop('readonly', true);
	var map;
	var historypolyline = null;
	var pageRefresh;
	/*====================================================>>>>>> Start of Basic function <<<<<=================================================*/
	
	/*
	 *  check for token availability
	 * */
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
	
	/*
	 * Object to select radio by default
	 * */
	$scope.basedOn={
			Item:0	
	};
	
	
	$scope.setDate = function(){
		$scope.trip.timeStamp = null;
		$scope.showTripDropDown=false;
		$scope.trip.timeStamp=null;
	}
	
	/*
	 * intialize map function 
	 * */
	$scope.initMap=function(){
		map = new google.maps.Map(document.getElementById('history_map'), {
			center: {lat: 20.5937, lng: 78.9629},
			zoom: 4
		});
		
		google.maps.event.addListener(map, 'zoom_changed', function() {
			var oldZoom = map.getZoom();
		});
	}
	/**
	 * Based on the radio selection change the view
	 * 	driver based history view
	 *  vehicel based history view
	 * */
	$scope.granChoice=function(basedOn){
		if(basedOn.Item=="0"){
			$scope.driverBased=true;
			$scope.vehicleBased=false;
			$scope.trip.history_type="D";
		}else if(basedOn.Item=="1"){
			$scope.driverBased=false;
			$scope.vehicleBased=true;
			$scope.trip.history_type="V";
		}
	}
	
	
	
	$scope.tab = 1;

	$scope.setTab = function(newTab){
		/*google.maps.event.trigger(map, 'resize');*///$scope.tripDetails="";
		clearField();
		$scope.tab = newTab;
	};

	$scope.isSet = function(tabNum){
		return $scope.tab === tabNum;
	};

	/**
	   * Show DateTimePicker onclick in jquery 
	 */	
	$(document).on('click', '#tripHistoryDatePicker', function(){
		$('#tripHistoryDatePicker').datetimepicker({
			inline: true,
			sideBySide: true,
			ignoreReadonly: true,
			allowInputToggle: true,
			showClose : true,
			maxDate: 'now',
			format: 'DD/MM/YYYY'
		}).on("dp.change",function (e) {
			$('#selectTripSection span.select2-chosen').empty();
			$('#selectTripSection span.select2-chosen').text("- - Select Device - -");
		});
	});
	/**
	 * 	Show History modal
	 * */	
	$('#showHistoryData').click(function() {
		$('#historyModal')
			.prop('class', 'modal fade') // revert to default
			.addClass( $(this).data('direction') );
		$('#historyModal').modal('show');
	});

	$scope.stopBouncing=function(){
		$scope.startBouncing=false;
	}
	/**
	 * 	returns timestamp for the date selected
	 *  and the params given
	 * */	
	function getTimestamp(hr,mins,sec){		
		var d=new Date($scope.trip.timeStamp);
		d.setHours(hr);
		d.setMinutes(mins);
		d.setSeconds(sec);
		return d.getTime();
	}
	/**
	 * Select Group/Device dropdown based on jquery
	 */
	$(document).ready(function(){
		$.getScript('../assets/select_filter/select2.min.js',function(){
			$("#selectTrip").select2({});
			$('#selectTripSection span.select2-chosen').text(" Select Trip");
			$("#selectTrip1").select2({});
			$('#selectTripSection1 span.select2-chosen').text(" Select Trip");
			$("#selectDriver").select2({});
			$('#selectDriverSection span.select2-chosen').text("Select Driver ");
			$("#selectGroup").select2({});
			$('#selectGroupSection span.select2-chosen').text("Select Group ");
			$("#selectVehicle").select2({});
			$('#selectVehicleSection span.select2-chosen').text("Select Vehicle ");
		});
	});
		
	/**
	 * getTime from service 
	 * 
	 * */	
	$scope.getTimeFormat=function(ts){
		return travelDeskService.showTime(ts);
	}
		
	function clearField(){
		$scope.showTripDropDown=false;
		$scope.trip.timeStamp=null;
		$scope.showUpBtn=false;
		map = new google.maps.Map(document.getElementById('history_map'), {
			center: {lat: 20.5937, lng: 78.9629},
			zoom: 4
		});
	}
		
		
	/*====================================================>>>>>> End of Basic function <<<<<=================================================*/
	/*====================================================>>>>>> Start of API function <<<<<=================================================*/
	/**
	 * API for listing drivers
	 * */
	$scope.listDriversJson={};
	$scope.listDriversJson.token=$scope.token;	
	$scope.listDriversJson.type="0"//to get all drivers created by admin
	travelDeskFactory.callApi("POST",apiURL+"driver/list",$scope.listDriversJson,function(result){
		$scope.showTripDropDown=false;
		$scope.driverList=result;  
	});
		
	/**
	 * API for group listing
	 * */
	$scope.listGroupJson={};
	$scope.listGroupJson.token=$scope.token;	
	travelDeskFactory.callApi("POST",apiURL+"group/list",$scope.listGroupJson,function(result){
		$scope.showTripDropDown=false;
		$scope.groupList=result.glist;
	});	
	
	/** list devices*/
	$scope.fetchDevicelist=function(groupDetail){
		$scope.httpLoading=true;
		$scope.showTripDropDown=false;
		//$scope.trip.vehicle_num = "";
		$scope.listDeviceJson={};
		$scope.listDeviceJson.token=$scope.token;
		$scope.listDeviceJson.gid=groupDetail.gid;
		travelDeskFactory.callApi("POST",apiURL+"traveldesk/getgroupdevices",$scope.listDeviceJson,function(result){
			$scope.devlistObject=result;
			$scope.httpLoading=false;
		});
	}
	
	/** fetch history*/
	$scope.fetchHistory=function(searchtype){

		$('#selectTripSection span.select2-chosen').empty();
		$('#selectTripSection span.select2-chosen').text("- - Select Trip - -");

		$('#selectTripSection1 span.select2-chosen').empty();
		$('#selectTripSection1 span.select2-chosen').text("- - Select Trip - -");

		//historypolyline.setMap(null);
		if(historypolyline!=null){
			historypolyline.setMap(null); 
			historypolyline=null;
		}
		$scope.httpLoading=true;
		
		$scope.getHistoryJson={};
		$scope.getHistoryJson.token=$scope.token;
		if(searchtype=="0"){
			$scope.getHistoryJson.driver_id=$scope.trip.driver_id.driver_id;
			$scope.getHistoryJson.vehicle_num=""
			$scope.getHistoryJson.history_type="D"
		}else if(searchtype=="1"){
			$scope.getHistoryJson.driver_id="";
			$scope.getHistoryJson.vehicle_num=$scope.trip.vehicle_num.vehicle_num;
			$scope.getHistoryJson.history_type="V"
		}
		$scope.getHistoryJson.sts=getTimestamp(0,0,0);
		$scope.getHistoryJson.ets=getTimestamp(23,59,59);
		travelDeskFactory.callApi("POST",apiURL+"trip/history",$scope.getHistoryJson,function(result){
			if(result.msg=="history data not found"){
				swal("No History Available");
				map = new google.maps.Map(document.getElementById('history_map'), {
					center: {lat: 20.5937, lng: 78.9629},
					zoom: 4
				});
				//	map.clear();
				$scope.showTripDropDown=false;
				$interval.cancel(pageRefresh);
			}else{
				$scope.tripDetails=result.data;
				$scope.driverStartTime = result.data;
				$scope.showTripDropDown=true;
				//$('.filterChoice, #openFilter').toggleClass('active');
			}
			$scope.httpLoading=false;
		});
	}

	/**
	 * 	Display the trip history data
	 * 	on selection of trip
	 * */
	$scope.getStatus= function(tripDataStatus){
		return travelDeskService.showStatus(tripDataStatus); 
	}
	
	$scope.$watch('tripName', function(newvalue,oldvalue) {
		if (oldvalue == newvalue) return;
	});


		
	$scope.showHistoryData = function(tripDetail){
		if(historypolyline!=null){
			historypolyline.setMap(null);
			historypolyline=null;
		}
		
		$scope.driver_hist;
		$scope.replayData ={};
		$scope.replayData.token = $scope.token;
		$scope.replayData.devid = tripDetail.devid;
			
		if(tripDetail.status === "C"){
			swal("Trip cancelled");
			$scope.replayData.sts = 0;
			$scope.replayData.ets = 0;
		}else if(tripDetail.status === "R" || tripDetail.status === "D"){
			swal("Trip running");
			$scope.replayData.sts = tripDetail.drv_start_point.ts;
			//$scope.replayData.ets = tripDetail.drv_end_point.ts;
			var d = new Date();
			var n = d.getTime();
			$scope.replayData.ets = n;
				
		}else if(tripDetail.status === "S"){
			swal("Trip Scheduled");
			$scope.replayData.sts = 0;
			$scope.replayData.ets = 0;
		}else{
			$scope.replayData.sts = tripDetail.drv_start_point.ts;
			$scope.replayData.ets = tripDetail.drv_end_point.ts;
		}

		$scope.showUpBtn=true;
		$scope.startBouncing=true;
		$scope.tripData=tripDetail;

		travelDeskFactory.callApi("POST",apiURL+"device/history",$scope.replayData,function(result){
			$scope.driver_hist = result.values;
			var polyPathArray=[];
			//var arr=$scope.tripData.path_way;
			var arr=$scope.driver_hist;
			if(arr.length == 0){
				swal('Vehicle in stationary');
			}else{
				for(var inc=0;inc<arr.length;inc++){
					var pathValues={};  
					//pathValues.lat=arr[inc][0];
					//pathValues.lng=arr[inc][1]; 

					pathValues.lat=Number(arr[inc].lat);
					pathValues.lng=Number(arr[inc].long);
					polyPathArray.push(pathValues);
				}
				var poly_len = polyPathArray.length;
				var iconsettings = {
					path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
			    };
			    var polylineoptns = {
					path: polyPathArray,
					strokeOpacity: 0.8,
					strokeWeight: 3,
					map: map,
					icons: [{
						icon: iconsettings,
						repeat:'35px',
						offset: '100%'}]
				};

				historypolyline = new google.maps.Polyline(polylineoptns);

			    var bounds = new google.maps.LatLngBounds();
			    for(var j=0;j<poly_len;j++){
			    	 var latlng = new google.maps.LatLng(polyPathArray[j].lat,polyPathArray[j].lng);
			    	 bounds.extend(latlng);
			    }
			    map.fitBounds(bounds);
			}		      
		});
	}
	/*====================================================>>>>>> End of API function <<<<<=================================================*/
		
}); 