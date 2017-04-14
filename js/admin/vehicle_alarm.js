var startTimeStampKm;
var endTimeStampKm;
var startDateMinMaxError = document.getElementById('startDateMinMaxErrorAlarm');
var endDateMinMaxError = document.getElementById('endDateMinMaxErrorAlarm'); 

batsAdminHome.controller('vehicleAlarm',function($scope,$rootScope, $http, $localStorage){
	$rootScope.menuPos=2;
	console.log(window.screen.availHeight);
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
	$scope.blankTable=true;
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
	$('#clearTextDevice span.select2-chosen').text("Select Vehicle No/Device"); 
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
	startDateMinMaxErrorAlarm.style.display = 'none';
	endDateMinMaxErrorAlarm.style.display = 'none';
	$('.md-datepicker-input').prop('readonly', true);
	};	
	

	/**
	  * Onsubmit of Min/Max Speed from values 
	*/
	
	/*$(document).on('click', '#VAStartTimePic', function(){
		
	});*/
	
	/*$(document).on('click', '#VAEndTimePic', function(){
		$('#VAEndTimePic').datetimepicker({
			 inline: true,
             sideBySide: true,
			format: 'DD/MM/YYYY hh:mm a',
	        maxDate: 'now',        		
			ignoreReadonly:true,
	            }).on("dp.change",function (e) {
	            	//$("#startDateMaxKm").blur(); 
	            	//closeResult();
	            	console.log(e);
	            	console.log(e.date);
	            	console.log(e.date._d);
	            	$scope.MyDate = e.date._d;
	            	endDateMinMaxErrorAlarm.style.display = 'none';
	            	
	            });
		//startDateMaxKmError.style.display = 'none';
		var dt=new Date().getTime();
		$('#VAEndTime').val(showTime(dt));
	});*/
	
	$scope.openCalS = function(){
		$('#VAStartTimePic').datetimepicker({
			/* inline: true,
             sideBySide: true,*/
			format: 'DD/MM/YYYY hh:mm a',
	        maxDate: 'now',        		
			ignoreReadonly:true,
	            }).on("dp.change",function (e) {
	            	//$("#startDateMaxKm").blur(); 
	            	//closeResult();
	            	/*console.log(e);
	            	console.log(e.date);
	            	console.log(e.date._d);
	            	$scope.MyDate = e.date._d;*/
	            	startDateMinMaxErrorAlarm.style.display = 'none';
	    			
	            });
		//startDateMaxKmError.style.display = 'none';
		var dt=new Date().getTime();
		$('#VAStartTime').val(showTime(dt));
	}
	
	
	$scope.openCalE = function(){
		$('#VAEndTimePic').datetimepicker({
			/* inline: true,
             sideBySide: true,*/
			format: 'DD/MM/YYYY hh:mm a',
	        maxDate: 'now',        		
			ignoreReadonly:true,
	            }).on("dp.change",function (e) {
	            	//$("#startDateMaxKm").blur(); 
	            	//closeResult();
	            	/*console.log(e);
	            	console.log(e.date);
	            	console.log(e.date._d);
	            	$scope.MyDate = e.date._d;*/
	            	endDateMinMaxErrorAlarm.style.display = 'none';
	    			
	            });
		//startDateMaxKmError.style.display = 'none';
		var dt=new Date().getTime();
		$('#VAEndTime').val(showTime(dt));
	}
	
	/*$(document).on('click', '#VAEndTimePic', function(){
		alert("hi");
		
	});*/
	
	
	function showTime (ts) {
		//console.log(ts);
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
		var strTime = day+"/"+month+"/"+year+" "+ hours + ':' + minutes + ' ' + ampm;
		//console.log(strTime);
		return strTime;
	};
	
	
	
	$scope.submitAlarm = function() {
		var startDateMaxKm = document.getElementById('VAStartTime').value;
		console.log(startDateMaxKm);
		var endDateMaxKm = document.getElementById('VAEndTime').value;
		//$scope.httpLoading=false;
		
		
		if(startDateMaxKm == "" && endDateMaxKm == ""){
			startDateMinMaxErrorAlarm.style.display = 'block';
			endDateMinMaxErrorAlarm.style.display = 'block';
			// alert("1");
		}
		else if(startDateMaxKm == ""){
			startDateMinMaxErrorAlarm.style.display = 'block';
			// alert("2");
		}
		else if(endDateMaxKm == ""){
			endDateMinMaxErrorAlarm.style.display = 'block';
			// alert("3");
		}
		else{
			$scope.httpLoading=true;
			startDateMinMaxErrorAlarm.style.display = 'none';
			endDateMinMaxErrorAlarm.style.display = 'none';

		/*console.log($scope.myDate.start);
		getSTS($scope.myDate.start);
		getETS($scope.myDate.end);*/
			startDate(startDateMaxKm);
			endDate(endDateMaxKm);
		                    $scope.devIdJson = {};
							$scope.devIdJson.token = $scope.token;
							$scope.devIdJson.devid = $scope.deviceId;
							$scope.devIdJson.sts = startTimeStampKm;
							$scope.devIdJson.ets = endTimeStampKm;
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
									$scope.blankTable=false;
									$scope.noResultTable = true;
									$scope.httpLoading=false;
								}
								else{
									$scope.httpLoading=false;
									$scope.noResultTable = false;
									$scope.showResultTable = true;
									$scope.blankTable=false;
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
		if(strArra[2] == "pm"){
			if(tsArr[0] == "12"){
				sts.setHours(tsArr[0]);
				sts.setMinutes(tsArr[1]);
				startTimeStampKm = sts.getTime();
			}
			else{
				sts.setHours(Number(tsArr[0]) + 12);
				sts.setMinutes(tsArr[1]);
				//console.log("if " + sts);
				startTimeStampKm = sts.getTime();
				//console.log(startTimeStamp);
			}
		}
		else{
			if(tsArr[0] == "12"){
				sts.setHours(Number(tsArr[0]) - 12);
				sts.setMinutes(tsArr[1]);
				startTimeStampKm = sts.getTime();
			}
			else{
				sts.setHours(tsArr[0]);
				sts.setMinutes(tsArr[1]);
				//console.log("else " + sts);
				startTimeStampKm = sts.getTime();
				//console.log(startTimeStamp);
			}
		}
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
		if(strArra[2] == "pm"){
			if(tsArr[0] == "12"){
				sts.setHours(tsArr[0]);
				sts.setMinutes(tsArr[1]);
				endTimeStampKm = sts.getTime();
			}
			else{
				sts.setHours(Number(tsArr[0]) + 12);
				sts.setMinutes(tsArr[1]);
				//console.log("if " + sts);
				endTimeStampKm = sts.getTime();
				//console.log(endTimeStamp);	
			}
		}
		else{
			if(tsArr[0] == "12"){
				sts.setHours(Number(tsArr[0]) - 12);
				sts.setMinutes(tsArr[1]);
				endTimeStampKm = sts.getTime();
			}
			else{
				sts.setHours(tsArr[0]);
				sts.setMinutes(tsArr[1]);
				//console.log("else " + sts);
				endTimeStampKm = sts.getTime();
				//console.log(endTimeStamp);
			}
		}
	}


/*function getSTS(){		
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
}*/	


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
	  hours= hours<10?'0'+hours:hours;
	  minutes = minutes < 10 ? '0'+minutes : minutes;
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
				$('#clearTextGroup span.select2-chosen').text("Select Group");
				$('#clearTextDevice span.select2-chosen').text("Select Vehicle No/Device");
			});// script
		});	
	
	
});