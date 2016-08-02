//=====================filter multiple select dropdown=======================
batsfactoryhome.filter('filterMultiple',['$filter',function ($filter) {
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