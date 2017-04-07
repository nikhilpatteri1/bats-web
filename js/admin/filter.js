/**
 * Filter Details 1)Onselect of options from Dropdown Filter the Grid Details
 * 2)Filter Unique values and show in the dropdown
 */

//=====================filter multiple select dropdown=======================
batsAdminHome.filter('filterMultiple',['$filter',function ($filter) {
	return function (items, keyObj) {
		var filterObj = {
							data:items,
							filteredData:[],
							applyFilter : function(obj,key){
								var fData = [];
								if(this.filteredData && this.filteredData.length == 0)
									this.filteredData = this.data;
								if(obj){
									var fObj = {};
									if(angular.isString(obj)){
										fObj[key] = obj;
										fData = fData.concat($filter('filter')(this.filteredData,fObj));
									}else if(angular.isArray(obj)){
										if(obj.length > 0){	
											for(var i=0;i<obj.length;i++){
												if(angular.isString(obj[i])){
													fObj[key] = obj[i];
													fData = fData.concat($filter('filter')(this.filteredData,fObj));	
												}
											}
											
										}										
									}									
									if(fData.length > 0){
										this.filteredData = fData;
									}
								}
							}
				};

		if(keyObj){
			angular.forEach(keyObj,function(obj,key){
				filterObj.applyFilter(obj,key);
			});			
		}
		return filterObj.filteredData;
	}
}]).filter('unique', function() {
	   return function(collection, keyname) {
		      var output = [], 
		          keys = [];

		      angular.forEach(collection, function(item) {
		          var key = item[keyname];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              output.push(item);
		          }
		      });

		      return output;
		   };
		});


/*
 * batsAdminHome.filter('unique', function() { return function(input, key) {
 * //console.log(input); var unique = {}; var uniqueList = []; for(var i = 0; i <
 * input.length; i++){ if(typeof unique[input[i][key]] == "undefined"){
 * unique[input[i][key]] = ""; uniqueList.push(input[i]); } } return uniqueList; };
 * });
 */
batsAdminHome.filter('removeDups', function() {
	return function(data) {
		if (angular.isArray(data)) {
			var result = [];
			var key = {};
			for ( var i = 0; i < data.length; i++) {
				var val = data[i];
				if (angular.isUndefined(key[val])) {
					key[val] = val;
					result.push(val);
				}
			}
			if (result.length > 0) {
				return result;
			}
		}
		return data;
	}
});


//====================== Timestamp to Date Conversion =====================
batsAdminHome.filter('timestampToDate', function () {
    return function (timestamp) {
        var date = new Date(timestamp);
        var dateString = timeStamp_value.toLocaleDateString();
        var timeString = timeStamp_value.toLocaleTimeString();
        var dateObject = dateString +", "+ timeString;
        return dateObject;
    };
});

batsAdminHome.filter('driverFilter', function() {
    return function(driverlist, searchDriver) {
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