batstravelDeskHome.controller('batsDriverBinding', function($scope, $localStorage,travelDeskFactory) {
	$scope.httpLoading=false;//loading image
	$scope.token = $localStorage.data;
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
	/*====================================================>>>>>> End of Basic function <<<<<=================================================*/
	
	/*====================================================>>>>>> Start of list Devices function <<<<<=================================================*/
	//factory method callApi does calling api and returning the response
	/*
	 * list group 
	 * */
	$scope.listGroupJson={};
	$scope.listGroupJson.token=$scope.token;	
	travelDeskFactory.callApi("POST",apiURL+"group/list",$scope.listGroupJson,function(result){
	      //console.log(result);
	      $scope.groupList=result.glist;
	      
	});
	
	/*
	 * list devices*/
	$scope.fetchDevicelist=function(groupname){
		$scope.listDeviceJson={};
		$scope.listDeviceJson.token=$scope.token;
		$scope.listDeviceJson.gid=groupname;
		travelDeskFactory.callApi("POST",apiURL+"traveldesk/getgroupdevices",$scope.listDeviceJson,function(result){
		      console.log(result);	
		      $scope.devlistObject=result;
		});
	}
	$scope.list
	/*====================================================>>>>>> End of list Devices function <<<<<=================================================*/
});