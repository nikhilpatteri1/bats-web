batsfactoryhome.controller('deviceController', function($rootScope,$scope,$http,$localStorage) {
	$rootScope.menuPos=1;
	$scope.isSelected=true;
	$scope.token = $localStorage.data;
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
	 * Load Customer list 
	 * 1) on load of page load the customer in the dropdown*/
	$scope.loadCustomer=function(){
		$scope.user = {"token":$scope.token};
		//console.log($scope.user);
	    $http({
	      method  : 'POST',		  
	      url     : apiURL+'customer/list',
		  data    : JSON.stringify($scope.user), 
		  headers : { 'Content-Type': 'application/json' }
	     })
		  .success(function(data) {
		  $scope.customerName = data.clist;
		  //console.log($scope.customerName);
		  $scope.loadDevice();
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
	};
	/**
	 * Device list
	 * 1)device in stock which is un alloted */
	$scope.loadDevice=function(){
		$scope.user = {"token":$scope.token};
	    $http({
	      method  : 'POST',		  
	      url     : apiURL+'factory/stock',
		  data    : JSON.stringify($scope.user), 
		  headers : { 'Content-Type': 'application/json' }
	     })
		  .success(function(data) {
		  console.log(JSON.stringify(data));
		   $scope.rows=[];
		   var dev_len=data.stocklist.length;
		   for(var inc=0;inc<dev_len;inc++){
			  // console.log(data.stocklist[inc]);
			   $scope.rows.push(data.stocklist[inc].devid);
		   }
		   $scope.FActoryStock=$scope.rows;
		   console.log($scope.FActoryStock.length);
		   $scope.FactoryStockCount=$scope.FActoryStock.length;
		   var stockList = data.stocklist;
           if(stockList.length == 0){
        	   console.log(stockList.length);
        	   console.log(stockList);
               $scope.noDevicesFactory = true;
               $scope.devicesTable = false;
           }
           else{
        	   console.log(stockList.length);
               $scope.noDevicesFactory = false;
               $scope.devicesTable = true;
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
	};
	/**
	 * customer name based device list
	 * 1)If data is empty change button to assign to customer
	 * 2)If data is available
	 * 		a) load devices in assigned devices part
	 * 		b) change button to modify customer*/
	$scope.chk=function(custName){
		$scope.selection=[];
		$scope.loadDevice();
		$scope.selectCustomer = true;
		$scope.isSelected=false;
		//document.getElementById("custIdList").blur();
		$scope.userjson={"token":$scope.token,"uname":custName};
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'customer/devlist',
			  data    : JSON.stringify($scope.userjson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
			  //console.log(data.devlist);
			  var dev_len=data.devlist.length;
			  if(dev_len>0){
				  $scope.IsVisible=false;
				  $scope.modify=true;
				  $scope.selection=[];
				  $scope.assignedList=[];
				  for(var inc=0;inc<dev_len;inc++){
					   //$scope.selection.push((data.devlist[inc]));
					  $scope.assignedList.push((data.devlist[inc]));
				   }  
			  }
			  else{
				  //$scope.selection=[];
				  $scope.assignedList=[];
				  console.log($scope.selection);
				  $scope.IsVisible=true;
				  $scope.modify=false;
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
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
	};
	/**
	 * add device function 
	 * 1)adding device to the new customer */
	$scope.addDevice=function(customerName){
		$scope.addDeviceJson={};
		$scope.addDeviceJson.token=$scope.token;
		$scope.addDeviceJson.uname=customerName;
		var deviceList=[];
		var dev_len=$scope.selection.length;
		for(var inc=0;inc<dev_len;inc++){
			deviceList.push($scope.selection[inc]);
		}
		$scope.addDeviceJson.devlist=deviceList;
		console.log($scope.addDeviceJson);
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'customer/addevices/',
			  data    : JSON.stringify($scope.addDeviceJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  swal({title:data.status,
					   text: "Success!",   
					   type: "success",   
					   confirmButtonColor: "#9afb29",   
					   closeOnConfirm: false }, 
					   function(){ 
						   location.reload();
						   console.log(data);
					   });
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
	};
	
	
	
	
	/**
	 * modify device function 
	 * 1)modifying device to the existing customer */
	$scope.modifyDevice=function(customerName){
		$scope.modifyDeviceJson={};
		$scope.modifyDeviceJson.token=$scope.token;
		$scope.modifyDeviceJson.uname=customerName;
		var deviceList=[];
		var dev_len=$scope.selection.length;
		for(var inc=0;inc<dev_len;inc++){
			deviceList.push($scope.selection[inc]);
		}
		$scope.modifyDeviceJson.devlist=deviceList;
		console.log($scope.modifyDeviceJson);
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'customer/modifydevicelist/',
			  data    : JSON.stringify($scope.modifyDeviceJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
					  swal({title:data.status,
						   text: "Success!",   
						   type: "success",   
						   confirmButtonColor: "#9afb29",   
						   closeOnConfirm: false }, 
						   function(){ 
							   location.reload();
							   console.log(data);
						   });
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
	};
	
	/**
	 * On Selection and On Remove of device
	 * 1)selecting device from un allocated
	 * 2)Remove device from assigned*/
	$scope.selection=[];
	$scope.toggleSelection = function toggleSelection(deviceID) {
	    var idx = $scope.selection.indexOf(deviceID);
	    
	    
	    console.log( $scope.FactoryStockCount);
	    // is currently selected
	    if (idx > -1) {
	      $scope.selection.splice(idx, 1);
	     /* console.log($scope.selection);
	      $scope.rows.push(deviceID);*/
	      //$scope.FactoryStockCount=$scope.FactoryStockCount+1;
	    }
	   
	    // is newly selected
	    else {
	      $scope.selection.push(deviceID);
	      console.log($scope.selection);
	      var index = -1;		
			var comArr = eval( $scope.rows );
			console.log($scope.rows+"\n"+comArr);
			for( var i = 0; i < comArr.length; i++ ) {
				if( comArr[i] === deviceID ) {
					index = i;
					break;
				}
			}
			if( index === -1 ) {
				alert( "Something gone wrong" );
			}
			/*$scope.rows.splice( index, 1 );*/	
			//$scope.FactoryStockCount=$scope.FactoryStockCount-1;
	    }
	   
	  };
	  
	  
	
/*
	    $scope.items = [
	        {id: 1, title: "Can't Hold Us"},
	        {id: 2, title: "Just Give Me A Reason"},
	        {id: 3, title: "Mirrors"},
	        {id: 4, title: "Get Lucky"},
	      ];
	    */
	      $scope.selectedItems = 0;
	      $scope.$watch('rows', function(rows){
	    	  console.log(rows);
	        var selectedItems = 0;
	        angular.forEach(rows, function(rowContent){
	        	console.log(rowContent);
	          selectedItems += rowContent.selected ? 1 : 0;
	        })
	        $scope.selectedItems = selectedItems;
	      }, true);        

	 
	      
	 /* *//**
	 	* On Create User Form
	    * 1) Select Group on click of checkbox & viceversa*//*
		$scope.selection = {};        
	    $scope.group = group_list;        
	    $scope.$watch(function() {
	        return $scope.selection.ids;
	    }, function(value) {
	        $scope.selection.objects = [];
	        angular.forEach($scope.selection.ids, function(v, k) {
	            v && $scope.selection.objects.push(getCategoryById(k));            
	        });        
	    }, true);
	    
	    function getCategoryById (gid) {
	        for (var i = 0; i < $scope.group.length; i++) {
	            if ($scope.group[i].gid == gid) {
	                return $scope.group[i];
	            }
	        }
	    };
		      */
	  /**
	   * On load of customer name
	   * 1)Filter customer name
	   * 2)Select customer name*/	  
	  	  //var tagsData = cname;
	  	// init jquery functions and plugins
	
	  
	 // *********************** number of checkbox selected ***********************
	  $scope.selectedItems = 0;
	  
	  
	  $(document).ready(function() {
			$.getScript('../assets/select_filter/select2.min.js', function() {
				$("#mySelect").select2({}); 
				$('#clearTextCustomer span.select2-chosen').text("- - Select Customer - -");
			});// script
		});
	  
	  
});




	  
