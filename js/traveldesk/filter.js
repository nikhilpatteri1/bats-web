batstravelDeskHome.filter('driverFilter', function() {
    return function(driverlist, searchDriver,ctrl) {
        var searchRegx = new RegExp(searchDriver, "i");       
        var result = [];
        if(typeof driverlist!='undefined'){
        	for (i = 0; i < driverlist.length; i++) {
                if (driverlist[i].name.search(searchRegx) != -1 || 
                		driverlist[i].contact_no.toString().search(searchDriver) != -1) {
                    result.push(driverlist[i]);                    
                }             
                
            }
        }        
        return result;
  }
}); 
batstravelDeskHome.filter('tripFilter', function() {
    return function(triplistObject, searchTrip,ctrl) {
        var searchRegx = new RegExp(searchTrip, "i");       
        var result = [];
        if(typeof triplistObject!='undefined'){
        	for (i = 0; i < triplistObject.length; i++) {
                if (triplistObject[i].driver_name.search(searchRegx) != -1 || triplistObject[i].contact_no.toString().search(searchTrip) != -1 || triplistObject[i].trip_id.search(searchRegx) != -1  || triplistObject[i].vehicle_num.search(searchRegx) != -1 ) {
                    result.push(triplistObject[i]);                    
                }             
                
            }
        }        
        return result;
  }
}); 