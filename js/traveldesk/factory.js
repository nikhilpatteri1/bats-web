batstravelDeskHome.factory('travelDeskFactory', function($http,$localStorage) {
	// console.log("entered the factory");
	return {
		callApi : function(para1, para2, para3, callback) {
			//console.log(para1,para2,para3);
			return $http({
				method : para1,
				url : para2,
				data : para3,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function(data) {
				callback(data);
				// console.log(data);
			}).error(function(data) {
				callback(data);
				// console.log(data.err);
				if (data.err == "Expired Session") {
					expiredSession();
					$localStorage.$reset();
				} else if (data.err == "Invalid User") {
					invalidUser();
					$localStorage.$reset();
				}
				console.log(status);
				console.log(headers);
				console.log(config);
			});
		}
	};

});
