		angular.module('batsGeneralHome').controller('ModalDemoCtrl',
				function($scope, $uibModal, $http, $localStorage,$rootScope) {
					$scope.animationsEnabled = true;
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
							console.log(JSON.stringify(data));
							var modalInstance = $uibModal.open({
								animation : $scope.animationsEnabled,
								templateUrl : '/html/general/myModalContent.html',
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
				.module('batsGeneralHome')
				.controller(
						'ModalInstanceCtrl',
						function($scope, $http, $uibModalInstance, dev, $localStorage) {
							// for history tab hide the map and table part intially
							$scope.token = $localStorage.data;
							$scope.yoData=false;
							$scope.noData=false;
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
									$scope.url = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQnBx8Czkt93BZhCcIWGh-3eHuv8CH613GrTCpah6RP9b7LyxIJjw';
								} else if ($scope.dev.devtype == "bus") {
									$scope.url = 'http://www.myiconfinder.com/uploads/iconsets/256-256-3ac514df5b4f36e2d8d525fe7f63b83c.png'
								} else if ($scope.dev.devtype == "jeep") {
									$scope.url = 'https://www.google.co.in/imgres?imgurl=https://cdn4.iconfinder.com/data/icons/transportation-front-view/80/Transportation_cars-01-512.png&imgrefurl=https://www.iconfinder.com/icons/215247/4x4_automobile_cars_front_view_jeep_machine_quadro_transportation_travel_vehicle_icon&h=512&w=512&tbnid=o3WW9QtjG1UktM:&docid=CoqPwHHUjs97UM&ei=EJeMVt2QOZKiugTW-JOYCw&tbm=isch&ved=0ahUKEwjd2Njgq5TKAhUSkY4KHVb8BLMQMwgkKAkwCQ';
								} else if ($scope.dev.devtype == "truck") {
									$scope.url = 'http://www.wpclipart.com/transportation/car/icons_BW/flatbed_truck_BW_icon.png';
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
							$scope.myDateChange=function(myDate){
								//console.log(new Date(myDate).getTime());
								var sts=new Date(myDate).getTime();
								var d=new Date(myDate);
								d.setHours(23);
								d.setMinutes(59);
								d.setSeconds(59);
								var ets=d.getTime();
								historyApiCall(sts,ets);
							}
							$scope.showHistory = function(mydate) {
								var sts=new Date(mydate).getTime();
								var d=new Date(mydate);
								d.setHours(23);
								d.setMinutes(59);
								d.setSeconds(59);
								var ets=d.getTime();
								historyApiCall(sts,ets);
							};
							function historyApiCall(sts,ets){
								$scope.deviceHistoryjson = {};
								$scope.deviceHistoryjson.token = $scope.token;
								$scope.deviceHistoryjson.devid = dev.devid;
								$scope.deviceHistoryjson.sts = sts;
								$scope.deviceHistoryjson.ets = ets;
								$http(
										{
											method : 'POST',
											url : apiURL + 'device/history',
											data : JSON
													.stringify($scope.deviceHistoryjson),
											headers : {
												'Content-Type' : 'application/json'
											}
										}).success(function(data) {
									$scope.histData = data;
									//console.log($scope.histData.values.length);
									if($scope.histData.values.length>=1){
										displayHistory();	
										$scope.yoData=true;
										$scope.noData=false;
									}
									else{
										$scope.yoData=false;
										$scope.noData=true;
									}
								})
										.error(
												function(data, status, headers,
														config) {
													console.log(data);
													console.log(status);
													console.log(headers);
													console.log(config);
												});
							}
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
													console.log(data);
													console.log(status);
													console.log(headers);
													console.log(config);
												});
							};
							/**
							1) Plot on Map History Path
							2) Display on Table
							-----------------------------------------------------------------------*/
							function displayHistory() {
								var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
								var histData = $scope.histData.values;
								var hist_len = histData.length;
								var obj = [];
								var coordinates = [];
								for ( var inc = 0; inc < hist_len; inc++) {
									var arr = {};
									arr.latitude = Number(histData[inc].lat)
									arr.longitude = Number(histData[inc].long);
									obj.push(arr);
									lat_tot += Number(histData[inc].lat);
									lg_tot += Number(histData[inc].long);
								}
								//console.log(obj);
								lt_avg = lat_tot / hist_len;
								lg_avg = lg_tot / hist_len;
								//console.log(lt_avg + " " + lg_avg);

								$scope.historyMap = {
									center : {
										latitude : lt_avg,
										longitude : lg_avg
									},
									zoom : 12
								};
								//polyline for the history path
								$scope.historyMap.polylines = [];
								$scope.historyMap.polylines.push({
									id : 1,
									path : obj,
									stroke : {
										color : '#000000',
										weight : 3
									},
									editable : true,
									draggable : true,
									geodesic : true,
									visible : true
								});
							}
						}).directive('phone', function() {
						    return {
						        restrice: 'A',
						        require: 'ngModel',
						        link: function(scope, element, attrs, ctrl) {
						            angular.element(element).bind('blur', function() {
						                var value = this.value;
						                if(PHONE_REGEXP.test(value)) {
						                    // Valid input
						                    console.log("valid phone number"+value);
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