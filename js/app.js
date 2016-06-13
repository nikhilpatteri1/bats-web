//==============Login Form===============
var batsLogin = angular.module('batsLogin', ['ngStorage','ngAnimate']);

//==============Factory Home===============
var batsfactoryhome = angular.module('batsfactoryhome', ['ngStorage', 'ngRoute','ngAnimate']);

//============== Reset Password Form===============
var reset = angular.module('resetPwd', []);

//==============Admin Home===============
var batsAdminHome = angular.module('batsAdminHome', ['ngStorage', 'ngRoute','ngAnimate', 'ui.bootstrap','ngMaterial', 'ngMessages', 'uiGmapgoogle-maps']);

//==============General Home===============
var batsGeneralHome = angular.module('batsGeneralHome', ['ngStorage', 'ngRoute', 'uiGmapgoogle-maps','ngAnimate', 'ui.bootstrap','ngMaterial', 'ngMessages']);

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
            controller  : 'AdminController'
        })
        .when('/admin/history', {
            templateUrl : '/html/admin/vehicle_history.html',
            controller  : 'vehicleHistory'
        })
        .when('/admin/group', {
            templateUrl : '/html/admin/manage_group.html',
            controller  : 'groupController'
        })
        .when('/admin/user', {
            templateUrl : '/html/admin/manage_user.html',
            controller  : 'userController'
        })
        .when('/admin/device', {
            templateUrl : '/html/admin/manage_device.html',
            controller  : 'deviceController'
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
