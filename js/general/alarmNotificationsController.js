batsGeneralHome.controller('AlarmNotificationsController', function($scope, $http, $localStorage, $interval) {
	
	var requestTime = 60;
	$scope.token = $localStorage.data;
	var token = $scope.token;
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
	callAlarmNotification();
	var callAlarmApi = $interval(callAlarmNotification ,requestTime * 1000);

/**
	* Call Alarm notification frequently for particular time interval
	* Store in local storage upto five notifications
*/	
	function callAlarmNotification() {
		$scope.token = {token};
		//console.log(JSON.stringify($scope.token));
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'device/alarmnotifications',
			  data    : JSON.stringify($scope.token), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  console.log(JSON.stringify(data));
				  if($localStorage.notification == undefined){
					  //alert("1");
					  $scope.noNotification = true;
					  $scope.showNotification = false;
					  $scope.viewMoreNotify = false;
				  }
				  if($localStorage.notification != undefined && data.length == undefined){
					  //alert("2");
					  $scope.noNotification = false;
					  $scope.showNotification = true;
					  $scope.viewMoreNotify = true;
					  var oldNotifications = $localStorage.notification;
					  $localStorage.notification = [];
					  for(i=0; i<oldNotifications.length; i++){
						  if($localStorage.notification.length <= 4){
						  $localStorage.notification.push(oldNotifications[i]);
						  }
					  }
					  $scope.notifyLength = $localStorage.newNotifyLength;
					  $scope.notification = $localStorage.notification;
					  //console.log(JSON.stringify($scope.notification));
					  showNotifications($scope.notification);
				  }
				  else if(($localStorage.notification != undefined && data.length != undefined) || ($localStorage.notification == undefined && data.length != undefined)){
					  //alert("3");
					  $scope.noNotification = false;
					  $scope.showNotification = true;
					  $scope.viewMoreNotify = true;
					  var oldNotifications = $localStorage.notification;
					  //console.log(JSON.stringify(oldNotifications));
					  $localStorage.notification = [];
					  for(i=0; i<data.length; i++){
						  if($localStorage.notification.length <= 4){
						  $localStorage.notification.push(data[i]);
						  }
					  }
					  if(oldNotifications != undefined){
					  for(i=0; i<oldNotifications.length; i++){
						  if($localStorage.notification.length <= 4){
						  $localStorage.notification.push(oldNotifications[i]);
						  }
					  }
					  }
					  if($localStorage.newNotifyLength == undefined){
						  //alert("undefined localstorage");
						  //console.log(JSON.stringify(data.length));
						  $localStorage.newNotifyLength = data.length;
						  $scope.notifyLength = $localStorage.newNotifyLength;
					  }
					  else{
						  //alert("defined localstorage");
						  //console.log(JSON.stringify($localStorage.newNotifyLength));
						  //console.log(JSON.stringify(data.length));
						  $localStorage.newNotifyLength = $localStorage.newNotifyLength + data.length;
						  //console.log(JSON.stringify($localStorage.newNotifyLength));
						  $scope.notifyLength = $localStorage.newNotifyLength;
					  }
					  $scope.notification = $localStorage.notification;
					  showNotifications($scope.notification);
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  console.log(data);
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });

    };

    
function showNotifications(notifications){
	var resultStatus = [];
	for(i=0;i<notifications.length;i++){
		  executeStatus(notifications[i].devid,notifications[i].ts,notifications[i].alarm_type,notifications[i].lat,notifications[i].long,notifications[i].Velocity, function(statusExecuted){
		  resultStatus.push(statusExecuted); 
		  });
	  }    
	  //console.log(JSON.stringify(resultStatus));
	  $scope.notifyStatus = resultStatus;
}

function executeStatus(devid,ts,alarm,lat,long,velocity, alarmStatusNotify){
	var finalStatus={};
	  finalStatus.devid = devid;
	  finalStatus.ts = ts;
	  finalStatus.alarm_type = alarm;
	  finalStatus.lat = lat;
	  finalStatus.long = long;
	  finalStatus.Velocity = velocity;
	  var statusOne;
	  var statusTwo;
	  switch (Number(alarm)) {
	      case 0:
	    	statusOne = "P";
	    	statusTwo = "Panic Alarm";
	        break;
	      case 1:
	    	statusOne = "T";
	    	statusTwo = "Tamper Sim Alarm";
	        break;
	      case 2:
	    	statusOne = "T";
	      	statusTwo = "Tamper Top Alarm";
	        break;
	      case 3:
	    	statusOne = "B";
	    	statusTwo = "Battery Alarm";
	          break;
	      case 4:
	    	statusOne = "O";
	    	statusTwo = "Overspeed Alarm";
	          break;
	      case 5:
	    	statusOne = "G";
	    	statusTwo = "Geofence Alarm";
	          break;
	      case  6:
	    	statusOne = "S";
	    	statusTwo = "Sanity Alarm";
	  }
	  finalStatus.alarm_type_One = statusOne;
	  finalStatus.alarm_type_Two = statusTwo;
	  alarmStatusNotify(finalStatus);
}
    
$scope.hideNotifyCount = function(){
	$scope.notifyLength = "";
	delete $localStorage.newNotifyLength;
}

$scope.showNotifyModal = function(getNotify){
	$scope.notifyModalValues = getNotify;
	//timestampToDate(getNotify.ts);
	latlongToAddress(getNotify.lat,getNotify.long);
	//alarmStatus(getNotify.alarm_type);
}

/*function timestampToDate(ts){
	console.log(ts);
	var timeStamp_value = new Date(ts);
	var dateString = timeStamp_value.toLocaleDateString();
	var timeString = timeStamp_value.toLocaleTimeString();
	console.log(dateString +","+ timeString);
	var formattedDate = dateString +", "+ timeString;
	$scope.timeStamp = formattedDate;
} */

function latlongToAddress(lt,lg){
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
	               //console.log(responses[0].formatted_address); 
	               $scope.address = responses[0].formatted_address;
	           } 
	           else 
	           {       
	        	   //console.log("No Address Found. Check the Lat Long Values " + lt + ', ' + lg);  
	        	   $scope.address = "No Address Found. Check the Lat Long Values " + lt + ', ' + lg;
	           }   
	        }
	);
}


/*function alarmStatus(alarmType){
var status;
switch (Number(alarmType)) {
    case 0:
    	status = "Panic Alarm";
        break;
    case 1:
    	status = "Temper Sim Alarm";
        break;
    case 2:
    	status = "Temper Top Alarm";
        break;
    case 3:
    	status = "Battery Alarm";
        break;
    case 4:
    	status = "Overspeed Alarm";
        break;
    case 5:
    	status = "Geofence Alarm";
        break;
    case  6:
    	status = "Sanity Alarm";
}
$scope.notifyAlarmStatus = status;
}*/


	
});