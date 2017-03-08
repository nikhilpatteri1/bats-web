commonApp.service('commonAppService',function(commonFactory,$localStorage){
	/**
	 * 
	 * 
	 *  ------------------------------------------- Common functionality ----------------------------------------------*/
	this.getPercentage = function (a,b) {
	    return ((b * 100) / a).toFixed(2);
	}
	this.donutChart=function(chartID,arrayOfData){
		console.log(chartID);
		$(function() {
	        var chart = new Highcharts.Chart({
	            chart: {
	                renderTo: chartID,
	                type: 'pie',
	                height: 222,
	                width:250,
	                
	            },
	            title: {
	                text: ''
	            },

	            plotOptions: {
	                pie: {
	                    borderColor: '#fff',
	                    innerSize: '70%',
	                    /*borderColor: '#000000'*/
	                }
	            },
	            series: [{
	                data:arrayOfData 
	                	/*[
	                       {name: 03,y: 30, color: '#b3b3b3'},
	                       {name: 02,y: 10, color: '#e54a4e'},
	                       {name: 07,y: 60, color: '#008cdc' },          
	                      ]*/
	                    }],
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
	}
	
	/**
	 * ----------------------------------------------End of Common Functionality---------------------------------------------*/
	/**
	 * ----------------------------------------------TRACKER---------------------------------------------*/
	this.tracker = function(cb){
		var getTrackerJson = {};
		getTrackerJson.token = $localStorage.data;
		console.log(JSON.stringify(getTrackerJson));
		commonFactory.callApi("POST",apiURL+"dashboard/trackers",getTrackerJson,function(result){
			console.log(result);
			cb(result)
		});
	}
	
	this.trackerList =function(sta,TC){
		console.log(sta);
		var getTrackerListJson = {};
		getTrackerListJson.token = $localStorage.data;
		getTrackerListJson.status = sta.toString();;
		console.log(JSON.stringify(getTrackerListJson));
		commonFactory.callApi("POST",apiURL+"dashboard/tracker/devices",getTrackerListJson,function(result){
			console.log(result);
			TC(result);
			
		})
	}
	
	/*this.plotValues = function(){
		var getDeviceCountJson={};
		getDeviceCountJson.token=$localStorage.data;
		getDeviceCountJson.status="0";
		console.log(JSON.stringify(getDeviceCountJson));
		commonFactory.callApi("POST",apiURL+"dashboard/tracker/devices",getDeviceCountJson,function(result){
		      console.log(result);		      
		});
		return 0;
	}*/
	
	/**
	 * ----------------------------------------------TRACKER END---------------------------------------------*/
	
	/**
	 * -----------------------------------------------Trip Service-------------------------------------------------------*/

	this.initMap =function() {
		var map;
          map = new google.maps.Map(document.getElementById('TripMap'), {
        	  zoom : 14,
  			center : {
  				lat : 12.849857,
  				lng : 77.658968
  			}
          });
          
	}	
	this.getTripData=function(cb){
		var getTripDataJson={};
		getTripDataJson.token=$localStorage.data;
		commonFactory.callApi("POST",apiURL+"dashboard/trips",getTripDataJson,function(result){			
			cb(result);
		});
	}
	this.plotVehicleMarker=function(vehicleData){
		 var carIcon ="M25.762,8.510 L20.921,2.204 C20.921,2.204 25.252,2.647 25.885,8.065 C26.517,13.483 25.762,8.510 25.762,8.510 ZM15.160,2.706 C12.355,2.772 10.092,2.853 10.085,2.450 C10.076,2.165 12.353,1.834 15.164,1.816 C17.968,1.902 20.240,2.220 20.248,2.466 C20.253,2.846 17.967,2.761 15.160,2.706 ZM4.815,8.074 C5.443,2.668 9.749,2.226 9.749,2.226 L4.937,8.518 C4.937,8.518 4.187,13.481 4.815,8.074 ZM5.000,47.349 L4.562,21.574 C4.562,21.574 9.613,34.691 5.000,47.349 ZM18.688,30.281 L11.875,30.281 L11.875,27.781 L18.688,27.781 L18.688,30.281 ZM7.721,44.433 C7.885,44.231 8.225,44.075 8.463,44.081 C12.577,44.174 17.922,44.176 21.827,44.145 C21.842,44.145 21.860,44.151 21.875,44.152 L22.632,26.355 C22.585,26.368 22.537,26.385 22.495,26.383 C18.058,26.218 12.293,26.214 8.082,26.268 C8.038,26.269 7.987,26.251 7.938,26.235 L8.688,44.076 L8.565,44.081 L7.813,26.219 L7.873,26.217 C7.663,26.123 7.433,25.909 7.299,25.650 C6.246,23.582 5.784,21.256 5.737,19.294 C5.700,18.027 6.392,17.124 7.323,16.364 C8.266,15.625 9.448,15.028 10.664,14.841 C13.663,14.447 16.725,14.440 19.798,14.794 C22.228,15.233 24.825,17.000 24.814,19.411 C24.761,21.376 24.325,23.625 23.296,25.754 C23.156,26.038 22.901,26.265 22.673,26.346 L22.757,26.350 L22.000,44.169 C22.199,44.218 22.424,44.341 22.553,44.491 C23.529,45.647 23.957,46.947 24.001,48.043 C24.035,48.752 23.394,49.256 22.531,49.681 C21.656,50.094 20.560,50.428 19.432,50.532 C16.652,50.752 13.813,50.756 10.964,50.558 C8.711,50.313 6.303,49.325 6.313,47.978 C6.362,46.880 6.766,45.623 7.721,44.433 ZM25.937,21.591 L25.500,47.392 C20.891,34.722 25.937,21.591 25.937,21.591 Z";
		 var markers=[];
		 var icon = {
			    path: carIcon,
			    scale: .7,
			    strokeColor: 'white',
			    strokeWeight: 0,
			    fillOpacity: 1,
			    fillColor: '#000000',
			    offset: '5%',
			    anchor: new google.maps.Point(10, 25) 
			};
		var map
		 map = new google.maps.Map(document.getElementById('TripMap'), {
      	  zoom : 14,
			center : {
				lat : 12.849857,
				lng : 77.658968
			}
        });
        
		var infoWindow = new google.maps.InfoWindow(),marker;
		var bounds = new google.maps.LatLngBounds();
		function createMarker(tripID,lt,lg,vel,vol,ts){
			var contentString; 
				marker = new google.maps.Marker({
		        position: new google.maps.LatLng(lt,lg),
		        map: map,
		        title: tripID, 
		        icon:icon,       
		        zIndex: Math.round(lt*-100000)<<5
		        });
		        marker.myname = tripID;
		        markers.push(marker);
		        contentString="'<b><label>Trip ID:</label> '"+tripID+"'</b><br><br><b><label>Speed:</label>'"+vel+"'KmpH</b>'";
		       google.maps.event.addListener(marker,'click',( function(marker) { 
		    	   return function(){
		    		   infoWindow.setContent(contentString); 
			    	   infoWindow.open(map,marker);
		    	   }		    	   		       
		       })(marker));	
		}
		
		var data_len=vehicleData.length;
		for(var i=0;i<data_len;i++){			
			createMarker(vehicleData[i].trip_id,vehicleData[i].values.lat,vehicleData[i].values.long,vehicleData[i].values.Velocity,vehicleData[i].values.Vol,vehicleData[i].values.ts);
			var myLatLng = new google.maps.LatLng(vehicleData[i].values.lat,vehicleData[i].values.long);
			bounds.extend(myLatLng);
		}
		map.setCenter(bounds.getCenter());
		//map.fitBounds(bounds);
	}
	this.getTripsByStatus=function(statusParam,cb){
		var getTripsByStatusJson={};
		getTripsByStatusJson.token=$localStorage.data;
		getTripsByStatusJson.status=statusParam;
		commonFactory.callApi("POST",apiURL+"dashboard/trips_wrt_status",getTripsByStatusJson,function(result){			
			cb(result);
		});
	}
	/**
	 * -----------------------------------------------End of Trip Service-------------------------------------------------------*/
	/**
	 * -----------------------------------------------Driver Service---------------------------------------------------------*/
	this.getDriversData=function(cb){
		var driversDataJson={};
		driversDataJson.token=$localStorage.data;
		commonFactory.callApi("POST",apiURL+"dashboard/drivers",driversDataJson,function(result){			
			cb(result);
		});
	}
	/**
	 * -----------------------------------------------End of Driver Service-------------------------------------------------------*/
	
	/**
	 * -----------------------------------------------Vehicle Service---------------------------------------------------------*/
	this.getVehicleData=function(cb){
		var getVehicleDataJson={};
		getVehicleDataJson.token=$localStorage.data;
		commonFactory.callApi("POST",apiURL+"dashboard/vehicles",getVehicleDataJson,function(result){			
			cb(result);
		});
	}
	this.getVehiclesByStatus=function(statusParam,cb){
		var getVehiclesByStatusJson={};
		getVehiclesByStatusJson.token=$localStorage.data;
		getVehiclesByStatusJson.status=statusParam;
		commonFactory.callApi("POST",apiURL+"dashboard/vehicles_wrt_status",getVehiclesByStatusJson,function(result){			
			cb(result);
		});
	}
	/**
	 * -----------------------------------------------End of Vehicle Service-------------------------------------------------------*/
});