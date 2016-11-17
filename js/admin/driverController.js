/**
 *  Driver Controller
 *  This Controller involves in the following
 *  a)Driver Creation
 *  b)Driver Updation
 *  c)Driver Listing
 *  d)Driver Removal
 *  and some basic operations like
 *  a)checking token and warning the user to login 
 *  b)age validation
 *  c)image upload
 *  d)on checkbox action (use present address as permanent)
 *  e)date picker
 *  f)language array preparation / language selection and removal based on tag input concept
 *  g)
 */
batsAdminHome.controller('driverController', function($scope, $localStorage, $http) {
	$scope.httpLoading=false;//loading image
	$scope.imageUploading=false;
	$scope.onlyImage=false;
	$scope.onlyFiletype=false;
	$scope.token = $localStorage.data;
	$scope.driver={};//Driver object for getting the form values	
	$scope.driver.confirmAddress=true;	//by default the checkbox is selected for taking present address as permanent address
	$scope.imagepath=""; // image path for the driver 
	/*====================================================>>>>>> Start of Basic function <<<<<=================================================*/
	/*
	 *  check for token availability
	 * */
	if(typeof $scope.token==="undefined"){
		swal({ 
			   title: "Un Authorized Access",
		  	   text: "Kindly Login!",   
		  	   type: "warning",   
		  	   confirmButtonColor: "#ff0000",   
		  	   closeOnConfirm: false }, 
		  	   function(){  
		  		
		  		   $localStorage.$reset();
		  		 wi
		  		 ndow.location = apiURL;
		
		  	   });
	}
	
		 
	/* Use Present Address as permanent address option
	 * show hide the address part on choice
	 * */
	$scope.usePresentAddress=function(choice){
		/* Modal Scroll Top function by animating
		 * Ref link :http://codepen.io/anon/pen/NRoBAq
		 * */
		//if false then user want to enter permanent address
		if(choice==false){
			var sectionOffset = $('#permanentAddr').offset();
			//console.log(sectionOffset);
			$("#driverCreateModal").animate({scrollTop:sectionOffset.top},"slow");
		}
		else{
			var sectionOffset = $('#confirmAddress').offset();			
			$("#driverCreateModal").animate({scrollTop:sectionOffset.top},"slow");	  
		}
		 
	}
	
	/**
	   * Show DateTimePicker onclick in jquery 
	* */	
		$(document).on('click', '#dobPicker', function(){
			var curDate = moment();
			$('#dobPicker').datetimepicker({
		                inline: true,
		                sideBySide: true,
		                ignoreReadonly: true,
		                allowInputToggle: true,
		                showClose : true,
		                defaultDate:curDate,
		                minDate:'1/1/1900',
		                maxDate: 'now',
		                format: 'DD/MM/YYYY'
		            }).on("dp.change",function (e) {
		            	console.log(e.date._i);
		            	$scope.selectedDOB=e.date._i;		
		            	$scope.driver.dob=$scope.selectedDOB;
		            });
			//startDateMinMaxError.style.display = 'none';
		}); 
		/*to validate minor age for driver*/
		$scope.validateAge=function(){
		/*function validateAge(){*/			
			var today = new Date();
    	    var birthDate = new Date($scope.selectedDOB);
    	    var age = today.getFullYear() - birthDate.getFullYear();
    	    var m = today.getMonth() - birthDate.getMonth();
    	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    	    	console.log(age--);
    	    }
    	    if(age<18){
    	    	$scope.minorAge=true;
    	    }
    	    else{
    	    	$scope.minorAge=false;
    	    }
    	    console.log($scope.driver.dob);
		}
		/*
		 *  forming languages array on selection and adding languages drop down
		 * */
		$scope.lang = {"ab":{"name":"Abkhaz","nativeName":"аҧсуа"},"aa":{"name":"Afar","nativeName":"Afaraf"},"af":{"name":"Afrikaans","nativeName":"Afrikaans"},"ak":{"name":"Akan","nativeName":"Akan"},"sq":{"name":"Albanian","nativeName":"Shqip"},"am":{"name":"Amharic","nativeName":"አማርኛ"},"ar":{"name":"Arabic","nativeName":"العربية"},"an":{"name":"Aragonese","nativeName":"Aragonés"},"hy":{"name":"Armenian","nativeName":"Հայերեն"},"as":{"name":"Assamese","nativeName":"অসমীয়া"},"av":{"name":"Avaric","nativeName":"авар мацӀ, магӀарул мацӀ"},"ae":{"name":"Avestan","nativeName":"avesta"},"ay":{"name":"Aymara","nativeName":"aymar aru"},"az":{"name":"Azerbaijani","nativeName":"azərbaycan dili"},"bm":{"name":"Bambara","nativeName":"bamanankan"},"ba":{"name":"Bashkir","nativeName":"башҡорт теле"},"eu":{"name":"Basque","nativeName":"euskara, euskera"},"be":{"name":"Belarusian","nativeName":"Беларуская"},"bn":{"name":"Bengali","nativeName":"বাংলা"},"bh":{"name":"Bihari","nativeName":"भोजपुरी"},"bi":{"name":"Bislama","nativeName":"Bislama"},"bs":{"name":"Bosnian","nativeName":"bosanski jezik"},"br":{"name":"Breton","nativeName":"brezhoneg"},"bg":{"name":"Bulgarian","nativeName":"български език"},"my":{"name":"Burmese","nativeName":"ဗမာစာ"},"ca":{"name":"Catalan; Valencian","nativeName":"Català"},"ch":{"name":"Chamorro","nativeName":"Chamoru"},"ce":{"name":"Chechen","nativeName":"нохчийн мотт"},"ny":{"name":"Chichewa; Chewa; Nyanja","nativeName":"chiCheŵa, chinyanja"},"zh":{"name":"Chinese","nativeName":"中文 (Zhōngwén), 汉语, 漢語"},"cv":{"name":"Chuvash","nativeName":"чӑваш чӗлхи"},"kw":{"name":"Cornish","nativeName":"Kernewek"},"co":{"name":"Corsican","nativeName":"corsu, lingua corsa"},"cr":{"name":"Cree","nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"},"hr":{"name":"Croatian","nativeName":"hrvatski"},"cs":{"name":"Czech","nativeName":"česky, čeština"},"da":{"name":"Danish","nativeName":"dansk"},"dv":{"name":"Divehi; Dhivehi; Maldivian;","nativeName":"ދިވެހި"},"nl":{"name":"Dutch","nativeName":"Nederlands, Vlaams"},"en":{"name":"English","nativeName":"English"},"eo":{"name":"Esperanto","nativeName":"Esperanto"},"et":{"name":"Estonian","nativeName":"eesti, eesti keel"},"ee":{"name":"Ewe","nativeName":"Eʋegbe"},"fo":{"name":"Faroese","nativeName":"føroyskt"},"fj":{"name":"Fijian","nativeName":"vosa Vakaviti"},"fi":{"name":"Finnish","nativeName":"suomi, suomen kieli"},"fr":{"name":"French","nativeName":"français, langue française"},"ff":{"name":"Fula; Fulah; Pulaar; Pular","nativeName":"Fulfulde, Pulaar, Pular"},"gl":{"name":"Galician","nativeName":"Galego"},"ka":{"name":"Georgian","nativeName":"ქართული"},"de":{"name":"German","nativeName":"Deutsch"},"el":{"name":"Greek, Modern","nativeName":"Ελληνικά"},"gn":{"name":"Guaraní","nativeName":"Avañeẽ"},"gu":{"name":"Gujarati","nativeName":"ગુજરાતી"},"ht":{"name":"Haitian; Haitian Creole","nativeName":"Kreyòl ayisyen"},"ha":{"name":"Hausa","nativeName":"Hausa, هَوُسَ"},"he":{"name":"Hebrew (modern)","nativeName":"עברית"},"hz":{"name":"Herero","nativeName":"Otjiherero"},"hi":{"name":"Hindi","nativeName":"हिन्दी, हिंदी"},"ho":{"name":"Hiri Motu","nativeName":"Hiri Motu"},"hu":{"name":"Hungarian","nativeName":"Magyar"},"ia":{"name":"Interlingua","nativeName":"Interlingua"},"id":{"name":"Indonesian","nativeName":"Bahasa Indonesia"},"ie":{"name":"Interlingue","nativeName":"Originally called Occidental; then Interlingue after WWII"},"ga":{"name":"Irish","nativeName":"Gaeilge"},"ig":{"name":"Igbo","nativeName":"Asụsụ Igbo"},"ik":{"name":"Inupiaq","nativeName":"Iñupiaq, Iñupiatun"},"io":{"name":"Ido","nativeName":"Ido"},"is":{"name":"Icelandic","nativeName":"Íslenska"},"it":{"name":"Italian","nativeName":"Italiano"},"iu":{"name":"Inuktitut","nativeName":"ᐃᓄᒃᑎᑐᑦ"},"ja":{"name":"Japanese","nativeName":"日本語 (にほんご／にっぽんご)"},"jv":{"name":"Javanese","nativeName":"basa Jawa"},"kl":{"name":"Kalaallisut, Greenlandic","nativeName":"kalaallisut, kalaallit oqaasii"},"kn":{"name":"Kannada","nativeName":"ಕನ್ನಡ"},"kr":{"name":"Kanuri","nativeName":"Kanuri"},"ks":{"name":"Kashmiri","nativeName":"कश्मीरी, كشميري‎"},"kk":{"name":"Kazakh","nativeName":"Қазақ тілі"},"km":{"name":"Khmer","nativeName":"ភាសាខ្មែរ"},"ki":{"name":"Kikuyu, Gikuyu","nativeName":"Gĩkũyũ"},"rw":{"name":"Kinyarwanda","nativeName":"Ikinyarwanda"},"ky":{"name":"Kirghiz, Kyrgyz","nativeName":"кыргыз тили"},"kv":{"name":"Komi","nativeName":"коми кыв"},"kg":{"name":"Kongo","nativeName":"KiKongo"},"ko":{"name":"Korean","nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"},"ku":{"name":"Kurdish","nativeName":"Kurdî, كوردی‎"},"kj":{"name":"Kwanyama, Kuanyama","nativeName":"Kuanyama"},"la":{"name":"Latin","nativeName":"latine, lingua latina"},"lb":{"name":"Luxembourgish, Letzeburgesch","nativeName":"Lëtzebuergesch"},"lg":{"name":"Luganda","nativeName":"Luganda"},"li":{"name":"Limburgish, Limburgan, Limburger","nativeName":"Limburgs"},"ln":{"name":"Lingala","nativeName":"Lingála"},"lo":{"name":"Lao","nativeName":"ພາສາລາວ"},"lt":{"name":"Lithuanian","nativeName":"lietuvių kalba"},"lu":{"name":"Luba-Katanga","nativeName":""},"lv":{"name":"Latvian","nativeName":"latviešu valoda"},"gv":{"name":"Manx","nativeName":"Gaelg, Gailck"},"mk":{"name":"Macedonian","nativeName":"македонски јазик"},"mg":{"name":"Malagasy","nativeName":"Malagasy fiteny"},"ms":{"name":"Malay","nativeName":"bahasa Melayu, بهاس ملايو‎"},"ml":{"name":"Malayalam","nativeName":"മലയാളം"},"mt":{"name":"Maltese","nativeName":"Malti"},"mi":{"name":"Māori","nativeName":"te reo Māori"},"mr":{"name":"Marathi (Marāṭhī)","nativeName":"मराठी"},"mh":{"name":"Marshallese","nativeName":"Kajin M̧ajeļ"},"mn":{"name":"Mongolian","nativeName":"монгол"},"na":{"name":"Nauru","nativeName":"Ekakairũ Naoero"},"nv":{"name":"Navajo, Navaho","nativeName":"Diné bizaad, Dinékʼehǰí"},"nb":{"name":"Norwegian Bokmål","nativeName":"Norsk bokmål"},"nd":{"name":"North Ndebele","nativeName":"isiNdebele"},"ne":{"name":"Nepali","nativeName":"नेपाली"},"ng":{"name":"Ndonga","nativeName":"Owambo"},"nn":{"name":"Norwegian Nynorsk","nativeName":"Norsk nynorsk"},"no":{"name":"Norwegian","nativeName":"Norsk"},"ii":{"name":"Nuosu","nativeName":"ꆈꌠ꒿ Nuosuhxop"},"nr":{"name":"South Ndebele","nativeName":"isiNdebele"},"oc":{"name":"Occitan","nativeName":"Occitan"},"oj":{"name":"Ojibwe, Ojibwa","nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"},"cu":{"name":"Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic","nativeName":"ѩзыкъ словѣньскъ"},"om":{"name":"Oromo","nativeName":"Afaan Oromoo"},"or":{"name":"Oriya","nativeName":"ଓଡ଼ିଆ"},"os":{"name":"Ossetian, Ossetic","nativeName":"ирон æвзаг"},"pa":{"name":"Panjabi, Punjabi","nativeName":"ਪੰਜਾਬੀ, پنجابی‎"},"pi":{"name":"Pāli","nativeName":"पाऴि"},"fa":{"name":"Persian","nativeName":"فارسی"},"pl":{"name":"Polish","nativeName":"polski"},"ps":{"name":"Pashto, Pushto","nativeName":"پښتو"},"pt":{"name":"Portuguese","nativeName":"Português"},"qu":{"name":"Quechua","nativeName":"Runa Simi, Kichwa"},"rm":{"name":"Romansh","nativeName":"rumantsch grischun"},"rn":{"name":"Kirundi","nativeName":"kiRundi"},"ro":{"name":"Romanian, Moldavian, Moldovan","nativeName":"română"},"ru":{"name":"Russian","nativeName":"русский язык"},"sa":{"name":"Sanskrit (Saṁskṛta)","nativeName":"संस्कृतम्"},"sc":{"name":"Sardinian","nativeName":"sardu"},"sd":{"name":"Sindhi","nativeName":"सिन्धी, سنڌي، سندھی‎"},"se":{"name":"Northern Sami","nativeName":"Davvisámegiella"},"sm":{"name":"Samoan","nativeName":"gagana faa Samoa"},"sg":{"name":"Sango","nativeName":"yângâ tî sängö"},"sr":{"name":"Serbian","nativeName":"српски језик"},"gd":{"name":"Scottish Gaelic; Gaelic","nativeName":"Gàidhlig"},"sn":{"name":"Shona","nativeName":"chiShona"},"si":{"name":"Sinhala, Sinhalese","nativeName":"සිංහල"},"sk":{"name":"Slovak","nativeName":"slovenčina"},"sl":{"name":"Slovene","nativeName":"slovenščina"},"so":{"name":"Somali","nativeName":"Soomaaliga, af Soomaali"},"st":{"name":"Southern Sotho","nativeName":"Sesotho"},"es":{"name":"Spanish; Castilian","nativeName":"español, castellano"},"su":{"name":"Sundanese","nativeName":"Basa Sunda"},"sw":{"name":"Swahili","nativeName":"Kiswahili"},"ss":{"name":"Swati","nativeName":"SiSwati"},"sv":{"name":"Swedish","nativeName":"svenska"},"ta":{"name":"Tamil","nativeName":"தமிழ்"},"te":{"name":"Telugu","nativeName":"తెలుగు"},"tg":{"name":"Tajik","nativeName":"тоҷикӣ, toğikī, تاجیکی‎"},"th":{"name":"Thai","nativeName":"ไทย"},"ti":{"name":"Tigrinya","nativeName":"ትግርኛ"},"bo":{"name":"Tibetan Standard, Tibetan, Central","nativeName":"བོད་ཡིག"},"tk":{"name":"Turkmen","nativeName":"Türkmen, Түркмен"},"tl":{"name":"Tagalog","nativeName":"Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"},"tn":{"name":"Tswana","nativeName":"Setswana"},"to":{"name":"Tonga (Tonga Islands)","nativeName":"faka Tonga"},"tr":{"name":"Turkish","nativeName":"Türkçe"},"ts":{"name":"Tsonga","nativeName":"Xitsonga"},"tt":{"name":"Tatar","nativeName":"татарча, tatarça, تاتارچا‎"},"tw":{"name":"Twi","nativeName":"Twi"},"ty":{"name":"Tahitian","nativeName":"Reo Tahiti"},"ug":{"name":"Uighur, Uyghur","nativeName":"Uyƣurqə, ئۇيغۇرچە‎"},"uk":{"name":"Ukrainian","nativeName":"українська"},"ur":{"name":"Urdu","nativeName":"اردو"},"uz":{"name":"Uzbek","nativeName":"zbek, Ўзбек, أۇزبېك‎"},"ve":{"name":"Venda","nativeName":"Tshivenḓa"},"vi":{"name":"Vietnamese","nativeName":"Tiếng Việt"},"vo":{"name":"Volapük","nativeName":"Volapük"},"wa":{"name":"Walloon","nativeName":"Walon"},"cy":{"name":"Welsh","nativeName":"Cymraeg"},"wo":{"name":"Wolof","nativeName":"Wollof"},"fy":{"name":"Western Frisian","nativeName":"Frysk"},"xh":{"name":"Xhosa","nativeName":"isiXhosa"},"yi":{"name":"Yiddish","nativeName":"ייִדיש"},"yo":{"name":"Yoruba","nativeName":"Yorùbá"},"za":{"name":"Zhuang, Chuang","nativeName":"Saɯ cueŋƅ, Saw cuengh"}};
		$scope.langArray=[];
		$scope.formObj=function(selectedlanguage){
			if($scope.langArray.length<5){
				$scope.max5language=false;
				if($scope.langArray.indexOf(selectedlanguage)==-1){
					$scope.langArray.push(selectedlanguage);
					$scope.alreadySelected=false;
					$scope.driver.languages=$scope.langArray;
					}
				else{
					$scope.alreadySelected=true;
				}
			}
			else{
				$scope.max5language=true;
			}
			
			$('.langSection span.select2-chosen').empty();  
		    $('.langSection span.select2-chosen').text("  - - Select Language - -");								
		};
		/*
		 *  remove selected language based on close click
		 * */
		$scope.removeSelected=function(item){
			var arrayIndex=$scope.langArray.indexOf(item);
			if(arrayIndex>-1){
				$scope.langArray.splice(arrayIndex,1);
			}
			if($scope.langArray.length<5){
				$scope.max5language=false;
			}
			else{
				$scope.max5language=true;
			}
		}		
		/**
		 *  to trigger input type file on click of upload or update icon
		 * */
		$scope.triggerInput=function(){
			document.getElementById('imageInput').click();	
		}
		/**
		 *  ================================== upload image to url based on FORM DATA=====================================
		 * */
		$scope.uploadFile = function(files) {
			var filecheck=files[0].type;
			var filechkArray=filecheck.split("/");			
			if(filechkArray[0]=='image'){
				if(filechkArray[1]=='jpg' || filechkArray[1]=='gif'|| filechkArray[1]=='jpeg' || filechkArray[1]=='png'){
					$scope.onlyImage=false;
					$scope.onlyFiletype=false;
					$scope.imageUploading=true;
					if(files[0].size>0){
						var fd = new FormData();
						//Take the first selected file
						fd.append("drv", files[0]);

						$http.post(apiURL+"upload/image", fd, {
							withCredentials : false,
							headers : {
								'Content-Type' : undefined
							},
							transformRequest : angular.identity
						}).success(function(data) {
							$scope.imageUploading=false;
							console.log(data.data)
							$scope.imagepath=data.data;
							$scope.driver.image_src=data.data;
						}).error(function(data, status) {
							$scope.imageUploading=false;
							console.log(data);
							console.log(status);
						});
					}		
				}
				else{
					$scope.onlyImage=false;
					$scope.onlyFiletype=true;
				}
			}
			else{
				$scope.onlyImage=true;	
				$scope.onlyFiletype=false;
			}		
		};
		/*
		 *  for loading country and state
		 * */
		var countries = ['India'];
		var states = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 
		                'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 
		                'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 
		                'Maharashtra', 'Manipur', '	Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 
		                'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
		$scope.country = countries;
		$scope.state = [];
		$scope.onSelectCountry = function () {
	        var myNewOptions = states;
	        $scope.states = myNewOptions;
		};	
		/*verify uniqueness of contact*/
		$scope.verifyContact=function(d_id,driverContact){
			console.log(driverContact);
			if(typeof(driverContact)!='undefined'){
				$scope.verifydriverContactJSON = {};
				$scope.verifydriverContactJSON.token = $scope.token;
				if(d_id!='new'){
					$scope.verifydriverContactJSON.driver_id=d_id;
				}				
				$scope.verifydriverContactJSON.contact_no = driverContact;
				console.log(JSON.stringify($scope.verifydriverContactJSON));
				$http({
					method : 'POST',
					url : apiURL + 'driver/validatecontact',
					data : JSON.stringify($scope.verifydriverContactJSON),
					headers : {
						'Content-Type' : 'application/json'
					}
				}).success(function(data) {
					console.log(data);
					if (data.status) {
						$scope.driverform.driverContact.$setValidity('contAvailable',true);
						$scope.driverupdateform.driverContact.$setValidity('contAvailable',true);
					} else {
						$scope.driverform.driverContact.$setValidity('contAvailable',false);
						$scope.driverupdateform.driverContact.$setValidity('contAvailable',true);
					}
				}).error(function(data, status, headers, config) {
					// console.log(data.err);
					if (data.err == "Expired Session") {
						$('#driverUpdateModal').modal('hide');
						$('#driverCreateModal').modal('hide');
						expiredSession();
						$localStorage.$reset();
					} else if (data.err == "Invalid User") {
						$('#driverUpdateModal').modal('hide');
						$('#driverCreateModal').modal('hide');
						invalidUser();
						$localStorage.$reset();
					}
					console.log(status);
					console.log(headers);
					console.log(config);
				})
			}
		}
		/**
		 * check uniqueness of driver license
		 */		
		$scope.verifyDL = function(d_id,dl) {
			if(typeof(dl)!='undefined'){
				$scope.verifydlJSON = {};
				$scope.verifydlJSON.token = $scope.token;
				if(d_id!='new'){
					$scope.verifydlJSON.driver_id=d_id;
				}				
				$scope.verifydlJSON.driver_licence = dl;
				$http({
					method : 'POST',
					url : apiURL + 'driver/validatelicenceid',
					data : JSON.stringify($scope.verifydlJSON),
					headers : {
						'Content-Type' : 'application/json'
					}
				}).success(function(data) {
					console.log(data);
					if (data.status) {
						$scope.driverform.driverlicense.$setValidity('dlavailable',true);
						$scope.driverupdateform.driverlicense.$setValidity('dlavailable',true);
					} else {
						$scope.driverform.driverlicense.$setValidity('dlavailable',false);
						$scope.driverupdateform.driverlicense.$setValidity('dlavailable',false);
					}
				}).error(function(data, status, headers, config) {
					// console.log(data.err);
					if (data.err == "Expired Session") {
						$('#driverUpdateModal').modal('hide');
						$('#driverCreateModal').modal('hide');
						expiredSession();
						$localStorage.$reset();
					} else if (data.err == "Invalid User") {
						$('#driverUpdateModal').modal('hide');
						$('#driverCreateModal').modal('hide');
						invalidUser();
						$localStorage.$reset();
					}
					console.log(status);
					console.log(headers);
					console.log(config);
				})
			}		
		};
		
		$scope.countChild=function(){
			var count=document.getElementById("driverUlist").childElementCount;
			console.log(count);
		}
		/*
		 * reset form with clearing form fields
		 * a) .reset() javscript function clearing field even after error
		 * b) assigning the empty object (to all the ng-model of the form fields)
		 * c) setting Pristine (field is set to not modofied state)
		 * d) setting Untouched (field is set to not touched state)
		 * e) clearing the image path
		 * f) clearing the language array
		 * g) for driver contact availablity error reset on close of create /update form
		 * h) for driver licence availablity error reset on close of create /update form
		 * */
		 $scope.reset=function(){
			 document.getElementById("driverCreateform").reset();
			 $scope.driver={};
			 $scope.driver.confirmAddress=true;
			 $scope.createDriverObject={};		 
			 $scope.langArray=[];
			 $scope.imagepath="";
			 $scope.driverform.$setPristine();
			 $scope.driverform.$setUntouched();
			 $scope.driverupdateform.$setPristine();
			 $scope.driverupdateform.$setUntouched();
			 $scope.driverform.driverContact.$setValidity('contAvailable',true);
			 $scope.driverupdateform.driverContact.$setValidity('contAvailable',true);
			 $scope.driverform.driverlicense.$setValidity('dlavailable',true);
			 $scope.driverupdateform.driverlicense.$setValidity('dlavailable',true);
			 
		 }
	/*====================================================>>>>>> End of Basic function <<<<<=================================================*/
	/*
	 * ====================================================>>>>>> list drivers function <<<<<=================================================
	 * */	
		$scope.listDrivers=function(){
			$scope.httpLoading=true;
			$scope.listDriverJSON={};
			$scope.listDriverJSON.token=$scope.token;
			$scope.listDriverJSON.type="0";
			$http({
				method:'POST',
				url:apiURL+'driver/list',
				data:JSON.stringify($scope.listDriverJSON),
				headers:{'Content-Type':'application/json'}
			})
			.success(function(data){
				//console.log(JSON.stringify(data));
				$scope.driverlist=data;
				$scope.httpLoading=false;
			})
			.error(function(data, status, headers, config) {
				console.log(data);
				$scope.httpLoading=false;
			}).finally(function(){		
				$scope.httpLoading=false;
			});
		}
	/*
	 * ====================================================>>>>>> End of list drivers function <<<<<=================================================
	 * */		
	/*
	 * ===============================>>>>> Start of Create Driver function <<<<<==========================================
	 * Manadatory Fields
	 * a)Driver Name
	 * b)Driver contact number
	 * c)Driver driving license number
	 * d)Driver current city
	 * e)Driver current pin code
	 * f)Driver current street
	 * g)Driver current state
	 * h)Driver current country
	 * i)Driver aadhar card
	 * j)Driver emergency contact number
	 * k)Driver blood group
	 * l)Employee Type (Permanent or Temprorary)
	 * */
	$scope.submitCreateDriverForm=function(){
		$scope.createDriverObject={};
		$scope.createDriverObject.token=$scope.token;
		$scope.createDriverObject.name=$scope.driver.name;
		$scope.createDriverObject.contact_no=$scope.driver.contact;
		$scope.createDriverObject.licence_id=$scope.driver.license;
		if($scope.driver.confirmAddress==true){
			$scope.createDriverObject.native_city=$scope.driver.city;
			$scope.createDriverObject.native_state=$scope.driver.state;
			$scope.createDriverObject.native_pincode=$scope.driver.pincode;
			$scope.createDriverObject.native_street=$scope.driver.street;
			$scope.createDriverObject.native_country=$scope.driver.country;	
		}
		else{
			$scope.createDriverObject.native_city=$scope.driver.pcity;
			$scope.createDriverObject.native_state=$scope.driver.pstate;
			$scope.createDriverObject.native_pincode=$scope.driver.ppincode;
			$scope.createDriverObject.native_street=$scope.driver.pstreet;
			$scope.createDriverObject.native_country=$scope.driver.pcountry;
		}
		$scope.createDriverObject.current_city=$scope.driver.city;
		$scope.createDriverObject.current_country=$scope.driver.country;
		$scope.createDriverObject.current_state=$scope.driver.state;
		$scope.createDriverObject.current_pincode=$scope.driver.pincode;
		$scope.createDriverObject.current_street=$scope.driver.street;
		$scope.createDriverObject.adhar_id=$scope.driver.aadhar;
		$scope.createDriverObject.image_src=$scope.imagepath
		$scope.createDriverObject.emergency_cn=$scope.driver.emergency_cn
		$scope.createDriverObject.blood_group=$scope.driver.blood;
		$scope.createDriverObject.dob=$scope.driver.dob;
		$scope.createDriverObject.education=$scope.driver.education;
		$scope.createDriverObject.languages_known=$scope.driver.languages;
		$scope.createDriverObject.password=$scope.driver.password;
		$scope.createDriverObject.salary=$scope.driver.salary;
		$scope.createDriverObject.employee_type=$scope.driver.etype;		
		
		console.log(JSON.stringify($scope.driver));
		console.log(JSON.stringify($scope.createDriverObject));
		$scope.httpLoading=true
		$http({
			method:'POST',
			url:apiURL+'driver/create',
			data:JSON.stringify($scope.createDriverObject),
			headers:{'Content-Type':'application/json'}
		})
		.success(function(data){
			console.log(data);
			$scope.httpLoading=false;
			swal({title: "Driver Created Successfully",
	   			   text: "Success!",   
	   			   type: "success",   
	   			   confirmButtonColor: "#9afb29",   
	   			   closeOnConfirm: true }, 
	   			   function(){   
	   				$('#driverCreateModal').modal('hide');
					$scope.listDrivers();
	   		 });
		})
		.error(function(data, status, headers, config) {
			//console.log(data);
			$scope.httpLoading=false;
			 if(data.err == "Expired Session")
			  {
       		  $('#driverCreateModal').modal('hide');
			      expiredSession();
			      $localStorage.$reset();
			  }
	       	  else if(data.err == "Invalid User"){
	       		  $('#driverCreateModal').modal('hide');
	       		  invalidUser();
	   			  $localStorage.$reset();  
	       	  }
			
		}).finally(function(){		
			$scope.httpLoading=false;
		});
	}
	
	/*
	 * ===============================>>>>> End of Create Driver function <<<<<==========================================
	 * */
	 
	 /*
	  * ===============================>>>>> Fetch Driver info function <<<<<==========================================
	  * */ 
	 $scope.fetchdriverInfo=function(driver_id){
		 $scope.fetchDriverInfo={};
		 $scope.fetchDriverInfo.token=$scope.token;
		 $scope.fetchDriverInfo.driver_id=driver_id;
		 //console.log(JSON.stringify($scope.fetchDriverInfo));
		 $http({
				method:'POST',
				url:apiURL+'driver/info',
				data:JSON.stringify($scope.fetchDriverInfo),
				headers:{'Content-Type':'application/json'}
			})
			.success(function(data){
				//console.log(JSON.stringify(data));
				$scope.updateEditModal(data,function(){
					$("#driverUpdateModal").modal('show');	
				});				
			})
			.error(function(data, status, headers, config) {				
				 if(data.err == "Expired Session")
				  {	  expiredSession();
				      $localStorage.$reset();
				  }
		       	  else if(data.err == "Invalid User"){
		       		  invalidUser();
		   			  $localStorage.$reset();  
		       	  }
			})
	 }
	 
	 $scope.updateEditModal=function(data,callModal){
		 $scope.editformselect=true;
		 $scope.driver=data;
		 $scope.driver.contact=data.contact_no;
		 $scope.driver.license=data.licence_id;
		 $scope.driver.etype=data.employee_type;
		 $scope.langArray=data.languages_known;
		 $scope.driver.blood=data.blood_group;
		 $scope.driver.image_src=data.image_src;
		 $scope.imagepath=data.image_src;
		 $scope.driver.aadhar=data.adhar_id;
		 $scope.driver.street=data.current_address.street;
		 $scope.driver.city=data.current_address.city;
		 $scope.driver.pincode=data.current_address.pincode;		 
		 $scope.driver.country=data.current_address.country;
		 $scope.driver.state=data.current_address.state;
		 $scope.driver.pstreet=data.native_address.street;
		 $scope.driver.pcity=data.native_address.city;
		 $scope.driver.ppincode=data.native_address.pincode;		 
		 $scope.driver.pcountry=data.native_address.country;
		 $scope.driver.pstate=data.native_address.state;
		 $scope.driver.driver_id=data.driver_id;
		 callModal();		 
	 }
	 /*
	  * ===============================>>>>> End Fetch Driver info  function <<<<<==========================================	  * 
	  * */
	 /*
	  * ===============================>>>>> Update Driver info  function <<<<<==========================================
	  * */
	 $scope.submitUpdateDriverForm=function(){
		 $scope.updateDriverObject={};
	      $scope.updateDriverObject.token=$scope.token;
	      $scope.updateDriverObject.name=$scope.driver.name;
	      $scope.updateDriverObject.contact_no=$scope.driver.contact;
	      $scope.updateDriverObject.licence_id=$scope.driver.license;
	      if($scope.driver.confirmAddress==true){
	         $scope.updateDriverObject.native_city=$scope.driver.city;
	         $scope.updateDriverObject.native_state=$scope.driver.state;
	         $scope.updateDriverObject.native_pincode=$scope.driver.pincode;
	         $scope.updateDriverObject.native_street=$scope.driver.street;
	         $scope.updateDriverObject.native_country=$scope.driver.country;   
	      }
	      else{
	         $scope.updateDriverObject.native_city=$scope.driver.pcity;
	         $scope.updateDriverObject.native_state=$scope.driver.pstate;
	         $scope.updateDriverObject.native_pincode=$scope.driver.ppincode;
	         $scope.updateDriverObject.native_street=$scope.driver.pstreet;
	         $scope.updateDriverObject.native_country=$scope.driver.pcountry;
	      }
	      $scope.updateDriverObject.current_city=$scope.driver.city;
	      $scope.updateDriverObject.current_country=$scope.driver.country;
	      $scope.updateDriverObject.current_state=$scope.driver.state;
	      $scope.updateDriverObject.current_pincode=$scope.driver.pincode;
	      $scope.updateDriverObject.current_street=$scope.driver.street;
	      $scope.updateDriverObject.adhar_id=$scope.driver.aadhar;
	      $scope.updateDriverObject.image_src=$scope.imagepath;
	      $scope.updateDriverObject.emergency_cn=$scope.driver.emergency_cn;
	      $scope.updateDriverObject.blood_group=$scope.driver.blood;
	      $scope.updateDriverObject.dob=$scope.driver.dob;
	      $scope.updateDriverObject.education=$scope.driver.education;
	      $scope.updateDriverObject.languages_known=$scope.langArray;
	      $scope.updateDriverObject.salary=$scope.driver.salary;
	      $scope.updateDriverObject.employee_type=$scope.driver.etype;
	      $scope.updateDriverObject.driver_id=$scope.driver.driver_id;
	      //console.log($scope.updateDriverObject);
	      $scope.httpLoading=true
			$http({
				method:'POST',
				url:apiURL+'driver/update',
				data:JSON.stringify($scope.updateDriverObject),
				headers:{'Content-Type':'application/json'}
			})
			.success(function(data){
				//console.log(data);
				$scope.httpLoading=false;
				$('#driverUpdateModal').modal('hide');
					$scope.listDrivers();
				swal({title: "Driver Updated Successfully",
		   			   text: "Success!",   
		   			   type: "success",   
		   			   confirmButtonColor: "#9afb29",   
		   			   closeOnConfirm: true }, 
		   			   function(){   
		   				
		   		 });
			})
			.error(function(data, status, headers, config) {
				//console.log(data);
				$scope.httpLoading=false;
				 if(data.err == "Expired Session")
				  {
	       		  $('#driverUpdateModal').modal('hide');
				      expiredSession();
				      $localStorage.$reset();
				  }
		       	  else if(data.err == "Invalid User"){
		       		  $('#driverUpdateModal').modal('hide');
		       		  invalidUser();
		   			  $localStorage.$reset();  
		       	  }
				
			}).finally(function(){		
				$scope.httpLoading=false;
			});
	 }
	 /*
	  * ===============================>>>>> End of Update Driver info  function <<<<<==========================================
	  * */
	 /*
		 * ===============================>>>>> Delete Driver function <<<<<==========================================
		 * */
	 $scope.deleteDriver=function(idVal){
		 swal({
			  title: "Password Confirmation Required!",
			  text: "Enter your password",
			  type: "input",
			  inputType:"password",
			  showCancelButton: true,
			  closeOnConfirm: false,
			  animation: "slide-from-top",
			  inputPlaceholder: "Enter your password"
			},
			function(inputValue){
			  if (inputValue === false) return false;
			  
			  if (inputValue === "") {
			    swal.showInputError("You need to enter password!");
			    return false
			  }
			  confirmUser(inputValue,function(result){
				  if(result){
					  swal({   title: "Are you sure?",   
				         	text: "You want to delete this driver?",   
				         	type: "warning",   
				         	showCancelButton: true,   
				         	confirmButtonColor: "#DD6B55",   
				         	confirmButtonText: "Yes, delete it!",   
				         	cancelButtonText: "No, cancel it!",   
				         	closeOnConfirm: false,   
				         	closeOnCancel: false }, 
				         	function(isConfirm){   
				         		if (isConfirm) {
				         			$scope.httpLoading=true;
				         			 $scope.deleteDriverObject={}
				         			 $scope.deleteDriverObject.token=$scope.token;
				         			 $scope.deleteDriverObject.driver_id=idVal;
				         			 $http({
				         					method:'POST',
				         					url:apiURL+'driver/delete',
				         					data:JSON.stringify($scope.deleteDriverObject),
				         					headers:{'Content-Type':'application/json'}
				         				})
				         				.success(function(data){
				         					console.log(data);
				         					swal({title: "Driver Deleted Successfully",
				         			   			   text: "Success!",   
				         			   			   type: "success",   
				         			   			   confirmButtonColor: "#9afb29",   
				         			   			   closeOnConfirm: true }, 
				         			   			   function(){   
				         			   				
				         			   		 });
				         					$scope.httpLoading=false;
				         					$scope.listDrivers();
				         				})
				         				.error(function(data, status, headers, config) {
				         					console.log(data);
				         					$scope.httpLoading=false;
				         				}).finally(function(){		
				         					$scope.httpLoading=false;
				         				});
				         			
				         		}
				         		else{
				         			swal("Cancelled", "You have cancelled :)", "error");
				         		}
				         	});
				  }
				  else{
					  swal("Warning!", "You wrote wrong password ", "error");  
				  }
			  });			  
			});
	 }
	 function confirmUser(passwordValue,cb){
		 $scope.httpLoading=true;
		 var flag;
		 $scope.verifyUser={};
		 $scope.verifyUser.token=$scope.token;
		 $scope.verifyUser.password=passwordValue;
		 $http({
				method:'POST',
				url:apiURL+'user/confirmpassword',
				data:JSON.stringify($scope.verifyUser),
				headers:{'Content-Type':'application/json'}
			})
			.success(function(data){
				flag=data.status;				
				cb(flag);
			})
			.error(function(data, status, headers, config) {
				flag=data.status;				
				cb(flag);
				$scope.httpLoading=false;
			}).finally(function(){		
				$scope.httpLoading=false;
			});		 
	 }
	 
	 
	 /*
		 * ===============================>>>>> End of Delete Driver function <<<<<==========================================
		 * */
	$(document).ready(
			function() {
				$.getScript('../assets/select_filter/select2.min.js', function() {					
					$('#langSelect').select2({});
					$('#updatelangSelect').select2({});
					$('.langSection span.select2-chosen').text("  - - Select Language - -");
				});// script
			});
	
});

