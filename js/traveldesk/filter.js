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