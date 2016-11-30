//==============Factory Login Form===============
batsLogin.controller('loginController', function($scope, $http, $localStorage) {
/**
 * Verify token in local storage*/
	$scope.token = $localStorage.data;
	if(typeof $scope.token==="undefined"){
		 
	}
	else{
		if($scope.token.charAt(9)==="0"){
	  		$('#loginModal').modal('hide');
	  		$localStorage.data = $scope.token;
	  		window.location = "/factory/customer";
	  	  }
	  	  else if($scope.token.charAt(9)==="1"){
	  		$('#loginModal').modal('hide');
	  		$localStorage.data = $scope.token;
	  		window.location = "/admin/map";
	  	  }
	  	  else if($scope.token.charAt(9)==="2"){
	  		$('#loginModal').modal('hide');
	  		$localStorage.data = $scope.token;
	  		window.location = "/general/map";
	  	  }
	  	 else if($scope.token.charAt(9)==="3"){
		  		$('#loginModal').modal('hide');
		  		$localStorage.data = $scope.token;
		  		window.location = "/traveldesk/binding";
		  }
	}
	$scope.user = {};
	$scope.reset=function(){
		$scope.user={};
		$scope.userForm.$setPristine();
	};
	$scope.submitLoginForm = function() {
	console.log($scope.user);
    $http({
      method  : 'POST',		  
      url     : apiURL+'login',
	  data    : JSON.stringify($scope.user), 
	  headers : { 'Content-Type': 'application/json' }
     })
	  .success(function(data) {
		  //console.log("after login");
		  $localStorage.data = data.token;
		  swal({   title: "Successfully Logged In",
			  	   text: "Welcome!",   
			  	   type: "success",   
			  	   confirmButtonColor: "#9afb29",   
			  	   closeOnConfirm: false }, 
			  	   function(){   
			  		  $scope.token = data.token;
			  		  /*$('#loginModal').modal('hide');
			  		  $localStorage.data = $scope.token;
			  		  window.location = "/factory/customer";
			  	      console.log(JSON.stringify($scope.data));*/   
			  	  console.log($scope.token.charAt(9));
			  	  if($scope.token.charAt(9)==="0"){
			  		$('#loginModal').modal('hide');
			  		//$localStorage.data = $scope.token;
			  		window.location = "/factory/customer";
			  	  }
			  	  else if($scope.token.charAt(9)==="1"){
			  		$('#loginModal').modal('hide');
			  		//$localStorage.data = $scope.token;
			  		window.location = "/admin/map";
			  	  }
			  	  else if($scope.token.charAt(9)==="2"){
			  		$('#loginModal').modal('hide');
			  		//$localStorage.data = $scope.token;
			  		window.location = "/general/map";
			  	  }
			  	else if($scope.token.charAt(9)==="3"){
			  		$('#loginModal').modal('hide');
			  		//$localStorage.data = $scope.token;
			  		window.location = "/traveldesk/binding";
			  	  }
			  	  
			  });
	  
      })
      .error(function(data, status, headers, config) {
    	  /**
    	   * error messages from server
    	   * 0 - unauthorized
    	   * 1 - already logged in
    	   * 2 - user name doesn't exist
    	   * */
    	  if(data.err=="Some other user already logged in with same credentials."){
    		  swal({
        		  title:"Already Logged In",
        		  text:data.err,
        		  type:"warning",
        	  });
    	  }
    	  else if(data=="Unauthorized"){
    		  swal({
        		  title:"Unauthorized Credentials",
        		  text:data.err,
        		  type:"warning",
        	  });
    	  }
    	  else if(data.err=="Inactive"){
    		  swal({
        		  title:"User is Inactive. Please Contact Admin",
        		  text:data.err,
        		  type:"warning",
        	  });
    	  }
    	  
    	  console.log(data);
    	  console.log(status);
    	  console.log(headers);
    	  console.log(config);
	  });
    };
});


