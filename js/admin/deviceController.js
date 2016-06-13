/** Group Creation Controller 
*/
batsAdminHome.controller('deviceController', function($scope, $http, $localStorage) {
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	if(typeof $scope.token==="undefined"){
		swal({ 
			   title: "Un Authorized Acces",
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
   * Load User list 
   * 1) on load of page load the username is displayed in the user list grid*/
				$scope.user = {"token":$scope.token};
				//console.log(JSON.stringify($scope.user));
				$http({
				  method  : 'POST',		  
				  url     :apiURL+'device/list',
				  data    : JSON.stringify($scope.user), 
				  headers : { 'Content-Type': 'application/json' }
				 })
				  .success(function(data) {
				  $scope.dlist = data;
				  //console.log(JSON.stringify($scope.dlist));
				  $scope.allocated = $scope.dlist.allocated;
				  //console.log(JSON.stringify($scope.allocated));
				  if($scope.allocated.length == 0){
					  $scope.noDevicesAllocated = true;
				  }
				  $scope.un_allocated = $scope.dlist.un_allocated;
				  //console.log(JSON.stringify($scope.un_allocated));
				  if($scope.un_allocated == 0){
					  $scope.noDevicesUnAllocated = true;
				  }
				  })
				  .error(function(data, status, headers, config) {
					  //console.log(data.err);
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

/**
  * Reset Form*/			
				$scope.reset=function(){
					$scope.device = {};
					$scope.updateDeviceForm.$setPristine();
				};			
				
/**
	* On Click of Edit Icon
    * 1)Fetch Details of Particular Device
	* 2)Display Fetched Details & Dispaly on the Form*/
				    $scope.submitUpdateDevice = function(did) {

				    	$scope.device = {};
				    	$scope.device.token = $scope.token;
				    	$scope.device.devid = did;
				    	//console.log(JSON.stringify($scope.device));
				        $http({
				          method  : 'POST',		  
				          url     : apiURL+'device/info',
				    	  data    : JSON.stringify($scope.device), 
				    	  headers : { 'Content-Type': 'application/json' }
				         })
				    	  .success(function(data) {
							  $scope.device = data;
				              //console.log(JSON.stringify($scope.device));
				          })
				          .error(function(data, status, headers, config) {
				        	  //console.log(data.err);
				        	  if(data.err == "Expired Session")
							  {
				        		  $('#editModal').modal('hide');
							      expiredSession();
							      $localStorage.$reset();
							  }
				        	  else if(data.err == "Invalid User"){
				        		  $('#editModal').modal('hide');
				        		  invalidUser();
				    			  $localStorage.$reset();  
				        	  }
				        	  console.log(status);
				        	  console.log(headers);
				        	  console.log(config);
				    	  });
				        }; 
				        
/**
   * On Click of Update Button
   * 1)Update Details of particular Device*/
				              $scope.submitUpdateDeviceForm = function() {
				              	var device_details = $scope.device;
				              	//console.log(JSON.stringify(device_details));
				              	var token = $scope.token;
				              	var devid = device_details.devid;
				              	var devtype = device_details.devtype;
				              	var vehicle_num = device_details.vehicle_num;
				              	var sr_num = device_details.sr_num;
				              	var driver_name = device_details.driver_name;
				              	var driver_licence = device_details.driver_licence;
				              	var desc = device_details.desc;
				              	$scope.resultJson = {"token":token,"devid":devid,"devtype":devtype,"vehicle_num":vehicle_num,
				              			          "sr_num":sr_num,"driver_name":driver_name,"driver_licence":driver_licence,
				              			          "desc":desc}
				              	//console.log(JSON.stringify($scope.resultJson));
				                  $http({
				                    method  : 'POST',		  
				                    url     : apiURL+'device/modify',
				              	  data    : JSON.stringify($scope.resultJson), 
				              	  headers : { 'Content-Type': 'application/json' }
				                   })
				              	  .success(function(data) {
				              		  swal({title: "Device Updated Successfully",
				             			   text: "Success!",   
				             			   type: "success",   
				             			   confirmButtonColor: "#9afb29",   
				             			   closeOnConfirm: false }, 
				             			   function(){   
				             				$scope.device = data;
				                          //console.log(JSON.stringify($scope.device));
				                          location.reload();
				             		});
				                    })
				                    .error(function(data, status, headers, config) {
				                  	  //console.log(data.err);
				                  	  if(data.err == "Expired Session")
				          			  {
				                  		  $('#updateDeviceModal').modal('hide');
				          			      expiredSession();
				          			      $localStorage.$reset();
				          			  }
				                  	  else if(data.err == "Invalid User"){
				                  		  $('#updateDeviceModal').modal('hide');
				                  		  invalidUser();
				              			  $localStorage.$reset();  
				                  	  }
				                  	  console.log(status);
				                  	  console.log(headers);
				                  	  console.log(config);
				              	  });
				                  };				
				

				
});



