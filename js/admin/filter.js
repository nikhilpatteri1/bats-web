/**
 * Filter Details
 * 1)Onselect of options from Dropdown Filter the Grid Details
 * 2)Filter Unique values and show in the dropdown*/ 
 
batsAdminHome.filter('filterMultiple',['$filter',function ($filter) {
	return function (items, keyObj) {
		var filterObj = {
							data:items,
							filteredData:[],
							applyFilter : function(obj,key){
								var fData = [];
								if(this.filteredData.length == 0)
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
}]);



batsAdminHome.filter('unique', function() {
		  return function(input, key) {
			  //console.log(input);
		      var unique = {};
		      var uniqueList = [];
		      for(var i = 0; i < input.length; i++){
		          if(typeof unique[input[i][key]] == "undefined"){
		              unique[input[i][key]] = "";
		              uniqueList.push(input[i]);
		          }
		      }
		      return uniqueList;
		  };
});


    