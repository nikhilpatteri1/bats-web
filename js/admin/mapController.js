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
	
    $scope.headings;
    var map;
    var directionDisplay;
    var directionsService;
    var stepDisplay;
    var markers = [];
    var marker = new Array();
    var myPolygon;
    var position;
    var polyline = null;
    var poly2 = null;
    var speed = 0.000005,
    wait = 1;
    var infowindow = null;
    var timerHandle = null;
    var storedltlng={};
    var trafficLayer = new google.maps.TrafficLayer();
    var Colors = ["#FF0000", "#00FF00", "#0000FF"];
    var svg = new Array();
    var icons = new Array();
    var vehicleType;
    var multiBounds;
    var myPlace = {lat: 12.850167, lng: 77.660329};
	
	
	//bike
    var bike = new Array();
    bike[0] = {path :"M14.938,47.125 L14.062,47.125 C13.752,47.125 13.500,46.873 13.500,46.562 C13.500,46.252 13.752,46.000 14.062,46.000 L14.938,46.000 C15.248,46.000 15.500,46.252 15.500,46.562 C15.500,46.873 15.248,47.125 14.938,47.125 ZM11.248,48.741 C11.126,48.968 10.904,49.125 10.733,49.125 L9.003,49.125 C8.832,49.125 8.609,48.968 8.487,48.741 L7.848,47.551 C7.514,46.929 7.469,46.250 7.865,46.250 L11.871,46.250 C12.266,46.250 12.222,46.929 11.887,47.551 L11.248,48.741 ZM5.687,47.125 L4.812,47.125 C4.502,47.125 4.250,46.873 4.250,46.562 C4.250,46.252 4.502,46.000 4.812,46.000 L5.687,46.000 C5.998,46.000 6.250,46.252 6.250,46.562 C6.250,46.873 5.998,47.125 5.687,47.125 Z", fillColor : "rgb(242, 0, 0)"}; 
    bike[1] = {path :"M18.997,13.925 L18.789,14.677 C18.774,14.729 18.719,14.760 18.665,14.746 L15.072,13.817 C15.019,13.803 14.987,13.750 15.001,13.698 L15.006,13.681 L13.382,13.249 C13.380,13.249 13.377,13.250 13.375,13.250 L6.668,13.250 L4.763,13.760 C4.760,13.761 4.756,13.760 4.751,13.758 C4.740,13.785 4.717,13.807 4.686,13.815 L1.125,14.769 C1.071,14.784 1.017,14.752 1.003,14.699 L0.795,13.926 C0.781,13.873 0.813,13.818 0.866,13.804 L4.427,12.849 C4.478,12.836 4.529,12.864 4.546,12.913 L6.516,12.385 C6.524,12.383 6.535,12.390 6.545,12.405 C6.567,12.386 6.594,12.375 6.625,12.375 L13.375,12.375 C13.406,12.375 13.434,12.387 13.456,12.405 C13.469,12.383 13.483,12.370 13.494,12.373 L15.487,12.903 C15.492,12.905 15.496,12.911 15.499,12.919 L18.926,13.806 C18.980,13.820 19.012,13.873 18.997,13.925 ZM18.010,8.765 C17.322,8.518 16.642,8.397 16.040,8.390 L15.908,7.631 L14.304,8.273 C14.616,8.667 14.921,9.076 15.216,9.503 L16.236,11.158 C16.402,11.426 16.487,11.773 16.498,12.124 C14.470,11.361 12.258,10.937 9.940,10.937 C7.619,10.937 5.406,11.362 3.376,12.126 C3.387,11.774 3.472,11.427 3.638,11.158 L4.622,9.562 C4.912,9.139 5.212,8.734 5.519,8.343 L3.889,7.673 L3.756,8.458 C3.151,8.465 2.467,8.591 1.774,8.846 C1.748,8.856 1.722,8.866 1.697,8.876 L1.376,8.123 C1.472,8.059 1.569,7.997 1.670,7.937 C2.435,7.481 3.222,7.213 3.909,7.134 L3.912,7.125 L3.928,7.132 C3.946,7.130 3.964,7.126 3.981,7.125 L3.977,7.152 L5.856,7.925 C6.497,7.150 7.171,6.444 7.875,5.816 C7.875,5.816 7.875,5.816 7.875,5.817 L7.875,2.250 C7.875,1.145 8.770,0.250 9.875,0.250 C10.980,0.250 11.875,1.145 11.875,2.250 L11.875,5.702 C11.875,5.702 11.875,5.702 11.875,5.702 C12.608,6.343 13.309,7.068 13.975,7.866 L15.821,7.127 L15.817,7.101 C15.834,7.103 15.852,7.106 15.869,7.108 L15.885,7.102 L15.889,7.110 C16.571,7.186 17.353,7.445 18.114,7.886 C18.214,7.944 18.310,8.005 18.405,8.066 L18.087,8.794 C18.061,8.785 18.036,8.775 18.010,8.765 ZM3.374,22.822 C3.742,19.339 4.824,16.200 6.395,13.725 C7.563,13.578 8.770,13.500 10.005,13.500 C11.285,13.500 12.534,13.583 13.741,13.741 C15.305,16.212 16.383,19.345 16.751,22.818 L14.353,25.552 C14.232,26.334 14.165,27.155 14.160,28.002 C14.147,30.574 14.714,32.871 15.628,34.499 C15.671,34.567 15.713,34.637 15.752,34.710 C15.780,34.756 15.806,34.803 15.834,34.847 L15.824,34.847 C16.099,35.409 16.257,36.088 16.250,36.820 C16.249,36.931 16.243,37.040 16.235,37.149 L16.233,37.361 C16.212,37.460 16.187,37.560 16.165,37.659 C16.144,37.770 16.119,37.879 16.091,37.985 C16.008,38.337 15.921,38.690 15.824,39.044 C14.946,42.242 13.631,45.006 12.146,47.054 L12.058,47.054 C11.506,47.562 10.745,47.875 9.904,47.875 C9.063,47.875 8.299,47.562 7.744,47.054 L7.663,47.054 C7.566,46.922 7.470,46.786 7.375,46.648 C7.316,46.569 7.261,46.487 7.211,46.403 C5.906,44.444 4.756,41.942 3.953,39.094 C3.848,38.719 3.752,38.346 3.663,37.975 C3.638,37.883 3.616,37.790 3.597,37.695 C3.566,37.562 3.536,37.428 3.507,37.294 L3.500,36.851 L3.501,36.851 C3.501,36.841 3.500,36.830 3.499,36.820 C3.482,35.669 3.871,34.649 4.484,34.015 C5.240,32.430 5.692,30.330 5.666,28.002 C5.654,26.994 5.554,26.022 5.380,25.110 L3.374,22.822 Z", fillColor : "rgb(0, 0, 0)"};
    bike[2] = {path :"M4.001,12.126 C4.011,11.774 4.088,11.427 4.238,11.158 L5.128,9.562 C6.528,7.305 8.156,5.496 9.941,4.249 C11.709,5.486 13.322,7.275 14.713,9.503 L15.636,11.158 C15.786,11.426 15.863,11.773 15.873,12.124 C14.038,11.361 12.037,10.937 9.940,10.937 C7.840,10.937 5.837,11.362 4.001,12.126 ZM5.659,24.467 L3.999,22.551 C4.333,19.356 5.314,16.477 6.738,14.207 C7.796,14.072 8.890,14.000 10.010,14.000 C11.171,14.000 12.303,14.076 13.397,14.221 C14.815,16.488 15.792,19.361 16.125,22.547 L14.079,24.909 C13.784,26.032 13.615,27.299 13.615,28.644 C13.615,30.987 14.121,33.100 14.933,34.608 C14.972,34.672 15.009,34.737 15.044,34.805 C15.069,34.847 15.092,34.891 15.117,34.932 L15.109,34.932 C15.354,35.456 15.499,36.090 15.499,36.776 C15.499,36.880 15.495,36.983 15.488,37.084 L15.488,37.284 C15.470,37.377 15.450,37.471 15.431,37.564 C15.413,37.669 15.392,37.771 15.368,37.872 C15.297,38.204 15.223,38.536 15.140,38.872 C14.437,41.694 13.386,44.189 12.177,46.125 L13.625,46.125 L13.625,46.625 L11.753,46.625 C11.261,47.089 10.599,47.375 9.869,47.375 C9.139,47.375 8.477,47.089 7.985,46.625 L6.000,46.625 L6.000,46.125 L7.565,46.125 C7.525,46.064 7.487,46.001 7.452,45.937 C6.299,44.036 5.299,41.629 4.621,38.918 C4.532,38.564 4.453,38.212 4.379,37.862 C4.358,37.776 4.340,37.688 4.324,37.599 C4.299,37.473 4.274,37.347 4.250,37.221 L4.250,36.805 L4.251,36.805 C4.251,36.795 4.250,36.786 4.250,36.776 C4.250,35.699 4.606,34.748 5.153,34.159 C5.833,32.693 6.248,30.764 6.248,28.644 C6.248,27.119 6.032,25.694 5.659,24.467 Z" , fillColor : "rgb(255, 255, 255)"};
    //car
    var car = new Array();
    car[0] = { path :"M26.068,7.719 C27.423,21.657 26.941,35.659 26.801,49.660 C26.765,52.945 23.953,55.681 20.511,55.727 C16.978,55.770 13.462,55.778 9.929,55.738 C6.486,55.697 3.672,52.944 3.640,49.660 C3.516,35.659 3.113,21.657 4.657,7.719 C5.083,4.446 7.639,1.760 10.572,1.739 C13.630,1.721 16.881,1.721 20.018,1.739 C23.034,1.760 25.695,4.446 26.068,7.719 L26.068,7.719 Z",fillColor : "rgb(237, 237, 237)"};
    car[1] = { path : "M25.762,8.510 L20.921,2.204 C20.921,2.204 25.252,2.647 25.885,8.065 C26.517,13.483 25.762,8.510 25.762,8.510 ZM15.160,2.706 C12.355,2.772 10.092,2.853 10.085,2.450 C10.076,2.165 12.353,1.834 15.164,1.816 C17.968,1.902 20.240,2.220 20.248,2.466 C20.253,2.846 17.967,2.761 15.160,2.706 ZM4.815,8.074 C5.443,2.668 9.749,2.226 9.749,2.226 L4.937,8.518 C4.937,8.518 4.187,13.481 4.815,8.074 ZM5.000,47.349 L4.563,21.574 C4.563,21.574 9.613,34.691 5.000,47.349 ZM7.721,44.433 C7.865,44.256 8.144,44.114 8.372,44.086 L7.879,26.221 C7.668,26.129 7.434,25.911 7.299,25.650 C6.246,23.582 5.784,21.256 5.737,19.294 C5.700,18.027 6.392,17.124 7.323,16.364 C8.266,15.625 9.448,15.028 10.664,14.841 C13.663,14.447 16.725,14.440 19.798,14.794 C22.228,15.233 24.825,17.000 24.814,19.411 C24.761,21.376 24.325,23.625 23.296,25.754 C23.118,26.114 22.752,26.393 22.495,26.383 C18.058,26.218 12.293,26.214 8.082,26.268 C8.078,26.268 8.073,26.268 8.069,26.268 L8.559,44.083 C12.615,44.173 17.835,44.175 21.697,44.146 L22.187,26.376 L22.375,26.381 L21.885,44.149 C22.107,44.170 22.399,44.311 22.553,44.491 C23.529,45.647 23.957,46.947 24.001,48.043 C24.035,48.752 23.394,49.256 22.531,49.681 C21.656,50.094 20.560,50.428 19.432,50.532 C16.652,50.752 13.813,50.756 10.964,50.558 C8.711,50.313 6.303,49.325 6.313,47.978 C6.362,46.880 6.766,45.623 7.721,44.433 ZM25.938,21.591 L25.500,47.392 C20.891,34.722 25.938,21.591 25.938,21.591 Z", fillColor :"rgb(0, 0, 0)"};
    car[2] = { path : "M25.122,54.823 L22.326,56.181 C22.187,56.249 22.449,55.545 22.710,54.987 L23.830,52.596 C23.909,52.427 24.031,52.230 24.113,52.136 L25.203,50.886 C25.331,50.739 25.452,50.678 25.470,50.765 L25.838,52.542 C25.993,53.290 25.636,54.572 25.122,54.823 ZM7.994,56.175 L5.193,54.808 C4.677,54.557 4.319,53.266 4.474,52.514 L4.844,50.726 C4.862,50.638 4.983,50.700 5.111,50.848 L6.203,52.105 C6.285,52.200 6.408,52.398 6.487,52.568 L7.610,54.974 C7.871,55.535 8.134,56.244 7.994,56.175 Z", fillColor : "rgb(255, 0, 0)"};
    car[3] = { path : "M25.937,21.687 L25.937,19.750 L28.312,19.750 C29.348,19.750 30.187,20.589 30.187,21.625 L30.187,21.687 L25.937,21.687 ZM26.125,7.719 C25.751,4.446 23.075,1.760 20.044,1.739 C16.890,1.721 13.622,1.721 10.547,1.739 C7.599,1.760 5.029,4.446 4.601,7.719 C4.586,7.854 4.572,7.990 4.557,8.125 L4.422,8.125 C4.460,7.741 4.499,7.358 4.540,6.974 C4.969,3.541 7.542,0.723 10.495,0.702 C13.574,0.682 16.847,0.682 20.006,0.702 C23.042,0.723 25.721,3.541 26.096,6.974 C26.132,7.358 26.166,7.741 26.199,8.125 L26.164,8.125 C26.151,7.990 26.138,7.854 26.125,7.719 ZM4.563,21.687 L0.313,21.687 L0.313,21.625 C0.313,20.589 1.152,19.750 2.188,19.750 L4.563,19.750 L4.563,21.687 ZM9.901,55.738 C13.452,55.778 16.988,55.770 20.539,55.727 C23.812,55.684 26.518,53.233 26.832,50.188 L26.843,50.188 C26.840,50.449 26.837,50.711 26.835,50.973 C26.798,54.419 23.967,57.290 20.502,57.338 C16.945,57.383 13.404,57.391 9.847,57.350 C6.381,57.306 3.548,54.418 3.516,50.973 C3.514,50.711 3.511,50.449 3.509,50.188 L3.609,50.188 C3.919,53.234 6.627,55.699 9.901,55.738 Z", fillColor : "rgb(121, 121, 121)"};
    car[4] = { path : "M24.837,18.830 C24.828,18.872 24.811,18.913 24.786,18.951 C24.786,18.952 24.785,18.953 24.784,18.955 C24.491,16.779 22.071,15.204 19.798,14.794 C16.725,14.440 13.663,14.447 10.664,14.841 C9.448,15.028 8.266,15.625 7.323,16.364 C6.429,17.094 5.758,17.956 5.738,19.145 C5.738,19.145 5.738,19.145 5.738,19.145 C5.713,19.107 5.695,19.066 5.686,19.024 C5.677,18.982 5.676,18.939 5.685,18.894 C6.276,15.191 7.255,10.228 9.521,3.606 C9.575,3.439 9.940,3.312 10.339,3.319 C13.562,3.374 16.941,3.366 20.142,3.287 C20.537,3.277 20.903,3.400 20.963,3.563 C22.183,6.915 23.071,9.715 23.639,12.193 C24.216,14.623 24.504,16.818 24.838,18.701 C24.846,18.745 24.845,18.789 24.837,18.830 ZM7.107,45.332 C7.202,45.144 7.304,44.956 7.417,44.768 C7.539,44.566 7.708,44.387 7.875,44.260 C7.959,44.196 8.042,44.145 8.119,44.111 C8.157,44.094 8.194,44.081 8.229,44.073 C8.246,44.069 8.263,44.066 8.280,44.064 C8.288,44.063 8.296,44.063 8.303,44.062 C8.311,44.062 8.319,44.062 8.326,44.062 C8.577,44.074 8.832,44.084 9.091,44.094 C8.879,44.090 8.669,44.086 8.463,44.081 C8.225,44.075 7.885,44.231 7.721,44.433 C7.483,44.729 7.279,45.030 7.107,45.332 ZM6.353,47.528 C6.333,47.680 6.320,47.831 6.313,47.978 C6.303,49.325 8.711,50.313 10.964,50.558 C13.813,50.756 16.652,50.752 19.432,50.532 C20.560,50.428 21.656,50.094 22.531,49.681 C23.243,49.330 23.804,48.925 23.958,48.395 C23.981,48.634 23.997,48.870 24.004,49.103 C24.007,49.241 24.008,49.377 24.007,49.512 C24.006,49.647 24.003,49.781 23.998,49.914 C23.976,50.443 23.925,50.949 23.860,51.414 C23.695,52.619 22.983,53.376 22.098,53.877 C21.223,54.358 20.166,54.609 19.108,54.606 C17.817,54.582 16.520,54.552 15.215,54.554 C14.889,54.555 14.562,54.557 14.234,54.560 C13.907,54.564 13.578,54.569 13.250,54.575 C12.592,54.588 11.932,54.607 11.268,54.626 C9.175,54.644 6.776,53.680 6.373,51.323 C6.302,50.860 6.244,50.364 6.216,49.845 C6.209,49.715 6.205,49.584 6.202,49.452 C6.199,49.319 6.199,49.186 6.201,49.051 C6.206,48.781 6.222,48.506 6.251,48.228 C6.274,47.997 6.308,47.763 6.353,47.528 Z", fillColor : "rgb(255, 255, 255)"};

    //truck
    var truck = new Array();
    truck[0] = { path :"M21.914,8.812 C21.914,10.320 21.914,11.829 21.914,13.336 C21.914,13.569 21.820,13.776 21.670,13.928 C21.707,15.684 21.714,17.432 21.714,19.179 C21.714,19.570 21.418,19.887 21.052,19.887 C15.663,19.887 10.273,19.887 4.884,19.887 C4.518,19.887 4.222,19.570 4.222,19.179 C4.222,17.555 4.229,15.929 4.262,14.291 C4.005,14.149 3.825,13.886 3.825,13.566 C3.825,11.983 3.825,10.397 3.825,8.812 L0.776,8.812 L0.776,8.424 C0.776,7.540 1.492,6.824 2.376,6.824 L4.059,6.824 C4.217,6.646 4.437,6.525 4.687,6.514 C4.687,6.617 4.687,6.721 4.687,6.824 L4.688,6.824 C4.730,6.423 4.770,6.022 4.819,5.617 C5.038,4.412 5.235,2.856 5.832,2.356 C8.452,0.399 17.495,0.603 20.179,2.551 C20.791,3.050 20.986,4.543 21.187,5.722 C21.213,5.956 21.229,6.187 21.247,6.419 C21.472,6.482 21.657,6.626 21.774,6.824 L23.560,6.824 C24.444,6.824 25.160,7.540 25.160,8.424 L25.160,8.812 L21.914,8.812 ZM2.035,24.325 C2.035,26.914 2.035,29.502 2.035,32.090 C1.559,32.094 1.174,31.713 1.174,31.237 C1.174,29.226 1.174,27.216 1.174,25.205 C1.174,24.729 1.559,24.335 2.035,24.325 ZM2.035,48.603 C2.035,51.189 2.035,53.774 2.035,56.360 C1.559,56.360 1.174,55.974 1.174,55.498 C1.174,53.487 1.174,51.476 1.174,49.466 C1.174,48.990 1.559,48.604 2.035,48.603 ZM2.698,20.590 C9.347,20.428 15.995,20.475 22.642,20.601 C23.008,20.608 23.305,20.911 23.305,21.278 C23.305,22.296 23.305,23.312 23.305,24.330 C23.780,24.337 24.166,24.729 24.166,25.205 C24.166,27.216 24.166,29.226 24.166,31.237 C24.166,31.713 23.780,32.096 23.305,32.092 C23.305,37.597 23.305,43.101 23.305,48.603 C23.780,48.604 24.166,48.990 24.166,49.466 C24.166,51.476 24.166,53.487 24.166,55.498 C24.166,55.974 23.780,56.360 23.305,56.360 C23.305,57.508 23.305,58.658 23.305,59.806 C23.305,60.173 23.008,60.469 22.642,60.469 C15.994,60.469 9.346,60.469 2.698,60.469 C2.332,60.469 2.035,60.173 2.035,59.806 C2.035,46.969 2.035,34.130 2.035,21.271 C2.035,20.905 2.332,20.599 2.698,20.590 Z", fillColor : "rgb(0, 0, 0)"};
    truck[1] = { path :"M20.437,19.224 C15.436,19.224 10.434,19.224 5.433,19.224 C5.093,19.224 4.818,18.929 4.818,18.565 C4.819,14.602 4.855,10.625 5.324,6.466 C8.985,5.272 16.895,5.400 20.613,6.637 C21.018,10.685 21.051,14.629 21.052,18.565 C21.052,18.929 20.777,19.224 20.437,19.224 Z", fillColor : "rgb(255, 255, 255)"};
    truck[2] = { path :"M20.438,18.607 C16.789,18.607 13.140,18.607 9.491,18.607 C11.022,14.199 12.867,9.889 15.196,5.729 C17.307,5.874 19.254,6.182 20.630,6.643 C21.016,10.485 21.051,14.233 21.052,17.972 C21.052,18.323 20.777,18.607 20.438,18.607 Z", fillColor :"rgb(246, 246, 246)"};
    truck[3] = { path :"M3.626,22.274 L21.714,22.274 L21.714,58.546 L3.626,58.546 L3.626,22.274 Z",fillColor:"rgb(196, 196, 196)"};
    truck[4] = { path :"M20.508,61.464 L17.518,61.464 C17.218,61.464 16.974,61.220 16.974,60.920 L16.974,58.546 L21.052,58.546 L21.052,60.920 C21.052,61.220 20.808,61.464 20.508,61.464 ZM7.822,61.464 L4.832,61.464 C4.532,61.464 4.288,61.220 4.288,60.920 L4.288,58.546 L8.366,58.546 L8.366,60.920 C8.366,61.220 8.122,61.464 7.822,61.464 Z",  fillColor:"rgb(255, 28, 28)"};

    //bus
    var bus = new Array();
    bus[0] = { path : "M5.806,2.411 C10.643,1.276 15.467,1.242 20.276,2.393 C21.772,2.758 22.984,4.350 22.984,5.780 C22.984,24.443 22.984,43.105 22.984,61.768 C22.984,62.129 22.680,62.421 22.305,62.421 C16.123,62.421 9.941,62.421 3.759,62.421 C3.384,62.421 3.080,62.129 3.080,61.768 C3.080,43.105 3.080,24.443 3.080,5.780 C3.080,4.349 4.301,2.772 5.806,2.411 L5.806,2.411 Z",fillColor:"rgb(232, 232, 232)"};
    bus[1] = { path : "M3.209,62.150 C3.128,62.042 3.080,61.911 3.080,61.768 C3.080,43.105 3.080,24.443 3.080,5.780 C3.080,4.349 4.301,2.772 5.806,2.411 C10.643,1.276 15.467,1.242 20.276,2.393 C21.227,2.625 22.062,3.352 22.545,4.218 C11.512,22.079 4.828,41.314 3.209,62.150 Z", fillColor:"rgb(255, 255, 255)"};
    bus[2] = { path : "M22.978,9.280 L22.978,59.895 L21.953,59.895 L21.953,7.311 L21.960,7.311 L21.960,7.232 L23.496,7.232 C24.556,7.232 25.416,8.092 25.416,9.152 L25.416,9.280 L22.978,9.280 ZM20.728,4.609 C15.655,3.429 10.573,3.356 5.481,4.581 C4.547,4.810 3.720,5.704 3.494,6.627 C3.490,6.551 3.483,6.569 3.474,6.641 C3.453,6.576 3.428,6.513 3.428,6.442 C3.428,5.953 3.428,5.523 3.428,5.107 C3.428,4.013 4.317,2.831 5.412,2.558 C10.505,1.307 15.587,1.382 20.660,2.586 C21.752,2.850 22.636,4.012 22.636,5.107 C22.636,5.589 22.636,6.070 22.636,6.552 C22.409,5.658 21.642,4.826 20.728,4.609 ZM3.496,6.735 C3.486,6.715 3.489,6.690 3.481,6.669 C3.484,6.655 3.490,6.641 3.494,6.627 C3.495,6.653 3.496,6.681 3.496,6.735 ZM3.444,6.957 C3.453,6.851 3.464,6.721 3.474,6.641 C3.477,6.650 3.477,6.660 3.481,6.669 C3.459,6.765 3.451,6.861 3.444,6.957 ZM3.444,6.957 C3.435,7.062 3.428,7.141 3.428,7.106 C3.428,7.057 3.440,7.007 3.444,6.957 ZM4.104,7.311 L4.111,7.311 L4.111,59.895 L3.086,59.895 L3.086,9.280 L0.648,9.280 L0.648,9.152 C0.648,8.092 1.508,7.232 2.568,7.232 L4.104,7.232 L4.104,7.311 ZM17.236,10.382 L17.236,15.702 L8.758,15.702 L8.758,10.382 L17.236,10.382 ZM17.918,41.846 L17.918,58.846 C17.918,59.199 17.631,59.486 17.278,59.486 L8.648,59.486 C8.295,59.486 8.008,59.199 8.008,58.846 L8.008,41.846 C8.008,41.493 8.295,41.206 8.648,41.206 L17.278,41.206 C17.631,41.206 17.918,41.493 17.918,41.846 ZM5.844,60.442 L20.152,60.442 C20.505,60.442 20.792,60.729 20.792,61.082 L20.792,62.486 L5.204,62.486 L5.204,61.082 C5.204,60.729 5.491,60.442 5.844,60.442 Z", fillColor:"rgb(0, 0, 0)"};
    bus[3] = { path : "M21.320,63.168 L18.322,63.168 C17.969,63.168 17.682,62.881 17.682,62.528 L17.682,62.080 C17.682,61.727 17.969,61.440 18.322,61.440 L21.320,61.440 C21.673,61.440 21.960,61.727 21.960,62.080 L21.960,62.528 C21.960,62.881 21.673,63.168 21.320,63.168 ZM7.742,63.168 L4.744,63.168 C4.391,63.168 4.104,62.881 4.104,62.528 L4.104,62.080 C4.104,61.727 4.391,61.440 4.744,61.440 L7.742,61.440 C8.095,61.440 8.382,61.727 8.382,62.080 L8.382,62.528 C8.382,62.881 8.095,63.168 7.742,63.168 Z", fillColor:"rgb(255, 28, 28)"};
	//=============== ~animation funcitons =====================

    $scope.httpLoading=false;
	
	
	  // function initialize(){
    $scope.initialize=function () {
	var $map = $('#map_canvas');
	infowindow = new google.maps.InfoWindow({  
	    size: new google.maps.Size(150,50)
	});
	var styleMap = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#bee4f4"},{"visibility":"on"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"color":"#000000"}]}]; 
	var myOptions = {
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	// console.log(document.getElementById("map_canvas"));
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	// $scope.maploaded = false;
	/*map.addListener('tilesloaded', function() { 
		    	
	$scope.maploaded = true; 
	document.getElementById('panel').innerHTML  = 'Tilesloaded  Event';  
    	window.setTimeout(function() {    
	document.getElementById('panel').innerHTML = '';  
	}, 2000);  
	
	});
	document.getElementById('panel').innerHTML = 'loading';*/
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
				setTimeout(function(){
					$scope.zoomlevel = map.getZoom();
					}, 80);
			    
			   /* setTimeout(function(){
			    	console.log("hi");
			    	wheelEvent(); 
			    	}, 80);*/
			});
			 
			
			
			function wheelEvent( event ) {  
			/*	console.log($scope.zoomlevel);
				console.log($scope.deviceId);*/
				if(typeof $scope.deviceId !='undefined' && $scope.deviceId !=""){
					if ($scope.zoomlevel < 16 || $scope.zoomlevel > 17) {
//						console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ZOOM & DEVICEID<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
//						console.log($scope.zoomlevel);
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
		  
		  
		  google.maps.event.addDomListener(window, 'load', $scope.initialize);
		  
		  
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
    	$(".count_label").css("position", 'fixed').css('top', '20px').css('left', '5px').css('margin-top', '45px');
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
    	$(".count_label").css("position", 'absolute').css('top', 0).css('left', '15px').css('margin-top','10%');
    	$(".traffic_layer_btn").css("position", 'absolute').css('top', '10px').css('left', '130px');
    	google.maps.event.trigger(map, 'resize');
    }
	
    var iconImg;
    function createMarker(latlng, deviceID,vehNo,vehModel, html,type,devtype) {
	svg = new Array();
	icons = new Array();
	if(devtype == "car"){
	    svg = car;
	}
	else if(devtype == "truck")
	{
	    svg = truck;
	}
	else if(devtype == "bike"){
	    svg = bike;
	}
	else if(devtype == "bus"){
	    svg = bus; 
	}
	else{
		svg = car;
	}
	var contentString; 
	for(let i in svg){
//	    if(type==0){svg[i].fillColor='#ea0909';}
//	    else if(type==1){svg[i].fillColor='#ffde01';}
//	    else if(type==2){svg[i].fillColor='#e59305';}
//	    else if(type==3){svg[i].fillColor='#000000';}
//	    else if(type==4){svg[i].fillColor='#0540E5';}
	    icons[i] = {path : svg[i].path, 
	    		fillColor : svg[i].fillColor, 
	    		scale: .9, 
	    		strokeColor: 'white', 
		    strokeWeight: .10, 
		    fillOpacity: 1, 
		    offset: '5%',
		    rotation: Number($scope.headings),
		    anchor: new google.maps.Point(16, 16) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
	    };
	}
//	var geocoder = new google.maps.Geocoder();		
//	geocoder.geocode({latLng: latlng}, function(responses){     
//	    if (responses && responses.length > 0) 
//	    {     	   
//		if(html.length==0){
//		    html=responses[0].formatted_address;
//		    contentString  = '<b><label>Device ID:</label> '+deviceID+'</b><br><br><b><label>Vehicle No:</label> '+vehNo+'</b><br><br><b><label>Vehicle Model:</label> '+vehModel+'</b><br><br>'+html+'<br><br><button class="btn btn-primary btn-sm" id="infoClick" data-deviceID="'+deviceID+'">show detail</button>';	
//		}		        	   		                    
//	    } 
//	    else 
//	    {       
//		// swal('Not getting Any address for given latitude and longitude.');
//	    }   
//	});
//	if(html.length!=0){
//	    contentString  = '<b><label>Device ID:</label> '+deviceID+'</b><br><br><b><label>Vehicle No:</label> '+vehNo+'</b><br><br><b><label>Vehicle Model:</label> '+vehModel+'</b><br><br>'+html+'<br><br><button class="btn btn-primary btn-sm" id="infoClick" data-deviceID="'+deviceID+'">show detail</button>';
//	}
	
	for (let i in svg){
	    marker[i] = new google.maps.Marker({
		position: latlng,
		map: map,
		title: deviceID,
		icon: icons[i],
		zIndex: Math.round(latlng.lat() * -100000) << 5,
		myname : deviceID
	    });
	    markers.push(marker[i]);
//	    var damymarker = marker[i];
//	    google.maps.event.addListener(damymarker, 'click', function() {
//		    /*
//		     * calling map modal controller function from here using
//		     * $emit ref links
//		     * http://stackoverflow.com/questions/29467339/how-to-call-function-in-another-controller-in-angularjs
//		     * http://stackoverflow.com/questions/21346565/how-to-pass-an-object-using-rootscope
//		     */	    	 
//		    infowindow.setContent(contentString); 
//		    //infowindow.setZIndex(1000000);
//		    infowindow.open(map,damymarker);
//		    // $rootScope.$emit("deviceDetailModal",lg,deviceID);
//		    // $scope.open("lg",deviceID);
//		});
	}
	return marker;
    }
    
    
    function createMarker1(latlng, deviceID,vehNo,vehModel, html,type,devtype) {
	svg = new Array();
	icons = new Array();
	if(devtype == "car"){
	    svg = car;
	}
	else if(devtype == "truck")
	{
	    svg = truck;
	}
	else if(devtype == "bike"){
	    svg = bike;
	}
	else if(devtype == "bus"){
	    svg = bus; 
	}
	else{
		svg = car;
	}
	var contentString; 
	for(let i in svg){
//	    if(type==0){svg[i].fillColor='#ea0909';}
//	    else if(type==1){svg[i].fillColor='#ffde01';}
//	    else if(type==2){svg[i].fillColor='#e59305';}
//	    else if(type==3){svg[i].fillColor='#000000';}
//	    else if(type==4){svg[i].fillColor='#0540E5';}
	    icons[i] = {path : svg[i].path, 
	    		fillColor : svg[i].fillColor, 
	    		scale: .9, 
	    		strokeColor: 'white', 
		    strokeWeight: .10, 
		    fillOpacity: 1, 
		    offset: '5%',
		    rotation: Number($scope.headings),
		    anchor: new google.maps.Point(16, 16) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
	    };
	}
	var geocoder = new google.maps.Geocoder();		
	geocoder.geocode({latLng: latlng}, function(responses){     
	    if (responses && responses.length > 0) 
	    {     	   
		if(html.length==0){
		    html=responses[0].formatted_address;
		    contentString  = '<b><label>Device ID:</label> '+deviceID+'</b><br><br><b><label>Vehicle No:</label> '+vehNo+'</b><br><br><b><label>Vehicle Model:</label> '+vehModel+'</b><br><br>'+html+'<br><br><button class="btn btn-primary btn-sm" id="infoClick" data-deviceID="'+deviceID+'">show detail</button>';	
		}		        	   		                    
	    } 
	    else 
	    {       
		// swal('Not getting Any address for given latitude and longitude.');
	    }   
	});
	if(html.length!=0){
	    contentString  = '<b><label>Device ID:</label> '+deviceID+'</b><br><br><b><label>Vehicle No:</label> '+vehNo+'</b><br><br><b><label>Vehicle Model:</label> '+vehModel+'</b><br><br>'+html+'<br><br><button class="btn btn-primary btn-sm" id="infoClick" data-deviceID="'+deviceID+'">show detail</button>';
	}
	
	for (let i in svg){
	    marker[i] = new google.maps.Marker({
		position: latlng,
		map: map,
		title: deviceID,
		icon: icons[i],
		zIndex: Math.round(latlng.lat() * -100000) << 5,
		myname : deviceID
	    });
	    markers.push(marker[i]);
	    var damymarker = marker[i];
	    google.maps.event.addListener(damymarker, 'click', function() {
		    /*
		     * calling map modal controller function from here using
		     * $emit ref links
		     * http://stackoverflow.com/questions/29467339/how-to-call-function-in-another-controller-in-angularjs
		     * http://stackoverflow.com/questions/21346565/how-to-pass-an-object-using-rootscope
		     */	    	 
		    infowindow.setContent(contentString); 
		    //infowindow.setZIndex(1000000);
		    infowindow.open(map,damymarker);
		    // $rootScope.$emit("deviceDetailModal",lg,deviceID);
		    // $scope.open("lg",deviceID);
		});
	}
	return marker;
    }
    
    
    
    
    
    
	// Sets the map on all markers in the array.
    function setMapOnAll(map) {
	for (let i = 0; i < markers.length; i++) {
	    markers[i].setMap(map);
	}
	markers = [];
    }
    
    function setPolygonNull(){
    	myPolygon.setMap(null);
    }
	
    $(document).on('click','#infoClick',function(event){
	event.stopImmediatePropagation();
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
//					console.log("--------------------Different lat lng of "+dataVal[0].values[0].type+" ------------------------------");
//					console.log("start : ",storedltlng.lat,"end :",dataVal[0].values[0].lat);
					vehichleRouting(dataVal,storedltlng.lat,storedltlng.lng,storedltlng.lat,storedltlng.lng);
				}
				
				else{
//					console.log("--------------------Different lat lng------------------------------");
//					console.log("start : ",storedltlng.lat,"end :",dataVal[0].values[0].lat);
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
//				console.log("-----------------EQUAL / SAME LAT------------------------")
//				console.log("start : ",storedltlng.lat,"end :",dataVal[0].values[0].lat);
			
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
	    setMapOnAll(null);
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
                        startLocation.latlng = legs[i].start_location;
                        startLocation.address = legs[i].start_address;												   
                          createMarker1(legs[i].start_location,dataVal[i].devid,dataVal[i].vehicle_num,dataVal[i].vehicle_model,legs[i].start_address,dataVal[i].values[0].type,dataVal[i].devtype);
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
	    if (d > eol) {        
		map.panTo(endLocation.latlng);
		for(i in svg){marker[i].setPosition(endLocation.latlng);}
		return;
	    }
	    var p = polyline.GetPointAtDistance(d);
	    map.panTo(p);
	    var lastPosn = marker[0].getPosition();
	    for(let i in svg){marker[i].setPosition(p);}
	    var heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
	    $scope.headings = heading;
	    //localStorage.setItem("heading",heading);
	    for(let i in svg){icons[i].rotation = heading;}
	    for(let i in svg){marker[i].setIcon(icons[i]);}
	    updatePoly(d);
	    // timerHandle = setTimeout("animate(" + (d + step) + ")", tick);
	    
	    timerHandle = setTimeout(function() {
	        $scope.animate(d + step);
	    }, tick);
	}

	function startAnimation() {
	    eol = polyline.Distance();
	    map.setCenter(polyline.getPath().getAt(0));
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
	
	//$scope.chart;
	var chart;
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
//		console.log(data);
		if (data.err == "Expired Session") {
			expiredSession();
			$localStorage.$reset();
		} else if (data.err == "Invalid User") {
			invalidUser();
			$localStorage.$reset();
		}
//		console.log(status);
//		console.log(headers);
//		console.log(config);		
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
		$('#clearTextDevice span.select2-chosen').empty();
		$('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
		// console.log($scope.groupList);
		/*$("#selectDevice").on("select2-opening", function(e) { 
			//$('#selectDevice').select2('val', '').remove();
			//$("#selectDevice option[value='']").remove();
			$(".select2-results").css('display','none');
		});*/
		
		
		
		
	}
	/**
	 * fetch device list based on group id
	 */
	 //$("#selectDevice option[value='']").remove();
	$scope.fetchDevicelist = function(groupID) {
		//resizeTrackingMap();
		$scope.deviceId="";
		$scope.httpLoading=true;
	    $('#clearTextDevice span.select2-chosen').empty();  
	    $('#clearTextDevice span.select2-chosen').text("- - Select Device - -"); 
		storage_arr=[];// clearing the matched array on change of group id
						// dropdown
		//setMapOnAll(null);
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
		    	setMapOnAll(null);
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
//			console.log(data);
//			console.log(status);
//			console.log(headers);
//			console.log(config);
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
//			console.log(data);
//			console.log(status);
//			console.log(headers);
//			console.log(config);
		});
	}
	function plotGeofence(geofence_plot){
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
			    if(data[i].values.length>0){				
    				createMarker(new google.maps.LatLng(data[i].values[0].lat, data[i].values[0].long),data[i].devid,data[i].vehicle_num,data[i].vehicle_model,"",data[i].values[0].type,data[i].devtype);			 
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
		});
		
	}
	function plotDevice(){
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
				$scope.multiDevice = false;
				if(data[0].values.length>0){				
					$scope.singleDevice = true;
					$scope.divcolor = data[0].values[0].type;
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
					}
					else if(data[0].devtype=="bus"){
						$scope.busCount = 1;
					}else if(data[0].devtype=="truck"){
						$scope.truckCount = 1;
					}else if(data[0].devtype=="bike"){
						$scope.bikeCount = 1;
					}
					else{$scope.carCount = 0;
        					$scope.bikeCount = 0;
        					$scope.busCount = 0;
        					$scope.truckCount = 0;
					}
					$scope.speedSpeedOmeter=speedValue;
					$scope.vehnoSpeedOmeter=data[0].vehicle_num;
					$scope.vehModel = data[0].vehicle_model;
					$scope.speedlimitSpeedOmeter=speedlimit;
					$scope.dateTimeSpeedOmeter=getDateTime(data[0].values[0].ts);
					//updateSpeed(data[0].vehicle_num,data[0].values[0].Velocity,data[0].speed_limit,getDateTime(data[0].values[0].ts));				
					
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
					            data: [Number(data[0].values[0].Velocity)],
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
//			console.log(data);
//			console.log(status);
//			console.log(headers);
//			console.log(config);
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
//		console.log("Single Device Re Center");
		map.setZoom($scope.singleDeviceZoomLevel);
		map.panTo(marker[0].getPosition());
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
//			console.log(type)
			if(type=="0"){
				$scope.img_url="../images/mapIcon/geofenceStatus.png";
				$(".barStyle").css("background-color", "#710e9f");
				//$scope.barTxt= "Crossed Geofence";
			}
			else if(type=="1"){
				$scope.img_url="../images/mapIcon/speed-limit.png";
				//$scope.barTxt= "Crossed Speed";
				$(".barStyle").css("background-color", "#ffd500");
			}
			else if(type=="2"){
				$scope.img_url="../images/mapIcon/warning.png";
				//$scope.barTxt= "Crossed Geofence and Speed";
				$(".barStyle").css("background-color", "#ff0000");
			}
			else if(type== "3"){
				$scope.img_url="../images/mapIcon/normal.png";
				//$scope.barTxt= "Normal State";
				$(".barStyle").css("background-color", "#7fbb01");
			}
			else if(type== "4"){
				$scope.img_url="../images/mapIcon/no-response.png";
				//$scope.barTxt= "No-Response State";
				$(".barStyle").css("background-color", "#2d2d2d");  
			}
		}
   
	
	
	
	
	
	
	
	$scope.geoColor={"background-color":"#f44336"};
	$scope.speedColor={"background-color":"#ffde01"};
	$scope.geospeedColor={"background-color":"#e59305"};
	$scope.normalVehicleColor={"background-color":"#000000"};
	$scope.aliveVehicleColor={"background-color":"#0540E5"};
	
	
	
		$scope.getColorBack =function(div){
//			console.log(div)
			
			if(div=="0"){
				setTimeout(function() {
				$scope.singleImg_url="../images/mapIcon/geofenceStatus.png";
				//$(".barStyleSingle").css("background-color", "#f44336");
				$scope.barTxt= "Crossed Geofence";
				},7000);
			}
			else if(div=="1"){
				$scope.singleImg_url="../images/mapIcon/speed-limit.png";
				$scope.barTxt= "Crossed Speed";
				//$(".barStyleSingle").css("background-color", "#ffde01");
			}
			else if(div=="2"){
				$scope.singleImg_url="../images/mapIcon/warning.png";
				$scope.barTxt= "Crossed Geofence and Speed";
				//$(".barStyleSingle").css("background-color", "#e59305");
			}
			else if(div== "3"){
				$scope.singleImg_url="../images/mapIcon/normal.png";
				$scope.barTxt= "Normal State";
				//$(".barStyleSingle").css("background-color", "#000000");
			}
			else if(div== "4"){
				$scope.singleImg_url="../images/mapIcon/no-response.png";
				$scope.barTxt= "No-Response State";
				//$(".barStyleSingle").css("background-color", "#0540E5");
			}
		}
    
	
	/* clear markers*/
	function clearMarkers(){
		google.maps.Map.prototype.markers = new Array();

		google.maps.Map.prototype.getMarkers = function() {
		    return this.markers
		};

		google.maps.Map.prototype.clearMarkers = function() {
		    for(let i=0; i<this.markers.length; i++){
			_.each(markers[i], function(marker, i){
			    this.marker.setMap(null);
			})
		        
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
		console.log(speed);
		console.log(Number(speed));
		
		if(speed == "0")
			{
			//plotDevice();
			$('#container').highcharts().series[0].points[0].update(Number(speed));
			}
		else{
		$('#container').highcharts().series[0].points[0].update(Number(speed));
		}
		
	}
	
	
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
//		console.log("check");
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
//			console.log(data);
//			console.log(status);
//			console.log(headers);
//			console.log(config);
		});
	};
	var flag = 0;
	$scope.singleDeviceData = false;
	$scope.plusmin = "+";
	
	$scope.guageHG = function(){
		//alert("hi");
		//$scope.singleDeviceData = true;
		if(flag == 0){
			//$("#gaugeHS").show();
			$scope.singleDeviceData = true;
			$scope.plusmin = "-";
			flag= 1;
		}
		else{
			//$("#gaugeHS").hide();
		$scope.singleDeviceData = false;
		$scope.plusmin = "+";
			flag= 0;
		}
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
//			console.log(data);
//			console.log(status);
//			console.log(headers);
//			console.log(config);
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
//											console.log(data);
//											console.log(status);
//											console.log(headers);
//											console.log(config);
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
//											console.log(data);
//											console.log(status);
//											console.log(headers);
//											console.log(config);
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