
//==============Factory Home===============

batsfactoryhome.controller('customerController', function($scope, $http, $localStorage) {
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
});


batsfactoryhome.controller('customerControllerInner', function($scope, $http, $localStorage) {
	/*
	 * for back button navigation in angular
	 * matching with current controller and making them staying on the same page
	 * */
	 /*$scope.$on('$routeChangeStart', function (scope, next, current) {
		 		    var	obtainedStr=next.$$route.originalPath;
		 		    console.log(obtainedStr+" length is "+obtainedStr.length);
		 		   var createdStr='/factory/device';
		 		    console.log(createdStr+" length is "+createdStr.length);
		 		  // console.log(next.$$route.originalPath);
	        if ((next.$$route.originalPath!="/factory/customer") ||  (next.$$route.originalPath!="/factory/device") || (next.$$route.originalPath!="factory")) {
	            // Show here for your model, and do what you need**
	        	//console.log(next.$$route.originalPath);
	        	//swal({title:"Cancelled", text:"This action is cancelled :)", type:"error"},function(){window.location = apiURL;});
	        }
	        else{
	        	console.log(">>>>>>>>>>>>>>>>>>>>>>>"+next.$$route.originalPath);
	        }
	        
	    });*/
	
//==============Factory Home After Load===============
	
	//else{
		$scope.customer = {};
		//$(window).bind("load", function() {
		$scope.customer.token = $scope.token;
		//$scope.customer.id = $scope.token;
		//console.log(JSON.stringify($scope.customer));
		$http({
		  method  : 'POST',		  
		  url     : apiURL+'user/loaddata',
		  data    : JSON.stringify($scope.customer), 
		  headers : { 'Content-Type': 'application/json' }
		 })
		  .success(function(data) {
		  $scope.home = data.clist;
		  console.log(JSON.stringify($scope.home));
		  if($scope.home.length == 0){
			  $scope.noCustomer = true;
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
		//});
	//}
	
	/*
	 Hardcoded Country & State Values
	 */
		var countries = ['India'];
		var states = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 
		                'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 
		                'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 
		                'Maharashtra', 'Manipur', '	Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 
		                'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
		$scope.country = countries;
		$scope.state = [];
		$scope.onSelectCountry = function () {
	        var myNewOptions = states;
	        $scope.state = myNewOptions;
		};
		$scope.states = states;
		
//==============Factory Home Delete Customer===============   

    $scope.submitDeleteCustomer = function(uname) {
    	/*$scope.deleteMsg = "Do you want to delete this customer?";
    	if ( window.confirm($scope.deleteMsg) ) {
    		
        }*/
    	swal({   title: "Are you sure?",   
        	text: "You want to delete this customer?",   
        	type: "warning",   
        	showCancelButton: true,   
        	confirmButtonColor: "#DD6B55",   
        	confirmButtonText: "Yes, delete it!",   
        	cancelButtonText: "No, cancel it!",   
        	closeOnConfirm: false,   
        	closeOnCancel: false }, 
        	function(isConfirm){   
        		if (isConfirm) {     
        			$scope.customer = {};
        	    	$scope.customer.token = $scope.token;
        	    	$scope.customer.uname = uname;
        	    	console.log(JSON.stringify($scope.customer));
        	        $http({
        	          method  : 'POST',		  
        	          url     : apiURL+'customer/delete',
        	    	  data    : JSON.stringify($scope.customer), 
        	    	  headers : { 'Content-Type': 'application/json' }
        	         })
        	    	  .success(function(data) {
        	    		  console.log(data);
        	    			  swal({title: "Customer Deleted Successfully",
              	   			   text: "Success!",   
              	   			   type: "success",   
              	   			   confirmButtonColor: "#9afb29",   
              	   			   closeOnConfirm: false }, 
              	   			   function(){   
              	   				   $scope.data = data;
              	   			       console.log(JSON.stringify($scope.data));
              	   			       location.reload();
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
        			} 
        		else {     
        			swal("Cancelled", "You have cancelled :)", "error");   
        			} 
        		});
    	
        };
        
        
//==============Factory Home Fetch Edit Customer Details Form===============   
        $scope.submitEditCustomer = function(uname) {
        	$scope.customer = {};
        	$scope.customer.token = $scope.token;
        	$scope.customer.uname = uname;
        	console.log(JSON.stringify($scope.customer));
            $http({
              method  : 'POST',		  
              url     : apiURL+'customer/detail',
        	  data    : JSON.stringify($scope.customer), 
        	  headers : { 'Content-Type': 'application/json' }
             })
        	  .success(function(data) {
    			 // $scope.edit = data;
    			  //var mobile_no = data.contact_no.slice(3);
    			  $scope.edit = data;
    			  //$scope.edit.contact_no = mobile_no;
                  console.log(JSON.stringify($scope.edit));
              })
              .error(function(data, status, headers, config) {
            	  console.log(data.err);
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
            
            
            
            

});



//==============Factory Home Submit Edit Customer Form===============   
batsfactoryhome.controller('factoryEdit', function($scope, $http, $localStorage) {
$scope.token = $localStorage.data;
$scope.saveEditForm = function() {
	$scope.edit.token = $scope.token;
	$scope.edit.country=angular.lowercase($scope.edit.country);
	$scope.edit.state=angular.lowercase($scope.edit.state);
	//$scope.edit.contact_no = '+91'+$scope.edit.contact_no;
	console.log(JSON.stringify($scope.edit));
    $http({
      method  : 'POST',		  
      url     : apiURL+'customer/update',
	  data    : JSON.stringify($scope.edit), 
	  headers : { 'Content-Type': 'application/json' }
     })
	  .success(function(data) {
		  swal({title: "Customer Updated Successfully",
			   text: "Success!",   
			   type: "success",   
			   confirmButtonColor: "#9afb29",   
			   closeOnConfirm: false }, 
			   function(){   
				   $scope.update = data;
				      console.log(JSON.stringify($scope.update));
				      $('#editModal').modal('hide');
				      location.reload();
		});
      })
      .error(function(data, status, headers, config) {
    	  //swal(data);
    	  console.log(data.err);
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
    	  else if(data.err == "Email Exist"){
    		  swal("Email Id already exists. Enter different mail id."); 
    	  }
    	  console.log(status);
    	  console.log(headers);
    	  console.log(config);
	  });
    }; 
});



//==============Factory User Create Form===============
batsfactoryhome.controller('factoryCreate', function($scope, $http, $localStorage) {
	$scope.reset=function(){
		$scope.customer={};
		$scope.customer.password="";
		$scope.customer.email="";
		$scope.customer.contact_no="";
		$scope.error = {cname:false};
		$scope.createForm.$setPristine();
	};
	$scope.verifyUser=function(customerName){
		$scope.verifyUserJson={};
		$scope.verifyUserJson.token=$localStorage.data;
		$scope.verifyUserJson.uname=angular.lowercase(customerName);
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/check',
			  data    : JSON.stringify($scope.verifyUserJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  console.log(data);
				  $scope.status=data.msg;
				  console.log($scope.status);
				  if(data.status == true){
					  $scope.cname=true;
					  $scope.error = {cname:false};
				  }
				  else{
					  $scope.cname=false;
					  $scope.error = {cname:true};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  console.log(data);
		    	  if(data.err == "Expired Session")
    			  {
            		  $('#createModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		  $('#createModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
	};
	
	$scope.verifyEmail=function(customerEmail){
		$scope.verifyEmailJson={};
		$scope.verifyEmailJson.token=$localStorage.data;
		$scope.verifyEmailJson.email=customerEmail;
		//console.log(JSON.stringify($scope.verifyEmailJson));
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/emailcheck',
			  data    : JSON.stringify($scope.verifyEmailJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  console.log(data.msg);
				  $scope.statusMail=data.msg;
				  if(data.status == true){
					  $scope.cmail=true;
					  $scope.error_mail = {cmail:false};
				  }
				  else{
					  $scope.cmail=false;
					  $scope.error_mail = {cmail:true};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  console.log(data);
		    	  if(data.err == "Expired Session")
    			  {
            		  $('#createModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		  $('#createModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
	};
	
	$scope.verifyOrgname=function(orgName){
		$scope.verifyOrgnameJson={};
		$scope.verifyOrgnameJson.token=$localStorage.data;
		$scope.verifyOrgnameJson.org_id=angular.lowercase(orgName);
		console.log(JSON.stringify($scope.verifyOrgnameJson));
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/orgidcheck',
			  data    : JSON.stringify($scope.verifyOrgnameJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  console.log(data);
				  $scope.status=data.msg;
				  console.log($scope.status);
				  if(data.status == true){
					  $scope.orgname=true;
					  $scope.error = {orgname:false};
				  }
				  else{
					  $scope.orgname=false;
					  $scope.error = {orgname:true};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  console.log(data);
		    	  if(data.err == "Expired Session")
    			  {
            		  $('#createModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		  $('#createModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
	};
	
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	$scope.customer = {};
	$scope.submitCreateForm = function() {
		if ($scope.createForm.$valid) {
			//alert('New Customer Created');
		}
	$scope.customer.token = $scope.token;
	$scope.customer.country=angular.lowercase($scope.customer.country);
	$scope.customer.state=angular.lowercase($scope.customer.state);
	$scope.customer.org_id=angular.lowercase($scope.customer.org_id);
	//$scope.customer.contact_no = '+91'+$scope.customer.contact_no;
	console.log(JSON.stringify($scope.customer));
	$('#createModal').modal('hide');
    $http({
      method  : 'POST',		  
      url     : apiURL+'customer/create',
	  data    : JSON.stringify($scope.customer), 
	  headers : { 'Content-Type': 'application/json' }
     })
	  .success(function(data) {
		  swal({title: "Customer Created Successfully",
			   text: "Success!",   
			   type: "success",   
			   confirmButtonColor: "#9afb29",   
			   closeOnConfirm: false }, 
			   function(){   
				   $scope.data = data;
				   console.log(JSON.stringify($scope.data));
				   location.reload();
		});
      })
      .error(function(data, status, headers, config) {
    	  swal(data.msg);
    	  console.log(data);
    	  if(data.err == "Expired Session")
		  {
    		  $('#createModal').modal('hide');
		      expiredSession();
		      $localStorage.$reset();
		  }
    	  else if(data.err == "Invalid User"){
    		  $('#createModal').modal('hide');
    		  invalidUser();
			  $localStorage.$reset();  
    	  }
    	  console.log(status);
    	  console.log(headers);
    	  console.log(config);
	  });
    };
});


   





