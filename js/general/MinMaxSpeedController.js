var startTimeStamp;
var endTimeStamp;
var minSpeed;
var maxSpeed;

batsGeneralHome.controller("GeneralMinMaxSpeedCtrl",function($http,$scope,$filter,$localStorage,$timeout){

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
	$scope.deviceSelectMinMax = true;
	$scope.showResult = true;
	$scope.sel_group_device = false;
	var startDateMinMaxError = document.getElementById('startDateMinMaxError');
	var endDateMinMaxError = document.getElementById('endDateMinMaxError');
	
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
	$('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
	$scope.sel_group_device = false;
	//$scope.hist.searchDeviceModel = "";
	$scope.deviceSelectMinMax=true;
	$scope.showResult = false;
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
	$scope.httpLoading=false;
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
	$scope.deviceSelectedMinMax=function(deviceId){
	$scope.sel_group_device = true;
	$scope.deviceSelectMinMax=false;
	$scope.showResult = false;
	startDateMinMaxError.style.display = 'none';
	endDateMinMaxError.style.display = 'none';
	document.getElementById('startDateMinMax').value = "";
	document.getElementById('endDateMinMax').value = "";
	};


	
/**
  * Onsubmit of Min/Max Speed from values 
*/
$scope.submitMinMaxSpeed = function() {
	$scope.httpLoading=true;
	//alert("Yes");
	var startDateMinMax = document.getElementById('startDateMinMax').value;
	var endDateMinMax = document.getElementById('endDateMinMax').value;
	//console.log(startDateMinMax);
	//console.log(endDateMinMax);
if(startDateMinMax == "" && endDateMinMax == ""){
	startDateMinMaxError.style.display = 'block';
	endDateMinMaxError.style.display = 'block';
	//alert("1");
}
else if(startDateMinMax == ""){
	startDateMinMaxError.style.display = 'block';
	//alert("2");
}
else if(endDateMinMax == ""){
	endDateMinMaxError.style.display = 'block';
	//alert("3");
}
else{
	//alert("4");
	startDate(startDateMinMax);
	endDate(endDateMinMax);
	                    $scope.devIdJson = {};
						$scope.devIdJson.token = token;
						$scope.devIdJson.devlist = [$scope.deviceId];
						$scope.devIdJson.sts = startTimeStamp;
						$scope.devIdJson.ets = endTimeStamp;
						//$scope.devIdJson.sts = "1456893473000";
						//$scope.devIdJson.ets = "1456893584000";
						console.log(JSON.stringify($scope.devIdJson));
						$http({
							method : 'POST',
							url : apiURL + 'app/get_min_max_speed',
							data : JSON.stringify($scope.devIdJson),
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function(data) {
							$scope.httpLoading=false;
							$scope.showResult = true;
							var deviceList = data;
							console.log(JSON.stringify(deviceList));
							var resultDevlist = [];
							for(i=0;i<deviceList.length;i++){
								var deviceID = deviceList[i].dev_id;
								var finalDevStatus ={"dev_id":deviceID};
								resultDevlist.push(finalDevStatus);
								$scope.MinMaxResult = resultDevlist;
							}
							for(i=0;i<data.length;i++){
								minSpeed = data[i].min_speed;
								maxSpeed = data[i].max_speed;
							}
							min_speed(minSpeed);
							max_speed(maxSpeed);
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
						 });
}
};

function startDate(getStartDateMinMax){
	console.log(getStartDateMinMax);
	var datetimeVal = getStartDateMinMax;
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
	startTimeStamp = sts.getTime();
	//console.log(startTimeStamp);
}
function endDate(getEndDateMinMax){
	var datetimeVal = getEndDateMinMax;
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
	endTimeStamp = sts.getTime();
	//console.log(endTimeStamp);
}
function min_speed(minSpeedVal){
    $scope.minSpeedChart = {
            options: {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor: "rgba(255,255,255,0.8)",
                },
                title: {
                    text: 'Min Speed'
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                }
            },
    	    yAxis: {
    	        min: 0,
    	        max: 200,   	        
    	        minorTickInterval: 'auto',
    	        minorTickWidth: 1,
    	        minorTickLength: 10,
    	        minorTickPosition: 'inside',
    	        minorTickColor: '#666',
    	        tickPixelInterval: 30,
    	        tickWidth: 2,
    	        tickPosition: 'inside',
    	        tickLength: 10,
    	        tickColor: '#666',
    	        labels: {
    	            step: 2,
    	            rotation: 'auto'
    	        },
    	        title: {
    	            text: 'km/h'
    	        },
    	        plotBands: [{
    	            from: 0,
    	            to: 120,
    	            color: '#55BF3B' // green
    	        }, {
    	            from: 120,
    	            to: 160,
    	            color: '#DDDF0D' // yellow
    	        }, {
    	            from: 160,
    	            to: 200,
    	            color: '#DF5353' // red
    	        }]        
    	    },	
    	    series: [{
    	        name: 'Speed',
    	        data: [minSpeedVal],
    	        tooltip: {
    	            valueSuffix: ' km/h'
    	        }
    	    }],
        };
}
function max_speed(maxSpeedVal){
    $scope.maxSpeedChart = {
            options: {
                chart: {
                    type: 'gauge',
                    plotBackgroundColor: null,
                    plotBackgroundImage: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    backgroundColor: "rgba(255,255,255,0.8)"
                },
                title: {
                    text: 'Max Speed'
                },
                pane: {
                    startAngle: -150,
                    endAngle: 150,
                    background: [{
                        backgroundColor: {
                            stops: [
                                [0, '#FFF'],
                                [1, '#333']
                            ]
                        },
                        borderWidth: 0,
                        outerRadius: '109%'
                    }, {
                        backgroundColor: {
                            stops: [
                                [0, '#333'],
                                [1, '#FFF']
                            ]
                        },
                        borderWidth: 1,
                        outerRadius: '107%'
                    }, {
                        // default background
                    }, {
                        backgroundColor: '#DDD',
                        borderWidth: 0,
                        outerRadius: '105%',
                        innerRadius: '103%'
                    }]
                }
            },
    	    yAxis: {
    	        min: 0,
    	        max: 200,   	        
    	        minorTickInterval: 'auto',
    	        minorTickWidth: 1,
    	        minorTickLength: 10,
    	        minorTickPosition: 'inside',
    	        minorTickColor: '#666',
    	        tickPixelInterval: 30,
    	        tickWidth: 2,
    	        tickPosition: 'inside',
    	        tickLength: 10,
    	        tickColor: '#666',
    	        labels: {
    	            step: 2,
    	            rotation: 'auto'
    	        },
    	        title: {
    	            text: 'km/h'
    	        },
    	        plotBands: [{
    	            from: 0,
    	            to: 120,
    	            color: '#55BF3B' // green
    	        }, {
    	            from: 120,
    	            to: 160,
    	            color: '#DDDF0D' // yellow
    	        }, {
    	            from: 160,
    	            to: 200,
    	            color: '#DF5353' // red
    	        }]        
    	    },	
    	    series: [{
    	        name: 'Speed',
    	        data: [maxSpeedVal],
    	        tooltip: {
    	            valueSuffix: ' km/h'
    	        }
    	    }],
        };
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
		$(document).on('click', '#startDateMinMaxPicker', function(){
			$('#startDateMinMaxPicker').datetimepicker({
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
		            	$("#startDateMinMax").blur(); 
		            	closeResult();
		            });
			startDateMinMaxError.style.display = 'none';
		}); 
		$(document).on('click', '#endDateMinMaxPicker', function(){
			$('#endDateMinMaxPicker').datetimepicker({
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
		            	$("#endDateMinMax").blur(); 
		            	closeResult();
		            });
			endDateMinMaxError.style.display = 'none';
		});
		
		function closeResult(){
			$timeout(function () {
				$scope.showResult = false;
		    }, 0);
		}
	

});

