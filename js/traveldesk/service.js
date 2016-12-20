batstravelDeskHome.service('travelDeskService', function() {
	this.showTime = function(ts) {
		var d = new Date(Number(ts));
		var hours = d.getHours();
		var minutes = d.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	};
	this.convertAddress = function(latlng,cb){
		/*console.log("entered the convertAddress");*/
		var geocoder = new google.maps.Geocoder();
		//var latLng = new google.maps.LatLng(latlng);
		geocoder.geocode({
			latLng: latlng
		},
		function(responses){
			//console.log(responses);
			if(responses && responses.length > 0){
				//console.log(responses[0].formatted_address);
				responses[0].formatted_address;
				cb(responses[0].formatted_address);
			}
			else{
				cb("no address");
			}
		}
		)
	};
	this.getTimestamp=function (dt,hr,mins,sec,meridian){		
		var d=new Date(dt);
		if(meridian=="PM"){
			hr=hr+12;
		}
		d.setHours(hr);
		d.setMinutes(mins);
		d.setSeconds(sec);
		return d.getTime();
	};
	this.getTimestampSec= function(hr,mins,sec){
		var d = new Date($scope,mytime);
		
	}
});

