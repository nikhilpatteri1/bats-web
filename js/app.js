//==============Login Form===============
var batsLogin = angular.module('batsLogin', ['ngStorage','ngAnimate']);

//==============Factory Home===============
var batsfactoryhome = angular.module('batsfactoryhome', ['ngStorage', 'ngRoute','ngAnimate']);

//============== Reset Password Form===============
var reset = angular.module('resetPwd', []);

//==============Admin Home===============
var batsAdminHome = angular.module('batsAdminHome', ['ngStorage', 'ngRoute','ngAnimate', 'ui.bootstrap','ngMaterial', 'ngMessages', 'uiGmapgoogle-maps', 'ngMap', 'highcharts-ng']);

//==============General Home===============
var batsGeneralHome = angular.module('batsGeneralHome', ['ngStorage', 'ngRoute', 'uiGmapgoogle-maps','ngAnimate', 'ui.bootstrap','ngMaterial', 'ngMessages', 'highcharts-ng', 'ngMap']);

//==============Travel Desk=================
var batstravelDeskHome =angular.module('batstravelDeskHome',['ngStorage', 'ngRoute','ngAnimate','ngMaterial']);

var lt, lg;
var markerArray = [];
var map;
//var apiURL="http://10.1.71.90:8001/";
//var apiURL="http://220.227.124.134:8040/";
var adminToken="fy0NMW83D1UF5tnq";
var speedValue=0,devIDval="";



//====================== Configure routes for Factory User=====================
batsfactoryhome.config(function($routeProvider, $locationProvider) {
	  //$locationProvider.html5Mode(true);
	  $locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
    $routeProvider
        // route for the home page
        .when('/factory/customer', {
            templateUrl : '/html/factory/manage_customer.html',
            controller  : 'customerController'
        })

        // route for the about page
        .when('/factory/device', {
            templateUrl : '/html/factory/manage_device.html',
            controller  : 'deviceController'
        })
        .when('/factory/changePwd', {
        templateUrl : '/html/factory/changePwd.html',
        controller:'changePwdform'
    });
});

batsfactoryhome.run(function($rootScope, $route, $location,$localStorage){
	   //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to 
	   //bind in induvidual controllers.
	   $rootScope.$on('$locationChangeSuccess', function() {		   
	        $rootScope.actualLocation = $location.path();	        
	        var tokenCheck=$localStorage.data;
	        if(tokenCheck.charAt(9)!='0'){
	        	window.location = apiURL;
	        }
	    });        

	   $rootScope.$watch(function () {return $location.path();}, function (newLocation, oldLocation) {		   
	        
	    });
	});
batsfactoryhome.service('CalcService', function(MathService){
    this.square = function(a) {
        return MathService.multiply(a,a);
     }
  });

//====================== Configure routes for Admin User=====================
batsAdminHome.config(function($routeProvider, $locationProvider,$mdDateLocaleProvider) {
	  //$locationProvider.html5Mode(true);
	  $locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
    $routeProvider
        .when('/admin/map', {
            templateUrl : '/html/admin/map.html',
            controller  : 'AdminController',
            cache:false
        })
        .when('/admin/history', {
            templateUrl : '/html/admin/vehicle_history.html',
            controller  : 'vehicleHistory',
            cache:false
        })
        .when('/admin/alarm', {
            templateUrl : '/html/admin/vehicle_alarm.html',
            controller  : 'vehicleAlarm',
            cache:false
        })
        .when('/admin/latest_location', {
            templateUrl : '/html/admin/latest_location.html',
            controller  : 'LatestLocationCtrl',
            cache:false
        })
        .when('/admin/min_max_speed', {
            templateUrl : '/html/admin/min_max_speed.html',
            controller  : 'MinMaxSpeedCtrl',
            cache:false
        })
        .when('/admin/max_kilometer', {
            templateUrl : '/html/admin/max_kilometer.html',
            controller  : 'MaxKmCtrl',
            cache:false
        })
        .when('/admin/analytics', {
            templateUrl : '/html/admin/analytics.html',
            controller  : 'batsAnalytics',
            cache:false
        })
        .when('/admin/nearby_devices', {
            templateUrl : '/html/admin/nearby_devices.html',
            controller  : 'batsNearbyDevices',
            cache:false	
        })
        .when('/admin/group', {
            templateUrl : '/html/admin/manage_group.html',
            controller  : 'groupController',
            cache:false
        })
        .when('/admin/user', {
            templateUrl : '/html/admin/manage_user.html',
            controller  : 'userController',
            cache:false
        })
        .when('/admin/device', {
            templateUrl : '/html/admin/manage_device.html',
            controller  : 'deviceController',
            cache:false
        })
        .when('/admin/driver', {
            templateUrl : '/html/admin/manage_driver.html',
            controller  : 'driverController',            
            cache:false
        })
        .when('/admin/tduser',{
        	templateUrl : '/html/admin/tduser.html',
        	controller:'TDcontroller',
            cache:false
        })
        .when('/admin/changePwd', {
            templateUrl : '/html/admin/changePwd.html',
            controller  : 'changePwdformAdmin',            
            cache:false
        })
        .when('/admin/subMenu', {
            templateUrl : '/html/admin/submenu.html',                        
            cache:false
        })
        ;
    $mdDateLocaleProvider.formatDate = function(date) {    	
    	if(date!=null && date!=""){    		
    		return moment(date).format('DD-MM-YYYY');
    	}
    	else{    		
    		return "Select Date";//moment(new Date()).format('DD-MM-YYYY');
    	}
    	
     }; 
});
batsAdminHome.run(function($rootScope, $route, $location,$localStorage){
	   //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to 
	   //bind in induvidual controllers.
	   $rootScope.$on('$locationChangeSuccess', function() {		   
	        $rootScope.actualLocation = $location.path();	        
	        var tokenCheck=$localStorage.data;
	        if(tokenCheck.charAt(9)!='1'){
	        	window.location = apiURL;
	        }
	    });        

	   $rootScope.$watch(function () {return $location.path();}, function (newLocation, oldLocation) {		   
	        
	    });
	});


