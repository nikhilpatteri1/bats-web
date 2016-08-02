var startTimeStampKm;
var endTimeStampKm;

batsGeneralHome.controller("GeneralMaxKmCtrl",function($http,$scope,$filter,$localStorage,$timeout){
	
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
	
	$scope.token = token;
	$scope.deviceSelectMaxKm = true;
	$scope.showResultMaxKm = true;
	$scope.sel_group_device = false;
	var startDateMaxKmError = document.getElementById('startDateMaxKmError');
	var endDateMaxKmError = document.getElementById('endDateMaxKmError');
	
/**
	* fetch Group list based on token
	* fetch device list based on group list
*/	
	//$scope.hist = {"searchGroupModel":""};
	//$scope.hist.searchDeviceModel = "";
	
	$scope.customer = {};
	$scope.customer.token = token;
	//console.log(JSON.stringify($scope.customer));
	$http({
	  method  : 'POST',		  
	  url     :apiURL+'group/list',
	  data    : JSON.stringify($scope.customer), 
	  headers : { 'Content-Type': 'application/json' }
	 })
	  .success(function(data) {
	  $scope.groupList = data.glist;
	  console.log(JSON.stringify($scope.groupList));
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
		$scope.httpLoading=true
	$('#clearTextDevice span.select2-chosen').empty();  
	$('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
	$scope.sel_group_device = false;
	//$scope.hist.searchDeviceModel = "";
	$scope.deviceSelectMaxKm=true;
	$scope.showResultMaxKm = false;
	$scope.deviceJson = {};
	$scope.deviceJson.token = token;
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
$scope.deviceSelectedMaxKm=function(deviceId){
deviceGlobal = deviceId;
$scope.sel_group_device = true;
$scope.deviceSelectMaxKm=false;
$scope.showResultMaxKm = false;
startDateMaxKmError.style.display = 'none';
endDateMaxKmError.style.display = 'none';
document.getElementById('startDateMaxKm').value = "";
document.getElementById('endDateMaxKm').value = "";
};


/**
  * Onsubmit of Max KM Covered from values 
*/
$scope.submitMaxKm = function(){
	//alert("Yes");
	var startDateMaxKm = document.getElementById('startDateMaxKm').value;
	var endDateMaxKm = document.getElementById('endDateMaxKm').value;
if(startDateMaxKm == "" && endDateMaxKm == ""){
	startDateMaxKmError.style.display = 'block';
	endDateMaxKmError.style.display = 'block';
}
else if(startDateMaxKm == ""){
	startDateMaxKmError.style.display = 'block';
}
else if(endDateMaxKm == ""){
	endDateMaxKmError.style.display = 'block';
}
else {
	$scope.httpLoading=true;
	startDate(startDateMaxKm);
	endDate(endDateMaxKm);
	                    $scope.devIdJson = {};
						$scope.devIdJson.token = token;
						$scope.devIdJson.devlist = [$scope.deviceId];
						$scope.devIdJson.sts = startTimeStampKm;
						$scope.devIdJson.ets = endTimeStampKm;
						//$scope.devIdJson.sts = "1456893473000";
						//$scope.devIdJson.ets = "1456893584000";
						console.log(JSON.stringify($scope.devIdJson));
						$http({
							method : 'POST',
							url : apiURL + 'app/distance_km_covered',
							data : JSON.stringify($scope.devIdJson),
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function(data) {
							$scope.showResultMaxKm = true;
							var deviceList = data;
							console.log(JSON.stringify(deviceList));
							var resultDevlist = [];
							for(i=0;i<deviceList.length;i++){
								var deviceID = deviceList[i].devid;
								var distance_tofix = deviceList[i].distance;
								var distance = distance_tofix.toFixed(2);
								var finalDevStatus ={"devid":deviceID,"distance":distance};
								resultDevlist.push(finalDevStatus);
								$scope.MaxKmResult = resultDevlist;
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
						  	  else if(data.err == "start time is greater than end time"){
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
}
};


function startDate(getStartDateMinMax){
	var datetimeVal=getStartDateMinMax;
	var strArra=datetimeVal.split(" ");
	var dateVal=strArra[0];
	var dateArray=dateVal.split("/");
	var timeStr=strArra[1];
	var tsArr=timeStr.split(":");
	var newStDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
	//console.log(newStDate);
	var sts=new Date(newStDate);
	//console.log(sts);
	sts.setDate(dateArray[0]);
	sts.setMonth(dateArray[1]-1);
	sts.setHours(tsArr[0]);
	sts.setMinutes(tsArr[1]);
	//console.log(sts);
	startTimeStampKm = sts.getTime();
	//console.log(startTimeStampKm);
}
function endDate(getEndDateMinMax){
	var datetimeVal=getEndDateMinMax;
	var strArra=datetimeVal.split(" ");
	var dateVal=strArra[0];
	var dateArray=dateVal.split("/");
	var timeStr=strArra[1];
	var tsArr=timeStr.split(":");
	var newStDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
	//console.log(newStDate);
	var sts=new Date(newStDate);
	//console.log(sts);
	sts.setDate(dateArray[0]);
	sts.setMonth(dateArray[1]-1);
	sts.setHours(tsArr[0]);
	sts.setMinutes(tsArr[1]);
	//console.log(sts);
	endTimeStampKm = sts.getTime();
	//console.log(startTimeStampKm);
}


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

	
/**
   * Show DateTimePicker onclick in jquery 
* */	
			$(document).on('click', '#startDateMaxKmPicker', function(){
				$('#startDateMaxKmPicker').datetimepicker({
			                inline: true,
			                sideBySide: true,
			                ignoreReadonly: true,
			                allowInputToggle: true,
			                showClose : true,
			                defaultDate:'now',
			                maxDate: 'now',
			                format: 'DD/MM/YYYY HH:mm'
			            }).on("dp.change",function (e) {
			            	//$('.bootstrap-datetimepicker-widget').hide();
			            	$("#startDateMaxKm").blur(); 
			            	closeResult();
			            });
				startDateMaxKmError.style.display = 'none';
			}); 
			$(document).on('click', '#endDateMaxKmPicker', function(){
				$('#endDateMaxKmPicker').datetimepicker({
			                inline: true,
			                sideBySide: true,
			                ignoreReadonly: true,
			                allowInputToggle: true,
			                showClose : true,
			                defaultDate:'now',
			                maxDate: 'now',
			                format: 'DD/MM/YYYY HH:mm'
			            }).on("dp.change",function (e) {
			            	//$('.bootstrap-datetimepicker-widget').hide();
			            	$("#endDateMaxKm").blur(); 
			            	closeResult();
			            });
				endDateMaxKmError.style.display = 'none';
			});
			
			function closeResult(){
				$timeout(function () {
					$scope.showResultMaxKm = false;
			    }, 0);
			}
	

});