//==============Forget Password Form===============
batsLogin.controller('forgetpwdController', function($scope, $http, $localStorage) {
	$scope.fgtJson = {};
	$scope.reset=function(){
		$scope.useremail="";
		$scope.fgtForm.$setPristine();
	};
	$scope.submitFgtForm = function(useremail) {
	$scope.fgtJson.email=useremail;
	console.log($scope.fgtJson);
	swal({ 
		title: "Are you Sure, You want to send an e-mail?",   
		text: "Click ok to send e-mail to <b style='color:red'>"+useremail+"</b>",
		html:true,
		type: "info",   
		showCancelButton: true,   
		closeOnConfirm: false,   
		showLoaderOnConfirm: true, 
		}, function(){   
			setTimeout(function(){     
				$http({
				      method  : 'POST',		  
				      url     : apiURL+'forgotpwd',
					  data    : JSON.stringify($scope.fgtJson), 
					  headers : { 'Content-Type': 'application/json' }
				     })
					  .success(function(data) {
						  console.log(data.msg);		  
						  swal({title:"Status",text:data.msg},function(){$('#fgtModal').modal('hide');});						  
						  
				      })
				      .error(function(data, status, headers, config) {
				    	  swal(data.err);
				    	  console.log(data);
				    	  console.log(status);
				    	  console.log(headers);
				    	  console.log(config);
					  });
				   
				}, 2000); 
			});
    };
});


/**
 * Change Password Factory*/
//==============Factory User Create Form===============
batsfactoryhome.controller('changePwdform', function($scope,$http,$localStorage) {
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	$scope.pwdChange=function(typedPwd){
		console.log($scope.newpwd+"=="+typedPwd);
		if($scope.newpwd==typedPwd){
			$scope.changepwdjson.token=$localStorage.data;
			$scope.changepwdjson.newpassword=typedPwd;
			console.log($scope.changepwdjson);
			if($scope.changePwd.$valid){
				$http({
				      method  : 'POST',		  
				      url     : apiURL+'reset',
					  data    : JSON.stringify($scope.changepwdjson), 
					  headers : { 'Content-Type': 'application/json' }
				     })
					  .success(function(data) {
						  swal({title: "Password Reset Successful",
						  	   text: "Success!",   
						  	   type: "success",   
						  	   confirmButtonColor: "#9afb29",   
						  	   closeOnConfirm: false }, 
						  	 function(){   
						  		 $('#changePwd').modal('hide');
								 window.location = "/";
							  });
				      })
				      .error(function(data, status, headers, config) {
				    	  //swal(data);
				    	  console.log(data.err);
				    	  if(data.err == "Expired Session")
		    			  {
		            		  $('#changePwd').modal('hide');
		    			      expiredSession();
		    			      $localStorage.$reset();
		    			  }
			        	  else if(data.err == "Invalid User"){
			        		  $('#changePwd').modal('hide');
			        		  invalidUser();
			    			  $localStorage.$reset();  
			        	  }
				    	  console.log(status);
				    	  console.log(headers);
				    	  console.log(config);
				});
			}
		}
		else{
			$scope.isMismatch=true;			
		}
	};
	
$scope.hidePasswordMismatch = function(){
	$scope.isMismatch = false;
}
});


/**
 * Change Password Admin*/
//==============Factory User Create Form===============
batsAdminHome.controller('changePwdformAdmin', function($scope,$http,$localStorage) {
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	$scope.pwdChangeAdmin=function(typedPwd){
		if($scope.newpwd==typedPwd){
			$scope.changepwdjson.token=$localStorage.data;
			$scope.changepwdjson.newpassword=typedPwd;
			console.log($scope.changepwdjson);
			if($scope.changePwd.$valid){
				$http({
				      method  : 'POST',		  
				      url     : apiURL+'reset',
					  data    : JSON.stringify($scope.changepwdjson), 
					  headers : { 'Content-Type': 'application/json' }
				     })
					  .success(function(data) {
						  swal({title: "Password Reset Successful",
						  	   text: "Success!",   
						  	   type: "success",   
						  	   confirmButtonColor: "#9afb29",   
						  	   closeOnConfirm: false }, 
						  	 function(){   
						  		 $('#changePwdAdmin').modal('hide');
								 window.location = "/";
							  });
				      })
				      .error(function(data, status, headers, config) {
				    	  //swal(data);
				    	  console.log(data.err);
				    	  if(data.err == "Expired Session")
		    			  {
		            		  $('#changePwdAdmin').modal('hide');
		    			      expiredSession();
		    			      $localStorage.$reset();
		    			  }
			        	  else if(data.err == "Invalid User"){
			        		  $('#changePwdAdmin').modal('hide');
			        		  invalidUser();
			    			  $localStorage.$reset();  
			        	  }
				    	  console.log(status);
				    	  console.log(headers);
				    	  console.log(config);
				});
			}
		}
		else{
			$scope.isMismatch=true;
		}
		
	};
	
	$scope.hidePasswordMismatch = function(){
		$scope.isMismatch = false;
	}
});

/**
 * Change Password General*/
