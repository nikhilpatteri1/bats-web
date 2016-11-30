batstravelDeskHome.controller('batsDriverBinding', function($scope, $localStorage,travelDeskFactory) {
	$scope.httpLoading=false;//loading image
	$scope.token = $localStorage.data;
	$scope.veh_details;
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
	/*
	 * Change of Bind Status*/
	$scope.changeBindStatus=function(){
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
	    if(typeof $scope.groupname!='undefined'){
	    	$scope.fetchDevicelist($scope.groupname);
	    }
	}
	
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
		$scope.deviceId="";
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
		$scope.httpLoading=true;
		$scope.listDeviceJson={};
		$scope.listDeviceJson.token=$scope.token;
		$scope.listDeviceJson.gid=groupname;
		travelDeskFactory.callApi("POST",apiURL+"traveldesk/getgroupdevices",$scope.listDeviceJson,function(result){
		      //console.log(result);	
		      $scope.devlistObject=result;
		      $scope.httpLoading=false;
		});
	}
	/*
	 * list drivers*/
	$scope.showDrivers=function(){
		$scope.httpLoading=true;
		$scope.listDriversJson={};
		$scope.listDriversJson.token=$scope.token;
		$scope.listDriversJson.type=1;
		travelDeskFactory.callApi("POST",apiURL+"driver/list",$scope.listDriversJson,function(result){			
			$scope.driverCount=result.length;
		      $scope.driverlist=result;
		      $scope.httpLoading=false;
		});
	}
	/*
	 * Show Driver Modal*/
	$scope.showDriverModal=function(veh_dt){		
		$scope.veh_details=veh_dt;
		if($scope.driverCount>0){
			$("#listDriverModal").modal('show');
		}
		else{
			swal({title:"No Drivers Created Yet"});
		}
		
	}
	/**
	 * reset driver list modal by emptying search criteria*/
	$scope.reset=function(){
		$scope.searchDriver="";
		$('#accordion .in').collapse('hide');
	}
	/*
	 * Show Driver info*/
	
	$scope.showDriverInfo=function(driver_id){	
		$scope.imageUploading=true;
		$scope.driverInfoJson={};
		$scope.driverInfoJson.token=$scope.token;
		$scope.driverInfoJson.driver_id=driver_id;
		travelDeskFactory.callApi("POST",apiURL+"driver/info",$scope.driverInfoJson,function(result){
			$scope.driverInfo=result;
			$scope.imageUploading=false;
		});
	}
	/*
	 * Assign Driver to vehicle
	 * 	
	 * */
	$scope.assignDriver=function(driverdetail){
		$scope.httpLoading=true;
		$scope.assignDriverJson={};
		$scope.assignDriverJson.token=$scope.token;
		$scope.assignDriverJson.devid=$scope.veh_details.devid;
		$scope.assignDriverJson.vehicle_num=$scope.veh_details.vehicle_num;
		$scope.assignDriverJson.driver_name=driverdetail.name;
		$scope.assignDriverJson.licence_id=driverdetail.licence_id;
		$scope.assignDriverJson.devtype=$scope.veh_details.devtype;
		$scope.assignDriverJson.driver_id=driverdetail.driver_id;
		$scope.assignDriverJson.bind="T";
		console.log($scope.assignDriverJson);
		travelDeskFactory.callApi("POST",apiURL+"device/assign_driver",$scope.assignDriverJson,function(result){
			/*console.log(result);*/
			if(result.status=="success"){
				$scope.fetchDevicelist($scope.groupname);
			}
			$("#listDriverModal").modal('hide');
			$scope.httpLoading=false;
		});
	}
	/*
	 * Un Bind Driver from vehicle
	 * 	
	 * */
	$scope.unBindDriver=function(veh_dt){
		$scope.httpLoading=true;
		console.log(JSON.stringify(veh_dt));
		$scope.unBindDriverJson={};
		$scope.unBindDriverJson.token=$scope.token;
		$scope.unBindDriverJson.devid=veh_dt.devid;
		$scope.unBindDriverJson.vehicle_num=veh_dt.vehicle_num;
		$scope.unBindDriverJson.driver_name=veh_dt.driver_name;
		$scope.unBindDriverJson.licence_id=veh_dt.licence_id;
		$scope.unBindDriverJson.devtype=veh_dt.devtype;
		$scope.unBindDriverJson.driver_id=veh_dt.driver_id;
		$scope.unBindDriverJson.bind="F";
		console.log($scope.unBindDriverJson);
		travelDeskFactory.callApi("POST",apiURL+"device/assign_driver",$scope.unBindDriverJson,function(result){
			console.log(result);
			if(result.status=="success"){
				$scope.fetchDevicelist($scope.groupname);
			}
			$scope.httpLoading=false;
		});
	}	
	

	/**
	 * get Date formatted date based on TIMESTAMP
	 -----------------------------------------------------------------------*/
	$scope.getDateTime = function(ts) {
		var d = new Date(Number(ts));
		// console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
		var monthVal = d.getMonth() + 1;
		var hours = d.getHours();
		  var minutes = d.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		return d.getDate() + "-" + monthVal + "-"
				+ d.getFullYear() + " / "
				+ strTime;
	};
	$scope.getTimeFormat=function(tn){
		tn=tn<10?'0'+tn:tn;
		return tn;
	}
	
	/*====================================================>>>>>> End of list Devices function <<<<<=================================================*/
	$(function(){
		var active = true;
		  $('#accordion').on('show.bs.collapse', function () {			 
		        if (active) $('#accordion .in').collapse('hide');
		    });
	});
	/*$(document).on('click','button',function(){ //you can give id or class name here for $('button')
	    $(this).text(function(i,old){
	    	old=old.trim();
	        return old=='+' ?  '-' : '+';
	   });
	});*/
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectBindStatus").select2({});
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearBinding span.select2-chosen').text("- - Binding Status - -");
			$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
			$('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
		});// script
	});
});