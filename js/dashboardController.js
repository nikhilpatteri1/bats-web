batsAdminHome.controller('dashboardController', function($scope, $http, $rootScope,$localStorage){
	console.log("dashboard"); 
	$scope.token = $localStorage.data;
	$rootScope.menuPos=14;
	
	
	$scope.tab = 1;
	$scope.setTab = function(newTab){
    	/*google.maps.event.trigger(map, 'resize');*///$scope.tripDetails="";
    	console.log("in setTab");
    	//clearField();
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
    	//$scope.showTripDropDown=false;
    	//$scope.tripDetails="";
    	console.log("in isSetTab");
    	
      return $scope.tab === tabNum;
    }; 
   
    $(function() {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                type: 'pie',
                height: 222,
                width:250
            },
            title: {
                text: ''
            },

            plotOptions: {
                pie: {
                    borderColor: '#fff',
                    innerSize: '70%'
                }
            },
            series: [{
                data: [
                       {name: 03,y: 30, color: '#b3b3b3'},
                       {name: 02,y: 10, color: '#e54a4e'},
                       {name: 07,y: 60, color: '#008cdc' },
           
                   
                    ]}],
                 name: "",
                 size: 15,
                 innerSize: 10,
                 pointPadding: 0,
                 groupPadding: 0 
                 
                 
                 
                   
        },
        // using 
                                         
        function(chart) { // on complete
            
            var xpos = '50%';
            var ypos = '50%';
            var circleradius = 80;
        
        // Render the circle
        chart.renderer.circle(xpos, ypos, circleradius).attr({
            fill: '#fff', 
        }).add();

        // Render the text 
        /*'THIS TEXT <span style="color: red">should be in the center of the donut</span>'*/
       /* chart.renderer.text('', 155, 215).css({
                width: circleradius*2,
                color: '#4572A7',
                fontSize: '16px',
                textAlign: 'center'
          }).attr({
                // why doesn't zIndex get the text in front of the chart?
                zIndex: 999
            }).add();*/
        });
    });
    
});

batsAdminHome.controller('dashboardTripController', function($scope, $http, $rootScope,$localStorage){
	console.log("trip"); 
    $scope.initMap =function() {
    	console.log("map");
    	var map;
          map = new google.maps.Map(document.getElementById('TripMap'), {
        	  zoom : 14,
  			center : {
  				lat : 12.849857,
  				lng : 77.658968
  			}
          });
	}
    $(function() {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'DriverContainer',
                type: 'pie',
                height: 222,
                width:250
            },
            title: {
                text: ''
            },

            plotOptions: { 
                pie: {
                    borderColor: '#fff',
                    innerSize: '70%'
                }
            },
            series: [{
                data: [
                       {name: 07,y: 90, color: '#00af81' },
                       {name: 02,y: 10, color: '#43aae5'},
                       ]}],
                 name: "",
                 size: 15,
                 innerSize: 10,
                 pointPadding: 0,
                 groupPadding: 0 
                 
                 
                 
                   
        },
        // using 
                                         
        function(chart) { // on complete
            
            var xpos = '50%';
            var ypos = '50%';
            var circleradius = 80;
        
        // Render the circle
        chart.renderer.circle(xpos, ypos, circleradius).attr({
            fill: '#fff', 
        }).add();

        // Render the text 
        /*'THIS TEXT <span style="color: red">should be in the center of the donut</span>'*/
        /*chart.renderer.text('', 155, 215).css({
                width: circleradius*2,
                color: '#4572A7',
                fontSize: '16px',
                textAlign: 'center'
          }).attr({
                // why doesn't zIndex get the text in front of the chart?
                zIndex: 999
            }).add();*/
        });
    });
	
});



