batstravelDeskHome.controller('batsDriverBinding', function($rootScope,$scope, $localStorage,travelDeskFactory) {
	console.log("td cont");
	$rootScope.menuPos = 0;
	var contentHeight=window.screen.availHeight-200;
	$scope.histcontentheight={
			"height":contentHeight
	}
	$scope.httpLoading=false;//loading image
	$scope.token = $localStorage.data;
	$scope.veh_details;
	$scope.yesdata = false;
	$scope.blankTable=true;
	$scope.nodevice= false;
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
	
// 	$(document).ready(function() {
	 
// }

	
	/*====================================================>>>>>> End of Basic function <<<<<=================================================*/
	/*====================================================>>>>>> Start of list Devices function <<<<<=================================================*/
	/*
	 * Change of Bind Status*/
	$scope.changeBindStatus=function(){
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
	    
	    console.log($scope.bindStatus);
	    if($scope.bindStatus == "All"){
	    	$scope.bindStatus = undefined;
	    	//$('#selectBindStatus').select2('val', "");
	    }
	    
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
		//alert("hi");


		// var $myGroup = $('#myGroup');
  //   $myGroup.on('show','.collapse', function() {
  //   	alert("hi");
  //       $myGroup.find('.collapse.in').collapse('hide');
  //   }); 

  $('.collapse').on('show.bs.collapse', function (e) {
    $('.collapse').not(e.target).removeClass('in');
})
  

		$scope.deviceId="";
		$('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
		$scope.httpLoading=true;
		$scope.listDeviceJson={};
		$scope.listDeviceJson.token=$scope.token;
		$scope.listDeviceJson.gid=groupname;
		travelDeskFactory.callApi("POST",apiURL+"traveldesk/getgroupdevices",$scope.listDeviceJson,
			  function(result){
		      //console.log(result);	
		      $scope.devlistObject=result;
		      $scope.httpLoading=false; 
		      $scope.yesdata = true;
		      $scope.blankTable=false;
		      //$scope.blankTable = true;
		      console.log(result[0].bind);
		      /*if(result.bind[0].length == 0){
		    	  alert("no bind");
		      }*/
		      
		      //$scope.nodevice=true;
		      //console.log(result.bind.length);
		      /*if(result.bind.length == 0 && result.)*/
		});
	}
	/*
	 * list drivers*/
	$scope.showDrivers=function(){
		console.log("driver list");
		$scope.httpLoading=true;
		$scope.listDriversJson={};
		$scope.listDriversJson.token=$scope.token;
		console.log($scope.listDriversJson.token);
		$scope.listDriversJson.type=1;
		travelDeskFactory.callApi("POST",apiURL+"driver/list",$scope.listDriversJson,function(result){
			
			if(result.length >0){
			console.log(result);
			$scope.driverCount=result.length;
		      $scope.driverlist=result;
		      $scope.httpLoading=false;
		      $scope.nodriver= false;
			}
			else{
				//swal({title:"There is No Drivers"});
				console.log("nores");
				$scope.nodriver= true;
				//$scope.blankTable=false;
				$scope.httpLoading=false;
				//
			}
		});
		console.log($scope.token);
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




		$(".panel-body").css("border","none");  
		$scope.imageUploading=true;
		$scope.driverInfoJson={};
		$scope.driverInfoJson.token=$scope.token;
		$scope.driverInfoJson.driver_id=driver_id;
		travelDeskFactory.callApi("POST",apiURL+"driver/info",$scope.driverInfoJson,function(result){
			$scope.driverInfo=result;
			$scope.imageUploading=false;
		});
	}
	
	
	$scope.toggleEventInfo = function(driverd) {
	    if ($scope.isEventShown(driverd)) {
	      $scope.shownEvent = null;
	    } else {
	      $scope.shownEvent = driverd;
	    }
	  };
	  $scope.isEventShown = function(driverd) {
	    return $scope.shownEvent === driverd;
	  };
	
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
		travelDeskFactory.callApi("POST",apiURL+"device/assign_driver",$scope.assignDriverJson,function(result){
			/*console.log(result);*/
			if(result.status=="success"){
				
				swal({title: "Driver binded Successfully",
		   			   text: "Success!",   
		   			   type: "success",   
		   			   confirmButtonColor: "#9afb29",   
		   			   closeOnConfirm: true }, 
		   			   function(){
		   				$scope.fetchDevicelist($scope.groupname);
						$scope.searchDriver=""; 	
		   		 });
				
				
			}
			$("#listDriverModal").modal('hide');
			$scope.httpLoading=false;
			$scope.showDrivers();
		});
	}
	/*
	 * Un Bind Driver from vehicle
	 * 	
	 * */
	$scope.unBindDriver=function(veh_dt){
		swal({   title: "Are you sure?",   
         	text: "You want to un bind this driver?",   
         	type: "warning",   
         	showCancelButton: true,   
         	confirmButtonColor: "#DD6B55",   
         	confirmButtonText: "Yes, Un bind!",   
         	cancelButtonText: "No, cancel it!",   
         	closeOnConfirm: false,   
         	closeOnCancel: false }, 
         	function(isConfirm){
         		if (isConfirm) {
         			$scope.httpLoading=true;
         			$scope.unBindDriverJson={};
         			$scope.unBindDriverJson.token=$scope.token;
         			$scope.unBindDriverJson.devid=veh_dt.devid;
         			$scope.unBindDriverJson.vehicle_num=veh_dt.vehicle_num;
         			$scope.unBindDriverJson.driver_name=veh_dt.driver_name;
         			$scope.unBindDriverJson.licence_id=veh_dt.licence_id;
         			$scope.unBindDriverJson.devtype=veh_dt.devtype;
         			$scope.unBindDriverJson.driver_id=veh_dt.driver_id;
         			$scope.unBindDriverJson.bind="F";
         			travelDeskFactory.callApi("POST",apiURL+"device/assign_driver",$scope.unBindDriverJson,function(result){
         				console.log(result); 
         				if(result.status=="success"){
         					console.log("status"); 
         					swal({title: "Driver unbinded Successfully",
      			   			   text: "Success!",   
      			   			   type: "success",   
      			   			   confirmButtonColor: "#9afb29",   
      			   			   closeOnConfirm: true }, 
      			   			   function(){
      			   				$scope.fetchDevicelist($scope.groupname);
      			   				$scope.searchDriver="";
      			   				$scope.showDrivers();
      			   		 });
         					
         					/*$scope.searchDriver="";*/
         					
         				}
         				else if(result.err == "Some Trips are active, Please cancel Scheduled and Running trips"){
         					swal("Some Trips are active, Please cancel Scheduled and Running trips");
         				}
         				$scope.httpLoading=false;
         			});
         		}
         		else{
         			swal("Cancelled", "You have cancelled :)", "error");
     			}
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