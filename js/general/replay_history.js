batsGeneralHome.controller('replayHistory',function($rootScope,$scope, $http, $localStorage,uiGmapGoogleMapApi,uiGmapIsReady){
	$rootScope.menuPos=8;
	var dynamicMapHeight=window.screen.availHeight-100;
	$scope.mapHeight={
		height:dynamicMapHeight
	}
	$scope.yoData=false;
	$scope.noData=false;
	$scope.blankTable=true;
	$scope.showDatepicker=true;
	$scope.showTimeSlot=false;
	$scope.token = $localStorage.data;
	$scope.todayDate=new Date();
	$scope.play = false;
	$scope.end = false;
	$scope.greyColor={
		color:"#637778"
	};
	$scope.whiteColor={
		color:"#fff"
	};
	var contentHeight=window.screen.availHeight-220;
	$scope.histcontentheight={
		"maxHeight":contentHeight
	}
	var dev={};
	var maploadedInterval;
	var directionDisplay;
	var directionsService;
	var map;
	var historypolyline = null;
	var timerHandle = null;
	var step = 5; // metres
	var tick = 100; // milliseconds
	$rootScope.lastStep = step;
	$rootScope.lastTick = tick;
	var poly;
	var poly2;
	var lastVertex = 0;
	var eol;
	var marker = new Array();
	var k=0;
	var svg = new Array();
	$scope.vehType;
	var endmarkers = new Array() ;
	var stmarkers = new Array();
	$scope.headings;
	$rootScope.headings1;
	var heading;
	var eventmarker =new Array();
	

	
	  /*var carSvg = new Array();
	  carSvg[0] = { path :"M26.068,7.719 C27.423,21.657 26.941,35.659 26.801,49.660 C26.765,52.945 23.953,55.681 20.511,55.727 C16.978,55.770 13.462,55.778 9.929,55.738 C6.486,55.697 3.672,52.944 3.640,49.660 C3.516,35.659 3.113,21.657 4.657,7.719 C5.083,4.446 7.639,1.760 10.572,1.739 C13.630,1.721 16.881,1.721 20.018,1.739 C23.034,1.760 25.695,4.446 26.068,7.719 L26.068,7.719 Z",fillColor : "rgb(237, 237, 237)"};
	  carSvg[1] = { path : "M25.762,8.510 L20.921,2.204 C20.921,2.204 25.252,2.647 25.885,8.065 C26.517,13.483 25.762,8.510 25.762,8.510 ZM15.160,2.706 C12.355,2.772 10.092,2.853 10.085,2.450 C10.076,2.165 12.353,1.834 15.164,1.816 C17.968,1.902 20.240,2.220 20.248,2.466 C20.253,2.846 17.967,2.761 15.160,2.706 ZM4.815,8.074 C5.443,2.668 9.749,2.226 9.749,2.226 L4.937,8.518 C4.937,8.518 4.187,13.481 4.815,8.074 ZM5.000,47.349 L4.563,21.574 C4.563,21.574 9.613,34.691 5.000,47.349 ZM7.721,44.433 C7.865,44.256 8.144,44.114 8.372,44.086 L7.879,26.221 C7.668,26.129 7.434,25.911 7.299,25.650 C6.246,23.582 5.784,21.256 5.737,19.294 C5.700,18.027 6.392,17.124 7.323,16.364 C8.266,15.625 9.448,15.028 10.664,14.841 C13.663,14.447 16.725,14.440 19.798,14.794 C22.228,15.233 24.825,17.000 24.814,19.411 C24.761,21.376 24.325,23.625 23.296,25.754 C23.118,26.114 22.752,26.393 22.495,26.383 C18.058,26.218 12.293,26.214 8.082,26.268 C8.078,26.268 8.073,26.268 8.069,26.268 L8.559,44.083 C12.615,44.173 17.835,44.175 21.697,44.146 L22.187,26.376 L22.375,26.381 L21.885,44.149 C22.107,44.170 22.399,44.311 22.553,44.491 C23.529,45.647 23.957,46.947 24.001,48.043 C24.035,48.752 23.394,49.256 22.531,49.681 C21.656,50.094 20.560,50.428 19.432,50.532 C16.652,50.752 13.813,50.756 10.964,50.558 C8.711,50.313 6.303,49.325 6.313,47.978 C6.362,46.880 6.766,45.623 7.721,44.433 ZM25.938,21.591 L25.500,47.392 C20.891,34.722 25.938,21.591 25.938,21.591 Z", fillColor :"rgb(0, 0, 0)"};
	  carSvg[2] = { path : "M25.122,54.823 L22.326,56.181 C22.187,56.249 22.449,55.545 22.710,54.987 L23.830,52.596 C23.909,52.427 24.031,52.230 24.113,52.136 L25.203,50.886 C25.331,50.739 25.452,50.678 25.470,50.765 L25.838,52.542 C25.993,53.290 25.636,54.572 25.122,54.823 ZM7.994,56.175 L5.193,54.808 C4.677,54.557 4.319,53.266 4.474,52.514 L4.844,50.726 C4.862,50.638 4.983,50.700 5.111,50.848 L6.203,52.105 C6.285,52.200 6.408,52.398 6.487,52.568 L7.610,54.974 C7.871,55.535 8.134,56.244 7.994,56.175 Z", fillColor : "rgb(255, 0, 0)"};
	  carSvg[3] = { path : "M25.937,21.687 L25.937,19.750 L28.312,19.750 C29.348,19.750 30.187,20.589 30.187,21.625 L30.187,21.687 L25.937,21.687 ZM26.125,7.719 C25.751,4.446 23.075,1.760 20.044,1.739 C16.890,1.721 13.622,1.721 10.547,1.739 C7.599,1.760 5.029,4.446 4.601,7.719 C4.586,7.854 4.572,7.990 4.557,8.125 L4.422,8.125 C4.460,7.741 4.499,7.358 4.540,6.974 C4.969,3.541 7.542,0.723 10.495,0.702 C13.574,0.682 16.847,0.682 20.006,0.702 C23.042,0.723 25.721,3.541 26.096,6.974 C26.132,7.358 26.166,7.741 26.199,8.125 L26.164,8.125 C26.151,7.990 26.138,7.854 26.125,7.719 ZM4.563,21.687 L0.313,21.687 L0.313,21.625 C0.313,20.589 1.152,19.750 2.188,19.750 L4.563,19.750 L4.563,21.687 ZM9.901,55.738 C13.452,55.778 16.988,55.770 20.539,55.727 C23.812,55.684 26.518,53.233 26.832,50.188 L26.843,50.188 C26.840,50.449 26.837,50.711 26.835,50.973 C26.798,54.419 23.967,57.290 20.502,57.338 C16.945,57.383 13.404,57.391 9.847,57.350 C6.381,57.306 3.548,54.418 3.516,50.973 C3.514,50.711 3.511,50.449 3.509,50.188 L3.609,50.188 C3.919,53.234 6.627,55.699 9.901,55.738 Z", fillColor : "rgb(121, 121, 121)"};
	  carSvg[4] = { path : "M24.837,18.830 C24.828,18.872 24.811,18.913 24.786,18.951 C24.786,18.952 24.785,18.953 24.784,18.955 C24.491,16.779 22.071,15.204 19.798,14.794 C16.725,14.440 13.663,14.447 10.664,14.841 C9.448,15.028 8.266,15.625 7.323,16.364 C6.429,17.094 5.758,17.956 5.738,19.145 C5.738,19.145 5.738,19.145 5.738,19.145 C5.713,19.107 5.695,19.066 5.686,19.024 C5.677,18.982 5.676,18.939 5.685,18.894 C6.276,15.191 7.255,10.228 9.521,3.606 C9.575,3.439 9.940,3.312 10.339,3.319 C13.562,3.374 16.941,3.366 20.142,3.287 C20.537,3.277 20.903,3.400 20.963,3.563 C22.183,6.915 23.071,9.715 23.639,12.193 C24.216,14.623 24.504,16.818 24.838,18.701 C24.846,18.745 24.845,18.789 24.837,18.830 ZM7.107,45.332 C7.202,45.144 7.304,44.956 7.417,44.768 C7.539,44.566 7.708,44.387 7.875,44.260 C7.959,44.196 8.042,44.145 8.119,44.111 C8.157,44.094 8.194,44.081 8.229,44.073 C8.246,44.069 8.263,44.066 8.280,44.064 C8.288,44.063 8.296,44.063 8.303,44.062 C8.311,44.062 8.319,44.062 8.326,44.062 C8.577,44.074 8.832,44.084 9.091,44.094 C8.879,44.090 8.669,44.086 8.463,44.081 C8.225,44.075 7.885,44.231 7.721,44.433 C7.483,44.729 7.279,45.030 7.107,45.332 ZM6.353,47.528 C6.333,47.680 6.320,47.831 6.313,47.978 C6.303,49.325 8.711,50.313 10.964,50.558 C13.813,50.756 16.652,50.752 19.432,50.532 C20.560,50.428 21.656,50.094 22.531,49.681 C23.243,49.330 23.804,48.925 23.958,48.395 C23.981,48.634 23.997,48.870 24.004,49.103 C24.007,49.241 24.008,49.377 24.007,49.512 C24.006,49.647 24.003,49.781 23.998,49.914 C23.976,50.443 23.925,50.949 23.860,51.414 C23.695,52.619 22.983,53.376 22.098,53.877 C21.223,54.358 20.166,54.609 19.108,54.606 C17.817,54.582 16.520,54.552 15.215,54.554 C14.889,54.555 14.562,54.557 14.234,54.560 C13.907,54.564 13.578,54.569 13.250,54.575 C12.592,54.588 11.932,54.607 11.268,54.626 C9.175,54.644 6.776,53.680 6.373,51.323 C6.302,50.860 6.244,50.364 6.216,49.845 C6.209,49.715 6.205,49.584 6.202,49.452 C6.199,49.319 6.199,49.186 6.201,49.051 C6.206,48.781 6.222,48.506 6.251,48.228 C6.274,47.997 6.308,47.763 6.353,47.528 Z", fillColor : "rgb(255, 255, 255)"};*/
	  
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


	  
	  
	  
	  /*var icons = new Array();
	  for(i in svg){
	  	icons[i] = {path : svg[i].path, fillColor : svg[i].fillColor, scale: .7, strokeColor: 'white', strokeWeight: .10, fillOpacity: 1, offset: '5%',
	  		anchor: new google.maps.Point(10, 25) // orig 10,50
								// back of car,
								// 10,0 front of
								// car, 10,25
								// center of car
	  	};
	  }*/
	  var oldStep;
	  // To Change Replay Speed level
	  $scope.updateSpeed=function(choice){
	  	switch (choice) {
	  		case 0:
	  		oldStep = {step: 1,tick:100};
	  		step=5;
	  		tick=100;
	  		$scope.play = false;
	  		$rootScope.lastStep = step;
	  		$rootScope.lastTick = tick;
	  		break;
	  		case 1:
	  		oldStep = {step: 10,tick:50};
	  		step=10;
	  		tick=50;
	  		$scope.play = false;
	  		$rootScope.lastStep = step;
	  		$rootScope.lastTick = tick;
	  		break;
	  		case 2:
	  		oldStep = {step: 50,tick:10};
	  		step=50;
	  		tick=10;
	  		$scope.play = false;
	  		$rootScope.lastStep = step;
	  		$rootScope.lastTick = tick;
	  		break;	
	  		case 3:
	  		step=0;
	  		tick=1000;
	  		$scope.play = true;
	  		break;
	  		
	  		case 4:
			   	// step=oldStep.step;
				// tick=oldStep.tick;
				step = $rootScope.lastStep;
				tick = $rootScope.lastTick;
				$scope.play = false;
				break;
			}
		}
	// $("#loading_icon").hide();
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



	// function initialize() {
		$scope.initialize=function () {	
			var styleMap = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#bee4f4"},{"visibility":"on"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"color":"#000000"}]}];
			var myOptions = {
				zoom: 8,
				maxZoom : 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			address = 'India';
	    // address = 'Trinidad and Tobago'
	    geocoder = new google.maps.Geocoder();
	    geocoder.geocode( { 'address': address}, function(results, status) {
	    	map.fitBounds(results[0].geometry.viewport);

	    });	
	    
	    map = new google.maps.Map(document.getElementById("replay_map"),
	    	myOptions);
	    google.maps.event.addListenerOnce(map, 'idle', function(){
	        // do something only the first time the map is loaded
	    	// console.log("map loaded");
	    });
	    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
	        // this part runs when the mapobject is created and rendered
	    	// console.log("Map Loaded");
	    	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
	            // this part runs when the mapobject shown for the first
		    // time
	        	// console.log("Map with tiles and polylines loaded one
			// time");
			
	        	// console.log("Hide Loading");
	        });
	    });
	    google.maps.event.addListener(map, 'tilesloaded', function() {
	    	  // Visible tiles loaded!
	    	// console.log("map loaded with tiles every time");
	    	// $("#loading_icon").hide();
	    	// $scope.httpLoading=false;
	    });
	    poly = new google.maps.Polyline({
	    	path: [],
	    	strokeColor: '#97dcc9',
	    	strokeWeight: 5
	    });
	    poly2 = new google.maps.Polyline({
	    	path: [],
	    	strokeColor: '#FF0000',
	    	strokeOpacity: 0.00001,
	    	strokeWeight: 0
	    });  
	}
	

	/**
	 * on load fetch and fill group drop down menu
	 */

	 $scope.glists = function() {
	 	console.log("glist");
	 	$scope.admingroup = {};
	 	$scope.admingroup.token = $scope.token;
	// console.log($scope.admingroup);
	$scope.httpLoading=true;
	$http({
		method : 'POST',
		url : apiURL + 'group/list',
		data : JSON.stringify($scope.admingroup),
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function(data) {
		listGroup(data);
		$scope.httpLoading=false;
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
// console.log(data);
// console.log(status);
// console.log(headers);
// console.log(config);
});
	
}





	/**
	 * function to list the group id and name
	 */

	 function listGroup(data) {
	 	var glist = [];
	 	for ( var inc = 0; inc < data.glist.length; inc++) {
	 		glist.push(data.glist[inc]);
	 	}
	 	$scope.groupList = glist;
	 	console.log($scope.groupList);
	 }
	/**
	 * fetch device list based on group id
	 */
	 $scope.fetchDevicelistHistory = function(groupID) {
	 	$scope.httpLoading=true;
	 	$scope.showDatepicker=true;
	 	$scope.noData = false;
	 	$scope.showTimeSlot=false;
	 	$scope.blankTable=false;
	/*
	 * $('#clearTextDevice span.select2-chosen').empty();
	 * $('#clearTextDevice span.select2-chosen').text("- - Select Vehicle
	 * No/Device - -");
	 */
		// document.getElementById("groupNamelist").blur();
		// console.log(groupID);
		$scope.initialize();
		$scope.yoData=false;
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
		 	$scope.httpLoading=false;
		 	$scope.groupDevice = data;
		 	$scope.devlistObject=$scope.groupDevice.devlist;
		 	$scope.deviceList = [];
		 	var dev_len = $scope.groupDevice.devlist.length;
		 	var devlist = $scope.groupDevice.devlist;
		 	for ( var i = 0; i < dev_len; i++) {
		 		$scope.deviceList.push(devlist[i].devid);
		 	}
			// console.log($scope.deviceList);
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
// console.log(data);
// console.log(status);
// console.log(headers);
// console.log(config);
});
	};
	/**
	 * add selected device for fetching history
	 */
	 
	 $scope.onChange = function(data){
	 	$scope.fetchDeviceDetailHistory(data.devid,data.devtype);
	 }
	 
	 $scope.fetchDeviceDetailHistory=function(devID,divType){
	 	
	 	$scope.vehType= divType;
	 	
	 	icons = new Array();
	 	if(divType == "car"){
	 		svg = car;
	 	}
	 	else if(divType == "truck")
	 	{
	 		svg = truck;
	 	}
	 	else if(divType == "bike"){
	 		svg = bike;
	 	}
	 	else if(divType == "bus"){
	 		svg = bus; 
	 	}
	 	else{
	 		svg = car;
	 	}
	 	
	 	for(i in svg){
	 		icons[i] = {path : svg[i].path, fillColor : svg[i].fillColor, 
	 			scale: .7, 
	 			strokeColor: 'white', 
	 			strokeWeight: .10, 
	 			fillOpacity: 1, 
	 			offset: '5%',
	 			rotation: Number($scope.headings),
	  		anchor: new google.maps.Point(10, 25) // orig 10,50 back of
								// car, 10,0 front of
								// car, 10,25 center of
								// car
							};
							console.log($scope.headings);
						}
						
						$scope.showDatepicker=false;
						$('.md-datepicker-input').prop('readonly', true);
						dev.devid=devID;
						$scope.yoData=false;
						$scope.showTimeSlot=false;
						$scope.myDate = "";
						$("#GtrvelRouteHstTime").val("");
						$scope.initialize();
		//var dt=new Date().getTime();
		var dt=new Date();
		$('#GtrvelRouteHstTime').val(showTime(dt));
		dateChange(dt);
	};
	
	
	$scope.openCal = function(){
		$('#GtrvelRouteHstTimePic').datetimepicker({
			/*
			 * inline: true, sideBySide: true,
			 */
			 format: 'DD/MM/YYYY',
			 maxDate: 'now',        		
			 ignoreReadonly:true,
			}).on("dp.change",function (e) {
	            	// $("#startDateMaxKm").blur();
	            	// closeResult();
	            	dateChange(e.date._d);
	            	/*$scope.myDateChange($scope.MyDate);
	            	$scope.activeMenu = '5';*/
	            });
		// startDateMaxKmError.style.display = 'none';
		
	}
	
	dateChange = function(date){
		$scope.myDateChange($scope.MyDate);
		$scope.activeMenu = '5';
	};
	
	function showTime (ts) {
		// console.log(ts);
		var d = new Date(Number(ts));
		var day = d.getDate();
		var month = d.getMonth()+1;
		var year = d.getFullYear();
		var hours = d.getHours();
		var minutes = d.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = day+"/"+month+"/"+year;
		// console.log(strTime);
		return strTime;
	};
	
	function startDate(getStartDateMinMax){
		var datetimeVal=getStartDateMinMax;
		console.log(getStartDateMinMax);
		/* strArra=datetimeVal.split(" "); */
		var dateArray=datetimeVal.split("/");
		var newStDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
		var sts=new Date(newStDate);
		return sts.getTime();
	}
	
	$scope.myDateChange=function(){
		$scope.initialize();
		$scope.yoData=false;
		$scope.showTimeSlot=true;
		$scope.slotCheckjson={};
		$scope.slotCheckjson.token=$scope.token;
		$scope.slotCheckjson.devid=dev.devid;
		$scope.slotCheckjson.slots=[];
		
		$scope.slotCheckjson.slots.push({"sts":getTimestamp(0,0,0),"ets":getTimestamp(5,59,59)},
			{"sts":getTimestamp(6,0,0),"ets":getTimestamp(11,59,59)},
			{"sts":getTimestamp(12,0,0),"ets":getTimestamp(17,59,59)},
			{"sts":getTimestamp(18,0,0),"ets":getTimestamp(23,59,59)});
		$http({
			method:'POST',
			url:apiURL+'device/history_data_exist',
			data:JSON.stringify($scope.slotCheckjson),	
			headers:{'Content-Type' : 'application/json'}
		}).success(function(data) {
			console.log(data.values);	
			$scope.slotA=data.values[0].data ? '1' : '0';
			$scope.slotB=data.values[1].data ? '1' : '0';
			$scope.slotC=data.values[2].data ? '1' : '0';
			$scope.slotD=data.values[3].data ? '1' : '0';
			if(data.values[0].data!=true && data.values[1].data!=true&&data.values[2].data!=true&&data.values[3].data!=true){						
				$scope.showTimeSlot=false;
				swal({title:"No history available for the selected date"});
					//$("#GtrvelRouteHstTime").val("");
				}
				else{
					$scope.showTimeSlot=true;
				}
			}).error(function(data, status, headers,config) {
				if (data.err == "Expired Session") {
					$('#updateDeviceModal').modal('hide');
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {
					$('#updateDeviceModal').modal('hide');
					invalidUser();
					$localStorage.$reset();
				}
// console.log(data);
// console.log(status);
// console.log(headers);
// console.log(config);
}).finally(function(){		
	$scope.httpLoading=false;
});
};
	/**
	 * 1 for 00:00 - 05:59 2 for 06:00 - 11:59 3 for 12:00 - 17:59 4 for
	 * 18:00 - 23:59
	 */
	 $scope.slotHistory=function(slot_num,noDataVal){
	 	oldStep = {step: 1,tick:100};
	 	$scope.end = false;
	 	$scope.replayPlayPause ={"slot_num" : slot_num, "noDataVal": noDataVal};
	    // $scope.play = false;
	    if(noDataVal!=0){
	    	if(slot_num==1){			
	    		historyApiCall(getTimestamp(0,0,0),getTimestamp(5,59,59));
	    	}
	    	else if(slot_num==2){			
	    		historyApiCall(getTimestamp(6,0,0),getTimestamp(11,59,59));
	    	}
	    	else if(slot_num==3){			
	    		historyApiCall(getTimestamp(12,0,0),getTimestamp(17,59,59));
	    	}
	    	else if(slot_num==4){			
	    		historyApiCall(getTimestamp(18,0,0),getTimestamp(23,59,59));
	    	}
	    }
	    else{swal("Kindly check for available slot(s)");}
	};
	function getTimestamp(hr,mins,sec){
		var trvelRouteHstTime=document.getElementById('GtrvelRouteHstTime').value;
		var selectDateTS=startDate(trvelRouteHstTime);
		var timeStamp=new Date(selectDateTS);
		timeStamp.setHours(hr);
		timeStamp.setMinutes(mins); 
		timeStamp.setSeconds(sec);
		return timeStamp.getTime();
		/*
		 * var d=new Date($scope.myDate); d.setHours(hr);
		 * d.setMinutes(mins); d.setSeconds(sec); return d.getTime();
		 */
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
			$scope.httpLoading=true;
		// $("#loading_icon").show();
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
			// console.log(JSON.stringify(data.values));
			if($scope.histData.values.length>=1){
				$scope.httpLoading=false;
				displayHistory();	
				eve_hist($scope.deviceHistoryjson);			
			}
			else{
				$scope.httpLoading=false;
				// $("#loading_icon").hide();
				$scope.yoData=false;
				// $scope.noData=true;
				swal("Kindly check for available slot(s)");
				$scope.activeMenu=5;
			}
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
// console.log(data);
// console.log(status);
// console.log(headers);
// console.log(config);
}).finally(function(){		
	$scope.httpLoading=false;
});
}
function checkMaploaded(){
	console.log($scope.historyMap);
	if($scope.historyMap){
		$interval.cancel(maploadedInterval);		
	}
	else{			
	}
}
	/**
	 * 1) Plot on Map History Path 2) Display on Table
	 * -----------------------------------------------------------------------
	 */




	 function eve_hist(data) {

	 	var infowindow = new google.maps.InfoWindow({
	 		size: new google.maps.Size(150,50)
	 	});

	 	
//var marker4 = [];

//clearMap();
  // console.log(marker);
  
  //     if (eventmarker[0]) { 
  //             console.log(eventmarker);
  //                for(i in eventmarker){
  //              console.log(eventmarker);
  //              eventmarker[i].setMap(null);
  //              }
  //              }
  //     eventmarker = [];


  console.log(data);
  $scope.alarmHistData = {}
  $scope.alarmHistData = data;
  $http({
  	method: 'POST',
  	url: apiURL+'device/alarmhistory',
  	data: JSON.stringify($scope.alarmHistData),
  	headers : {
  		'Content-Type' : 'application/json'
  	}

  }).success(function(data){
  	console.log(data);
  	console.log(data.values.length);

  	


  	if(data.values.length>0){
  		for (var i = 0; i <data.values.length;i++){
  			var evelist = new Array();
  			

  			var latE = Number(data.values[i].lat);
  			var longE = Number(data.values[i].long);
  			$scope.alarm_type =data.values[i].alarm_type;
        //console.log($scope.latE,$scope.longE,$scope.alarm_type);
        evelist.push($scope.alarm_type);
        console.log(evelist);
        
        var marker = new google.maps.Marker({
        	position: {lat: latE, lng: longE},
        	map: map,
        	icon: {
        		path: google.maps.SymbolPath.CIRCLE,
        		scale: 10,
        		strokeColor: '#393'
        	}
        });



        google.maps.event.addListener(marker,'click', (function(marker, i){
        	return function(){
          // console.log("value of: ");
          var elist = new Array();
          for(j=0;j< data.values.length;j++){
          	console.log(data.values[j].alarm_type);
          	checkEventFilter(data.values[j].alarm_type);
          	elist.push($scope.eventValue); 
          }

          console.log(_.uniq(elist));

          contentString  = '<b><label>Event type:</label></b> '+_.uniq(elist)+'</n><br><br> ';
          console.log(elist);

          infowindow.setContent(contentString);
          infowindow.open(map, marker);

      }
  }) (marker, i));

    }
}
else
{
      //nothing;

      
// console.log(marker4);
//     if (marker4[0]) { 
//           console.log(marker4);
//              for(i in marker4){
//            console.log(marker4);
//            marker4[i].setMap(null);
//            }
//            }
//          marker4 = [];



}

})
  .error(function(data,status,headers,config){
  	console.log(data,status,headers,config);
  });

}


