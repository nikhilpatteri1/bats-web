/**
* fetch Group list on page load based on token
*/
batsGeneralHome.controller('GeneralLatestLocationCtrl', function($rootScope,$scope, $http, $localStorage, NgMap){
	$rootScope.menuPos=3;
	/*var dynamicMapHeight=window.screen.availHeight-100;
	$scope.mapHeight={
			height:dynamicMapHeight
	}*/
	var token = $localStorage.data;
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
	
	$scope.availableDeveice = false;

	$scope.glists = function(){
	$scope.customer={};
	$scope.customer.token=token;
	$scope.httpLoading=true;
	//console.log(JSON.stringify($scope.customer));
	$http({
		method    : 'POST',
		url       : apiURL+'group/list',
		data      : JSON.stringify($scope.customer),
		headers   : {'Content-Type' : 'application/json'}
	})
	.success(function(data){
		//console.log(JSON.stringify(data));
		$scope.groupList = data.glist;
		$scope.httpLoading=false;
	})
	.error(function(data,status,headers,config){
		  if(data.err == "Expired Session")
		  {
		      expiredSession();
		      $localStorage.$reset();
		  }
	  	  else if(data.err == "Invalid User"){
	  		  invalidUser();
				  $localStorage.$reset();  
	  	  }
//		console.log(status);
//		console.log(headers);
//		console.log(config);
	})
	}
	

	/**
	* fetch device list based on group id
	* 1)Check in SQLite DB whether the device is Live (OR) Not Plot the map with devices
	* 2)If Device is Live fill the select device dropdown and plot the map with device
	* 3)If Device is Not Live, dont fill the devid in select device dropdown and hide the device in the map
*/
					$scope.fetchDevicelist = function(groupID) {
						$scope.httpLoading=true;
						closeLastOpenedInfoWindow();
						$scope.groupdevicejson = {};
						$scope.groupdevicejson.token = token;
						$scope.groupdevicejson.gid = groupID;
						//console.log(JSON.stringify($scope.groupdevicejson));
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
							var deviceList = data.devlist;
							$scope.availableDeveice = true;
							//console.log(JSON.stringify(deviceList)); 
							if(deviceList.length == 0){
								alert("No active devices available");
								$scope.position = [{"lat":"21.0000","long":"78.0000","zoom":22}];
								$scope.marker = {};
							}
							else{
								//var chk = data.devlist;
								//console.log(JSON.stringify(chk));
								var resultDevices =[];
								var devlist = data.devlist;
								for(i=0;i<devlist.length;i++){
									if(devlist[i].devtype == ""){
										var device_list = {"devid":devlist[i].devid,"vehicle_num":devlist[i].vehicle_num,"lat":devlist[i].lat,"long":devlist[i].long,"devtype":"marker"};	
									}
									else{
										var device_list = {"devid":devlist[i].devid,"vehicle_num":devlist[i].vehicle_num,"lat":devlist[i].lat,"long":devlist[i].long,"devtype":devlist[i].devtype};
										resultDevices.push(device_list);
									}
									
								} 
								$scope.marker = resultDevices;
								//console.log(JSON.stringify(resultDevices));
								var bounds = new google.maps.LatLngBounds();
								for(let i in $scope.marker){
								    var latLng = new google.maps.LatLng($scope.marker[i].lat,$scope.marker[i].long);
								    bounds.extend(latLng);
								}
								 $scope.map.fitBounds(bounds);
								  $scope.httpLoading=false;
							}
						}).error(function(data, status, headers, config) {
							console.log(data.err);
							  if(data.err == "Expired Session")
							  {
							      expiredSession();
							      $localStorage.$reset();
							  }
						  	  else if(data.err == "Invalid User"){
						  		  invalidUser();
									  $localStorage.$reset();  
						  	  }
							console.log(status);
							console.log(headers);
							console.log(config);
						}).finally(function(){		
							$scope.httpLoading=false;
						});
						/**
						 * get geofence based on group ID
						 */
						$http({
							method : 'POST',
							url : apiURL + 'group/info',
							data : JSON.stringify($scope.groupdevicejson),
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function(data) {
							var geofence = data.geofence;
							var Geofence = [];
							for(var key in geofence){
								if(geofence.hasOwnProperty(key)){
									Geofence.push([
										geofence[key].lat,
										geofence[key].long
									]);
								}
							}
							var resultGeofence = [];
							resultGeofence.push(Geofence);
							$scope.geofence = resultGeofence;
							//console.log(JSON.stringify($scope.geofence));
						}).error(function(data, status, headers, config) {
							console.log(data.err);
							  if(data.err == "Expired Session")
							  {
							      expiredSession();
							      $localStorage.$reset();
							  }
						  	  else if(data.err == "Invalid User"){
						  		  invalidUser();
									  $localStorage.$reset();  
						  	  }
						});

					};	

					
/**
/**
	* Shows device Id info window onclick of device in map
*/
$scope.$on('mapInitialized', function (event, map) {
	$scope.map = map;
	var bounds = new google.maps.LatLngBounds();
	var latLng = new google.maps.LatLng("21.0000","78.0000");
	bounds.extend(latLng);
	$scope.map.fitBounds(bounds);
	$scope.map.setZoom(4);
});
var lastOpenedInfoWindow;
$scope.showDeviceInfo=function(event,device){
var geocoder = new google.maps.Geocoder();
var latlng = new google.maps.LatLng(device.lat, device.long);
var request = {
	latLng: latlng
};
geocoder.geocode(request, function(data, status) {
	if (status == google.maps.GeocoderStatus.OK) {
		if (data[0] != null) {
			var content = "<label>Vehicle Number :</label>" + device.vehicle_num + "<br> <label>Address :</label> <p>" + data[0].formatted_address + "</p><br>";
		infowindow.setContent(content);
		} else {
		var content = "<b>Vehicle Number :</b> " + device.vehicle_num + "<br> <b>Address :</b> No address available";
		infowindow.setContent(content);
		}
	}
	else{
		var content = "<b>Vehicle Number :</b> " + device.vehicle_num + "<br> <b>Address :</b> No address available";
		infowindow.setContent(content);
	}
});
						      
closeLastOpenedInfoWindow();
//console.log(JSON.stringify(device));
var infowindow = new google.maps.InfoWindow();
var center = new google.maps.LatLng(device.lat,device.long);
infowindow.setPosition(center);
infowindow.open($scope.map);
lastOpenedInfoWindow = infowindow;
};
function closeLastOpenedInfoWindow() {
if (lastOpenedInfoWindow) {
    lastOpenedInfoWindow.close();
}
}	


/**
 * On URL change clear map infowindow
* */
	$scope.$on('$locationChangeStart', function(){
		closeLastOpenedInfoWindow();
	});

	
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