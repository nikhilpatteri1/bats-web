/*================== Map Script ===================*/
batsAdminHome.controller('smartcontroller', function($scope, $interval, $http, $uibModal,$rootScope,
	$localStorage,$window,$route) {	
	var dynamicMapHeight=window.screen.availHeight-100;
	$scope.mapHeight={
			height:dynamicMapHeight
	}
	var reqTime=12;
	$scope.token = $localStorage.data;
	$scope.deviceloaded=true;
	$rootScope.menuPos=0;
	$scope.showTrafficLayerBtn = false;
	$scope.hideTrafficLayerBtn = true;
	if (typeof $scope.token === "undefined") {
		swal({
			title : "Un Authorized Access",
			text : "Kindly Login!",
			type : "warning",
			confirmButtonColor : "#ff0000",
			closeOnConfirm : false
		}, function() {
			$localStorage.$reset();
			window.location = apiURL;
		});

	}
	var map;
    var directionDisplay;
    var directionsService;
    var stepDisplay;
    var markers = [];
    var myPolygon;
    var position;
    var marker = null;
    var polyline = null;
    var poly2 = null;
    var speed = 0.000005,
    wait = 1;
    var infowindow = null;
    var timerHandle = null;
    var storedltlng={};
    var trafficLayer = new google.maps.TrafficLayer();
	var Colors = ["#FF0000", "#00FF00", "#0000FF"];
	var carIcon ="M33.4,20.1c0.1,6.7-0.1,13.4-0.1,20.1c0,0.1,0,0.2,0,0.3c0,0.3,0,0.6,0,0.8c0,2.7-2.3,5-5,5c-2.8,0-5.6,0-8.4,0c-2.7,0-5-2.3-5-5c-0.1-7.1-0.2-14.3,0-21.4h-2.4v-0.4c0-0.8,0.7-1.5,1.5-1.5l0,0h0.9c0.1-3.9,0.4-7.7,0.8-11.6c0.1-0.7,0.3-1.3,0.6-2c0.8-1.8,2.4-3,4.2-3c2.4,0,5,0,7.5,0c2.4,0,4.5,2.2,4.8,4.8c0.4,3.9,0.6,7.9,0.7,11.8H34c0.8,0,1.5,0.7,1.5,1.5v0.4L33.4,20.1L33.4,20.1z M29.7,44.8l2.2-0.7c0.4-0.1,0.7-0.8,0.6-1.2L32.1,42c0,0-0.1,0-0.2,0.1l-0.9,0.6c-0.1,0.1-0.2,0.1-0.2,0.2L30,44.2C29.8,44.4,29.6,44.8,29.7,44.8z M32.6,18.1c0,0-4,10.4-0.3,20.4L32.6,18.1z M20.7,41c2.2,0.2,4.5,0.2,6.7,0c0.8-0.1,1.7-0.3,2.5-0.7c0.7-0.3,1.2-0.7,1.2-1.3c0-0.9-0.4-1.9-1.1-2.8c-0.1-0.1-0.3-0.2-0.4-0.3L30,21.9l-0.1,0c0.2-0.1,0.4-0.2,0.5-0.5c0.8-1.7,1.2-3.5,1.2-5c0-1.9-2-3.3-4-3.7c-2.4-0.3-4.8-0.3-7.2,0c-1,0.1-1.9,0.6-2.6,1.2c-0.7,0.6-1.3,1.3-1.3,2.3c0,1.6,0.4,3.4,1.2,5c0.1,0.2,0.3,0.4,0.5,0.4l0,0l0.6,14.1l0.1,0l-0.6-14.1c0,0,0.1,0,0.1,0c3.3,0,7.9,0,11.4,0.1c0,0,0.1,0,0.1,0L29.3,36c0,0,0,0,0,0c-3.1,0-7.3,0-10.6-0.1c-0.2,0-0.5,0.1-0.6,0.3c-0.8,0.9-1.1,1.9-1.1,2.8C17,40.1,18.9,40.9,20.7,41z M21.4,23v2h5.4v-2H21.4z M16.2,44.1l2.2,0.7c0.1,0-0.1-0.3-0.3-0.6l-0.9-1.2c-0.1-0.1-0.1-0.2-0.2-0.2L16.2,42C16.1,42,16,41.9,16,42l-0.3,0.9C15.6,43.3,15.8,43.9,16.2,44.1zM16,38.5c3.6-10-0.3-20.4-0.3-20.4L16,38.5z M15.6,7.5c-0.5,4.3,0.1,0.4,0.1,0.4l3.8-5C19.5,2.9,16.1,3.2,15.6,7.5L15.6,7.5zM24,2.4c-2.2,0-4,0.3-4,0.5c0,0.3,1.8,0.3,4,0.2c2.2,0,4,0.1,4-0.2C28,2.7,26.2,2.5,24,2.4z M32.7,7.5c-0.5-4.3-3.9-4.6-3.9-4.6l3.8,5C32.6,7.9,33.2,11.8,32.7,7.5z";  
	var busIcon = "M36.1,42l-1.5,0.7c-0.4,0.2-0.9,0-1.1-0.4l0,0v2.8c0,0.3-0.2,0.6-0.5,0.8V46c-5.3,1.4-10.9,1.4-16.2,0v-0.1c-0.3-0.2-0.5-0.5-0.5-0.8v-2.8l0,0c-0.2,0.4-0.7,0.6-1.1,0.4L13.8,42c-0.2-0.1-0.3-0.4-0.1-0.6l0.3-0.3l2.4,0.7v-40c0-0.5,0.4-0.9,0.9-0.9h0h15.3c0.5,0,0.9,0.4,0.9,0.9v40l2.4-0.7l0.3,0.3C36.4,41.6,36.4,41.9,36.1,42zM16.9,44.3c0,0.4,0.3,0.8,0.7,0.9v0c2,0.4,4.6,0.7,7.5,0.7s5.4-0.2,7.5-0.7v-0.1c0.3-0.1,0.6-0.5,0.6-0.8V41l-0.6,0.2v1.6c0,0.6-0.5,1.1-1.1,1.1c0,0,0,0,0,0H18.7c-0.6,0-1.1-0.5-1.1-1.1c0,0,0,0,0,0v-1.6L16.9,41L16.9,44.3L16.9,44.3z M20.4,5.4h9.3V4.1h-9.3V5.4z M20.3,37.9v4.5h9.3v-4.5H20.3z M20.4,5.9v1.2h9.3V5.9H20.4z M20.4,7.7v4.5h9.3V7.7C29.7,7.7,20.4,7.7,20.4,7.7zM16.9,39.6l0.7,0.5v-5.7L16.9,34V39.6L16.9,39.6z M16.9,33l0.7,0.4V27l-0.7-0.1V33L16.9,33z M16.9,26.2l0.7,0.3v-7.8l-0.7,0.2V26.2L16.9,26.2z M16.9,18.2l0.7-0.1v-6.4L16.9,12V18.2z M16.9,11.2l0.7-0.3V4.2l-0.7-0.7V11.2L16.9,11.2z M32.6,1.7H17.5c-0.3,0-0.5,0.2-0.3,0.5L17.6,3c0.2,0.3,0.5,0.4,0.8,0.4h13.3c0.3,0,0.6-0.2,0.8-0.4l0.4-0.7C33,2,32.9,1.7,32.6,1.7z M33.1,3.4l-0.7,0.7V11l0.7,0.3V3.4z M33.1,12l-0.7-0.4v6.4l0.7,0.1V12L33.1,12z M33.1,18.9l-0.7-0.2v7.8l0.7-0.3V18.9L33.1,18.9z M33.1,26.9L32.4,27v6.4l0.7-0.4V26.9z M33.1,34l-0.7,0.5v5.7l0.7-0.5V34L33.1,34z M18.1,0.1h2.1c0.3,0,0.5,0.2,0.5,0.5v0.2h-3.1V0.6C17.6,0.3,17.8,0.1,18.1,0.1z M29.8,0.1h2.1c0.3,0,0.5,0.2,0.5,0.5v0.2h-3.1V0.6C29.3,0.3,29.6,0.1,29.8,0.1z M21.3,47.3l-0.2,0.7l-2.9-0.4c-0.2,0-0.4-0.4-0.4-0.8v-0.1C18.9,46.9,20.1,47.1,21.3,47.3z M32.5,46.5L32.5,46.5c0,0.5-0.2,0.8-0.4,0.9l-2.9,0.4l-0.2-0.7C30.1,47,31.3,46.8,32.5,46.5z"; 
	var truckIcon = "M33.2,38.5v4.8c0,0.4-0.3,0.7-0.7,0.7l0,0v2.8c0,0.3-0.2,0.5-0.5,0.5h-1.1v0c0,0.2-0.2,0.5-0.5,0.5H28c-0.2,0-0.5-0.2-0.5-0.5v0h-7.1v0c0,0.2-0.2,0.5-0.5,0.5h-2.4c-0.2,0-0.5-0.2-0.5-0.5v0H16c-0.3,0-0.5-0.2-0.5-0.5v-2.8c-0.4,0-0.7-0.3-0.7-0.7l0,0v-4.8c0-0.4,0.3-0.7,0.7-0.7V24.6c-0.4,0-0.7-0.3-0.7-0.7l0,0v-4.8c0-0.4,0.3-0.7,0.7-0.7l0,0V16c0-0.3,0.2-0.5,0.5-0.5h16c0.3,0,0.5,0.2,0.5,0.5v2.4c0.4,0,0.7,0.3,0.7,0.7l0,0v4.8c0,0.4-0.3,0.7-0.7,0.7l0,0v13.2C32.9,37.9,33.2,38.2,33.2,38.5z M16.5,16.7c0-0.1-0.1-0.2-0.2-0.2c-0.1,0-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2c0.1,0,0.2-0.1,0.2-0.2V16.7z M17.5,16.7c0-0.1-0.1-0.2-0.2-0.2c-0.1,0-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2c0.1,0,0.2-0.1,0.2-0.2V16.7z M18.5,16.7c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.7z M19.4,16.6c0-0.1-0.1-0.2-0.2-0.2S19,16.5,19,16.6v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6z M20.4,16.6c0-0.1-0.1-0.2-0.2-0.2S20,16.5,20,16.6v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6zM21.3,16.6c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6z M22.3,16.7c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.7z M23.2,16.7c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.7z M24.2,16.7c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.7z M25.1,16.6c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6z M26.1,16.6c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6zM27.1,16.6c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6z M28,16.7c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.7z M29,16.7c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.7z M29.9,16.6c0-0.1-0.1-0.2-0.2-0.2s-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2s0.2-0.1,0.2-0.2V16.6z M30.9,16.6c0-0.1-0.1-0.2-0.2-0.2c-0.1,0-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2c0.1,0,0.2-0.1,0.2-0.2V16.6z M31.8,16.6c0-0.1-0.1-0.2-0.2-0.2c-0.1,0-0.2,0.1-0.2,0.2v28.7c0,0.1,0.1,0.2,0.2,0.2c0.1,0,0.2-0.1,0.2-0.2V16.6z M31.1,14.4c0,0.3-0.2,0.5-0.5,0.5H17.8c-0.3,0-0.5-0.2-0.5-0.5V6.5h-1.4V6.2c0-0.2,0.1-0.3,0.1-0.3l1.3-0.4V5.4h0c0.2-1.3,0.4-2.6,0.6-3.7c0.1-0.4,0.8-0.9,1.6-1C22.7,0,25.8,0,29,0.6c0.8,0.2,1.5,0.7,1.5,1c0.2,1.2,0.4,2.4,0.6,3.7v0.1l1.3,0.4c0.1,0,0.1,0.2,0.1,0.3v0.3h-1.4V14.4z M30.1,2.6c-0.1-0.3-0.7-0.8-1.4-0.9c-2.9-0.6-5.8-0.6-8.8,0c-0.7,0.2-1.4,0.6-1.4,0.9l-0.3,1.8c0.3-0.2,0.7-0.3,1-0.3c3.5-0.6,6.9-0.6,10.3,0c0.3,0.1,0.6,0.2,0.9,0.3C30.3,3.8,30.2,3.2,30.1,2.6z";
	var bikeIcon = "M34.7,16.4l-0.4-0.1l0.1-0.4c0,0,0,0,0,0l-4.4-1.2c-0.3,0.8-0.7,1.6-1.3,2.3c0.5,1.1,0.7,2.4,0.4,3.6h0L29,21c0,0,0,0.1,0,0.1l-0.8,2.7h-0.1c-0.1,0.2-0.1,0.4-0.2,0.6c-0.9,2.1-2.6,2.9-3.9,2.9s-3-0.8-3.9-2.9c-0.2-0.5-0.4-1-0.5-1.5l-0.7-2.3h0c-0.3-1.2-0.1-2.5,0.5-3.6c-0.5-0.7-1-1.5-1.3-2.3l-4.4,1.2c0,0,0,0,0,0l0.1,0.4l-0.4,0.1L12.9,15l0.4-0.1l0.1,0.2c0,0,0,0,0,0l4.4-1.2c0-0.1,0-0.1,0-0.2c0.1-0.5,0.3-1,0.5-1.5h-0.6v-0.1c0,0.2-0.2,0.4-0.4,0.4c0,0,0,0,0,0h-0.7c-0.2,0-0.4-0.2-0.4-0.4v0V12c0-0.2,0.2-0.4,0.4-0.4h0h0.7c0.2,0,0.4,0.2,0.4,0.4c0,0,0,0,0,0h0.7v0c0.9-1.9,2.5-3.5,4.5-4.3c0.4-0.2,0.7-0.3,1.1-0.4c0.3,0.1,0.7,0.2,1,0.3c2,0.8,3.6,2.5,4.5,4.3h0.6c0-0.2,0.2-0.4,0.4-0.4h0.7c0.2,0,0.4,0.2,0.4,0.4v0.1c0,0.2-0.2,0.4-0.4,0.4h-0.7c-0.2,0-0.4-0.2-0.4-0.4v0.1h-0.5c0.2,0.5,0.4,1,0.5,1.5c0,0.1,0,0.1,0,0.2l4.4,1.2c0,0,0,0,0,0l0.1-0.2l0.4,0.1L34.7,16.4z M22.8,17.2c0,0.5,0.4,0.8,0.8,0.8h0.2c0.5,0,0.8-0.4,0.8-0.8v-0.2c0-0.5-0.4-0.8-0.8-0.8h-0.2c-0.5,0-0.8,0.4-0.8,0.8V17.2z M26.8,12.6c0-0.2-0.2-0.4-0.4-0.4H24c-0.3-0.7-1.1-1.1-1.8-0.9c-0.7,0.3-1.1,1.1-0.9,1.8c0.2,0.5,0.7,0.9,1.2,1v0h3.7c0.3,0,0.6-0.3,0.6-0.6c0,0,0,0,0,0V12.6z M22.1,7.2V2.7c0-1,0.8-1.8,1.8-1.8s1.8,0.8,1.8,1.8v4.6C24.7,6.5,23.2,6.5,22.1,7.2z M17.4,33.2H20c0.2-0.9,0.3-1.9,0.4-2.8c0.1-1.1,0.1-2.2,0-3.3v0.3h-2.7v0.1h-0.4v-1h0.4v0.1h2.7v0.1c1,1.1,2.3,1.6,3.3,1.6c1,0,2.3-0.5,3.3-1.6v-0.1h0.1c0.1-0.1,0.1-0.1,0.2-0.2c0,0.1,0,0.1,0,0.2h2.5v-0.1h0.4v1h-0.4v-0.1h-2.6c-0.1,1-0.1,2,0,3c0.1,0.9,0.2,1.9,0.4,2.8h2.4v-0.1h0.4v1h-0.4v-0.1h-2.3c0.1,0.5,0.3,1.1,0.4,1.6h0.1l0,0.2l0,0.1h0l-1.6,7.7h0.4c0-0.2,0.2-0.4,0.4-0.4c0,0,0,0,0,0h0.7c0.2,0,0.4,0.2,0.4,0.4v0.1c0,0.2-0.2,0.4-0.4,0.4h-0.7c-0.2,0-0.4-0.2-0.4-0.4v0.1h-0.5l-0.4,2h0c-0.1,0.7-1.1,1.3-2.3,1.3c-1.2,0-2.2-0.6-2.3-1.3h-0.1l-0.4-2h-0.5v-0.1c0,0.2-0.2,0.4-0.4,0.4l0,0h-0.7c-0.2,0-0.4-0.2-0.4-0.4v-0.1c0-0.2,0.2-0.4,0.4-0.4h0.7c0.2,0,0.4,0.2,0.4,0.4H21l-1.6-7.7h-0.1l0-0.2l0,0h0l0-0.1c0.2-0.5,0.3-1,0.4-1.5h-2.5v0.1H17v-1h0.4L17.4,33.2L17.4,33.2z";
	var markerIcon = "M31.809992,17.113449c-0.001888,-8.347025 -6.76548,-15.113449 -15.110806,-15.113449c-8.348912,0 -15.116186,6.766424 -15.116186,15.113449c0,7.204499 11.258558,26.452334 14.343395,31.58728c0.162355,0.272039 0.455538,0.438075 0.771941,0.438075c0.316309,0 0.61053,-0.166036 0.770997,-0.437131c3.08295,-5.134946 14.340658,-24.383725 14.340658,-31.588224zm-15.111655,11.693896c-6.447283,0 -11.696633,-5.245668 -11.696633,-11.694745c0,-6.448227 5.247462,-11.694745 11.696633,-11.694745s11.692952,5.246518 11.692952,11.694745s-5.244724,11.694745 -11.692952,11.694745z";	 
	var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
	var vehicleType;
	var multiBounds;
	var myPlace = {lat: 12.850167, lng: 77.660329};
	var icon = {
	    path: markerIcon,
	    scale: .7,
	    strokeColor: 'white',
	    strokeWeight: 0,
	    fillOpacity: 1,
	    fillColor: '#000000',
	    offset: '5%',
	    // rotation: parseInt(heading[i]),
	    anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0
												// front of car, 10,25 center of
												// car
	};
	$scope.httpLoading=false;
	
	  // function initialize(){
	  $scope.initialize=function () {    
		  var $map = $('#map_canvas');
		  infowindow = new google.maps.InfoWindow(
		    {  
		      size: new google.maps.Size(150,50)
		    });
		    var styleMap = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#bee4f4"},{"visibility":"on"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"color":"#000000"}]}]; 
		    var myOptions = {
		      zoom: 16,
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    };
		    // console.log(document.getElementById("map_canvas"));
		    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		    address = 'India';
		    // address = 'Trinidad and Tobago'
		    geocoder = new google.maps.Geocoder();
		    geocoder.geocode( { 'address': address}, function(results, status) {
		     map.fitBounds(results[0].geometry.viewport);

		    });	
		 // Instantiate a directions service.
		    directionsService = new google.maps.DirectionsService();
		 // Create a renderer for directions and bind it to the map.
	        var rendererOptions = {
	            map: map
	        };
	        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
		    polyline = new google.maps.Polyline({
		        path: [],
		        strokeColor: '#FF0000',
		        strokeWeight: 0
		    });
		    poly2 = new google.maps.Polyline({
		        path: [],
		        strokeColor: '#FF0000',
		        strokeWeight: 0
		    });
		    /*
			 * google map default zoom_changed event
			 * */
		    $scope.zoomlevel=0;
			google.maps.event.addListener(map, 'zoom_changed', function() {
			    $scope.zoomlevel = map.getZoom();    			    
			});
			function wheelEvent( event ) { 
			/*	console.log($scope.zoomlevel);
				console.log($scope.deviceId);*/
				if(typeof $scope.deviceId !='undefined' && $scope.deviceId !=""){
					if ($scope.zoomlevel < 16 || $scope.zoomlevel > 21) {
						console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ZOOM & DEVICEID<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
						$scope.singleDeviceZoomed = false;
						if (angular.isDefined(singleDeviceInterval)) {
							$interval.cancel(singleDeviceInterval);
						} else if (angular.isDefined(multiDeviceInterval)) {
							$interval.cancel(multiDeviceInterval);
						}
					}
				}			
		    }
		    
		    $map[0].addEventListener( 'mousewheel', wheelEvent, true );
		    $map[0].addEventListener( 'DOMMouseScroll', wheelEvent, true );
		  };
		  /*function resizeTrackingMap() {
			   if(typeof map =="undefined") return;
			   google.maps.event.trigger(map, "resize");
			   if(typeof multiBounds!="undefined"){
				   map.fitBounds(multiBounds);
			   }
			   else{
				   map.setZoom(map.getZoom());
			   }			   
		};	*/  
    $scope.resizeMap = function(){
    	$("#map_canvas").css("position", 'fixed').
        css('top', 0).
        css('left', 0).
        css("width", '100%'). 
    	css("height",'100%');
    	$(".count_label").css("position", 'fixed').css('top', '8px').css('left', '5px').css('margin-top', '45px');
    	$(".traffic_layer_btn").css("position", 'fixed').css('top', '10px').css('left', '130px');
    	//console.log("resize");
    	google.maps.event.trigger(map, 'resize');
    }
    
    
    $scope.shrinkMap=function(){
    	$("#map_canvas").css("position", 'absolute').
        css('top', 0).
        css('left', 0).
        css("width", '100%').
    	css("height",'100%');
    	$(".count_label").css("position", 'absolute').css('top', 0).css('left', '15px').css('margin-top','125px');
    	$(".traffic_layer_btn").css("position", 'absolute').css('top', '10px').css('left', '130px');
    	google.maps.event.trigger(map, 'resize');
    }
	function createMarker(latlng, deviceID,vehNo,vehModel, html,type) {
		// console.log(deviceID+"=="+type);
		var contentString; 
		if(type==0){icon.fillColor='#ea0909';}
		else if(type==1){icon.fillColor='#ffde01';}
		else if(type==2){icon.fillColor='#e59305';}
		else if(type==3){icon.fillColor='#000000';}
		else if(type==4){icon.fillColor='#0540E5';}
		var geocoder = new google.maps.Geocoder();		
		geocoder.geocode({       
		        latLng: latlng     
		        }, 
		        function(responses) 
		        {     
		           if (responses && responses.length > 0) 
		           {     	   
		        	   if(html.length==0){
		        		   // console.log(html.length);
		        		   html=responses[0].formatted_address;
		        		   contentString  = '<b><label>Device ID:</label> '+deviceID+'</b><br><br><b><label>Vehicle No:</label> '+vehNo+'</b><br><br><b><label>Vehicle Model:</label> '+vehModel+'</b><br><br>'+html+'<br><br><button class="btn btn-primary btn-sm" id="infoClick" data-deviceID="'+deviceID+'">show detail</button>';	
		        	   }		        	   		                    
		           } 
		           else 
		           {       
		             // swal('Not getting Any address for given latitude and
						// longitude.');
		           }   
		        }
		);
		if(html.length!=0){
			contentString  = '<b><label>Device ID:</label> '+deviceID+'</b><br><br><b><label>Vehicle No:</label> '+vehNo+'</b><br><br><b><label>Vehicle Model:</label> '+vehModel+'</b><br><br>'+html+'<br><br><button class="btn btn-primary btn-sm" id="infoClick" data-deviceID="'+deviceID+'">show detail</button>';
		}
		
		    
		    var marker = new google.maps.Marker({
		        position: latlng,
		        map: map,
		        title: deviceID, 
		        icon:icon,       
		        zIndex: Math.round(latlng.lat()*-100000)<<5
		        });
		        marker.myname = deviceID;
		        markers.push(marker);

		    google.maps.event.addListener(marker, 'click', function() {
		    	 /*
					 * calling map modal controller function from here using
					 * $emit ref links
					 * http://stackoverflow.com/questions/29467339/how-to-call-function-in-another-controller-in-angularjs
					 * http://stackoverflow.com/questions/21346565/how-to-pass-an-object-using-rootscope
					 */	    	 
		        infowindow.setContent(contentString); 
		        infowindow.open(map,marker);
		       // $rootScope.$emit("deviceDetailModal",lg,deviceID);
		       // $scope.open("lg",deviceID);
		        });
		    return marker;
		}	
	// Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }
    function setPolygonNull(){
    	myPolygon.setMap(null);
    }
	
	$(document).on('click','#infoClick',function(event){
		 event.stopImmediatePropagation();
		console.log("Check click"+$(this).attr('class'));		
		if(typeof $scope.deviceId=='undefined' || $(this).attr("data-deviceID")!= ""){
			$scope.open("lg",$(this).attr("data-deviceID"));
		}
		else{
			$scope.open("lg",$scope.deviceId);	
		}
		
	});	 

	/*
	 * -----------------------------------------code for vehicle icon
	 * movement---------------------------------------------------------------
	 * 
	 */
	
	$scope.calcRoute = function(dataVal) {
		/**
		 * check for storedltlng object is initialized or not if initalized
		 * follow the next step else intialize the storedltlng check for
		 * storedltlng key "lat" value is not equal to current data values lat
		 * if not allow movement of vehichle operation else update start and end
		 * with same current data lat and lng ex: dataVal[0].values.lat and .lng
		 * for both start and end
		 */
		if(typeof storedltlng.lat!='undefined'){
			if(storedltlng.lat!=dataVal[0].values[0].lat){
				if(dataVal[0].values[0].type==4){
					console.log("--------------------Different lat lng of "+dataVal[0].values[0].type+" ------------------------------");
					console.log("start : ",storedltlng.lat,"end :",dataVal[0].values[0].lat);
					vehichleRouting(dataVal,storedltlng.lat,storedltlng.lng,storedltlng.lat,storedltlng.lng);
				}
				
				else{
					console.log("--------------------Different lat lng------------------------------");
					console.log("start : ",storedltlng.lat,"end :",dataVal[0].values[0].lat);
					vehichleRouting(dataVal,storedltlng.lat,storedltlng.lng,dataVal[0].values[0].lat,dataVal[0].values[0].long);
			        storedltlng.lat=dataVal[0].values[0].lat;
					storedltlng.lng=dataVal[0].values[0].long;
				}
			}
			else{
				var startLat=dataVal[0].values[0].lat;
				var startLng=dataVal[0].values[0].long;
				var endLat=dataVal[0].values[0].lat;
				var endLng=dataVal[0].values[0].long;
				vehichleRouting(dataVal,startLat,startLng,endLat,endLng)
				console.log("-----------------EQUAL / SAME LAT------------------------")
				console.log("start : ",storedltlng.lat,"end :",dataVal[0].values[0].lat);
			
			}
		}		
		else{
			storedltlng.lat=dataVal[0].values[0].lat;
			storedltlng.lng=dataVal[0].values[0].long;
			var startLat=dataVal[0].values[0].lat;
			var startLng=dataVal[0].values[0].long;
			var endLat=dataVal[0].values[0].lat;
			var endLng=dataVal[0].values[0].long;
			vehichleRouting(dataVal,startLat,startLng,endLat,endLng)
		}
	 
	};

	function vehichleRouting(dataVal,startLat,startLng,endLat,endLng){
		// console.log(startLat,startLng,endLat,endLng);
		if (timerHandle) {
            clearTimeout(timerHandle);
        }
        if (marker) {
            marker.setMap(null);
        }
        polyline.setMap(null);
        poly2.setMap(null);
        directionsDisplay.setMap(null);
        polyline = new google.maps.Polyline({
            path: [],
            strokeColor: '#FFFFFF',
            strokeWeight: 0
        });
        poly2 = new google.maps.Polyline({
            path: [],
            strokeColor: '#FFFFFF',
            strokeWeight: 0
        });
        // Create a renderer for directions and bind it to the map.
        var rendererOptions = {
            map: map
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

        var start = new google.maps.LatLng({lat: Number(startLat), lng: Number(startLng)}); // document.getElementById("start").value;
        var end = new google.maps.LatLng({lat: Number(endLat), lng: Number(endLng)}); // document.getElementById("end").value;
        var travelMode = google.maps.DirectionsTravelMode.DRIVING;

        var request = {
            origin: start,
            destination: end,
            travelMode: travelMode
        };

        // Route the directions and pass the response to a
        // function to create markers for each step.
        directionsService.route(request, function (response, status) {
            // console.log(response.routes[0]);
            if (status == google.maps.DirectionsStatus.OK) {
                // directionsDisplay.setDirections(response);

                var bounds = new google.maps.LatLngBounds();
                var route = response.routes[0];
                startLocation = new Object();
                endLocation = new Object();

                // For each route, display summary information.
                var path = response.routes[0].overview_path;
                var legs = response.routes[0].legs;
                for (i = 0; i < legs.length; i++) {
                    if (i === 0) {
                        // console.log(JSON.stringify(legs[i].start_location));
                        startLocation.latlng = legs[i].start_location;
                        startLocation.address = legs[i].start_address;												   
                          marker = createMarker(legs[i].start_location,dataVal[i].devid,dataVal[i].vehicle_num,dataVal[i].vehicle_model,legs[i].start_address,dataVal[i].values[0].type);
                      }
                      endLocation.latlng = legs[i].end_location;
                      endLocation.address = legs[i].end_address;
                      var steps = legs[i].steps;
                    // console.log(JSON.stringify(steps));
                    for (j = 0; j < steps.length; j++) {
                        var nextSegment = steps[j].path;
                        for (k = 0; k < nextSegment.length; k++) {
                            polyline.getPath().push(nextSegment[k]);
                            bounds.extend(nextSegment[k]);
                        }
                    }
                }
                polyline.setMap(map);
                map.fitBounds(bounds);
                console.log(map.getZoom());
                map.setZoom($scope.singleDeviceZoomLevel); 
                startAnimation();                
            }
        });
	}

	var step = 50; // 5; // metres
	var tick = 1000; // milliseconds
	var eol;
	var k = 0;
	var stepnum = 0;
	var speed = "";
	var lastVertex = 1;

	// =============== animation functions ======================
	function updatePoly(d) {
	    // Spawn a new polyline every 20 vertices, because updating a 100-vertex
		// poly is too slow
	    if (poly2.getPath().getLength() > 20) {
	        poly2 = new google.maps.Polyline([polyline.getPath().getAt(lastVertex - 1)]);
	        // map.addOverlay(poly2)
	    }

	    if (polyline.GetIndexAtDistance(d) < lastVertex + 2) {
	        if (poly2.getPath().getLength() > 1) {
	            poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
	        }
	        poly2.getPath().insertAt(poly2.getPath().getLength(), polyline.GetPointAtDistance(d));
	    } else {
	        poly2.getPath().insertAt(poly2.getPath().getLength(), endLocation.latlng);
	    }
	}

	$scope.animate = function(d) {
	  // console.log(d);
	  if (d > eol) {        
	    map.panTo(endLocation.latlng);
	    marker.setPosition(endLocation.latlng);
	    return;
	}
	var p = polyline.GetPointAtDistance(d);
	map.panTo(p);
	var lastPosn = marker.getPosition();
	marker.setPosition(p);
	var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
	icon.rotation = heading;
	marker.setIcon(icon);
	updatePoly(d);
	    // timerHandle = setTimeout("animate(" + (d + step) + ")", tick);
	    
	    timerHandle = setTimeout(function() {
	        $scope.animate(d + step);
	    }, tick);
	}

	function startAnimation() {
	    eol = polyline.Distance();
	    map.setCenter(polyline.getPath().getAt(0));
	   /*
		 * marker = new google.maps.Marker({ position:
		 * polyline.getPath().getAt(0), map: map, icon: icon });
		 */

	    poly2 = new google.maps.Polyline({
	        path: [polyline.getPath().getAt(0)],
	        strokeColor: "#0000FF",
	        strokeWeight: 0
	    });
	    // map.addOverlay(poly2);
	    // setTimeout("animate(50)", 2000); // Allow time for the initial map
		// display
	    
	    setTimeout(function() {
	        $scope.animate(50);
	    }, 2000);
	    

	}
	// ----------------------------------------------------------------------------
	// =============== ~animation funcitons =====================
	/***************************************************************************
	 * *******************************************************************\ *
	 * epolys.js by Mike Williams * updated to API v3 by Larry Ross * * A Google
	 * Maps API Extension * * Adds various Methods to google.maps.Polygon and
	 * google.maps.Polyline * * .Contains(latlng) returns true is the poly
	 * contains the specified * GLatLng * * .Area() returns the approximate area
	 * of a poly that is * not self-intersecting * * .Distance() returns the
	 * length of the poly path * * .Bounds() returns a GLatLngBounds that bounds
	 * the poly * * .GetPointAtDistance() returns a GLatLng at the specified
	 * distance * along the path. * The distance is specified in metres * Reurns
	 * null if the path is shorter than that * * .GetPointsAtDistance() returns
	 * an array of GLatLngs at the * specified interval along the path. * The
	 * distance is specified in metres * * .GetIndexAtDistance() returns the
	 * vertex number at the specified * distance along the path. * The distance
	 * is specified in metres * Returns null if the path is shorter than that * *
	 * .Bearing(v1?,v2?) returns the bearing between two vertices * if v1 is
	 * null, returns bearing from first to last * if v2 is null, returns bearing
	 * from v1 to next * * *
	 * ********************************************************************** *
	 * This Javascript is provided by Mike Williams * Blackpool Community Church
	 * Javascript Team * http://www.blackpoolchurch.org/ *
	 * http://econym.org.uk/gmap/ * * This work is licenced under a Creative
	 * Commons Licence * http://creativecommons.org/licenses/by/2.0/uk/ * *
	 * ********************************************************************** *
	 * Version 1.1 6-Jun-2007 * Version 1.2 1-Jul-2007 - fix: Bounds was
	 * omitting vertex zero * add: Bearing * Version 1.3 28-Nov-2008 add:
	 * GetPointsAtDistance() * Version 1.4 12-Jan-2009 fix:
	 * GetPointsAtDistance() * Version 3.0 11-Aug-2010 update to v3 * * \
	 **************************************************************************/

	// === first support methods that don't (yet) exist in v3
	google.maps.LatLng.prototype.distanceFrom = function (newLatLng) {
	    var EarthRadiusMeters = 6378137.0; // meters
	    var lat1 = this.lat();
	    var lon1 = this.lng();
	    var lat2 = newLatLng.lat();
	    var lon2 = newLatLng.lng();
	    var dLat = (lat2 - lat1) * Math.PI / 180;
	    var dLon = (lon2 - lon1) * Math.PI / 180;
	    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    var d = EarthRadiusMeters * c;
	    return d;
	}

	google.maps.LatLng.prototype.latRadians = function () {
	    return this.lat() * Math.PI / 180;
	}

	google.maps.LatLng.prototype.lngRadians = function () {
	    return this.lng() * Math.PI / 180;
	}

	// === A method which returns the length of a path in metres ===
	google.maps.Polygon.prototype.Distance = function () {
	    var dist = 0;
	    for (var i = 1; i < this.getPath().getLength(); i++) {
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	    }
	    return dist;
	}

	// === A method which returns a GLatLng of a point a given distance along
	// the path ===
	// === Returns null if the path is shorter than the specified distance ===
	google.maps.Polygon.prototype.GetPointAtDistance = function (metres) {
	    // some awkward special cases
	    if (metres == 0) return this.getPath().getAt(0);
	    if (metres < 0) return null;
	    if (this.getPath().getLength() < 2) return null;
	    var dist = 0;
	    var olddist = 0;
	    for (var i = 1;
	    (i < this.getPath().getLength() && dist < metres); i++) {
	        olddist = dist;
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	    }
	    if (dist < metres) {
	        return null;
	    }
	    var p1 = this.getPath().getAt(i - 2);
	    var p2 = this.getPath().getAt(i - 1);
	    var m = (metres - olddist) / (dist - olddist);
	    return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
	}

	// === A method which returns an array of GLatLngs of points a given
	// interval along the path ===
	google.maps.Polygon.prototype.GetPointsAtDistance = function (metres) {
	    var next = metres;
	    var points = [];
	    // some awkward special cases
	    if (metres <= 0) return points;
	    var dist = 0;
	    var olddist = 0;
	    for (var i = 1;
	    (i < this.getPath().getLength()); i++) {
	        olddist = dist;
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	        while (dist > next) {
	            var p1 = this.getPath().getAt(i - 1);
	            var p2 = this.getPath().getAt(i);
	            var m = (next - olddist) / (dist - olddist);
	            points.push(new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m));
	            next += metres;
	        }
	    }
	    return points;
	}

	// === A method which returns the Vertex number at a given distance along
	// the path ===
	// === Returns null if the path is shorter than the specified distance ===
	google.maps.Polygon.prototype.GetIndexAtDistance = function (metres) {
	    // some awkward special cases
	    if (metres == 0) return this.getPath().getAt(0);
	    if (metres < 0) return null;
	    var dist = 0;
	    var olddist = 0;
	    for (var i = 1;
	    (i < this.getPath().getLength() && dist < metres); i++) {
	        olddist = dist;
	        dist += this.getPath().getAt(i).distanceFrom(this.getPath().getAt(i - 1));
	    }
	    if (dist < metres) {
	        return null;
	    }
	    return i;
	}
	// === Copy all the above functions to GPolyline ===
	google.maps.Polyline.prototype.Distance = google.maps.Polygon.prototype.Distance;
	google.maps.Polyline.prototype.GetPointAtDistance = google.maps.Polygon.prototype.GetPointAtDistance;
	google.maps.Polyline.prototype.GetPointsAtDistance = google.maps.Polygon.prototype.GetPointsAtDistance;
	google.maps.Polyline.prototype.GetIndexAtDistance = google.maps.Polygon.prototype.GetIndexAtDistance;
	
	/*
	 * -----------------------------------------the end for vehicle icon
	 * movement---------------------------------------------------------------
	 * 
	 */
		
	$scope.singleDeviceZoomLevel=16;
	$scope.multipleDeviceZoomLevel=3;
	$scope.mars = 10;
	$scope.isZoomed = true;// reCenter button for group based
	$scope.singleDeviceZoomed = true;// reCenter button for single device
										// based
	$scope.deviceList = [];
	var speedValue=0;									
	var devIDval="";
	var speedlimit="";
	
	$scope.chart;

	/*
	 * var MarkersOnload=[]; var mapPosOnload={}; var polygonOnload=[]; var
	 * scope = angular.element(document.getElementById("smartMap")).scope();
	 * scope.updateMap(MarkersOnload, mapPosOnload,polygonOnload);
	 */
	// Count of vehicle count
	var multiDeviceInterval, singleDeviceInterval;
	$scope.multiDevice = false;
	$scope.singleDevice = false;
	$scope.carCount = 0;
	$scope.jeepCount = 0;
	$scope.bikeCount = 0;
	$scope.busCount = 0;
	$scope.truckCount = 0;
	$scope.admingroup = {};
	$scope.admingroup.token = $scope.token;
	// console.log($scope.admingroup);
	$http({
		method : 'POST',
		url : apiURL + 'group/list',
		data : JSON.stringify($scope.admingroup),
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function(data) {
		// console.log(JSON.stringify(data));
		listGroup(data);
	}).error(function(data, status, headers, config) {
		console.log(data);
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
	/**
	 * function to list the group id and name
	 */

	function listGroup(data) {
		var glist = [];
		for ( var inc = 0; inc < data.glist.length; inc++) {
			glist.push(data.glist[inc]);
		}
		$scope.groupList = glist;
		// console.log($scope.groupList);
	}
	/**
	 * fetch device list based on group id
	 */
	$scope.fetchDevicelist = function(groupID) {
		//resizeTrackingMap();
		$scope.deviceId="";
		$scope.httpLoading=true;
	    $('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
		storage_arr=[];// clearing the matched array on change of group id
						// dropdown
		setMapOnAll(null);
		if(myPolygon){			
			setPolygonNull();
		}
		$scope.isZoomed = true;// reCenter button for group based
		$scope.singleDeviceZoomed = true;// reCenter button for single device
											// based
		// document.getElementById("groupNamelist").blur();
		// console.log(groupID);
		$scope.groupdevicejson = {};
		$scope.groupdevicejson.token = $scope.token;
		$scope.groupdevicejson.gid = groupID;
		/**
		 * get device list based on group ID
		 */

		$http({
			method : 'POST',
			url : apiURL + 'group/devlist',
			data : JSON.stringify($scope.groupdevicejson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {	
			//console.log(JSON.stringify(data));
			if (angular.isDefined(multiDeviceInterval)) {
				$interval.cancel(multiDeviceInterval);
			} else if (angular.isDefined(singleDeviceInterval)) {
				$interval.cancel(singleDeviceInterval);
			}
			$scope.groupDevice = data;
			// console.log(JSON.stringify($scope.groupDevice));
			$scope.carCount = $scope.groupDevice.carcount;
			$scope.bikeCount = $scope.groupDevice.bikecount;
			$scope.busCount = $scope.groupDevice.buscount;
			$scope.truckCount = $scope.groupDevice.truckcount;
			var dev_len = $scope.groupDevice.devlist.length;
			$scope.devlistObject=$scope.groupDevice.devlist
			var devlist = $scope.groupDevice.devlist;
			$scope.deviceList=[];
			for ( var i = 0; i < dev_len; i++) {
				$scope.deviceList.push(devlist[i].devid);
			}
			plotDevices();			
			// multiDeviceInterval = $interval(plotDevices, reqTime * 1000);
			// console.log(multiDeviceInterval);
		}).error(function(data, status, headers, config) {
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			if (data.err == "Expired Session") {
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
		}).finally(function(){		
			$scope.httpLoading=false;
		});
	};
	/**
	 * fetch device information
	 */
	$scope.fetchDeviceDetail = function(gid, deviceId) {
		//resizeTrackingMap();
		// console.log(deviceId)
		// $scope.initialize();
		// $scope.isZoomed = true;// reCenter button for group based
		$scope.singleDeviceZoomed = true;// reCenter button for single device based
		$scope.devIDval = deviceId;
		devIDval=deviceId;
		$scope.multiDevice = false;
		$scope.singleDevice = true;
		if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		} else if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		}
		$scope.selectedgroupdevicejson = {};
		$scope.selectedgroupdevicejson.token = $scope.token;
		$scope.selectedgroupdevicejson.gid = $scope.groupdevicejson.gid;
		storedltlng={};	
		geofenceAPI($scope.selectedgroupdevicejson);
		setMapOnAll(null);
		map.setZoom($scope.singleDeviceZoomLevel);
		//console.log(map.getZoom());
		plotDevice();		
		singleDeviceInterval = $interval(plotDevice,reqTime * 1000);		
	};
	
	/**
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------
	 * 
	 * plot group based device on the map
	 * ---------------------------------------------------------------------------------------------------------------------------------------------------
	 */
	function geofenceAPI(groupdevicejson){
		/*
		 * get device info based on group ID
		 */
		$http({
			method : 'POST',
			url : apiURL + 'group/info',
			data : JSON.stringify(groupdevicejson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {			
			// console.log(data);
			// reqTime = data.time_interval;
			maxSpeed = data.speed_limit;

			var geoJson = data.geofence;			
			var resultGeoJson = [];
			for ( var key in geoJson) {
				if (geoJson.hasOwnProperty(key)) {
					
					resultGeoJson.push({
						'lat' : geoJson[key].lat,
						'lng' : geoJson[key].long
					});
				}
			}
			// console.log(JSON.stringify(resultGeoJson));
			var geofence_plot = resultGeoJson;
		    plotGeofence(geofence_plot);
		}).error(function(data, status, headers, config) {
			if (data.err == "Expired Session") {
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	}
	function plotGeofence(geofence_plot){
		// alert("Geofence");
		//alert(geofence_plot);
		// console.log(JSON.stringify(geofence_plot));
		if(myPolygon){			
			setPolygonNull();
		}
		myPolygon = new google.maps.Polygon({
	        paths: geofence_plot,
	        // draggable: true, // turn off if it gets annoying
	        // editable: true,
	        strokeColor: '#02adea',
	        strokeOpacity: 0.8,
	        strokeWeight: 2,
	        fillColor: '#02adea',
	        fillOpacity: 0.10
	      });
	      myPolygon.setMap(map);
	}
	function plotDevices(){
		// console.log("group");
		// console.log($scope.deviceList.length);
		$scope.devicejson = {};
		$scope.devicejson.token = $scope.token;	
		$scope.devicejson.devlist = $scope.deviceList;
		$http({
			method : 'POST',
			url : apiURL + 'device/currentdata',
			data : JSON.stringify($scope.devicejson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
		        //console.log(JSON.stringify(data));
				geofenceAPI($scope.groupdevicejson);			
				$scope.multiDevice = true;				
				$scope.singleDevice = false;
				displayData(data);			
			
			multiBounds = new google.maps.LatLngBounds();
			for(var i=0;i<data.length;i++){	
					if(data[i].devtype == "car"){
					icon.path = carIcon;		   
				   }
				   else if(data[i].devtype == "bus"){
					   icon.path = busIcon;
				   }
				   else if(data[i].devtype == "truck"){
					   icon.path = truckIcon;
				   }
				   else if(data[i].devtype == "bike"){
					   icon.path = bikeIcon;
				   }
				   else{
					   icon.path = markerIcon;
				   }
			if(data[i].values.length>0){				
				createMarker(new google.maps.LatLng(data[i].values[0].lat, data[i].values[0].long),data[i].devid,data[i].vehicle_num,data[i].vehicle_model,"",data[i].values[0].type);			 
				multiBounds.extend(new google.maps.LatLng(data[i].values[0].lat, data[i].values[0].long));						    
			}
			else{
				swal('Device of id '+data[i].devid+' is not updating kindly check it');
			}
			
			}
			map.fitBounds(multiBounds);
		}).error(function(data, status, headers, config) {
			if (data.err == "Expired Session") {
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
		
	}
	function plotDevice(){
		console.log("single"+$scope.zoomlevel);
		/*if ($scope.zoomlevel < 18 || $scope.zoomlevel > 21) {
		
		$scope.singleDeviceZoomed = false;
		if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		} else if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		}
	} else {*/
		$scope.deviceJson = {};
		$scope.deviceJson.token = $scope.token;
		var obj = [];
		obj.push(devIDval);
		$scope.deviceJson.devlist = obj;
		$scope.deviceJson.count = 1;
		$http({
			method : 'POST',
			url : apiURL + 'device/currentdata',
			data : JSON.stringify($scope.deviceJson),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {	
			 console.log(JSON.stringify(data));
				$scope.multiDevice = false;
				if(data[0].values.length>0){				
					$scope.singleDevice = true;		
					speedValue=data[0].values[0].Velocity;					
					speedlimit=data[0].speed_limit;				
					// request for geofence plotting
					// vechile count updation based on type
					$scope.carCount = 0;
					$scope.bikeCount = 0;
					$scope.busCount = 0;
					$scope.truckCount = 0;
					if(data[0].devtype=="car"){				
						$scope.carCount = 1;
						icon.path = carIcon;		
					}
					else if(data[0].devtype=="bus"){
						$scope.busCount = 1;
						icon.path = busIcon;
					}else if(data[0].devtype=="truck"){
						$scope.truckCount = 1;
						icon.path = truckIcon;
					}else if(data[0].devtype=="bike"){
						$scope.bikeCount = 1;
						icon.path = bikeIcon;
					}
					else{$scope.carCount = 0;
					$scope.bikeCount = 0;
					$scope.busCount = 0;
					$scope.truckCount = 0;
					icon.path = markerIcon;
					}
					$scope.speedSpeedOmeter=speedValue;
					$scope.vehnoSpeedOmeter=data[0].vehicle_num;
					$scope.speedlimitSpeedOmeter=speedlimit;
					$scope.dateTimeSpeedOmeter=getDateTime(data[0].values[0].ts);
					updateSpeed(data[0].vehicle_num,data[0].values[0].Velocity,data[0].speed_limit,getDateTime(data[0].values[0].ts));				
					// storedltlng.lat=data[0].values[0].lat;
					/* vehichleRouting(data,data[0].values[0].lat,data[0].values[0].long,data[0].values[0].lat,data[0].values[0].long); */
					$scope.calcRoute(data);
			}
			else{
				$scope.singleDevice = false;
				$scope.carCount = 0;
				$scope.bikeCount = 0;
				$scope.busCount = 0;
				$scope.truckCount = 0;
				swal('Device of id '+data[0].devid+' is not updating kindly check it');
			}
		
								
		}).error(function(data, status, headers, config) {
			if (data.err == "Expired Session") {
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	//}
	}
	function getDateTime(ts){
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
		return formattedTime+","+d.getDate() + "/" + monthVal + "/"
				+ d.getFullYear();
	}
	/**------------------------------------------------------------------------------------------------------
	 * function for recenter to re intiate the live tracking or request for
	 * current data
	 
	$scope.reCenter = function() {
		map.zoom = $scope.multipleDeviceZoomLevel;
		$scope.isZoomed = true;
		multiDeviceInterval = $interval(getCurrentData, reqTime * 1000);
	};
	------------------------------------------------------------------------------------------------------*/
	/**
	 * function for recenter the single device selection
	 */
	$scope.reCenterDevice = function() {
		console.log("Single Device Re Center");
		map.setZoom($scope.singleDeviceZoomLevel);
		map.panTo(marker.getPosition());
		$scope.singleDeviceZoomed = true;
		if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		} else if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		}		
		singleDeviceInterval = $interval(plotDevice, reqTime * 1000);
	};
	
	/**
	 * function to display current speed of all devices in the selected group
	 * and display it in the table
	 */
	function displayData(deviceData) {
		$scope.devData = [];
		for ( var inc = 0; inc < deviceData.length; inc++) {
			var deviceObj={};
			 // console.log(JSON.stringify(deviceData));
			var devId = deviceData[inc].devid;
			// console.log(devId);
			if(deviceData[inc].values.length>0){
				var devSpeed = deviceData[inc].values[0].Velocity;
				deviceObj.devid=devId;
				deviceObj.speed=devSpeed;
				deviceObj.type=deviceData[inc].values[0].type;
				$scope.devData.push(deviceObj);
				$scope.speedlimit = deviceData[inc].speed_limit;
			}
			else{
				swal('Device of id '+deviceData[inc].devid+' is not updating kindly check it');
			}
			//console.log(JSON.stringify($scope.devData));
			// console.log($scope.speedlimit);
		}
		 
	}
	$scope.getColor=function(type){
		switch (type) {
		case 0:
			return "geoColor";
			break;
		case 1:
			return "speedColor";
			break;
		case 2:
			return "geospeedColor";
			break;
		case 3:
			return "normalVehicleColor";
			break;
		case 4:
			return "aliveVehicleColor";
			break;	
		}
	}
	$scope.geoColor={"background-color":"#f44336"};
	$scope.speedColor={"background-color":"#ffde01"};
	$scope.geospeedColor={"background-color":"#e59305"};
	$scope.normalVehicleColor={"background-color":"#000000"};
	$scope.aliveVehicleColor={"background-color":"#0540E5"};
	/* clear markers*/
	function clearMarkers(){
		google.maps.Map.prototype.markers = new Array();

		google.maps.Map.prototype.getMarkers = function() {
		    return this.markers
		};

		google.maps.Map.prototype.clearMarkers = function() {
		    for(var i=0; i<this.markers.length; i++){
		        this.markers[i].setMap(null);
		    }
		    this.markers = new Array();
		};
	}
	/*------------------------------------------------------------------------------------------------------------------------
	 * 
	 *                                           angular gauge speedometer 
	 *                                           
	 *------------------------------------------------------------------------------------------------------------------------ */
	/**
	 * function to update the speedometer
	 */
	function updateSpeed(vehNo,speed,speed_limit,ts) {	
		//console.log("sas");
		/*$('#container').highcharts().setTitle({text: "<label>Vehicle No:</label><p>" + vehNo
			+ "</p><br/><br/><label>Speed Limit:</label><p><b>"
			+ speed_limit + "<b>KmpH</p><br/><br/><label>DateTime:</label><b>"
			+ts+"</b>"});*/
		$('#container').highcharts().series[0].points[0].update(Number(speed));		
	}
	 $('#container').highcharts({
		 
	        chart: {
	            type: 'gauge',
	            plotBackgroundColor: null,
	            plotBackgroundImage: null,
	            plotBorderWidth: 0,
	            plotShadow: false,
	            width:'200',
	            height:'200'
	        },

	        title : {
				text : ""
			},

	        pane: {
	            startAngle: -150,
	            endAngle: 150,
	            background: [{
	                backgroundColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	                    stops: [
	                        [0, '#FFF'],
	                        [1, '#333']
	                    ]
	                },
	                borderWidth: 0,
	                outerRadius: '109%'
	            }, {
	                backgroundColor: {
	                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
	                    stops: [
	                        [0, '#333'],
	                        [1, '#FFF']
	                    ]
	                },
	                borderWidth: 1,
	                outerRadius: '107%'
	            }, {
	                // default background
	            }, {
	                backgroundColor: '#DDD',
	                borderWidth: 0,
	                outerRadius: '105%',
	                innerRadius: '103%'
	            }]
	        },

	        // the value axis
	        yAxis: {
	            min: 0,
	            max: 200,

	            minorTickInterval: 'auto',
	            minorTickWidth: 1,
	            minorTickLength: 10,
	            minorTickPosition: 'inside',
	            minorTickColor: '#666',

	            tickPixelInterval: 30,
	            tickWidth: 2,
	            tickPosition: 'inside',
	            tickLength: 10,
	            tickColor: '#666',
	            labels: {
	                step: 2,
	                rotation: 'auto'
	            },
	            title: {
	                text: 'km/h'
	            },
	            plotBands: [{
	                from: 0,
	                to: 120,
	                color: '#55BF3B' // green
	            }, {
	                from: 120,
	                to: 160,
	                color: '#DDDF0D' // yellow
	            }, {
	                from: 160,
	                to: 200,
	                color: '#DF5353' // red
	            }]
	        },

	        series: [{
	            name: 'Speed',
	            data: [Number(speedValue)],
	            tooltip: {
	                valueSuffix: ' km/h'
	            }
	        }]

	    },
	    // Add some life
	    function (chart) {	    	
	        if (!chart.renderer.forExport && chart.length>0) {
	            setInterval(function () {
	            	// console.log(speedlimit);
	            	chart.setTitle({text: "<label>Device ID:</label><p>" + devIDval
	    				+ "</p><br/><br/><label>Speed Limit:</label><p><b>"
	    				+ speedlimit + "<b>KmpH</p>"});
	                var point = chart.series[0].points[0],
	                    newVal,                    
	                    inc = Math.round((Math.random() - 0.5) * 20);	               								
	                newVal = point.y + inc;
	                if (newVal < 0 || newVal > 200) {
	                    newVal = point.y - inc;
	                }

	                point.update(Number(speedValue));

	            }, reqTime*1000);
	        }
	    });
	
	/*------------------------------------------------------------------------------------------------------------------------
	 * 
	 *                                           the end of angular gauge speedometer 
	 *                                           
	 *------------------------------------------------------------------------------------------------------------------------ */

	/**
	 * On load of customer name 1)Filter customer name 2)Select customer name
	 */
	// var tagsData = cname;
	// init jquery functions and plugins
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			console.log("check");
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("Select Group");
			$('#clearTextDevice span.select2-chosen').text("Select Vehicle No / Device");			
			$(document).on('input','.select2-input',function(){
				/*console.log("input");*/
				$('.dropdownSection').css('top','20%');				
			});
			$(document).on('keyup','.select2-input',function(){
				/*console.log("keyup");*/
				$('.dropdownSection').css('top','20%');				
			});
			$(document).on('keydown','.select2-input',function(){
				/*console.log("keydown");*/
				$('.dropdownSection').css('top','20%');				
			});
			$(document).on('mouseenter','.map_content',function(){		
				$('.dropdownSection').css('top','20%');				
			});
			$(document).on('mouseleave','.map_content',function(){		
				$('.dropdownSection').css('top','-20%');				
			});
			
		});// script
	});
	
	
	

	/**
	 * Refresh map for particular time interval cancels on location change
	 */
	$scope.$on('$locationChangeStart', function(){
		if (angular.isDefined(multiDeviceInterval)) {
			$interval.cancel(multiDeviceInterval);
		} else if (angular.isDefined(singleDeviceInterval)) {
			$interval.cancel(singleDeviceInterval);
		}
	});
	/*
	 * Show/Hide Traffic Layer on map
	 */
	$scope.showTrafficLayer = function(){
		// alert("show traffic layer");
		trafficLayer.setMap(map);
		$scope.showTrafficLayerBtn = true;
		$scope.hideTrafficLayerBtn = false;
	}
	$scope.hideTrafficLayer = function(){
		// alert("hide traffic layer");
		trafficLayer.setMap(null);
		$scope.showTrafficLayerBtn = false;
		$scope.hideTrafficLayerBtn = true;
	}
	/**
	 * ------------------------------------------------------------------------------------------------------------------------------------
	 * -------------------------------------------------------- device detail
	 * modal --------------------------------------------------------
	 */
	$scope.open = function(size, deviceId) {	
		console.log("check");
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
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
		});
	};
});

/*
 * ----------------------------------------------------- end of map controller
 * ----------------------------------------------------------------------
 */

batsAdminHome.controller('dateCtrl', function($scope) {
	$scope.myDate = new Date();
	$scope.minDate = new Date($scope.myDate.getFullYear(), $scope.myDate
			.getMonth() - 2, $scope.myDate.getDate());
	$scope.maxDate = new Date($scope.myDate.getFullYear(), $scope.myDate
			.getMonth() + 2, $scope.myDate.getDate());
	$scope.onlyWeekendsPredicate = function(date) {
		var day = date.getDay();
		return day === 0 || day === 6;
	};
	$scope.myDateChange = function(mydate) {
	};
});

batsAdminHome.controller('AdminController', function($scope, $interval, $http,
		$localStorage) {
	$scope.getGrouplist = function() {
		/**
		 * Load Group list 1) on load of page load the Group_name, Country,
		 * State in the dropdown 2) Load Group details in grid
		 */
		$scope.token = $localStorage.data;
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
		$scope.customer = {};
		$scope.customer.token = $scope.token;
		// $scope.customer.id = $scope.token;
		// console.log(JSON.stringify($scope.customer));
		$http({
			method : 'POST',
			url : apiURL + 'group/list',
			data : JSON.stringify($scope.customer),
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data) {
			$scope.glist = data.glist;
			// console.log(JSON.stringify($scope.glist));
		}).error(function(data, status, headers, config) {
			// console.log(data.err);
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			if (data.err == "Expired Session") {
				expiredSession();
				$localStorage.$reset();
			} else if (data.err == "Invalid User") {
				invalidUser();
				$localStorage.$reset();
			}
		});

	};
	

	
});

/**
 * ------------------------------------------------------------------------------------------------------------------------------------------
 * ModalInstanceCtrl
 * ------------------------------------------------------------------------------------------------------------------------------------------
 */
// Please note that $modalInstance represents a modal window (instance)
// dependency.
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
					 * -----------------------------------------------------------------------
					 */
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
					 * Change Image of Device based on device Type
					 * -----------------------------------------------------------------------------
					 */
					$scope.whatVehicle = function() {
						if ($scope.dev.devtype == "car") {
							$scope.url = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQnBx8Czkt93BZhCcIWGh-3eHuv8CH613GrTCpah6RP9b7LyxIJjw';
						} else if ($scope.dev.devtype == "bus") {
							$scope.url = 'http://www.myiconfinder.com/uploads/iconsets/256-256-3ac514df5b4f36e2d8d525fe7f63b83c.png'
						} else if ($scope.dev.devtype == "bike") {
							$scope.url = 'https://cdn0.iconfinder.com/data/icons/travel-line-icons-vol-1/48/022-512.png';
						} else if ($scope.dev.devtype == "truck") {
							$scope.url = 'http://www.wpclipart.com/transportation/car/icons_BW/flatbed_truck_BW_icon.png';
						}
					}
					/**
					 * API Call for Device History
					 * ---------------------------------------------------------------------------
					 */
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
					 * Current Data API Call from
					 * here-------------------------------------------
					 */
					$scope.showCurrentData = function() {
						$scope.deviceCurrentDatajson = {};
						$scope.devIdobj = [];
						$scope.deviceCurrentDatajson.token = $scope.token;
						$scope.devIdobj.push(dev.devid);
						$scope.deviceCurrentDatajson.devlist = $scope.devIdobj;
						// $scope.deviceCurrentDatajson.devlist = dev.devid;
						$scope.deviceCurrentDatajson.count = 10;
						// console.log($scope.deviceCurrentDatajson);
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
												expiredSession();
												$localStorage.$reset();
											} else if (data.err == "Invalid User") {
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
					 * Device Settings API CALL Made
					 * here---------------------------
					 */
					$scope.device = {};
					$scope.submitSettings = function() {
						$scope.device.token = $scope.token;
						$scope.device.devid = dev.devid;
						/*
						 * var obj = []; obj.push($scope.device.contact_num)
						 * delete $scope.device['contact_num'];
						 * $scope.device.contact_num = obj;
						 */
						console.log($scope.device);
						$http({
							method : 'POST',
							url : apiURL + 'device/easyupdate',
							data : JSON.stringify($scope.device),
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function(data) {
							// console.log(JSON.stringify(data));
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
												expiredSession();
												$localStorage.$reset();
											} else if (data.err == "Invalid User") {
												invalidUser();
												$localStorage.$reset();
											}
											console.log(data);
											console.log(status);
											console.log(headers);
											console.log(config);
										});
					};

				})/*
					 * .directive('phone', function() { return { restrice: 'A',
					 * require: 'ngModel', link: function(scope, element, attrs,
					 * ctrl) { angular.element(element).bind('blur', function() {
					 * var value = this.value; if(PHONE_REGEXP.test(value)) { //
					 * Valid input //console.log("valid phone number"+value);
					 * angular.element(this).next().next().css('display','none');
					 * scope.btnDisabled = true; } else { scope.btnDisabled =
					 * true; // Invalid input console.log("invalid phone
					 * number"+value); scope.mobstatus="invalid phone number";
					 * angular.element(this).next().next().css('display','block');
					 * console.log(angular.element(this).children().find('span'));
					 * 
					 * Looks like at this point ctrl is not available, so I
					 * can't user the following method to display the error
					 * node: ctrl.$setValidity('currencyField', false); } }); } }; })
					 */;