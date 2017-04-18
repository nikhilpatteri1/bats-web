//==============Factory Login Form===============
batsLogin.controller('loginController', function($rootScope,$scope, $http, $localStorage) {
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
	  		window.location = "/admin/dashboard";
	  	  }
	  	  else if($scope.token.charAt(9)==="2"){
	  		$('#loginModal').modal('hide');
	  		$localStorage.data = $scope.token;	  		
	  		window.location = "/general/dashboard";
	  	  }
	  	 else if($scope.token.charAt(9)==="3"){
		  		$('#loginModal').modal('hide');
		  		$localStorage.data = $scope.token;
		  		window.location = "/traveldesk/dashboard";
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
			  		 $('.navbar').addClass('header');
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
			  		window.location = "/admin/dashboard";
			  	  }
			  	  else if($scope.token.charAt(9)==="2"){
			  		$('#loginModal').modal('hide');
			  		//$localStorage.data = $scope.token;
			  		window.location = "/general/dashboard";
			  	  }
			  	else if($scope.token.charAt(9)==="3"){
			  		$('#loginModal').modal('hide');
			  		//$localStorage.data = $scope.token;
			  		window.location = "/traveldesk/dashboard";
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
						  swal({title:"Status",text:data.msg},function(){
							  $('#fgtModal').modal('hide');
							  $('.navbar').addClass('header');
						  });
						  
						  
				      })
				      .error(function(data, status, headers, config) {
				    	  swal(data.err);
				    	  console.log(data);
				    	  console.log(status);
				    	  console.log(headers);
				    	  console.log(config);
				    	  $('.navbar').addClass('header');
					  });
				   
				}, 2000); 
			});
    };
});


/**
 * Change Password Factory*/
