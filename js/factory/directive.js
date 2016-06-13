//validate password
batsfactoryhome.directive('passwordValidate', function() {
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
batsfactoryhome.directive('repasswordValidate', function() {
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
reset.directive('passwordValidate', function() {
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
//validate email
batsfactoryhome.directive('validateEmail', function() {
	  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
	  return {
	    link: function(scope, elm) {
	      elm.on("keyup",function(){
	            var isMatchRegex = EMAIL_REGEXP.test(elm.val());
	            if( isMatchRegex&& elm.hasClass('warning') || elm.val() == ''){
	              elm.removeClass('warning');
	            }else if(isMatchRegex == false && !elm.hasClass('warning')){
	              elm.addClass('warning');
	            }
	      });
	    }
	  };
	});
//validate mobile number
var PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;

batsfactoryhome.directive('phone', function() {
    return {
        restrice: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            angular.element(element).bind('blur', function() {
                var value = this.value;
                if(PHONE_REGEXP.test(value)) {
                    // Valid input
                    console.log("valid phone number");
                    angular.element(this).next().next().css('display','none');  
                } else {
                    // Invalid input  
                    console.log("invalid phone number");
                    scope.mobstatus="invalid phone number";
                    angular.element(this).next().next().css('display','block');
                    console.log(angular.element(this).children().find('span'));
                    /* 
                        Looks like at this point ctrl is not available,
                        so I can't user the following method to display the error node:
                        ctrl.$setValidity('currencyField', false); 
                    */                    
                }
            });              
        }            
    };        
});
//validate numbers only
batsfactoryhome.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
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
//match password
batsfactoryhome.directive('sameAs', function() {
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
reset.directive('sameAs', function() {
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

batsfactoryhome.directive('stringToNumber', function() {
	  return {
	    require: 'ngModel',
	    link: function(scope, element, attrs, ngModel) {
	      ngModel.$parsers.push(function(value) {
	        return '' + value;
	      });
	      ngModel.$formatters.push(function(value) {
	        return parseFloat(value, 10);
	      });
	    }
	  };
	});

//====================== Active Menu Highlight for Factory User=====================
batsfactoryhome.directive('trackActive', function($location) {
	function link(scope, element, attrs){
		scope.$watch(function() {
			return $location.path();
		}, function(){
			var links = element.find('a');
			links.removeClass('active');
         angular.forEach(links, function(value){
             var a = angular.element(value);
             if (a.attr('href') ==  $location.path() ){
                 a.addClass('active');
             }
         });
		});
	}
	return {link: link};
});