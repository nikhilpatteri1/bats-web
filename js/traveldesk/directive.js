//validate password
batstravelDeskHome.directive('passwordValidate', function() {
	    return {
	        require: 'ngModel',
	        link: function(scope, elm, attrs, ctrl) {
	            ctrl.$parsers.unshift(function(viewValue) {

	                scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
	                scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
	                scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

	                if(scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
	                    ctrl.$setValidity('pwd', true);
	                    return viewValue;
	                } else {
	                    ctrl.$setValidity('pwd', false);                    
	                    return undefined;
	                }

	            });
	        }
	    };
	});
batstravelDeskHome.directive('repasswordValidate', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {

                scope.repwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
                scope.repwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                scope.repwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;               
           

                if(scope.repwdValidLength && scope.repwdHasLetter && scope.repwdHasNumber) {
                    ctrl.$setValidity('pwd', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('pwd', false);                    
                    return undefined;
                }
               

            });
        }
    };
});

batstravelDeskHome.directive("scroll", function () {
    return function(scope, element, attrs) {
    	var myDiv=document.getElementsByClassName('maintainScroll');
        angular.element(myDiv).bind("scroll", function() {
        	var myHeadDiv=document.getElementsByClassName("driverHistoryHeadList");
        	if(myDiv[0].scrollHeight-myDiv[0].scrollTop===myDiv[0].clientHeight){
        		myHeadDiv[0].style.border="none";
    		}else{
    			myHeadDiv[0].style.borderBottom ="1px solid #ccd";
    		}
        });
    };
});

batstravelDeskHome.directive('reverseGeocode', function () {
    return {
        restrict: 'E',
        template: '<div></div>',
        link: function (scope, element, attrs) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        element.text(results[1].formatted_address);
                    } else {
                        element.text('Location not found');
                    }
                } else {
                    element.text('Geocoder failed due to: ' + status);
                }
            });
        },
        replace: true
    }
});
//validate numbers only
batstravelDeskHome.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                	//console.log(text);
                    var transformedInput = text.replace(/[^0-9]/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();                    
                    }
                    
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});


batstravelDeskHome.directive('sameAs', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	      ctrl.$parsers.unshift(function(viewValue) {
	        if (viewValue === scope[attrs.sameAs]) {
	        	console.log(viewValue+"==="+scope[attrs.sameAs]);
	        	scope.isMismatch=false;
	          ctrl.$setValidity('sameAs', true);
	          return viewValue;
	        } else {
	        	console.log(viewValue+"==="+scope[attrs.sameAs]);
	        	scope.isMismatch=true;
	          ctrl.$setValidity('sameAs', false);
	          return undefined;
	        }
	      });
	    }
	  };
	});

//validate numbers only
