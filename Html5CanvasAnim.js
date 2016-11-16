// Script file for MyHtml5CanvasAnim.html
//
$(function(){
	var WIDTH =  HEIGHT = TEXTURE_WIDTH = TEXTURE_HEIGHT = 640,
		carray=[],
		root,
		NUM_CIRCLES = 300, // 100, //1600,
		RADIUS = 8,  // 10
		bGravity = false,
		bFade = false,
		g,
		g_texture,
		bImagesLoaded = false,
		nGeneralWindX = Math.sin(Math.random()*360)*3,
		nGeneralWindY = Math.cos(Math.random()*360)*3,
		arr_Msg=['w','e','l','c','o','m','e','f','r','i','e','n','d','s'],	// arr_Msg=['h','e','l','l','o'],
		nMsgIndex = 0,
		Alphabet = 1,
		loop_time = 33,
		draw_interval_id = 0,
		next_letter_interval_id = 0,
		clear_circles_interval_id = 0,
		anim_effect = 1,
		test_image,
		arr_ImageLetters = [],
		arr_ImageLetters2 = [];

	var arr_letters=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	//
	//---------------------------   select handlers   ---------------------->>
	//
	$('#sel_font').change(function(){
		var val_01 = $(this).val();
		Alphabet = Number(val_01);
		applyChanges();
	});    

	$('#sel_effects').change(function(){
		var val_02 = $(this).val();
		anim_effect = Number(val_02);	  
		applyChanges();
	});

	$('#sel_balls_radius').change(function(){
		var val_03 = $(this).val();
		RADIUS = Number(val_03);	  
		applyChanges();
	});
	
	$('#sel_loop_time').change(function(){
		var val_04 = $(this).val();
		loop_time = Number(val_04);	  
		applyChanges();
	});		
	
	$('#message').change(function(){  
		applyChanges();
	});	
	
		// but_anim
	$('#but_anim').click(function(e){
	   e.preventDefault();
	  
	  // reset settings to default
	  setInitialSettings();
	});


	//
	//---------------------------   function Circle()   ---------------------->>
	//
	function Circle(x,y,r){
		this.x=x;
		this.y=y;
		this.r=r;
		this.destX=-1;
		this.destY=-1;
		this.alpha = 0;
		
		this.vx=Math.random()-.5*3;
		this.vy=Math.random()-.5*3;
	}	

	
	

	//
	//---------------------------   init function   ---------------------->>
	//
	function init(){
		g = $('#mainCanvas')[0].getContext("2d");
		g_texture = $('#mainCanvas_hidden')[0].getContext("2d");
		
	//---------------------------   initial select properties   ---------------------->>
		loadLetters();
		
	//---------------------------   initial select properties   ---------------------->>
		setInitialSettings();
	}
	
	//
	//---------------------------   function loadLetters()   ---------------------->>
	//	
	
	function loadLetters() {	
		var total_letters = 0;
		try {
			test_image = new Image();
			test_image.src = "letter-w.png";
			
			for(var l=0; l<26; l++){
				arr_ImageLetters[l]=new Image();
				arr_ImageLetters[l].src="letters/" + arr_letters[l]+".png";
				
				total_letters++;
				
				arr_ImageLetters2[l]=new Image();
				arr_ImageLetters2[l].src="letters/Sticker-" + arr_letters[l]+".png";
				total_letters++;
			}
		} catch(e) {
			alert('ERROR at loadLetters() e.name = ' + e.name);
		} finally {
			// alert('total_letters = ' + total_letters);
		}
	}	
	

	//
	//---------------------------   initial dropboxes properties   ---------------------->>
	//
	function setInitialSettings(){
		try {
			$("#message").val('welcome friends');
			// $("#cur_letter").val('-');
			
			$('#sel_font').children(":nth-child(2)").prop('selected', 'selected');
			var val_01 = $('#sel_font').val();
			Alphabet = Number(val_01);

			$('#sel_effects').children(":nth-child(2)").prop('selected', 'selected');
			var val_02 = $('#sel_effects').val();
			anim_effect = Number(val_02);	 	
			
			$('#sel_balls_radius').children(":nth-child(4)").prop('selected', 'selected');
			var val_03 = $('#sel_balls_radius').val();
			RADIUS = Number(val_03);	 	
			
			$('#sel_loop_time').children(":nth-child(5)").prop('selected', 'selected');	
			var val_04 = $('#sel_loop_time').val();
			loop_time = Number(val_04);	  
			
		} catch(e) {
			alert('ERROR at setInitialSettings() e.name = ' + e.name);
		} finally {
			
			// alert('setInitialSettings() - finally.');
			applyChanges();	
		}
	}


	function setLetter(c) {
		var nFound = -1,  nIndex = 0;
		var sqWidth = 16;   // 20;   18    16
		
		try {
			
			for(var i=0; i<26; i++){
				if(arr_letters[i] == c) {
					nFound = i;
				}
			}

			if(nFound > -1) {
				g_texture.fillStyle = "#000000";
				g_texture.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
				
				// g_texture.drawImage(arr_ImageLetters[nFound],0,0);		
				// g_texture.drawImage(arr_ImageLetters[nFound], 0, 0, TEXTURE_WIDTH / 2, TEXTURE_HEIGHT / 2);
				
				
				if (Alphabet == 1) {
					g_texture.drawImage(arr_ImageLetters[nFound],0, 0, TEXTURE_WIDTH / 2, TEXTURE_HEIGHT / 2);
				} else {
					g_texture.drawImage(arr_ImageLetters2[nFound],0, 0, TEXTURE_WIDTH / 2, TEXTURE_HEIGHT / 2);
				}
				
				
				var imageData=g_texture.getImageData(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

				for(j=0; j<Math.floor(imageData.height); j= j + sqWidth) {
					for(i=0; i<Math.floor(imageData.width); i= i + sqWidth){
						var nAvg=0;
						for(ypos=j;ypos<j+sqWidth;ypos++){
							for(xpos=i;xpos<i+sqWidth;xpos++){
								var index=(xpos*4)*imageData.width+(ypos*4);
								var red=imageData.data[index];
								var green=imageData.data[index+1];
								var blue=imageData.data[index+2];
								var alpha=imageData.data[index+3];
								var average=(red+green+blue)/3;
								nAvg+=average/(sqWidth*sqWidth);
							}
						}
						
						// if(nAvg > 60 && nIndex < carray.length) {
						if(nAvg > 20 && nIndex < carray.length) {
							/*
							carray[nIndex].destX=(j+Math.floor(sqWidth/2))*1.5+260;
							carray[nIndex].destY=(i+Math.floor(sqWidth/2))*1.5+130;
							*/
							carray[nIndex].destX=(j+Math.floor(sqWidth/2))*1.2+140;
							carray[nIndex].destY=(i+Math.floor(sqWidth/2))*1.2+80;							
							
							nIndex++;
						}
					}
				}
			}
			
			for(i=nIndex+1; i<carray.length; i++){
				carray[i].destX=-1;
				carray[i].destY=-1
			}			
			// alert('setLetter( ' + c + ' ) - executed !!!');		
			
		} catch(e) {
			// alert('ERROR at setLetter( ' + c + ' ) e.name = ' + e.name);
			$('.label-2:first').text('ERROR at setLetter(\'' + c + '\'): ' + e.name);
			
		} finally {
			// alert('setLetter( ' + c + ' ) - executed !!!');
		}		
	}

	function setNextLetter() {
		setLetter(arr_Msg[nMsgIndex]);
		nMsgIndex++;
		nMsgIndex=nMsgIndex % arr_Msg.length;
	}

	function clearCircles() {
		// nGeneralWindX = Math.sin(Math.random()*360)*10;
		// nGeneralWindY = Math.cos(Math.random()*360)*10;
		
		for(i=0; i<carray.length; i++){
			var nang = Math.random()*360;
			carray[i].vx = Math.sin(nang)*5;
			carray[i].vy = Math.cos(nang)*5;
			carray[i].destX = -1;
			carray[i].destY = -1;
		}
	}

	function startClearCircles() {
		// setInterval(clearCircles,3000)		
		
		// clear_circles_interval_id
		if (clear_circles_interval_id > 0) {
			clearInterval(clear_circles_interval_id);
		}			
		clear_circles_interval_id = setInterval (clearCircles, 100 * loop_time);
	}

	//
	//---------------------------   draw function   ---------------------->>
	//
	function draw(){ 			
		try {
			
			if(!bImagesLoaded){
				bImagesLoaded=imagesLoaded();
				return;
			}	
			clear();	
			
			
			var i;	
			var prevCircle;
			for (i=0; i<carray.length; i++){
				
				var C=carray[i];		
				if (i > 0) 					
					prevCircle = carray[i - 1];
				
				if(C.destX >- 1){
					C.x+=(C.destX-C.x)/4+((C.destX-C.x)/90 * C.vx) + nGeneralWindX;
					C.y+=(C.destY-C.y)/4+((C.destY-C.y)/90 * C.vy) + nGeneralWindY;
					C.alpha+=(.1-C.alpha)/2;
				}
				else{		
					C.x+=C.vx+nGeneralWindX;
					C.y+=C.vy+nGeneralWindY;
					if(bGravity)
						C.vy+=1.0;
					if(bFade)
						C.alpha*=(.9+C.alpha)*.98
					if(C.alpha<0)
						C.alpha=0;
				}	
				nGeneralWindX*=.9999;
				nGeneralWindY*=.9999;
				if(C.x<0){
					C.x=-C.x;
					C.vx=-C.vx;
				}
				if(C.y<0){
					C.y=-C.y;
					C.vy=-C.vy;
				};
				if(C.x>WIDTH){
					C.x=WIDTH-(C.x-WIDTH);
					C.vx=-C.vx;
				}
				if(C.y>HEIGHT){
					C.y=HEIGHT-(C.y-HEIGHT);
					C.vy=-C.vy*.45;
				}
				
					//++				
				g.beginPath();
				g.moveTo(C.x, C.y);
				
				// if (i > 0) {
				if (i > 0 && i % 20 <= 4 && Math.max(Math.abs(prevCircle.x - C.x), Math.abs(prevCircle.y - C.y)) < 26) {
					g.moveTo(prevCircle.x, prevCircle.y);
					g.lineTo(C.x, C.y);
				}
				g.closePath();
				g.strokeStyle = "yellow"; // "red";
				g.lineWidth = 2;
				g.stroke();			

				
				// g.globalAlpha = C.alpha;
				g.globalAlpha = C.alpha;
				
				//++
				g.strokeStyle = "red"; // "blue";
				
				g.beginPath();

				// g.fillStyle = "#FFFFFF";			
				if (i % 20 < 1)
					g.fillStyle = "red";	
				else if (i % 20 <= 4)
					g.fillStyle = "yellow";	
				else
					g.fillStyle = "lime";	
				
				// g.arc(100, 100, 55, 0, Math.PI*2, true);
				g.arc(C.x, C.y, C.r, 0, Math.PI*2, false);
				g.closePath();				
				g.fill();	
				g.lineWidth = 1;
				g.stroke();	
			}				
		} catch(e) {
			// alert('ERROR at setLetter( ' + c + ' ) e.name = ' + e.name);
			$('.label-2:first').text('ERROR at draw(): ' + e.name);
			
		} finally {
			// alert('setLetter( ' + c + ' ) - executed !!!');
			// $('.label-2:first').text('draw(): code_line = ' + code_line);
		}				
	}


	function imagesLoaded(){
		for(i=0;i<26;i++){
			if(!arr_ImageLetters[i].complete)
				return false;
		}
		
		setTimeout(startClearCircles, 50 * loop_time);
		
		// next_letter_interval_id
		if (next_letter_interval_id > 0) {
			clearInterval(next_letter_interval_id);
		}			
		next_letter_interval_id = setInterval(setNextLetter, 100 * loop_time);
		
		return true;
	}

	function clear(){
		g.globalAlpha=.1;  //.1
		g.fillStyle="#000000";		
		g.fillRect(0,0,WIDTH,HEIGHT)
	}

	//
	//---------------------------   function applyChanges()   ---------------------->>
	//
	function applyChanges(){
		try {
			
			// выбор шрифта: тонкий или толстый
			// $('#lbl_font').text('Шрифт № ' + Alphabet);
			
			// Какой выбран эффект анимации: базовый, падение или растворение
			if (anim_effect == 1) {
				// $('#lbl_effects').text('Базовая анимация');	
				bGravity = false;
				bFade = false;
			} 
			else if (anim_effect ==  2) {
				// $('#lbl_effects').text('Падение вниз');	
				bGravity = true;
				bFade = false;
			} 
			else if (anim_effect ==  3) {
				// $('#lbl_effects').text('Растворение');	
				bGravity = false;
				bFade = true;
			} 			
			else {
				// $('#lbl_effects').text('Падение + Растворение');	
				bGravity = true;
				bFade = true;
			}	
			
			// выбор толщигы кружков
			// $('#lbl_balls_radius').text('Радиус: ' + RADIUS);		
			
			// loop_time
			// $('#lbl_loop_time').text('Loop time: ' + loop_time);	
			
			// анимируемая надпись
			var txtVal=($("#message").val()).toLowerCase();
			var regNoNumbers=new RegExp("([^a-z ])*","gi");
			txtVal=txtVal.replace(regNoNumbers,"");		
			arr_Msg=txtVal;
			nMsgIndex=0;	
			// alert('txtVal = ' + txtVal);
			
			// текущая выводимая буква
			// $("#cur_letter").text('-');
				
			delete carray;
			carray=[];
			for(i=0; i<NUM_CIRCLES; i++)
				carray[i] = new Circle(Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT), RADIUS);	
			
			// draw_interval_id
			if (draw_interval_id > 0) {
				clearInterval(draw_interval_id);
			}			
			// draw_interval_id = setInterval(draw,33);				
			draw_interval_id = setInterval(draw,loop_time);				
			
			// alert('applyChanges() - finally.');
			// $('.label-2:first').text('(interval_id = ' + draw_interval_id + ')');		
			
		} catch(e) {
			// alert('ERROR at setLetter( ' + c + ' ) e.name = ' + e.name);
			$('.label-2:first').text('ERROR at applyChanges(): ' + e.name);
			
		} finally {
			// alert('applyChanges() - finally.');
		}				
	}


	//
	//---------------------------   Start app logic   ---------------------->>
	//
	init();
});