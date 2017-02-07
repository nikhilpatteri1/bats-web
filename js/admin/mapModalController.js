		angular.module('batsAdminHome').controller('ModalDemoCtrl',
				function($scope, $uibModal, $http, $localStorage,$rootScope) {
					$scope.animationsEnabled = true;
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
						 
					}
				    $rootScope.$on("deviceDetailModal", function(event,param1,param2){
				           $scope.open(param1,param2);
				        });
				    
				        
					$scope.open = function(size, deviceId) {
						$scope.deviceInfojson = {};
						$scope.deviceInfojson.token = $scope.token;
						$scope.deviceInfojson.devid = deviceId;
						var devData;
						/*---------------------- Vechile Info API CALL -------------------------------------*/
						$http({
							method : 'POST',
							url : apiURL + 'device/info',
							data : JSON.stringify($scope.deviceInfojson),
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function(data) {
							var modalInstance = $uibModal.open({
								animation : $scope.animationsEnabled,
								templateUrl : '/html/admin/myModalContent.html',
								controller : 'ModalInstanceCtrl',
								directive:'phone',
								size : size,
								resolve : {
									dev : function() {
										return data;
									}
								}
							});
						}).error(function(data, status, headers, config) {
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
					/*---------------------- ./Vechile Info API CALL -------------------------------------*/
					$scope.toggleAnimation = function() {
						$scope.animationsEnabled = !$scope.animationsEnabled;
					};
				});
		// Please note that $modalInstance represents a modal window (instance) dependency.
		// It is not the same as the $uibModal service used above.

		angular
				.module('batsAdminHome')
				.controller(
						'ModalInstanceCtrl',
						function($scope, $http, $uibModalInstance, dev, $localStorage) {
							// for history tab hide the map and table part intially
							$scope.token = $localStorage.data;
							$scope.dev = dev;
							$scope.ok = function() {
								$uibModalInstance.close($scope.selected.item);
							};

							$scope.cancel = function() {
								$uibModalInstance.dismiss('cancel');
							};
							/**
							 * get Date formatted date based on TIMESTAMP
							 -----------------------------------------------------------------------*/
							$scope.getDate = function(ts) {
								var d = new Date(Number(ts));
								// console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
								var monthVal = d.getMonth() + 1;
								// Hours part from the timestamp
								var hours = d.getHours();
								// Minutes part from the timestamp
								var minutes = "0" + d.getMinutes();
								// Seconds part from the timestamp
								var seconds = "0" + d.getSeconds();

								// Will display time in 10:30:23 format
								var formattedTime = hours + ':'
										+ minutes.substr(-2) + ':'
										+ seconds.substr(-2);
								return d.getDate() + "-" + monthVal + "-"
										+ d.getFullYear() + " / "
										+ formattedTime;
							}
							/**
							Change Image of Device based on device Type
							-----------------------------------------------------------------------------*/
							$scope.whatVehicle = function() {
								if ($scope.dev.devtype == "car") {
									$scope.url = '../images/driver.png';
								} else if ($scope.dev.devtype == "bus") {
									$scope.url = '../images/driver.png';
								} else if ($scope.dev.devtype == "jeep") {
									$scope.url = '../images/driver.png';
								} else if ($scope.dev.devtype == "truck") {
									$scope.url = '../images/driver.png';
								}
								else{
									$scope.url = '../images/driver.png';
								}
							}
							/**
							API Call for Device History 
							---------------------------------------------------------------------------*/
							$scope.myDate = new Date();
							$scope.minDate = new Date($scope.myDate.getFullYear(),
									$scope.myDate.getMonth() - 2, $scope.myDate
											.getDate());
							$scope.maxDate = new Date($scope.myDate.getFullYear(),
									$scope.myDate.getMonth() + 2, $scope.myDate
											.getDate());
							$scope.onlyWeekendsPredicate = function(date) {
								var day = date.getDay();
								return day === 0 || day === 6;
							};
							
							/**
							Current Data API Call from here-------------------------------------------*/
							$scope.showCurrentData = function() {
								$scope.deviceCurrentDatajson = {};
								$scope.devIdobj = [];
								$scope.deviceCurrentDatajson.token = $scope.token;
								$scope.devIdobj.push(dev.devid);
								$scope.deviceCurrentDatajson.devlist = $scope.devIdobj;
								//$scope.deviceCurrentDatajson.devlist = dev.devid;
								$scope.deviceCurrentDatajson.count = 10;
								//console.log($scope.deviceCurrentDatajson);
								$http(
										{
											method : 'POST',
											url : apiURL + 'device/currentdata',
											data : JSON
													.stringify($scope.deviceCurrentDatajson),
											headers : {
												'Content-Type' : 'application/json'
											}
										})
										.success(
												function(data) {
													$scope.currData = data[0];
												}).error(
												function(data, status, headers,
														config) {
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
							Device Settings API CALL Made here---------------------------*/
							$scope.device = {};
							$scope.submitSettings = function() {
								$scope.device.token = $scope.token;
								$scope.device.devid = dev.devid;
								var obj = [];
								obj.push($scope.device.contact_num)
								delete $scope.device['contact_num'];
								$scope.device.contact_num = obj;
								//var alive_frequency = $scope.device.alive_frequency;
								//console.log(JSON.stringify(alive_frequency));
								//$scope.device.alive_frequency = String(alive_frequency * 60);
								//console.log(JSON.stringify($scope.device.alive_frequency));
								console.log(JSON.stringify($scope.device));
								$http({
									method : 'POST',
									url : apiURL + 'device/easyupdate',
									data : JSON.stringify($scope.device),
									headers : {
										'Content-Type' : 'application/json'
									}
								}).success(function(data) {
									console.log(JSON.stringify(data));
									swal({title: "Settings Changed Successfully",
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
										.error(
												function(data, status, headers,
														config) {
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

						}).directive('phone', function() {
						    return {
						        restrice: 'A',
						        require: 'ngModel',
						        link: function(scope, element, attrs, ctrl) {
						            angular.element(element).bind('blur', function() {
						                var value = this.value;
						                if(PHONE_REGEXP.test(value)) {
						                    // Valid input
						                    //console.log("valid phone number"+value);
						                    angular.element(this).next().next().css('display','none');
						                    scope.btnDisabled = true;
						                } else {
						                	scope.btnDisabled = true;
						                    // Invalid input  
						                    console.log("invalid phone number"+value);
						                    scope.mobstatus="invalid phone number";
						                    angular.element(this).next().next().css('display','block');
						                    console.log(angular.element(this).children().find('span'));
						                    /* 
						                        Looks like at this point ctrl is not available,
						                        so I can't user the following method to display the error node:
						                        ctrl.$setValidity('currencyField', false); 
						                    */                    
						                }
						            });              
						        }            
						    };        
						});