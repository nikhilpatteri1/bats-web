/** Group Creation Controller 
*/
batsAdminHome.controller('groupController', function($rootScope,$scope, $http, $localStorage) {
	$rootScope.menuPos=7;
	var contentHeight=window.screen.availHeight-200;
	$scope.histcontentheight={
			"height":contentHeight
	}
	var posArray;
	var geofence;
	var centerVal = {lat: 21.0000, lng: 78.0000};
	
	$scope.token = $localStorage.data;
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
		 
	}console.log("contry "+$scope.selectedcountry);
	/**------------------------------------
	 * for enabling geo fence based on user choice
	 * is performed here----------------------------------------------------------------------------*/
	$scope.geoChoiceRadio = '1';
	$scope.IsgeoFence=function(inc){
		return inc===$scope.geoChoiceRadio;
	};
	
	
	/*
	 Hardcoded Values of Alive Frequency
	 */
	var aliveFrequency = [2,5,7,10];
	$scope.alive_frequency = aliveFrequency;
	
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
		console.log("contry "+$scope.country);
	/*
	 Hardcoded Country & State Values
	 
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
		*/
		
		/**------------------------------------------------------------------------------------------------------------------------
		* 												Add Multiple Contact Numbers Begins Here
	   ------------------------------------------------------------------------------------------------------------------------*/	
		$scope.choices = [{}];
		if($scope.choices.length == 1){
			$scope.hide_remove = false;
		}
		if($scope.choices.length < 4){
			  $scope.hide_btn = false;
			  }
		$scope.addNewChoice = function() {
		  $scope.choices.push({});
		  if($scope.choices.length == 4){
		  $scope.hide_btn = true;
		  }
		  if($scope.choices.length > 1){
				$scope.hide_remove = true;
			}
		};  
		$scope.removeChoice = function(val) {
			console.log(val);	  
		  $scope.choices.splice(val);
		  if($scope.choices.length < 4){
		  $scope.hide_btn = false;
		  }
		  if($scope.choices.length == 1){
				$scope.hide_remove = false;
			}
		};
		/**------------------------------------------------------------------------------------------------------------------------
		* 												Add Multiple Contact Numbers Ends Here
		------------------------------------------------------------------------------------------------------------------------*/
		
/**
* Load Group list 
* 1) on load of page load the Group_name, Country, State in the dropdown
* 2) Load Group details in grid*/
			$scope.customer = {};
			$scope.customer.token = $scope.token;
			//$scope.customer.id = $scope.token;
			console.log(JSON.stringify($scope.customer));
			$http({
			  method  : 'POST',		  
			  url     :apiURL+'group/list',
			  data    : JSON.stringify($scope.customer), 
			  headers : { 'Content-Type': 'application/json' }
			 })
			  .success(function(data) {
			  var glist = data.glist;
			  console.log(JSON.stringify(glist));
			  if(glist.length == 0){
				  $scope.noGroupList = true;
				  $scope.yesGrouplist=false;
			  }
			  else if(glist.length != 0){
				  $scope.noGroupList = false;
				  $scope.yesGrouplist=true;
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
			
/**
* Load Device list 
* 1) on page load the devices is loaded*/
	$scope.loadDevices=function(){
		$scope.user = {"token":$scope.token};
		//console.log($scope.user);
	    $http({
	      method  : 'POST',		  
	      url     : apiURL+'device/list',
		  data    : JSON.stringify($scope.user), 
		  headers : { 'Content-Type': 'application/json' }
	     })
		  .success(function(data) {
		  $scope.customerDevices = data.un_allocated;
		  $scope.FActoryStock=$scope.customerDevices;
		   console.log($scope.FActoryStock.length);
		   $scope.FactoryStockCount=$scope.FActoryStock.length;
		  
		  console.log(JSON.stringify($scope.customerDevices));
		  $scope.presentStock = true;
		  if(data.un_allocated.length == 0){
			  $scope.noDevices = true;
			  $scope.presentStock = false;
		  }
		  //$scope.loadDevice();
	      })
	      .error(function(data, status, headers, config) {
	    	  if(data.err == "Expired Session")
			  {
			      expiredSession();
			      $localStorage.$reset();
			  }
        	  else if(data.err == "Invalid User"){
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
* On Selection and On Remove of device
* 1)selecting device from un allocated
* 2)Remove device from assigned*/
	$scope.selection=[];
	$scope.toggleSelectDevice = function toggleSelectDevice(deviceID) {
		
		$scope.noDevices = false;
		$scope.presentStock = true;
		var selArr=eval($scope.selection);
		var idx =-1;
		for(var inc=0;inc<selArr.length;inc++){			
			if(selArr[inc].devid===deviceID){
				idx=inc;
				break;
			}
		}
	    //var idx = $scope.selection.indexOf(deviceID);
	    // is currently selected
	    if (idx > -1) {
	     $scope.customerDevices.push(_.findWhere($scope.selection,{"devid":deviceID}));
	      $scope.selection.splice(idx, 1);
	      $scope.FactoryStockCount=$scope.FactoryStockCount+1;
	      //console.log($scope.selection);
	    }

	    // is newly selected
	    else {	    	
	      $scope.selection.push(_.findWhere($scope.customerDevices,{"devid":deviceID}));
	      console.log(JSON.stringify($scope.selection));
	      console.log(JSON.stringify($scope.customerDevices));
	      var index = -1;		
			var comArr = eval( $scope.customerDevices );
			//console.log($scope.rows);
			for( var i = 0; i < comArr.length; i++ ) {
				if( comArr[i].devid === deviceID ) {
					index = i;
					break;
				}
			}
			if( index === -1 ) {
				alert( "Something gone wrong" );
			}
			  $scope.FactoryStockCount=$scope.FactoryStockCount-1;
			$scope.customerDevices.splice( index, 1 );	
			//console.log(JSON.stringify($scope.customerDevices));
	    }
	  };
	  

/**
  * On typing of groupname in textbox of Form
  * 1) Checks groupname is available or not*/
	$scope.verifyGroup=function(groupName){
			$scope.verifyGroupJson={};
			$scope.verifyGroupJson.token=$scope.token;
			$scope.verifyGroupJson.gname=angular.lowercase(groupName);
			$http({
			      method  : 'POST',		  
			      url     : apiURL+'gname/available_check',
				  data    : JSON.stringify($scope.verifyGroupJson), 
				  headers : { 'Content-Type': 'application/json' }
			     })
				  .success(function(data) {
					  //console.log(data);
					  $scope.status=data.msg;
					  console.log($scope.status);
					  if(data.status == true){
						  $scope.gname=false;
						  $scope.error = {gname:false};
					  }
					  else{
						  $scope.gname=true;
						  $scope.error = {gname:true};
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
 	* On Submit of Create Group Form
*/
	$scope.reset=function(){
		$scope.group={};
		$scope.createGroupForm.$setPristine();
		$scope.createGroupForm.$setUntouched();
		$scope.selection=[];
		/*
		 * function defintion is written in admin.html page 
		 * becoz it operates via jquery show hide\
		 * --- showPrev() is used to show the home form of udpate group ----
		 * */ 
		//showPrev();
	};
	$scope.group = {};
	
	$scope.submitCreateGroupForm = function() {
	$scope.group.token = $scope.token;
	$scope.group.geofence = posArray;
	var deviceList=[];
		var dev_len=$scope.selection.length;
		for(var inc=0;inc<dev_len;inc++){
			deviceList.push($scope.selection[inc].devid);
		}
	$scope.group.devlist=deviceList;
	$scope.group.gname=angular.lowercase($scope.group.gname);
	/*var cno = [];
	cno.push($scope.group.contact_num);
	$scope.group.contact_num = cno;*/
	//var alive_frequency = $scope.groups.aliveFrequency;
	//console.log(JSON.stringify(alive_frequency));
	//$scope.group.alive_frequency = String(alive_frequency * 60);
	//console.log(JSON.stringify($scope.group.alive_frequency));
	//console.log($scope.group.devlist);
	var cont_num = $scope.choices;
	console.log(JSON.stringify(cont_num));
	$scope.group.contacts = [];
	var contactObject = {};
	for (var key in cont_num) {
	if (cont_num.hasOwnProperty(key)) {
		contactObject = {};
		contactObject.name=cont_num[key].contact_name;
		contactObject.phone=cont_num[key].contact_num;
		contactObject.email=cont_num[key].contact_email;
		contactObject.description=cont_num[key].contact_desc;
		$scope.group.contacts.push(contactObject);
	}
	}
	//console.log(JSON.stringify(json_cont_num));
	console.log(JSON.stringify($scope.group));
	
    $http({
      method  : 'POST',		  
      url     : apiURL+'group/create',
	  data    : JSON.stringify($scope.group), 
	  headers : { 'Content-Type': 'application/json' }
     })
	  .success(function(data) {
		  console.log(JSON.stringify(data));
		  swal({title: "Group Created Successfully",
			   text: "Success!",   
			   type: "success",   
			   confirmButtonColor: "#9afb29",   
			   closeOnConfirm: false }, 
			   function(){   
				   $scope.data = data;
				   console.log(JSON.stringify($scope.data));
				   location.reload();
				   $('#createGroupModal').modal('hide');
		});
      })
      .error(function(data, status, headers, config) {
    	  //swal(data.status);
    	  swal({ 
			   title: data.status,
		  	   text: "Try with different group name",   
		  	   type: "warning",   
		  	   confirmButtonColor: "#ff0000",   
		  	   closeOnConfirm: false }, 
		  	   function(){   
		  		 location.reload();
		  });
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
    * On Click of Edit Icon
    * 1)Fetch Details of Particular Group
    * 2)Display Fetched Details & Dispaly on the Form
    * 3)Show Update Button & Hide Create Button
    * 4)Show Update Title & Hide Create Title*/
    $scope.submitEditGroup = function(gid) {
    	
    	/**------------------------------------------------------------------------------------------------------------------------
		* 												Add Multiple Contact Numbers Begins Here
	   ------------------------------------------------------------------------------------------------------------------------*/	
		$scope.choices = [{}];
		if($scope.choices.length == 1){
			$scope.hide_remove = false;
		}
		if($scope.choices.length < 4){
			  $scope.hide_btn = false;
			  }
		$scope.addNewChoice = function() {
		  $scope.choices.push({});
		  if($scope.choices.length == 4){
		  $scope.hide_btn = true;
		  }
		  if($scope.choices.length > 1){
				$scope.hide_remove = true;
			}
		};  
		$scope.removeChoice = function(val) {
			console.log(val);
			console.log($scope.choices);
		  //var lastItem = $scope.choices.length-1;
		  $scope.choices.splice(val);
		  if($scope.choices.length < 4){
		  $scope.hide_btn = false;
		  }
		  if($scope.choices.length == 1){
				$scope.hide_remove = false;
			}
		};
		/**------------------------------------------------------------------------------------------------------------------------
		* 												Add Multiple Contact Numbers Ends Here
		------------------------------------------------------------------------------------------------------------------------*/
		
            $scope.btn = {
                update: false,
                create: true
            };
            $scope.title = {
                    update: true,
                    create: false
                };
            $scope.createGroupState = false;
            $scope.editGroupState = true;
        $scope.truefalse = true;
    	$scope.group = {};
    	$scope.group.token = $scope.token;
    	$scope.group.gid = gid;
    	//console.log(JSON.stringify($scope.group));
        $http({
          method  : 'POST',		  
          url     : apiURL+'group/info',
    	  data    : JSON.stringify($scope.group), 
    	  headers : { 'Content-Type': 'application/json' }
         })
    	  .success(function(data) {    		  
			  $scope.group = data;
              console.log(JSON.stringify($scope.group));
              $scope.selection = $scope.group.devlist;
              var edit_cont_num = data.contacts;
              //lconsole.log(JSON.stringify(edit_cont_num));
	      		var edit_choices = [];
	      		$scope.choices = edit_choices;
	      		for (var i in edit_cont_num) {	      			
	      		if (edit_cont_num.hasOwnProperty(i)) {
	      			edit_choices.push({
	      			'contact_name': edit_cont_num[i].name,
	      			'contact_email': edit_cont_num[i].email,
	      		    'contact_num': edit_cont_num[i].phone,
	      		    'contact_desc':edit_cont_num[i].description
	      		    
	      		});
	      		}
	      		} 		
	      		//console.log(JSON.stringify($scope.choices));
	      		
              geofence = $scope.group.geofence;
              var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
              if(geofence.length == 0){
          		centerVal = {lat: 21.0000, lng: 78.0000};
          	  }
              else{
            	  for(inc=0;inc<geofence.length;inc++){
  				  	lat_tot += Number(geofence[inc].lat);
  					lg_tot +=  Number(geofence[inc].long);
  				  }
  				  lat_avg = lat_tot / geofence.length;
  				  lg_avg = lg_tot / geofence.length;
  				  //centerVal = lat_avg+","+lg_avg;
  				  centerVal = {lat: lat_avg, lng: lg_avg};  
              }
              //console.log(JSON.stringify(centerVal));
				  
              /*var mobile_no = data.contact_num;
              var contact_number;
              for(i=0;i<mobile_no.length;i++){
            	  contact_number = mobile_no[i];
            	  //console.log(contact_number);
              }
              var contact_num = contact_number.slice(3);
			  //console.log(contact_num);
			  $scope.group.contact_num = contact_num;*/
              //var update_alive_frequency = Number($scope.group.alive_frequency);
              //console.log(JSON.stringify(update_alive_frequency));
              //$scope.aliveFrequency = update_alive_frequency/60;
              //$scope.groups = {"aliveFrequency": $scope.aliveFrequency};
              //console.log(JSON.stringify($scope.groups.aliveFrequency));
	      		/**
	        	 * hide & show, add more & remove contact button */
	        	if($scope.choices.length == 4){
	    			  $scope.hide_btn = true;
	    	    }
	        	if($scope.choices.length > 1){
					$scope.hide_remove = true;
				}
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
   * On Click of Edit Icon
   * 1)Show Create Button & Hide Update Button
   * 2)Show Create Title & Hide Update Title*/      
        $scope.showCreateBtn = function() {
            $scope.btn = {
            	create: false,
                update: true
            };
            $scope.title = {
                	create: true,
                    update: false
            };
            $scope.createGroupState = true;
            $scope.editGroupState = false;
        };
        
/**
   * On Click of Update Button
   * 1)Update Details of particular Group*/
        $scope.submitEditGroupForm = function() {
        	//$scope.group = {};
        	$scope.group.token = $scope.token;
        	$scope.group.gid = $scope.group.gid;
        	$scope.group.gname=angular.lowercase($scope.group.gname);
        	 /*if(Object.prototype.toString.call( $scope.group.contact_num ) != '[object Array]'){
        		 var cno = [];
        		 cno.push($scope.group.contact_num);
        		 $scope.group.contact_num = cno;
        	 }*/
        	//console.log($scope.group.contact_num);
        	//$scope.group.contact_num=[$scope.group.contact_num];
        	//$scope.group.geofence = posArray;
        	//$scope.group.geofence = geofence;
        	if(posArray == null){
        		$scope.group.geofence = geofence;
        	}
        	else{
        		$scope.group.geofence = posArray;
        	}
        	//var alive_frequency = $scope.groups.aliveFrequency;
        	//console.log(JSON.stringify(alive_frequency));
        	//$scope.group.alive_frequency = String(alive_frequency * 60);
        	//console.log(JSON.stringify($scope.group.alive_frequency));        	
        	$scope.group.devlist=[];        	
        	for(var inc=0;inc<$scope.selection.length;inc++){        		
        		$scope.group.devlist.push($scope.selection[inc].devid)
        	}
        	var cont_num = $scope.choices;
    		$scope.group.contacts = [];
    		var contactObject = {};
    		for (var key in cont_num) {
    		if (cont_num.hasOwnProperty(key)) {
    			contactObject = {}
    			//console.log(cont_num[key].contact_name);
    			contactObject.name=cont_num[key].contact_name;
    			contactObject.phone=cont_num[key].contact_num;
    			contactObject.email=cont_num[key].contact_email;
    			contactObject.description=cont_num[key].contact_desc;
    			$scope.group.contacts.push(contactObject);
    		}
    		}
        	delete $scope.group.alive_frequency;
        	delete $scope.group.time_interval;
        	console.log(JSON.stringify($scope.group));
            $http({
              method  : 'POST',		  
              url     : apiURL+'group/modify',
        	  data    : JSON.stringify($scope.group),  
        	  headers : { 'Content-Type': 'application/json' }
             })
        	  .success(function(data) {
        		  swal({title: "Group Updated Successfully",
       			   text: "Success!",   
       			   type: "success",   
       			   confirmButtonColor: "#9afb29",   
       			   closeOnConfirm: false }, 
       			   function(){   
       				$scope.group = data;
                    console.log(JSON.stringify($scope.group));
                    location.reload();
       		});
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
            	  else if(data.err == "Email Exist"){
            		  swal("Email Id already exists. Enter different mail id."); 
            	  }
            	  console.log(data);
            	  console.log(status);
            	  console.log(headers);
            	  console.log(config);
        	  });
            };
            
/**
   * On Click of Delete Icon
   * 1)Delete Details of particular Group*/            
            $scope.submitDeleteGroup = function(gid) {
            	swal({   title: "Are you sure?",   
                	text: "You want to delete this Group?",   
                	type: "warning",   
                	showCancelButton: true,   
                	confirmButtonColor: "#DD6B55",   
                	confirmButtonText: "Yes, delete it!",   
                	cancelButtonText: "No, cancel it!",   
                	closeOnConfirm: false,   
                	closeOnCancel: false }, 
                	function(isConfirm){   
                		if (isConfirm) {     
                	    	$scope.group.token = $scope.token;
                	    	$scope.group.gid = gid;
                	    	//console.log(JSON.stringify($scope.group));
                	        $http({
                	          method  : 'POST',		  
                	          url     : apiURL+'group/delete',
                	    	  data    : JSON.stringify($scope.group), 
                	    	  headers : { 'Content-Type': 'application/json' }
                	         })
                	    	  .success(function(data) {
                	    		  console.log(data);
                	    			  swal({title: "Group Deleted Successfully",
                      	   			   text: "Success!",   
                      	   			   type: "success",   
                      	   			   confirmButtonColor: "#9afb29",   
                      	   			   closeOnConfirm: false }, 
                      	   			   function(){   
                      	   				   $scope.data = data;
                      	   			       //console.log(JSON.stringify($scope.data));
                      	   			       location.reload();
                      	   			   });
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
                
/**
   * Google Map
   * 1)Draw Polygon on the Map
   * 2)Show Polygon on the Map based on geo-fence values
   * 3)Reset Polygon onclick of Re-Draw Button*/  
$('#show2').hide();     
  $(document).on('click', '#showMap', function () {
	$('#show2').show();
	$('#show1').hide();
	$('.create_button').hide();
	showGeofenceMap();
}); 
function showGeofenceMap(){
/**
     * A library to draw overlays on top of Google Maps to get geospatial info
     * Author: @rodowi
     * Updated: 2014-03
     * TODO: draggable, editable
     */
    var mapOverlays = [],
        mapDataId = 'map-data',
        mapOverlayStyle = {
    		strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            //draggable: true, // turn off if it gets annoying
            //editable: true,
            //paths: triangleCoords,
        };
    /**
     * Upon page load, setup map and bind listeners
     *
     */
    $(document).ready(function () {
    	var styleMap = [
    	                {
    	                    "featureType": "poi.business",
    	                    "stylers": [
    	                      {
    	                        "visibility": "on"
    	                      }
    	                    ]
    	                  },
    	                  {
    	                    "featureType": "poi.park",
    	                    "elementType": "labels.text",
    	                    "stylers": [
    	                      {
    	                        "visibility": "on"
    	                      }
    	                    ]
    	                  },
    	                  {
    	                    "featureType": "road.arterial",
    	                    "stylers": [
    	                      {
    	                        "visibility": "off"
    	                      }
    	                    ]
    	                  },
    	                  {
    	                    "featureType": "road.highway",
    	                    "elementType": "labels",
    	                    "stylers": [
    	                      {
    	                        "visibility": "off"
    	                      }
    	                    ]
    	                  },
    	                  {
    	                    "featureType": "road.local",
    	                    "stylers": [
    	                      {
    	                        "visibility": "on"
    	                      }
    	                    ]
    	                  },
    	                  {
    	                    "featureType": "transit.station",
    	                    "elementType": "geometry.fill",
    	                    "stylers": [
    	                      {
    	                        "lightness": 5
    	                      }
    	                    ]
    	                  }
    	                ];
    	// Variables and definitions
    	//console.log(geofence.length);
    	//console.log(centerVal);
    	var map;
    	var mapCanvasId = 'map-canvas';
          var mapOptions = {
            zoom: 4,
            center: centerVal,
            streetViewControl: false,
            disableDefaultUI: true,
			styles: styleMap,
          };
          map = new google.maps.Map(document.getElementById(mapCanvasId),
              mapOptions);

    	
    	
    	
      // Variables and definitions
          /*var mapCanvasId = 'map-canvas',
          map = new google.maps.Map(document.getElementById(mapCanvasId), {
            center: new google.maps.LatLng(21.0000, 78.0000),
            streetViewControl: false,
            zoom: 4,
            disableDefaultUI: true,
			styles: styleMap,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.LEFT_CENTER
            }
          }); */
      // Setup drawing manager
      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
          ]
        },
        polygonOptions: mapOverlayStyle,
      });
      drawingManager.setMap(map);
      
        var geoJson = geofence;
		var resultGeoJson = [];
		for (var key in geoJson) {
		if (geoJson.hasOwnProperty(key)) {
			resultGeoJson.push({
		   'lat': geoJson[key].lat,
		   'lng': geoJson[key].long
		});
		}
		}
		//var result = JSON.stringify(resultGeoJson)
		//console.log(JSON.stringify(resultGeoJson));
      var triangleCoords = resultGeoJson;
      myPolygon = new google.maps.Polygon({
          paths: triangleCoords,
          //draggable: true, // turn off if it gets annoying
          //editable: true,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.10
        });
        myPolygon.setMap(map); 
      // Add custom clear button
      var resetControl = $('<h6>  Draw</h6>').css({
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: '#000',
        cursor: 'pointer',
        margin: '5px',
        padding: '5px'
      })[0];
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(resetControl);
      google.maps.event.addDomListener(resetControl, 'click', function() {
        resetMap();
        myPolygon.setMap(null);
      });
      // Insert a DIV container to hold geospatial data from the map
      var $mapData = $('<div></div>')
        .attr('id', mapDataId);
        //.css('padding', '0 10px 10px 10px');
      $('#' + mapCanvasId).after($mapData);
      // Events to be trigger when drawing completes
      google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    	  myPolygon.setMap(null);
    	  resetMap();
        // Get bounds in CAP <area> format
        var bounds = event.overlay.toCapArea();
        // Store geo data in DOM
        insertBoundsIntoDOM(bounds, mapDataId);
        // Store overlay in global array
        mapOverlays.push(event.overlay);
      });
    });
    /*** DOM Operations ***/
    /**
     * Inserts geo-data into DOM.
     */
    function insertBoundsIntoDOM(bounds, domElementId) {
      //console.log('insertBoundsIntoDOM("' + bounds + '")');
      posArray = bounds;
    }
    /**
     * Removes map overlays and DOM elements with map data
     */
    function resetMap() {
      removeMapOverlays();
      removeMapData();
      $('.create_button').hide();
      $('.update_button').hide();
    }
    /**
     * Removes map overlays (global variable)
     *
     */
    function removeMapOverlays() {
      while(mapOverlays[0])
        mapOverlays.pop().setMap(null);
    }
    /**
     * Removes DOM elements with map data
     *
     */
    function removeMapData() { $('#' + mapDataId).empty() }
    /*** Maps extensions ***/
    /**
     * Both methods return a string with geospatial info of a map overlay formatted for CAP <area> elements
     * Note: As of Maps API v3.exp radius is given in meters and CAP v1.2 use KM
     * https://developers.google.com/maps/documentation/javascript/reference#Circle
     * http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html
     * Note: first and last pair of coordinates should be equal
     *
     */
    google.maps.Polygon.prototype.toCapArea = function () {
      var posArray=[];
      var capArea = '';
      this.getPath().forEach(function (element, index) {
        capArea += 'lat:' + element.lat() + ',long:' + element.lng() + ' ';
        posArray.push({"lat":element.lat(),"long":element.lng()});
      });
      var start = this.getPath().getAt(0);
      capArea += 'lat:' + start.lat() + ',long:' + start.lng();
      posArray.push({"lat":start.lat(),"long":start.lng()});
      //console.log(JSON.stringify(posArray));
      if(posArray == null){
		  $('.create_button').hide();
		  $('.update_button').hide();
		}
		else{
		  $('.create_button').show();
		  $('.update_button').show();
		}
      return posArray;
    };
 }
$(document).on('click', '#lat_long_geofence', function(){
      	//$('#geofence').val(posArray);
      	$('#show2').hide();
    	$('#show1').show();
 });
$(document).on('click', '.clickable', function(){
	    var effect = $(this).data('effect');
	        $(this).closest('.panel')[effect]();
	});

$scope.back2Show1 = function(){
	$('#show2').hide();
	$('#show3').hide();
	$("#show1").show();
}


$scope.back2Form=function(){
	$('#show2').hide();
	$('#show3').show();
	$("#show1").hide();
	$scope.applyClass=false;
}

$(document).ready(function() {
	$.getScript('../assets/select_filter/select2.min.js', function() {
		$("#selectGroup").select2({});
		$("#selectState").select2({});
		$("#selectCountry").select2({});
		$('#clearTextGroup span.select2-chosen').text("Select Group ");
		$('#clearTextCountry span.select2-chosen').text("Select Country ");
		$('#clearTextState span.select2-chosen').text("Select State");
	});// script
});

//$scope.applyClass=false;
$scope.changeStyle=function(){
	//$scope.applyClass=true;
	$("#show2").show();
	$("#show1").hide();
	$("#show3").hide();
}

$scope.clearForm = function(){
	$scope.truefalse = false;
	$("#show1").show();
	$("#show2").hide();
	$("#show3").hide();
	$('#createGroupModal').find('form')[0].reset();
};
$("#show3").hide();
$("#show1").show();
$scope.showAllocate = function(){
	$("#show3").show();
	$("#show1").hide();
}


$scope.factoryCheckAll = function(checkAll){
	  if(checkAll){
	      for(i in $scope.customerDevices){
			  $scope.selection.push($scope.customerDevices[i]);
			  var index = -1;		
					  $scope.FactoryStockCount=$scope.FactoryStockCount-1;
		  }
	      $scope.customerDevices = [];
	  }
	  else{
	      for(i in $scope.selection){
			  $scope.customerDevices.push($scope.selection[i]);
			      $scope.FactoryStockCount=$scope.FactoryStockCount+1;
	      }
	      $scope.selection = [];
	  }
	 }

});





