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
	this.getTsOverTime=function(time_val){
		var s_split = time_val.split(':');		
		var hr= s_split[0];
		console.log(hr);
		var s_apmsplit = s_split[1].split(' ');
		var mi = s_apmsplit[0];
		var meri = s_apmsplit[1];
		return this.getTimestamp(new Date(),hr,mi,0,meri);
		/*var todays =travelDeskService.getTimestamp(new Date(),hr,mi,0,meri);*/
	};
	this.getTimestamp=function (dt,hr,mins,sec,meridian){
		console.log(hr+mins+sec+meridian);
		var d=new Date(dt);
		if(meridian=="PM"){
			hr=Number(hr)+12;
		}
		d.setHours(hr);
		console.log(d.getHours());
		d.setMinutes(mins);
		d.setSeconds(sec);
		console.log(d.getTime());
		return d.getTime();
	};
	this.getTimestampSec= function(hr,mins,sec){
		var d = new Date($scope,mytime);
		
	}
});