//====================== Configure routes for General User=====================
batsGeneralHome.config(function($routeProvider, $locationProvider,$mdDateLocaleProvider) {
	  //$locationProvider.html5Mode(true);
	  $locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
    $routeProvider
        .when('/general/map', {
            templateUrl : '/html/general/map.html',
            controller  : 'GeneralController'
        })
        .when('/general/history', {
            templateUrl : '/html/general/vehicle_history.html',
            controller  : 'vehicleHistory'
        })
        .when('/general/alarm', {
            templateUrl : '/html/general/vehicle_alarm.html',
            controller  : 'vehicleAlarm'
        })
        .when('/general/latest_location', {
            templateUrl : '/html/general/latest_location.html',
            controller  : 'GeneralLatestLocationCtrl'
        })
        .when('/general/min_max_speed', {
            templateUrl : '/html/general/min_max_speed.html',
            controller  : 'GeneralMinMaxSpeedCtrl'
        })
        .when('/general/max_kilometer', {
            templateUrl : '/html/general/max_kilometer.html',
            controller  : 'GeneralMaxKmCtrl'
        })
        .when('/general/analytics', {
            templateUrl : '/html/general/analytics.html',
            controller  : 'batsAnalytics'
        })
        .when('/general/nearby_devices', {
            templateUrl : '/html/general/nearby_devices.html',
            controller  : 'batsNearbyDevices'
        })
                .when('/general/changePwd', {
            templateUrl : '/html/general/changePwd.html',
            controller  : 'changePwdformGeneral'
        })
        ;
    $mdDateLocaleProvider.formatDate = function(date) {    	
    	if(date!=null && date!=""){    		
    		return moment(date).format('DD-MM-YYYY');
    	}
    	else{    		
    		return "Select Date";//moment(new Date()).format('DD-MM-YYYY');
    	}
    	
     };     
});
batsGeneralHome.run(function($rootScope, $route, $location,$localStorage){
	   //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to 
	   //bind in induvidual controllers.
	   $rootScope.$on('$locationChangeSuccess', function() {		   
	        $rootScope.actualLocation = $location.path();	        
	        var tokenCheck=$localStorage.data;
	        if(tokenCheck.charAt(9)!='2'){
	        	window.location = apiURL;
	        }
	    });        

	   $rootScope.$watch(function () {return $location.path();}, function (newLocation, oldLocation) {		   
	        
	    });
	});
batstravelDeskHome.config(function($routeProvider, $locationProvider,$mdDateLocaleProvider) {
	  //$locationProvider.html5Mode(true);
	  $locationProvider.html5Mode({
		  enabled: true,
		  requireBase: false
		});
  $routeProvider
      .when('/traveldesk/binding', {
          templateUrl : '/html/traveldesk/driver_binding.html',
          controller  : 'batsDriverBinding'
      })
      .when('/traveldesk/trip', {
          templateUrl : '/html/traveldesk/trip_management.html',
          controller  : 'tripManagement'
       })
      .when('/traveldesk/history', {
          templateUrl : '/html/traveldesk/trip_history.html',
          controller  : 'tripHistory'
      })
      
      .when('/traveldesk/changePwd', {
          templateUrl : '/html/traveldesk/changePwd.html',
          controller  : 'changePwdformTraveldesk'
      });   
  $mdDateLocaleProvider.formatDate = function(date) {    	
  	if(date!=null && date!=""){    		
  		return moment(date).format('DD-MM-YYYY');
  	}
  	else{    		
  		return "Select Date";//moment(new Date()).format('DD-MM-YYYY');
  	}
  	
   };     
});
batstravelDeskHome.run(function($rootScope, $route, $location,$localStorage){
	   //Bind the `$locationChangeSuccess` event on the rootScope, so that we dont need to 
	   //bind in induvidual controllers.
	   $rootScope.$on('$locationChangeSuccess', function() {		   
	        $rootScope.actualLocation = $location.path();	        
	        var tokenCheck=$localStorage.data;
	        if(tokenCheck.charAt(9)!='3'){
	        	window.location = apiURL;
	        }
	    });        

	   $rootScope.$watch(function () {return $location.path();}, function (newLocation, oldLocation) {		   
	        
	    });
	});