//==============Factory User Create Form===============
batsfactoryhome.controller('changePwdform', function($rootScope,$scope,$http,$localStorage) {
	$rootScope.menuPos=2;    
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	
	
	
	$scope.verifyUser=function(usercurpwd){
		$scope.verifyUserCurrPassJson={};
		$scope.verifyUserCurrPassJson.token=$localStorage.data;
		$scope.verifyUserCurrPassJson.password=usercurpwd;
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/confirmpassword',
			  data    : JSON.stringify($scope.verifyUserCurrPassJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  if(data.status == true){
					  //alert("true");
					  $scope.currPassWord = usercurpwd;
					$scope.upass=true;
					  $scope.error = {upass:false};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  //console.log(data);
		    	  $scope.statusPass=data.msg;
		    	  if(data.status == false){
		    		 // alert("false");
		    		  $scope.upass=false;
					  $scope.error = {upass:true};
		    	  }
		    	  if(data.err == "Expired Session")
    			  {
            		 $('#createUserModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		 $('#createUserModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
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
	$scope.npass =false;
	$scope.hidePasswordMismatch = function(form){
		if($scope.currPassWord == $scope.newpwd){
			$scope.npass =true;
			$scope.showRePass =false;
		}
		else{
			$scope.npass =false;
			$scope.showRePass =true;
		}
		if($scope.repwd === $scope.newpwd){
		    form.confirm_pd.$setValidity('sameAs', true)
		}
		$scope.isMismatch = false;
	}
});


/**
 * Change Password Admin*/
//==============Factory User Create Form===============
batsAdminHome.controller('changePwdformAdmin', function($rootScope,$scope,$http,$localStorage) {
	$rootScope.menuPos=13;
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	
	$scope.verifyUser=function(usercurpwd){
		$scope.verifyUserCurrPassJson={};
		$scope.verifyUserCurrPassJson.token=$localStorage.data;
		$scope.verifyUserCurrPassJson.password=usercurpwd;
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/confirmpassword',
			  data    : JSON.stringify($scope.verifyUserCurrPassJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  if(data.status == true){
					  //alert("true");
					  $scope.currPassWord = usercurpwd;
					$scope.upass=true;
					  $scope.error = {upass:false};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  //console.log(data);
		    	  $scope.statusPass=data.msg;
		    	  if(data.status == false){
		    		 // alert("false");
		    		  $scope.upass=false;
					  $scope.error = {upass:true};
		    	  }
		    	  if(data.err == "Expired Session")
    			  {
            		 $('#createUserModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		 $('#createUserModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
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
	
	$scope.npass =false;
	$scope.hidePasswordMismatch = function(form){
		if($scope.currPassWord == $scope.newpwd){
			$scope.npass =true;
			$scope.showRePass =false;
		}
		else{
			$scope.npass =false;
			$scope.showRePass =true;
		}
		if($scope.repwd === $scope.newpwd){
		    form.confirm_pd.$setValidity('sameAs', true)
		}
		$scope.isMismatch = false;
	}
});

/**
 * Change Password General*/
//==============Factory User Create Form===============
batsGeneralHome.controller('changePwdformGeneral', function($rootScope,$scope,$http,$localStorage) {
	$rootScope.menuPos=7;
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	
	
	
	$scope.verifyUser=function(usercurpwd){
		$scope.verifyUserCurrPassJson={};
		$scope.verifyUserCurrPassJson.token=$localStorage.data;
		$scope.verifyUserCurrPassJson.password=usercurpwd;
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/confirmpassword',
			  data    : JSON.stringify($scope.verifyUserCurrPassJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  if(data.status == true){
					  //alert("true");
					  $scope.currPassWord = usercurpwd;
					$scope.upass=true;
					  $scope.error = {upass:false};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  //console.log(data);
		    	  $scope.statusPass=data.msg;
		    	  if(data.status == false){
		    		 // alert("false");
		    		  $scope.upass=false;
					  $scope.error = {upass:true};
		    	  }
		    	  if(data.err == "Expired Session")
    			  {
            		 $('#createUserModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		 $('#createUserModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
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
	
	$scope.npass =false;
	$scope.hidePasswordMismatch = function(form){
	console.log($scope.currPassWord);
	console.log($scope.newpwd);
		if($scope.currPassWord == $scope.newpwd){
			$scope.npass =true;
			$scope.showRePass =false;
		}
		else{
			$scope.npass =false;
			$scope.showRePass =true;
		}
		if($scope.repwd === $scope.newpwd){
		    form.confirm_pd.$setValidity('sameAs', true)
		}
		$scope.isMismatch = false;
	}
});
/*
 * ============================================>>>>>> Change Password <<<<<<===========================================
 * */

/*-------------------------------Change password for Traveldesk-----------------------*/

batstravelDeskHome.controller('changePwdformTraveldesk', function($rootScope,$scope,$http,$localStorage) {
	$rootScope.menuPos= 3; 
	$scope.changepwdjson={};
	$scope.reset=function(){
		document.getElementById("changePwdFrm").reset();
		$scope.changePwd.$setPristine();
		$scope.newpwd="";
		$scope.repwd="";
		$scope.isMismatch="";
	};
	
	$scope.verifyUser=function(usercurpwd){
		$scope.verifyUserCurrPassJson={};
		$scope.verifyUserCurrPassJson.token=$localStorage.data;
		$scope.verifyUserCurrPassJson.password=usercurpwd;
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/confirmpassword',
			  data    : JSON.stringify($scope.verifyUserCurrPassJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  if(data.status == true){
					  //alert("true");
					  $scope.currPassWord = usercurpwd;
					$scope.upass=true;
					  $scope.error = {upass:false};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  //$scope.isSaving=true;
		    	  //console.log(data);
		    	  $scope.statusPass=data.msg;
		    	  if(data.status == false){
		    		 // alert("false");
		    		  $scope.upass=false;
					  $scope.error = {upass:true};
		    	  }
		    	  if(data.err == "Expired Session")
    			  {
            		 $('#createUserModal').modal('hide');
    			      expiredSession();
    			      $localStorage.$reset();
    			  }
	        	  else if(data.err == "Invalid User"){
	        		 $('#createUserModal').modal('hide');
	        		  invalidUser();
	    			  $localStorage.$reset();  
	        	  }
		    	  console.log(status);
		    	  console.log(headers);
		    	  console.log(config);
			  });
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
	
	$scope.npass =false;
	$scope.hidePasswordMismatch = function(form){
		if($scope.currPassWord == $scope.newpwd){
			$scope.npass =true;
			$scope.showRePass =false;
		}
		else{
			$scope.npass =false;
			$scope.showRePass =true;
		}
		if($scope.repwd === $scope.newpwd){
		    form.confirm_pd.$setValidity('sameAs', true)
		}
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
	console.log("check");
	/*$rootScope.menuPos = 3;*/
	$scope.token = $localStorage.data;
	//console.log($scope.token);
	$scope.customer = {};
	$scope.logoutTravelDeskSubmit = function() {
		console.log("checksuvmut");
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
	    			  console.log("checkS");
	    			  })
	    			  .error(function(data, status, headers, config) {
	    				  console.log("checkE")
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