function checkEventFilter(type){
	console.log(type);
	console.log("inside checkfilter: "+type);
	var eventType;
	switch(type){
		case 0:
		eventType = 'Panic';
		break;
		case 1:
		eventType = 'Tamper Sim';
		break;
		case 2:
		eventType = 'Tamper Top';
		break;
		case 3:
		eventType = 'Battery Low';
		break;
		case 4:
		eventType = 'Overspeed';
		break;
		case 5:
		eventType = 'Geofence';
		break;
		case 6:
		eventType = 'Sanity alarm';
		break;
		case 7:
		eventType = 'Connection to tracker interrupted';
		break;
		case 8:
		eventType = 'Vehicle Moved / Theft';
		break;
		case 9:
		eventType = 'Tracker sim changed';
		break;
		case 10:
		eventType = 'Warning';
		break;
	}
	$scope.eventValue = eventType;
// console.log("scope value: "+$scope.eventValue);
}














function displayHistory() {
	console.log("display history")
		// console.log(JSON.stringify($scope.histData.values));
		
		$scope.yoData=true;
		$scope.noData=false;
		var lat_tot = 0, lg_tot = 0, lat_avg = 0, lg_avg = 0;
		var histData = $scope.histData.values;
		histData=histData.sort(SortByts);
		var hist_len = histData.length;
		var polyPathArray = [];
		$scope.plottedData=[];
		var coordinates = [];		
		
		for(var inc = 0; inc < hist_len; inc++){
			executeHisory(histData[inc].lat,histData[inc].long,histData[inc].Velocity,histData[inc].ts, 
				function(historyStatus){
                // console.log(JSON.stringify(historyStatus));
                var arr = {};
                var plottedObj={};
                arr.lat = Number(historyStatus.latitude);
                arr.lng = Number(historyStatus.longitude);
                plottedObj.lat = Number(historyStatus.latitude);
                plottedObj.long = Number(historyStatus.longitude);
                plottedObj.Velocity = historyStatus.velocity;
                plottedObj.ts = historyStatus.timestamp;
                polyPathArray.push(arr);
                $scope.plottedData.push(plottedObj);
                lat_tot += Number(historyStatus.latitude);
                lg_tot += Number(historyStatus.longitude);
            });
			
		}
		if($scope.plottedData.length <= 1){
			swal({title:"Stationary Vehicle"});
		}
		else{
			// nothing
		}
		function executeHisory(latitude,longitude,velocity,timestamp,mapHistory){
			// if(velocity>5){
				var historyStatus={"latitude":latitude,"longitude":longitude,"velocity":velocity,"timestamp":timestamp};
				mapHistory(historyStatus);
			// }
			// else{
				// console.log("less than 5");
			// }
		}
		// console.log(JSON.stringify(obj));
		/* console.log(JSON.stringify($scope.plottedData)); */
		// console.log(JSON.stringify(coordinates));
		
		if(polyPathArray.length == 0){
			// console.log("chk");
			$scope.yoData=false;
			// swal("No not available. Kindly check for another
			// date");
		}
		else{
			clearMap();
// console.log(JSON.stringify(polyPathArray));

if (stmarkers[0]) { 
	console.log(stmarkers);
	for(i in stmarkers){
		console.log(stmarkers);
		stmarkers[i].setMap(null);
	}
}
stmarkers = [];

if (endmarkers[0]) { 
	console.log(endmarkers);
	for(i in endmarkers){
		console.log(endmarkers);
		endmarkers[i].setMap(null);
	}
}
endmarkers = [];
bounds = new google.maps.LatLngBounds();
var pts=[];
var length = 0;
var point = null;

var icon2;
var icon1;

var myLatLng = {"lat":polyPathArray[0].lat,"lng":polyPathArray[0].lng};
icon1 = {
	url: '../images/menu/startFlag.png',
        	    scaledSize: new google.maps.Size(38, 38), // scaled size
        	};

        	var  marker1 = new google.maps.Marker({
        		position: myLatLng,
        		map: map,
        		icon: icon1,
        		scale:0.1
        	});
        	
        	stmarkers.push(marker1);
        	console.log(stmarkers);

            // console.log("zoom level: "+map.getZoom());

            icon2 = {
                    url: '../images/menu/finishFlag.png', // url
                    scaledSize: new google.maps.Size(38, 38), // scaled size
                };
            // console.log("zoom level4: "+map.getZoom());

            var myLatLng = {"lat":polyPathArray[polyPathArray.length-1].lat,"lng":polyPathArray[polyPathArray.length-1].lng};
            var  marker2 = new google.maps.Marker({
            	position: myLatLng,
            	map: map,
            	icon: icon2
            });
            endmarkers.push(marker2);
            console.log(endmarkers);
            
            
            
            
            
            for(var i=0;i<polyPathArray.length;i++){
            	pts[i]=new google.maps.LatLng(polyPathArray[i].lat,polyPathArray[i].lng)
            	if(i>0){
            		length += pts[i-1].distanceFrom(pts[i]);
            		if (isNaN(length)) { alert("["+i+"] length="+length+" segment="+pts[i-1].distanceFrom(pts[i])) };
            	}
            	bounds.extend(pts[i]);
            	point = pts[parseInt(i/2)];
            }
            poly = new google.maps.Polyline({
            	map:map,
            	path: pts,
            	strokeColor: '#97dcc9',
            	strokeWeight: 5
            });
            map.setZoom(16);
            map.fitBounds(bounds);
            startAnimation();  	    
        }
    }
    function clearMap(){
    	poly.setMap(null);
    	poly2.setMap(null);
    }
    function startAnimation() {   	 
    	console.log("start animation");
    	if (timerHandle) clearInterval(timerHandle);
    	eol=poly.Distance();
    	map.setCenter(poly.getPath().getAt(0));
         // map.addOverlay(new
	    // google.maps.Marker(polyline.getAt(0),G_START_ICON));
         // map.addOverlay(new
	    // GMarker(polyline.getVertex(polyline.getVertexCount()-1),G_END_ICON));
         /*
	     * if (marker) { marker.setMap(null); delete marker; marker = null; }
	     * if (!marker) marker = new
	     * google.maps.Marker({position:poly.getPath().getAt(0),
	     * map:map,icon:icon});
	     */
	     
	     console.log($scope.headings);
	     
	     if (marker[0]) {
	     	for(i in marker){marker[i].setMap(null);}
	     }
          //marker = [];
          /*for(i in svg){
        	  marker[i] = new google.maps.Marker({
        		position: poly.getPath().getAt(0),
        		map: map,
        		icon: icons[i]
        	  });
        	  
        	}*/
        	for(i in svg){
        		marker[i] = new google.maps.Marker({
        			position: poly.getPath().getAt(0),
        			map: map,
        			icon: {
        				path : svg[i].path, fillColor : svg[i].fillColor, 
        				scale: .7, 
        				strokeColor: 'white', 
        				strokeWeight: .10, 
        				fillOpacity: 1, 
        				offset: '5%',
        				rotation: Number($scope.headings),
        				anchor: new google.maps.Point(10, 25)
        			}
        		});
        		
        	}
        	console.log($scope.headings); 
         // map.addOverlay(marker);
         poly2 = new google.maps.Polyline({path: [poly.getPath().getAt(0)], strokeColor:"#0000FF",strokeOpacity: 0.00001, strokeWeight:0});
         // map.addOverlay(poly2);
         // setTimeout("animate(50)",2000); // Allow time for the initial map
	    // display
	    setTimeout(function() {
	    	$scope.animate(50);
	    }, 2000);
	}
	function updatePoly(d) {
		console.log("update");
		for(i in svg){icons[i].rotation = $scope.headings;}
	        // Spawn a new polyline every 20 vertices, because updating a
		// 100-vertex poly is too slow
		if (poly2.getPath().getLength() > 20) {
			poly2= new google.maps.Polyline([poly.getPath().getAt(lastVertex - 1)]);
			/* console.log(poly.getPath().getAt(lastVertex - 1).lat); */
	          // map.addOverlay(poly2)
	          //poly2.setMap(map);
	          poly2.setMap(null);
	      }

	      if (poly.GetIndexAtDistance(d) < lastVertex+2) {
	      	if (poly2.getPath().getLength()>1) {
	      		poly2.getPath().removeAt(poly2.getPath().getLength() - 1);
	      	}
	      	/* poly2.insertVertex(poly2.getVertexCount(),poly.GetPointAtDistance(d)); */
	      	poly2.getPath().insertAt(poly2.getPath().getLength(), poly.GetPointAtDistance(d));
	      } else {
	      	/* poly2.insertVertex(poly2.getPath().getLength(),poly.getVertex(lastVertex++)); */         
	      	poly2.getPath().insertAt(poly2.getPath().getLength(), poly.getPath().getAt(lastVertex++));
	      }
	  }
	  $scope.animate = function(d) {
	     // console.log($scope.headings);
	     // console.log("animate");
	     if (d>eol) {	
	     	$scope.end = true;
	     	for(i in svg){icons[i].rotation = $scope.headings;}
	     		console.log("end"); 
	     	console.log($scope.headings);
	     	return;
	     }
	     var p = poly.GetPointAtDistance(d);
	      // if (k++>=180/step) {
	      	map.panTo(p);
	        /*
		 * k=0; }
		 */ 
	       /*
		 * var lastPosn = marker.getPosition(); marker.setPosition(p);
		 * var heading =
		 * google.maps.geometry.spherical.computeHeading(lastPosn, p);
		 * icon.rotation = heading; marker.setIcon(icon);
		 */
	        // console.log($scope.headings);
	        // console.log($scope.play);
	        if($scope.play == false){
	        	var lastPosn = marker[0].getPosition();
	        	console.log("p value: "+p);
	        	var newLatLong = p.toString().replace('(', '');
	        	newLatLong = newLatLong.toString().replace(')', '');
	        	var inputLatLong = newLatLong.split(",",2);
	        	for(i in svg){marker[i].setPosition(new google.maps.LatLng(parseFloat(inputLatLong[0]), parseFloat(inputLatLong[1])));}
	        		for(i in svg){icons[i].rotation = $scope.headings;}
	        			heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
	        		$scope.headings = heading;
	        //   console.log($scope.headings);
	        for(i in svg){icons[i].rotation = $scope.headings;}
	        	
	        	for(i in svg){
	        		marker[i].setIcon(icons[i]);
	        	}
	        	for(i in svg){icons[i].rotation = $scope.headings;}
	          /*console.log($scope.headings);
	        updatePoly(d);
	        
	        // timerHandle = setTimeout("animate("+(d+step)+")", tick);
	        timerHandle = setTimeout(function() {
	            $scope.animate(d + step);
	        }, tick);*/


	    }
	    else if ($scope.play == true){
	        	/*var lastPosn = marker[0].getPosition();
	       		for(i in svg){marker[i].setPosition(p);}
	          for(i in svg){icons[i].rotation = $scope.headings;}
	          heading = google.maps.geometry.spherical.computeHeading(lastPosn, p);
	          $scope.headings = heading;
	          console.log($scope.headings);*/
	          for(i in svg){icons[i].rotation = $scope.headings;}
	          	
	          	for(i in svg){
	          		marker[i].setIcon(icons[i]);
	          	}
	          	for(i in svg){icons[i].rotation = $scope.headings;}
	          		

	        	//nothing
	    }
	        // console.log($scope.headings);
	        // console.log(d);
	        // console.log(step);
	        
	        updatePoly(d);
	        // timerHandle = setTimeout("animate("+(d+step)+")", tick);
	        timerHandle = setTimeout(function() {
	        	$scope.animate(d + step);
	        }, tick);


	    }
	 // ----------------------------------------------------------------------------
		// =============== ~animation funcitons =====================
		/***************************************************************
		 * *******************************************************************\ *
		 * epolys.js by Mike Williams * updated to API v3 by Larry Ross * *
		 * A Google Maps API Extension * * Adds various Methods to
		 * google.maps.Polygon and google.maps.Polyline * *
		 * .Contains(latlng) returns true is the poly contains the
		 * specified * GLatLng * * .Area() returns the approximate area
		 * of a poly that is * not self-intersecting * * .Distance()
		 * returns the length of the poly path * * .Bounds() returns a
		 * GLatLngBounds that bounds the poly * * .GetPointAtDistance()
		 * returns a GLatLng at the specified distance * along the path. *
		 * The distance is specified in metres * Reurns null if the path
		 * is shorter than that * * .GetPointsAtDistance() returns an
		 * array of GLatLngs at the * specified interval along the path. *
		 * The distance is specified in metres * * .GetIndexAtDistance()
		 * returns the vertex number at the specified * distance along
		 * the path. * The distance is specified in metres * Returns
		 * null if the path is shorter than that * * .Bearing(v1?,v2?)
		 * returns the bearing between two vertices * if v1 is null,
		 * returns bearing from first to last * if v2 is null, returns
		 * bearing from v1 to next * * *
		 * ********************************************************************** *
		 * This Javascript is provided by Mike Williams * Blackpool
		 * Community Church Javascript Team *
		 * http://www.blackpoolchurch.org/ * http://econym.org.uk/gmap/ * *
		 * This work is licenced under a Creative Commons Licence *
		 * http://creativecommons.org/licenses/by/2.0/uk/ * *
		 * ********************************************************************** *
		 * Version 1.1 6-Jun-2007 * Version 1.2 1-Jul-2007 - fix: Bounds
		 * was omitting vertex zero * add: Bearing * Version 1.3
		 * 28-Nov-2008 add: GetPointsAtDistance() * Version 1.4
		 * 12-Jan-2009 fix: GetPointsAtDistance() * Version 3.0
		 * 11-Aug-2010 update to v3 * * \
		 **************************************************************/

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

		// === A method which returns a GLatLng of a point a given
		// distance along
		// the path ===
		// === Returns null if the path is shorter than the specified
		// distance ===
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

		// === A method which returns an array of GLatLngs of points a
		// given
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

		// === A method which returns the Vertex number at a given
		// distance along
		// the path ===
		// === Returns null if the path is shorter than the specified
		// distance ===
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
		 * -----------------------------------------the end for vehicle
		 * icon
		 * movement---------------------------------------------------------------
		 * 
		 */
		 function SortByts(x,y) {
		// console.log(x);
		// console.log(y);
		return ((x.ts == y.ts) ? 0 : ((x.ts > y.ts) ? 1 : -1 ));
	}
	$(document).ready(function() {
		$.getScript('../assets/select_filter/select2.min.js', function() {
			$("#selectGroup").select2({});
			$("#selectDevice").select2({});
			$('#clearTextGroup span.select2-chosen').text("- - Select Group - -");
			$('#clearTextDevice span.select2-chosen').text("- - Select Vehicle No/Device - -");
		});// script
	});
	/**
	 * get Date formatted date based on TIMESTAMP
	 * -----------------------------------------------------------------------
	 */
	 $scope.showTime = function(ts) {
	 	var d = new Date(Number(ts));	 	
	 	var hours = d.getHours();
	 	var minutes = d.getMinutes();
	 	var ampm = hours >= 12 ? 'pm' : 'am';
	 	hours = hours % 12;
	 	  hours = hours ? hours : 12; // the hour '0' should be '12'
	 	  minutes = minutes < 10 ? '0'+minutes : minutes;
	 	  var strTime = hours + ':' + minutes + ' ' + ampm;
	 	  return strTime;
	 	};
	 	
	 	
	 	$scope.givelt=function(lt,lg){
		// alert("success");
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lt,lg);
		geocoder.geocode({       
			latLng: latLng     
		}, 
		function(responses) 
		{     
			if (responses && responses.length > 0) 
			{        
				swal(responses[0].formatted_address);     
			} 
			else 
			{       
				swal('Not getting Any address for given latitude and longitude.');     
			}   
		}
		);
	}
	$(".spdCtrl").click(function() {
		$(".spdCtrl").removeClass("activeCtrl");
		// $(".tab").addClass("active"); // instead of this do the below
		$(this).addClass("activeCtrl");
	});
	
});