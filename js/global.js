//var apiURL="http://10.1.71.194:8030/";
//var apiURL="http://220.227.124.134:8050/";//dev server
//var apiURL="http://220.227.124.134:8040/";//testing server
 
//var apiURL="http://220.227.124.134:8052/";//dev server from 08/08/2016  

//var apiURL="http://220.227.124.134:8058/";//dev server(modified traveldesk user and driver app) from 21/03/2017  

var apiURL="http://220.227.124.134:8042/"; //crown plaza
//var apiURL="http://10.1.71.40:8052/"
var reqTime=5;  
var maxSpeed=10;
//var factoryToken="VQGIO34xB0V3ZSxo";   





/*var factoryToken;
console.log(factoryToken);*/

batsfactoryhome.run(function ($localStorage) {
	factoryToken = $localStorage.data;
    //console.log(factoryToken);
});


//==============Invalid User===============
function invalidUser(){
	//console.log(a);
				swal({ 
					   title: "Un Authorized Access",
				  	   text: "Kindly Login!",   
				  	   type: "warning",   
				  	   confirmButtonColor: "#ff0000",   
				  	   closeOnConfirm: false }, 
				  	   function(){   
				  		 window.location = apiURL;
				  });
}


//==============Session Expire===============
function expiredSession(){
	swal({ 
		   title: "Session Expired",
	  	   text: "Kindly Login!",   
	  	   type: "warning",   
	  	   confirmButtonColor: "#ff0000",   
	  	   closeOnConfirm: false }, 
	  	   function(){ 
	  		 window.location = apiURL;
	  });
}


/**
 * Onclick of close icon in modal
 * 1)reload the page*/ 
$(document).on('click', '.closeIcon', function(){
	//location.reload();
});
$(document).on('click', '.closeIconReload', function(){
	location.reload();
})
$(document).ready(function(){
	$('input').attr('autocomplete','off');
    
});

/**
 * Onload of Page
 * 1)Header Logo Animate*/ 
/*var div = $(".object");
		        div.animate({left: '900px'}, 2000);
		        div.animate({left: '0'}, 2000);
		        div.promise().done(function(){
		        $(".object img").attr('src','../images/car_logo_active.png');
				$('.logo_Title').show();
});*/


/**
 * Onload Browser Back/Front Icon Click & Keyboard Backspace Button Press
 * Hide Bootstrap Modal & stay on same screen
 * Hide select filter*/ 
$(window).on('popstate', function() {
  //alert('Back button was pressed.');
  /*$('.modal').hide();
  $('.modal-backdrop').hide();*/
	if ($('.in').is(':visible')) {
		window.history.forward();
		$('.modal').hide();
		$('.modal-backdrop').hide();
		//alert("yes");
	}
	$(".select2-drop").css("display","none");
}); 

