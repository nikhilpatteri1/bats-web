/**
 * Group Creation Controller
 */
batsAdminHome.controller('deviceController', function($scope, $http,$interval,
		$localStorage,$timeout) {
	$scope.token = $localStorage.data;
	$scope.groupList = [];
	$scope.deviceList=[];
	$scope.selectedDevice=[];
	$scope.deviceSelected=false;	
	$scope.ready2activate=[];
	$scope.pendingArray=[];
	var pageRefresh;
	// console.log($scope.token);
	if (typeof $scope.token === "undefined") {
		swal({
			title : "Un Authorized Acces",
			text : "Kindly Login!",
			type : "warning",
			confirmButtonColor : "#ff0000",
			closeOnConfirm : false
		}, function() {
			$localStorage.$reset();
			window.location = apiURL;
		});

	}

	/**
	 * Load User list 1) on load of page load the username is displayed in the
	 * user list grid
	 */
	$scope.listDevices=function(){
		if($scope.pendingArray.length==0){
			//console.log($scope.pendingArray.length);
			$interval.cancel(pageRefresh);
		}
		//console.log("listDevices");
		$scope.user = {
				"token" : $scope.token
			};
			// console.log(JSON.stringify($scope.user));
			$http({
				method : 'POST',
				url : apiURL + 'device/list',
				data : JSON.stringify($scope.user),
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function(data) {
				$scope.dlist = data;
				// console.log(JSON.stringify($scope.dlist));				
				possible2Activate(data.allocated);
				$scope.allocated = $scope.dlist.allocated;	
				$scope.listGroup();
				if ($scope.allocated.length == 0) {
					$scope.noDevicesAllocated = true;
					
				}
				$scope.un_allocated = $scope.dlist.un_allocated;
				// console.log(JSON.stringify($scope.un_allocated));
				if ($scope.un_allocated == 0) {
					$scope.noDevicesUnAllocated = true;
				}
			}).error(function(data, status, headers, config) {
				// console.log(data.err);
				if (data.err == "Expired Session") {
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {
					invalidUser();
					$localStorage.$reset();
				}
				console.log(status);
				console.log(headers);
				console.log(config);
			});
	};
	/*
	 * loading devices which is possible to activate by matching two criteria 
	 * 1)Inactive
	 * 2)availablity of device sim cn*/
	function possible2Activate(data){
		angular.forEach(data,function(item){
			//console.log(item);
			if(item.status=="Inactive" && item.device_sim_cn!=""){
				$scope.ready2activate.push(item);				
			}
			else if(item.status=="Pending"){
				$scope.pendingArray.push(item);
			}
		});
	}
	/*
	 * list group function to fetch the data group
	 */
	$scope.listGroup = function() {
		var allocatedDevicelength = $scope.allocated.length;
		for ( var inc = 0; inc < allocatedDevicelength; inc++) {
			var obj={}
			obj.gid=$scope.allocated[inc].gid;
			obj.gname=$scope.allocated[inc].gname;
			$scope.groupList.push(obj);
		
		}
		//console.log(JSON.stringify($scope.groupList));
	};
	/**
	 * on selection of groupid found the device matching the group id and list
	 * in devicelist
	 */
	$scope.sortDeviceId=function(){
		$('#clearTextDeviceStatus span.select2-chosen').empty();  
		$('#clearTextDeviceStatus span.select2-chosen').text("- - Device Status - -");
	}
	$scope.listDevice = function(gid) {	
		$scope.deviceId='';
		$scope.statusId='';
		$('#clearTextDevice span.select2-chosen').empty();  
		$('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
		$('#clearTextDeviceStatus span.select2-chosen').empty();  
		$('#clearTextDeviceStatus span.select2-chosen').text("- - Device Status - -");		
		$scope.deviceList=[];
		var deviceArray=_.filter($scope.allocated,{'gid':gid});
		var devlen=deviceArray.length;
		for(var inc=0;inc<devlen;inc++){
			$scope.deviceList.push(deviceArray[inc].devid);
		}
		//console.log(JSON.stringify($scope.allocated));
	}
	/* get device status method gives back the sutiable text 
	 * for the device activation status
	 * 0- active,1-pending,2-inactive
	 * */
	$scope.getStatus=function(status){
		if(status=="Active"){
			$scope.green=true;
			return "Active";
		}
		else if(status==1){
			$scope.grey=true;
			return "Pending";
		}
		else if(status==2){
			$scope.red=true;
			return "InActive";
		}
	};
	/*
	 * for disabling the checkbox based on device status
	 * and enabling only if its Inactive
	 * by returning false for ng-disabled field
	 * */
	$scope.getDisabledByStatus=function(status){
		if(status=="Inactive"){			
			return false
		}
		else{
			return true
		}
	};
	/*
	 * for disabling the checkbox based on device sim number availability
	 * and enabling only if device sim number availabile
	 * by returning false for ng-disabled field
	 * */
	$scope.getDisabledBySimno=function(simNo){
		
		if(simNo.length!=0){//sim number is there so don't disable by returning false			
			return false
		}
		else{//sim number is not there so disable it by returning true
			return true
		}
	}
	/*
	 * on change of select all option 
	 * fetched out the selected out of disabled using JQUERY*/  
	/*$('#chkSelectAll').click(function () {
	    	$scope.selectedDevice=[];
	        var checked_status = this.checked;
	        $('div.checkDevice input[type=checkbox]').not("[disabled]").each(function () {	        		
	        		$scope.selectedDevice.push(this.id);	        		
	                   this.checked = checked_status;	                   
	        });    
	        
	        if(this.checked!=true){
	        	$scope.selectedDevice=[];
            }
	        console.log($scope.selectedDevice);
	    });*/
	$scope.isSelectAll=function(){		
		$scope.selectedDevice=[];
		if($scope.master){
			$scope.master=true;
			
			for(var i=0;i<$scope.allocated.length;i++){
				if($scope.allocated[i].status=="Inactive" && $scope.allocated[i].device_sim_cn!=""){
					$scope.selectedDevice.push($scope.allocated[i].devid);
				}
			}
		}
		else{$scope.master=false;}
		angular.forEach($scope.allocated,function(item){			
			if(item.status=="Inactive" && item.device_sim_cn!=""){				
				item.selected=$scope.master;
			}			
		});
	}
	$scope.isLabelChecked = function(devid)
	{
		if(this.devicedet.selected){
			$scope.selectedDevice.push(devid);
			if($scope.selectedDevice.length == $scope.ready2activate.length){$scope.master = true;}
		}else{
			$scope.master = false;
			var index = $scope.selectedDevice.indexOf(devid);
			$scope.selectedDevice.splice(index, 1);
		}
	}  
	/**
	 * on click of activate selected devices
	 * fetched all ids got selected 
	 * a check for select all devices and particularly selected device array is empty or not
	 * based on the length a devlist is prepared for activation JQUERY Dt:12-07-2016 */
	 $scope.sendActivation=function(){	 
		/* var particularSelDeviceArray=$('div.checkDevice input:checkbox:checked').map(function(){
			 return this.id;
		 }).get();		*/ 
		 			 
			 if($scope.selectedDevice.length>0){
				 //console.log($scope.selectedDevice);
				 callActivationAPI($scope.selectedDevice);
				 //console.log($scope.flag);
				 $timeout(function () {					 
					 $scope.listDevices();
					 }, 0);
				 pageRefresh=$interval($scope.listDevices,1000);
			 }	 
		 else{
			 swal({title:"Select atleast one device",type:"warning"})
		 }
	 }  
	 $scope.selParticularDevice=function(dev,checked){
		 console.log(dev,checked);
		 console.log($scope.selectedDevice);
		 console.log($scope.selectedAll);
	 };
	 function callActivationAPI(devlistArray){
		 $scope.deviceActivateJSON={};
		 $scope.deviceActivateJSON.token=$scope.token;
		 $scope.deviceActivateJSON.devlist=devlistArray;
		 console.log(JSON.stringify($scope.deviceActivateJSON));
		 $http({
				method:'POST',
				url:apiURL + 'device/activate',
				data:JSON.stringify($scope.deviceActivateJSON),
				headers:{
					'Content-Type' : 'application/json'
				}	
			}).success(function(data){
				swal({
					title : data.status,
					text : "Success!",
					type : "success",
					confirmButtonColor : "#9afb29",
					closeOnConfirm : false
				}, function() {					
					location.reload();
				});
			}).error(function(data,status,headers,config){
				console.log(data.err);
				if (data.err == "Expired Session") {					
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {					
					invalidUser();
					$localStorage.$reset();
				}
				console.log(status);
				console.log(headers);
				console.log(config);
			});
	 }
	/**
	 * Reset Form
	 */
	$scope.reset = function() {
		$scope.device = {};
		$scope.updateDeviceForm.$setPristine();
	};
	/*
	 * validate uniqueness 
	 * */
	$scope.verifyVehicleNo=function(vehicleNo){
		$scope.vehicleNoJSON={}
		$scope.vehicleNoJSON.token=$scope.token;
		$scope.vehicleNoJSON.vehicle_num=vehicleNo;
		$http({
			method:'POST',
			url:apiURL + 'device/vehicle_num_availability',
			data:JSON.stringify($scope.vehicleNoJSON),
			headers:{
				'Content-Type' : 'application/json'
			}	
		}).success(function(data){
			console.log(data.status);
			if(data.status){
				$scope.error_vehno=false;
			}
			else{
				$scope.error_vehno=true;
			}
		}).error(function(data,status,headers,config){
			// console.log(data.err);
			if (data.err == "Expired Session") {
				$('#updateDeviceModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				$('#updateDeviceModal').modal('hide');
				invalidUser();
				$localStorage.$reset();
			}
			console.log(status);
			console.log(headers);
			console.log(config);
		})
	};
	/**
	 * check uniqueness of driver license*/
	$scope.verifyDL=function(dl){
		$scope.verifydlJSON={};
		$scope.verifydlJSON.token=$scope.token;
		$scope.verifydlJSON.driver_licence=dl;
		$http({
			method:'POST',
			url:apiURL + 'device/check_driver_licence',
			data:JSON.stringify($scope.verifydlJSON),
			headers:{
				'Content-Type' : 'application/json'
			}	
		}).success(function(data){
			console.log(data.status);
			if(data.status){
				$scope.error_dlno=false;
			}
			else{
				$scope.error_dlno=true;
			}
		}).error(function(data,status,headers,config){
			// console.log(data.err);
			if (data.err == "Expired Session") {
				$('#updateDeviceModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				$('#updateDeviceModal').modal('hide');
				invalidUser();
				$localStorage.$reset();
			}
			console.log(status);
			console.log(headers);
			console.log(config);
		})
		
	};
	/**
	 * On Click of Edit Icon 1)Fetch Details of Particular Device 2)Display
	 * Fetched Details & Dispaly on the Form
	 */
	$scope.submitUpdateDevice = function(did) {

		$scope.device = {};
		$scope.device.token = $scope.token;
		$scope.device.devid = did;
		// console.log(JSON.stringify($scope.device));
		$http({
			method : 'POST',
			url : apiURL + 'device/info',
			data : JSON.stringify($scope.device),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			$scope.device = data;
			//console.log(JSON.stringify(data));
		}).error(function(data, status, headers, config) {
			// console.log(data.err);
			if (data.err == "Expired Session") {
				$('#editModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
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
	 * On Click of Update Button 1)Update Details of particular Device
	 */
	$scope.submitUpdateDeviceForm = function() {
		var device_details = $scope.device;
		// console.log(JSON.stringify(device_details));
		var token = $scope.token;
		var devid = device_details.devid;
		var devtype = device_details.devtype;
		var vehicle_num = device_details.vehicle_num;
		var sr_num = device_details.sr_num;
		var driver_name = device_details.driver_name;
		var driver_licence = device_details.driver_licence;
		var desc = device_details.desc;
		var simNo =device_details.device_sim_cn;		
		$scope.resultJson = {
			"token" : token,
			"devid" : devid,
			"devtype" : devtype,
			"vehicle_num" : vehicle_num,
			"sr_num" : sr_num,
			"driver_name" : driver_name,
			"driver_licence" : driver_licence,
			"desc" : desc,
			"device_sim_cn":simNo
		}
		//console.log(JSON.stringify($scope.resultJson));
		$http({
			method : 'POST',
			url : apiURL + 'device/modify',
			data : JSON.stringify($scope.resultJson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			swal({
				title : "Device Updated Successfully",
				text : "Success!",
				type : "success",
				confirmButtonColor : "#9afb29",
				closeOnConfirm : false
			}, function() {
				$scope.device = data;
				// console.log(JSON.stringify($scope.device));
				location.reload();
			});
		}).error(function(data, status, headers, config) {
			// console.log(data.err);
			if (data.err == "Expired Session") {
				$('#updateDeviceModal').modal('hide');
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				$('#updateDeviceModal').modal('hide');
				invalidUser();
				$localStorage.$reset();
			}
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	};
	/**
	 * Select Group/Device dropdown based on jquery
	 */
	$(document).ready(
			function() {
				$.getScript('../assets/select_filter/select2.min.js',
						function() {
							$("#selectGroup").select2({});
							$("#selectDevice").select2({});
							$("#selectStatus").select2({});
							$('#clearTextGroup span.select2-chosen').text(
									"- - Select Group - -");
							$('#clearTextDevice span.select2-chosen').text(
									"- - Select Device - -");
							$('#clearTextDeviceStatus span.select2-chosen').text(
							"- - Device Status - -");
						});// script
			});

});