//==============Factory User Create Form===============
batsGeneralHome.controller('changePwdformGeneral', function($scope,$http,$localStorage) {
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	$scope.pwdChangeGeneral=function(typedPwd){
		if($scope.newpwd==typedPwd){
			$scope.changepwdjson.token=$localStorage.data;
			$scope.changepwdjson.newpassword=typedPwd;
			console.log($scope.changepwdjson);
			if($scope.changePwd.$valid){
				$http({
				      method  : 'POST',		  
				      url     : apiURL+'reset',
					  data    : JSON.stringify($scope.changepwdjson), 
					  headers : { 'Content-Type': 'application/json' }
				     })
					  .success(function(data) {
						  swal({title: "Password Reset Successful",
						  	   text: "Success!",   
						  	   type: "success",   
						  	   confirmButtonColor: "#9afb29",   
						  	   closeOnConfirm: false }, 
						  	 function(){   
						  		 $('#changePwdAdmin').modal('hide');
								 window.location = "/";
							  });
				      })
				      .error(function(data, status, headers, config) {
				    	  //swal(data);
				    	  console.log(data.err);
				    	  if(data.err == "Expired Session")
		    			  {
		            		  $('#changePwdAdmin').modal('hide');
		    			      expiredSession();
		    			      $localStorage.$reset();
		    			  }
			        	  else if(data.err == "Invalid User"){
			        		  $('#changePwdAdmin').modal('hide');
			        		  invalidUser();
			    			  $localStorage.$reset();  
			        	  }
				    	  console.log(status);
				    	  console.log(headers);
				    	  console.log(config);
				});
			}
		}
		else{
			$scope.isMismatch=true;
		}
	};
	
	$scope.hidePasswordMismatch = function(){
		$scope.isMismatch = false;
	}
});
/*
 * ============================================>>>>>> Change Password <<<<<<===========================================
 * */

batstravelDeskHome.controller('changePwdformTraveldesk', function($scope,$http,$localStorage) {
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	$scope.pwdChangeTraveldesk=function(typedPwd){
		if($scope.newpwd==typedPwd){
			$scope.changepwdjson.token=$localStorage.data;
			$scope.changepwdjson.newpassword=typedPwd;
			console.log($scope.changepwdjson);
			if($scope.changePwd.$valid){
				$http({
				      method  : 'POST',		  
				      url     : apiURL+'reset',
					  data    : JSON.stringify($scope.changepwdjson), 
					  headers : { 'Content-Type': 'application/json' }
				     })
					  .success(function(data) {
						  swal({title: "Password Reset Successful",
						  	   text: "Success!",   
						  	   type: "success",   
						  	   confirmButtonColor: "#9afb29",   
						  	   closeOnConfirm: false }, 
						  	 function(){   
						  		 $('#changePwdTravelDesk').modal('hide');
								 window.location = "/";
							  });
				      })
				      .error(function(data, status, headers, config) {
				    	  //swal(data);
				    	  console.log(data.err);
				    	  if(data.err == "Expired Session")
		    			  {
		            		  $('#changePwdTravelDesk').modal('hide');
		    			      expiredSession();
		    			      $localStorage.$reset();
		    			  }
			        	  else if(data.err == "Invalid User"){
			        		  $('#changePwdTravelDesk').modal('hide');
			        		  invalidUser();
			    			  $localStorage.$reset();  
			        	  }
				    	  console.log(status);
				    	  console.log(headers);
				    	  console.log(config);
				});
			}
		}
		else{
			$scope.isMismatch=true;
		}
	};
	
	$scope.hidePasswordMismatch = function(){
		$scope.isMismatch = false;
	}
});

