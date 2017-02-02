batsGeneralHome.controller('vehicleAlarm',function($rootScope,$scope, $http, $localStorage){
	$rootScope.menuPos=2;
	var contentHeight=window.screen.availHeight-200;
	$scope.histcontentheight={
			"height":contentHeight
	}
	$scope.redColor={
			"color":"#ff0000"
	}
	$scope.token = $localStorage.data;
	var todayDate = new Date();
	$scope.deviceSelectAlarm = false;
	$scope.myDate = {"start":todayDate,"end":todayDate};
	$scope.showResultTable = false;
	$scope.noResultTable = false;
	$scope.todayDate=new Date();
	var startTimeStamp;
	var endTimeStamp;
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
	* fetch Group list based on token
	* fetch device list based on group list
*/	
	
	$scope.customer = {};
	$scope.customer.token = $scope.token;
	//console.log(JSON.stringify($scope.customer));
	$http({
	  method  : 'POST',		  
	  url     :apiURL+'group/list',
	  data    : JSON.stringify($scope.customer), 
	  headers : { 'Content-Type': 'application/json' }
	 })
	  .success(function(data) {
	  $scope.groupList = data.glist;
	  //console.log(JSON.stringify($scope.groupList));
	  })
	  .error(function(data, status, headers, config) {
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
	  });
	
	$scope.fetchDevList = function(groupID) {
	$scope.httpLoading=true;
	$('#clearTextDevice span.select2-chosen').empty();  
	$('#clearTextDevice span.select2-chosen').text("Select  Vehicle No/Device"); 
	$scope.deviceSelectAlarm=false;
	$scope.showResultTable = false;
	$scope.noResultTable = false;
	$scope.deviceJson = {};
	$scope.deviceJson.token = $scope.token;
	$scope.deviceJson.gid = groupID;
	//console.log(JSON.stringify($scope.deviceJson));
	$http({
	method : 'POST',
	url : apiURL + 'group/devlist',
	data : JSON.stringify($scope.deviceJson),
	headers : {
	'Content-Type' : 'application/json'
	}
	}).success(function(data) {
	$scope.httpLoading=false;
	$scope.devList = data.devlist;
	//console.log(JSON.stringify($scope.devList));
	})
	.error(function(data, status, headers, config) {
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
	};	

	
/**
	* Show datepicker & Submit button after device select
*/
	$scope.deviceSelectedAlarm=function(deviceId){
	$scope.deviceSelectAlarm=true;
	$scope.showResultTable = false;
	$scope.noResultTable = false;
	$('.md-datepicker-input').prop('readonly', true);
	};	
	

	/**
	  * Onsubmit of Min/Max Speed from values 
	*/
	$scope.submitAlarm = function() {
		$scope.httpLoading=true;
		console.log($scope.myDate.start);
		getSTS($scope.myDate.start);
		getETS($scope.myDate.end);
		                    $scope.devIdJson = {};
							$scope.devIdJson.token = $scope.token;
							$scope.devIdJson.devid = $scope.deviceId;
							$scope.devIdJson.sts = startTimeStamp;
							$scope.devIdJson.ets = endTimeStamp;
							console.log(JSON.stringify($scope.devIdJson));
							$http({
								method : 'POST',
								url : apiURL + 'device/alarmhistory',
								data : JSON.stringify($scope.devIdJson),
								headers : {
									'Content-Type' : 'application/json'
								}
							}).success(function(data) {
								var data_value = data.values;
								console.log(JSON.stringify(data));
								if(data_value.length == 0){
									$scope.showResultTable = false;
									$scope.noResultTable = true;
									$scope.httpLoading=false;
								}
								else{
									$scope.httpLoading=false;
									$scope.noResultTable = false;
									$scope.showResultTable = true;
									$scope.alarm_history = data_value;
								}
							})
							 .error(function(data, status, headers, config) {
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
							  	  else if(data.err == "start time stamp is greater than end time stamp."){
							  		swal({ 
										   title: "Start time is greater than end time",
									  	   text: "Change the start date and try!",   
									  	   closeOnConfirm: true }, 
									  	   function(){   
									  }); 
							  	  }
								console.log(status);
								console.log(headers);
								console.log(config);
							 }).finally(function(){		
									$scope.httpLoading=false;
								});
	};	
	

function getSTS(){		
	var d=new Date($scope.myDate.start);
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0);
	startTimeStamp = d.getTime();
}	
function getETS(){		
	var d=new Date($scope.myDate.end);
	d.setHours(23);
	d.setMinutes(59);
	d.setSeconds(59);
	endTimeStamp = d.getTime();
}	


/**
 * get Date formatted date based on TIMESTAMP
 -----------------------------------------------------------------------*/
$scope.getDate = function(ts) {
	var d = new Date(Number(ts));
	// console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
	var monthVal = d.getMonth() + 1;
	var hours = d.getHours();
	  var minutes = d.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  hours= hours<10?'0'+hours:hours;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime+" | "+d.getDate() + "/" + monthVal + "/"+ d.getFullYear();
};

/**
 * get address based on lat,long
 -----------------------------------------------------------------------*/
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