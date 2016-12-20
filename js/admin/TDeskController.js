batsAdminHome.controller('TDcontroller',function($scope,$http,$localStorage){
	$scope.token = $localStorage.data;
	//console.log($scope.token);
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
	
	$scope.reset = function(){
		document.getElementById("TravelDesk").reset();
		$scope.travelDeskForm.$setPristine();
		$scope.travelDeskForm.$setUntouched();	
	};
	
	$scope.resetUpdate=function(){
    	$scope.user={};
    	$scope.updateUserForm.$setPristine();
    	$scope.selection = {}; 
    	$('.showUpdateUser').hide();
    	$scope.error_mail = {"umail":false};
    };
	
	$scope.userinfo = function(){
		console.log("entered the userinfo");
		$scope.userinfObj={};
		$scope.userinfObj.token = $scope.token;
		console.log($scope.userinfObj);
		
		$http({
			method:'POST',
			url:apiURL+'traveldesk/userinfo',
			data: JSON.stringify($scope.userinfObj),
			headers:{'Content-Type':'application/json'}
		})
		.success(function(data){
			console.log(data);
			if(data.err == "Travel desk user not found")
			{
				$('#createTDModal').modal('show');		
			}
		
			else{
				$scope.updateEditModal(data,function(){
					$('#updateTDModal').modal('show');
				});	
			}		
		})
		.error(function(data,status,headers,config){
			if(data.err == "Expired Session")
				  {	  expiredSession();
				      $localStorage.$reset();
				  }
		       	  else if(data.err == "Invalid User"){
		       		  invalidUser();
		   			  $localStorage.$reset();  
		       	  }   	  
		})
		
	}
    
    
    
    
    
	$scope.submitTDform =function(){
		$scope.createTDobject ={};
		$scope.createTDobject.token = $scope.token;
		$scope.createTDobject.uname = $scope.travelDesk.Tdname;
		$scope.createTDobject.password = $scope.travelDesk.tdpassword;
		$scope.createTDobject.email = $scope.travelDesk.Email;
		$scope.createTDobject.contact_no =$scope.travelDesk.tdcontact;
		$scope.createTDobject.desc = $scope.travelDesk.desc;
		console.log(JSON.stringify($scope.createTDobject));
		
		$http({
			method:'POST',
			url: apiURL+'traveldesk/createuser',
			data: JSON.stringify($scope.createTDobject),
			headers:{'Content-Type':'application/json'}
		})
		.success(function(data){
			console.log(data);
			swal({title: "Travel Desk User Created Succesfully",
				text:"Success!",
				type:"success",
				confirmButtonColor:"#9afb29",
				closeOnConfirm:true} ,
				function(){
				$('#createTDModal').modal('hide');
			});
			})
			.error(function(data,status,headers,config){
				if(data.err == "Expired Session"){
					$('#createTDModal').modal('hide');
					expiredSession();
					$localStorage.$reset();	
				}
				else if (dat.err == "Invalid User"){
					/*$('#driverCreateModal').modal('hide');*/
		       		  invalidUser();
		   			  $localStorage.$reset();
				}	
			});
		}
	

	
	$scope.updateEditModal = function(data,callModal){
		$scope.travelDesk = data;
		$scope.travelDesk.Tdname = data.uname;
		$scope.travelDesk.Email =data.email;
		$scope.travelDesk.tdcontact = data.contact_no;
		$scope.travelDesk.desc = data.desc;
		callModal();
	}
	
	$scope.submitEditUserForm1 = function() {
		
		$scope.updateTDobj = {};
		$scope.updateTDobj.token =$scope.token;
		$scope.updateTDobj.uname = $scope.travelDesk.Tdname;
		$scope.updateTDobj.email = $scope.travelDesk.Email;
		$scope.updateTDobj.contact_no =$scope.travelDesk.tdcontact;
		$scope.updateTDobj.desc = $scope.travelDesk.desc;
		
		$http({
			method:'POST',
			url:apiURL+'traveldesk/updateuser',
			data: JSON.stringify($scope.updateTDobj),
			headers:{'Content-Type':'application/json'}
		})
		.success(function(data){
			console.log(data);
			swal({title: "Travel Desk User Updated Succesfully",
				text:"Success!",
				type:"success",
				confirmButtonColor:"#9afb29",
				closeOnConfirm:true},
				function(){
				$('#updateTDModal').modal('hide');
				
			});
		})
		.error(function(data,status,headers,config){
			if(data.err == "Expired Session"){
				/*$('#travel_desk_model').modal('hide');*/
				expiredSession();
				$localStorage.$reset();	
			}
			else if (dat.err == "Invalid User"){
				/*$('#driverCreateModal').modal('hide');*/
	       		  invalidUser();
	   			  $localStorage.$reset();
			}
			
		});
		
	}
	
});