//==============Factory Logout===============
batsfactoryhome.controller('logoutFactoryUser', function($scope, $http, $localStorage) {
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	$scope.customer = {};
	$scope.logoutFactorySubmit = function() {
		swal({   title: "Are you sure? You want to logout?",   
	    	text: "",   
	    	type: "warning",   
	    	showCancelButton: true,   
	    	confirmButtonColor: "#DD6B55",   
	    	confirmButtonText: "Yes, Logout!",   
	    	cancelButtonText: "No, cancel it!",   
	    	closeOnConfirm: false,   
	    	closeOnCancel: false },
	    	function(isConfirm){  
	    		if (isConfirm) {  
	    			$scope.customer.token = $scope.token;
	    			//$scope.customer.id = $scope.token;
	    			console.log(JSON.stringify($scope.customer));
	    			$http({
	    			  method  : 'POST',		  
	    			  url     : apiURL+'logout',
	    			  data    : JSON.stringify($scope.customer), 
	    			  headers : { 'Content-Type': 'application/json' }
	    			 })
	    			  .success(function(data) {
	    			  $scope.data = data;
	    			  $localStorage.$reset();
	    			  window.location = apiURL;
	    			  console.log(JSON.stringify($scope.data));
	    			  })
	    			  .error(function(data, status, headers, config) {
	    				  console.log(data);
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
	
	});


//==============Admin Logout===============
batsAdminHome.controller('logoutAdminUser', function($scope, $http, $localStorage) {
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	$scope.customer = {};
	$scope.logoutAdminSubmit = function() {
		swal({   title: "Are you sure? You want to logout?",   
	    	text: "",   
	    	type: "warning",   
	    	showCancelButton: true,   
	    	confirmButtonColor: "#DD6B55",   
	    	confirmButtonText: "Yes, Logout!",   
	    	cancelButtonText: "No, cancel it!",   
	    	closeOnConfirm: false,   
	    	closeOnCancel: false },
	    	function(isConfirm){  
	    		if (isConfirm) {  
	    			$scope.customer.token = $scope.token;
	    			//$scope.customer.id = $scope.token;
	    			console.log(JSON.stringify($scope.customer));
	    			$http({
	    			  method  : 'POST',		  
	    			  url     : apiURL+'logout',
	    			  data    : JSON.stringify($scope.customer), 
	    			  headers : { 'Content-Type': 'application/json' }
	    			 })
	    			  .success(function(data) {
	    			  $scope.data = data;
	    			  $localStorage.$reset();
	    			  window.location = apiURL;
	    			  console.log(JSON.stringify($scope.data));
	    			  })
	    			  .error(function(data, status, headers, config) {
	    				  console.log(data);
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
	});

//==============General Logout===============
batsGeneralHome.controller('logoutGeneralUser', function($scope, $http, $localStorage) {
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	$scope.customer = {};
	$scope.logoutGeneralSubmit = function() {
		swal({   title: "Are you sure? You want to logout?",   
	    	text: "",   
	    	type: "warning",   
	    	showCancelButton: true,   
	    	confirmButtonColor: "#DD6B55",   
	    	confirmButtonText: "Yes, Logout!",   
	    	cancelButtonText: "No, cancel it!",   
	    	closeOnConfirm: false,   
	    	closeOnCancel: false },
	    	function(isConfirm){  
	    		if (isConfirm) {  
	    			$scope.customer.token = $scope.token;
	    			//$scope.customer.id = $scope.token;
	    			console.log(JSON.stringify($scope.customer));
	    			$http({
	    			  method  : 'POST',		  
	    			  url     : apiURL+'logout',
	    			  data    : JSON.stringify($scope.customer), 
	    			  headers : { 'Content-Type': 'application/json' }
	    			 })
	    			  .success(function(data) {
	    			  $scope.data = data;
	    			  $localStorage.$reset();
	    			  window.location = apiURL;
	    			  console.log(JSON.stringify($scope.data));
	    			  })
	    			  .error(function(data, status, headers, config) {
	    				  console.log(data);
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
	});
//==============Travel Desk Logout===============
batstravelDeskHome.controller('logoutTraveldeskUser', function($scope, $http, $localStorage) {
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	$scope.customer = {};
	$scope.logoutTravelDeskSubmit = function() {
		swal({   title: "Are you sure? You want to logout?",   
	    	text: "",   
	    	type: "warning",   
	    	showCancelButton: true,   
	    	confirmButtonColor: "#DD6B55",   
	    	confirmButtonText: "Yes, Logout!",   
	    	cancelButtonText: "No, cancel it!",   
	    	closeOnConfirm: false,   
	    	closeOnCancel: false },
	    	function(isConfirm){  
	    		if (isConfirm) {  
	    			$scope.customer.token = $scope.token;
	    			//$scope.customer.id = $scope.token;
	    			console.log(JSON.stringify($scope.customer));
	    			$http({
	    			  method  : 'POST',		  
	    			  url     : apiURL+'logout',
	    			  data    : JSON.stringify($scope.customer), 
	    			  headers : { 'Content-Type': 'application/json' }
	    			 })
	    			  .success(function(data) {
	    			  $scope.data = data;
	    			  $localStorage.$reset();
	    			  window.location = apiURL;
	    			  console.log(JSON.stringify($scope.data));
	    			  })
	    			  .error(function(data, status, headers, config) {
	    				  console.log(data);
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
	});
