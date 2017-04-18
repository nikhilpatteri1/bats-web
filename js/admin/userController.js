var general_emailChk;
/** Group Creation Controller 
*/
batsAdminHome.controller('userController', function($rootScope,$scope, $http, $localStorage) {
	$rootScope.menuPos=8;
	var group_list;
	var contentHeight=window.screen.availHeight-200;
	$scope.noUsers = false;
	
	$scope.histcontentheight={
			"height":contentHeight
	}
	
	$scope.token = $localStorage.data;
	console.log($scope.token);
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
 	* On typing of username in textbox of Form
    * 1) Checks username is available or not*/
$scope.verifyUser=function(userName){
		$scope.verifyUserJson={};
		$scope.verifyUserJson.token=$scope.token;
		$scope.verifyUserJson.uname=angular.lowercase(userName);
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/check',
			  data    : JSON.stringify($scope.verifyUserJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  //console.log(data.msg);
				  $scope.status=data.msg;
				  //console.log($scope.status);
				  if(data.status == true){
					  $scope.uname=true;
					  $scope.error = {uname:false};
				  }
				  else{
					  $scope.uname=false;
					  $scope.error = {uname:true};
				  }
				  
		      })
		      .error(function(data, status, headers, config) {
		    	  $scope.isSaving=true;
		    	  //console.log(data);
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

	
/**
 	* On typing of email in textbox of Form
    * 1) Checks email is available or not*/	
	$scope.verifyEmail=function(userEmail){
		$scope.verifyEmailJson={};
		$scope.verifyEmailJson.token=$scope.token;
		$scope.verifyEmailJson.email=userEmail;
		$scope.verifyEmailJson.uname = general_emailChk;
		console.log(JSON.stringify($scope.verifyEmailJson));
		$http({
		      method  : 'POST',		  
		      url     : apiURL+'user/emailcheck',
			  data    : JSON.stringify($scope.verifyEmailJson), 
			  headers : { 'Content-Type': 'application/json' }
		     })
			  .success(function(data) {
				  //console.log(data.msg);
				  $scope.statusMail=data.msg;
				  if(data.status == true){
					  $scope.umail=true;
					  $scope.error_mail = {umail:false};
				  }
				  else{
					  $scope.umail=false;
					  $scope.error_mail = {umail:true};
				  }
		      })
		      .error(function(data, status, headers, config) {
		    	  $scope.isSaving=true;
		    	  //console.log(data);
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
	
/**
 	* On Create User Form
    * 1) Select Group on click of checkbox & viceversa*/
	$scope.selection = {}; 
	$scope.selectionLength=0;
    $scope.group = group_list;        
    $scope.$watch(function() {
        return $scope.selection.ids;
    }, function(value) {
        $scope.selection.objects = [];
        angular.forEach($scope.selection.ids, function(v, k) {
            v && $scope.selection.objects.push(getCategoryById(k));   
           console.log($scope.selection.objects);
           $scope.selectionLength=$scope.selection.objects.length;
        });        
    }, true);
    var temp=0;
    function getCategoryById (gid) {
        for (var i = 0; i < $scope.group.length; i++) {
        	console.log(i+temp);
            if ($scope.group[i].gid == gid) {
            	temp++;
            	// $scope.selectionLength=temp;
                return $scope.group[i];
            }
        }
    };
	  
/**
 	* On Submit of Create User Form
*/
    $scope.reset=function(){
    	$scope.user={};
    	$scope.createUserForm.$setPristine();
    	$scope.selection = {}; 
    	$('.showUpdateUser').hide();
    	$scope.error_mail = {"umail":false};
    };
    $scope.resetUpdate=function(){
    	$scope.user={};
    	$scope.createUserForm.$setPristine();
    	$scope.selection = {}; 
    	$('.showUpdateUser').hide();
    	$scope.error_mail = {"umail":false};
    };
	$scope.submitCreateUserForm = function() {
	var groupList = $scope.selection.objects;
	//console.log(JSON.stringify(groupList));
	var resultGlistJson = [];
	for (var key in groupList) {
	if (groupList.hasOwnProperty(key)) {
		resultGlistJson.push({
	   'gid': groupList[key].gid,
	   'gname': groupList[key].gname
	});
	}
	}
	//console.log(JSON.stringify(resultGlistJson));
	$scope.user.glist = resultGlistJson;
	$scope.user.token = $scope.token;
	$scope.user.uname=angular.lowercase($scope.user.uname);
	//$scope.user.contact_no = '+91'+$scope.user.contact_no;
	//console.log(JSON.stringify($scope.user));
	
    $http({
      method  : 'POST',		  
      url     : apiURL+'user/create',
	  data    : JSON.stringify($scope.user), 
	  headers : { 'Content-Type': 'application/json' }
     })
	  .success(function(data) {
		  swal({title: "User Created Successfully",
			   text: "Success!",   
			   type: "success",   
			   confirmButtonColor: "#9afb29",   
			   closeOnConfirm: false }, 
			   function(){   
				   $scope.data = data;
				   //console.log(JSON.stringify($scope.data));
				   location.reload();
				   $('#createUserModal').modal('hide');
		});
      })
      .error(function(data, status, headers, config) {
    	  //swal(data);
    	  if (data.err == "Expired Session") {
				$('#updateDeviceModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				$('#updateDeviceModal').modal('hide');
				invalidUser();
				$localStorage.$reset();
			}
    	  console.log(data);
    	  console.log(status);
    	  console.log(headers);
    	  console.log(config);
	  });
    };
    



/**
* Load Group list 
* 1) on load of page load the group list in the dropdown*/
	$scope.loadGroups=function(){
		$scope.user = {"token":$scope.token};
		//console.log($scope.user);
	    $http({
	      method  : 'POST',		  
	      url     : apiURL+'group/list',
		  data    : JSON.stringify($scope.user), 
		  headers : { 'Content-Type': 'application/json' }
	     })
		  .success(function(data) {
		  //$scope.customerGroups = data;
		  $scope.group = data.glist;
		  //console.log(JSON.stringify($scope.group));
		  group_list = data.glist;
		  //console.log(JSON.stringify(group_list));
		  if(group_list.length == 0){
			  $scope.noGroups = true;
		  }
		  //$scope.loadDevice();
	      })
	      .error(function(data, status, headers, config) {
	    	  if (data.err == "Expired Session") {
					$('#updateDeviceModal').modal('hide');
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {
					$('#updateDeviceModal').modal('hide');
					invalidUser();
					$localStorage.$reset();
				}
	    	  console.log(data.err);
	    	  console.log(status);
	    	  console.log(headers);
	    	  console.log(config);
		  });
	};
	


/**
   * Load User list 
   * 1) on load of page load the username is displayed in the user list grid*/
				$scope.user = {"token":$scope.token};
				//console.log(JSON.stringify($scope.user));
				$http({
				  method  : 'POST',		  
				  url     :apiURL+'user/list',
				  data    : JSON.stringify($scope.user), 
				  headers : { 'Content-Type': 'application/json' }
				 })
				  .success(function(data) {
				  $scope.ulist = data;
				 console.log(JSON.stringify($scope.ulist));
				  if(data.length == 0){
					  $scope.noUsers = true;
				  }
				  $scope.glist = data;
				  //console.log(JSON.stringify($scope.glist));
				  
				  var users = [];
                  for(i=0;i<data.length;i++){
                      console.log(JSON.stringify(data[i].uname));
                      var user = data[i].uname;
                      users.push(user);
                  }
                  //console.log(JSON.stringify(users));
                  
                  /**
                   * User Max Account Limit Count & Hide Add User Button
                   * */
                  $scope.users = {"token":$scope.token};
                    //console.log($scope.user);
                    $http({
                      method  : 'POST',       
                      url     : apiURL+'customer/detail',
                      data    : JSON.stringify($scope.users), 
                      headers : { 'Content-Type': 'application/json' }
                     })
                      .success(function(data) {
                      var acc_limit = data.user_acc_limit;
                      //console.log(JSON.stringify(data.user_acc_limit));
                      //console.log(JSON.stringify(users.length));
                      //console.log(JSON.stringify(acc_limit));
                      if(users.length < acc_limit){
                          $scope.addUser = true;
                      }
                      else{
                          $scope.addUser = false;
                      }
                      
                      })
                      .error(function(data, status, headers, config) {
                          console.log(data.err);
                          console.log(status);
                          console.log(headers);
                          console.log(config);
                      });
                    
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
   * On Click of Delete Icon
   * 1)Delete Details of particular Group*/            
				            $scope.submitDeleteuser = function(uname) {
				            	swal({   title: "Are you sure?",   
				                	text: "You want to delete this User?",   
				                	type: "warning",   
				                	showCancelButton: true,   
				                	confirmButtonColor: "#DD6B55",   
				                	confirmButtonText: "Yes, delete it!",   
				                	cancelButtonText: "No, cancel it!",   
				                	closeOnConfirm: false,   
				                	closeOnCancel: false }, 
				                	function(isConfirm){   
				                		if (isConfirm) {     
				                	    	$scope.user.token = $scope.token;
				                	    	$scope.user.uname = uname;
				                	    	//console.log(JSON.stringify($scope.group));
				                	        $http({
				                	          method  : 'POST',		  
				                	          url     : apiURL+'user/delete',
				                	    	  data    : JSON.stringify($scope.user), 
				                	    	  headers : { 'Content-Type': 'application/json' }
				                	         })
				                	    	  .success(function(data) {
				                	    		  //console.log(data);
				                	    			  swal({title: "User Deleted Successfully",
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
				                			} 
				                		else {     
				                			swal("Cancelled", "You have cancelled :)", "error");   
				                			} 
				                		});
				                };
				                
	
/**
	* On Click of Edit Icon
	* 1)Fetch Details of Particular User
	* 2)Display Fetched Details & Dispaly on the Form
	* 3)Show Update Button & Hide Create Button
	* 4)Show Update Title & Hide Create Title
	* 5)Hide Password Field from Form*/
				                 $scope.submitEditUser = function(uname) {
				                	 var res;
				                         $scope.btn = {
				                             update: true,
				                             create: false
				                         };
				                         $scope.title = {
				                             update: true,
				                             create: false
				                             };
				                         $scope.password = {
					                             update: false,
					                             };
				                    //$scope.truefalse = true;
				                 	$scope.user = {};
				                 	$scope.user.token = $scope.token;
				                 	$scope.user.uname = uname;
				                 	//console.log(JSON.stringify($scope.group));
				                     $http({
				                       method  : 'POST',		  
				                       url     : apiURL+'user/info',
				                 	  data    : JSON.stringify($scope.user), 
				                 	  headers : { 'Content-Type': 'application/json' }
				                      })
				                 	  .success(function(data) {
				             			  $scope.userUpdate = data;
				             			  general_emailChk = data.uname;
				                          //console.log(JSON.stringify($scope.userUpdate));
				                          var editGroupList = data.glist;
				                          var Result_editGroupList = [];
				                          //console.log(JSON.stringify(editGroupList));
				                          for (var key in editGroupList) {
				                        		if (editGroupList.hasOwnProperty(key)) {
				                        			Result_editGroupList.push({
				                        		   'gid': editGroupList[key].gid
				                        		});
				                        		}
				                        		}
				                          var jsonResult={};
				                          for(i=0;i<Result_editGroupList.length;i++){
				                        	  var keyPart = Result_editGroupList[i].gid;
				                        	  var value=true;
				                        	  jsonResult[keyPart]=value;
				                        	  //console.log(JSON.stringify(jsonResult));			                        	  
				                          }
				                          //console.log(JSON.stringify(data));
				                          $scope.selection.ids =  jsonResult;
				                          /*var mobile_no = data.contact_no.slice(3);
				            			  $scope.userUpdate.contact_no = mobile_no;*/
				                          //console.log(JSON.stringify($scope.userUpdate));
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
   * 1)Update Details of particular User*/
				                           $scope.submitEditUserForm = function() {
				                        	   var groupList = $scope.selection.objects;
				                        		//console.log(JSON.stringify(groupList));
				                        		var resultGlistJson = [];
				                        		for (var key in groupList) {
				                        		if (groupList.hasOwnProperty(key)) {
				                        			resultGlistJson.push({
				                        		   'gid': groupList[key].gid,
				                        		   'gname': groupList[key].gname
				                        		});
				                        		}
				                        		}
				                        		//console.log(JSON.stringify(resultGlistJson));
				                        	$scope.userUpdate.glist = resultGlistJson;
				                           	$scope.userUpdate.token = $scope.token;
				                           	$scope.userUpdate.uname=angular.lowercase($scope.userUpdate.uname);
				                        	//$scope.userUpdate.contact_no = '+91'+$scope.userUpdate.contact_no;
				                        	//console.log(JSON.stringify($scope.userUpdate));
				                               $http({
				                                 method  : 'POST',		  
				                                 url     : apiURL+'user/update',
				                           	  data    : JSON.stringify($scope.userUpdate), 
				                           	  headers : { 'Content-Type': 'application/json' }
				                                })
				                           	  .success(function(data) {
				                           		  swal({title: "User Updated Successfully",
				                          			   text: "Success!",   
				                          			   type: "success",   
				                          			   confirmButtonColor: "#9afb29",   
				                          			   closeOnConfirm: false }, 
				                          			   function(){   
				                          				$scope.user = data;
				                                       //console.log(JSON.stringify($scope.user));
				                                       location.reload();
				                          		});
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
				                               	  else if(data.err == "Email Exist"){
				                          		  swal("Email Id already exists. Enter different mail id."); 
				                               		}
				                               	  console.log(status);
				                               	  console.log(headers);
				                               	  console.log(config);
				                           	  });
				                               };				                     
				                     
				                     
/**
	* On Click of Edit Icon
	 * 1)Show Create Button & Hide Update Button
	 * 2)Show Create Title & Hide Update Title
	 * 3)Show password field*/      
		$scope.showCreateBtn = function() {
		$('#createUserModal').find('form')[0].reset();
		general_emailChk = "";
		  $scope.btn = {
			create: true,
			update: false
		 };
	    $scope.title = {
		    create: true,
			update: false
		 };
	    $scope.password = {
                update: true
                };
       };

/**
   	* On Click of Group Select in Update User
   	 * 1)Show & Hide Update Button*/ 
       $scope.check=function(){
			if($('ul.assignedList1 li').length > 3){
				 //alert("showU");
				 $('.showUpdateUser').show();
			 }
			 else{
				 //alert("hideU");
				 $('.showUpdateUser').hide();
			 }
		}
       
       $scope.reset=function(){
   		//$scope.group={};
   		$scope.createUserForm.$setPristine();
   		$scope.createUserForm.$setUntouched();
   		//$scope.selection=[];
   		/*
   		 * function defintion is written in admin.html page 
   		 * becoz it operates via jquery show hide\
   		 * --- showPrev() is used to show the home form of udpate group ----
   		 * */ 
   		//showPrev();
   	};
       
       $scope.clearForm = function(){
    		$('#createUserModal').find('form')[0].reset();
    	};     
       

});


