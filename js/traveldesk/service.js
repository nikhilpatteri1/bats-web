batstravelDeskHome.service('travelDeskService', function() {
	this.showTime = function(ts) {
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
		var strTime = day+"/"+month+"/"+year+" "+ hours + ':' + minutes + ' ' + ampm;
		// console.log(strTime);
		return strTime;
	};
	this.getDateTime = function(ts) {
		var d = new Date(Number(ts));
		// console.log(d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear());
		var monthVal = d.getMonth() + 1;
		monthVal=monthVal<10 ?'0'+monthVal:monthVal;
		var hours = d.getHours();
		  var minutes = d.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		return d.getDate() + "/" + monthVal + "/"
				+ d.getFullYear() + " "
				+ strTime;
	};
	this.convertAddress = function(latlng,cb){
		/*console.log("entered the convertAddress");*/
		var geocoder = new google.maps.Geocoder();
		//var latLng = new google.maps.LatLng(latlng);
		geocoder.geocode({
			latLng: latlng
		},
		function(responses){
			
			var a = responses[0].address_components;
			delete responses[0].address_components[0];
			
			//console.log(a);
			/*console.log(responses[0].address_components[0]);
			var q= responses[0].address_components.shift();
			var d=responses[0].address_components.splice(0, 1);
			var e= responses[0].address_components.splice(0, 1).formatted_address;
			console.log(responses[0].address_components.splice(0, 1).formatted_address);
			console.log(d);
			console.log(q);*/
			
			if(responses && responses.length > 0){
				
				/*console.log(responses[0].formatted_address);
				
				if(responses[0].address_components[0] = "Unnamed Road"){
					//delete responses[0].address_components[0];
					responses[0].formatted_address;
					cb(responses[0].formatted_address);
				}
				else{
					cb(responses[0].formatted_address);
				}*/
				responses[0].formatted_address;
				// console.log(responses[0].formatted_address);
				cb(responses[0].formatted_address);
			}
			else{
				cb("no address");
			}
		}
		)
	};
	/*this.getTsOverTime=function(time_val){
		var s_split = time_val.split(':');		
		var hr= s_split[0];
		var s_apmsplit = s_split[1].split(' ');
		var mi = s_apmsplit[0];
		var meri = s_apmsplit[1];
		return this.getTimestamp(new Date(),hr,mi,0,meri);
		var todays =travelDeskService.getTimestamp(new Date(),hr,mi,0,meri);
	};
	this.getTimestamp=function (dt,hr,mins,sec,meridian){
		var d=new Date(dt);
		if(meridian=="PM"){
			if(hr == 12){
				hr=12;
			}
			else{
			hr=Number(hr)+12;
			}
		}
		d.setHours(hr);
		d.setMinutes(mins);
		d.setSeconds(sec);
		return d.getTime();
	};
	this.getTimestampSec= function(hr,mins,sec){
		var d = new Date($scope,mytime);
		
	}*/
	
	this.getTsOverTime = function(getStartDateMinMax){
		// console.log(getStartDateMinMax);
		var datetimeVal = getStartDateMinMax;
		var strArra=datetimeVal.split(" ");
		var dateVal=strArra[0];
		var dateArray=dateVal.split("/");
		var timeStr=strArra[1];
		var tsArr=timeStr.split(":");
		var newStDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
		//console.log(newStDate);
		var sts=new Date(newStDate);
		//console.log(sts);
		sts.setDate(dateArray[0]);
		sts.setMonth(dateArray[1]-1);
		if(strArra[2] == "pm"){
			if(tsArr[0] == "12"){
				sts.setHours(tsArr[0]);
				sts.setMinutes(tsArr[1]);
				startTimeStamp = sts.getTime();
				//console.log(startTimeStamp);
				return sts.getTime();
			}
			else{
				sts.setHours(Number(tsArr[0]) + 12);
				sts.setMinutes(tsArr[1]);
				//console.log("if " + sts);
				startTimeStamp = sts.getTime();
				//console.log(startTimeStamp);
				return sts.getTime();
			}
		}
		else{
			if(tsArr[0] == "12"){
				sts.setHours(Number(tsArr[0]) - 12);
				sts.setMinutes(tsArr[1]);
				startTimeStamp = sts.getTime();
				//console.log(startTimeStamp);
				return sts.getTime();
			}
			else{
				sts.setHours(tsArr[0]);
				sts.setMinutes(tsArr[1]);
				//console.log("else " + sts);
				startTimeStamp = sts.getTime();
				//console.log(startTimeStamp);
				return sts.getTime();
				
			}
		}
	}

	this.showStatus=function(status_code){		
		var status;
		switch (status_code){
			case 'S':
			status='Scheduled';			
			break;
			case 'R':
			status='Running';
			break;
			case 'D':
			status='Dropped';
			break;
			case 'F':
			status='Finished';
			break;
			case 'C':
			status='Cancelled';
			break;

		}

		return status;
	}
	
});




