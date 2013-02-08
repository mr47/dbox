var maudio = function(){

	var audio = new Audio();
	var status = '';
	var LoadedTimer = -1;
	var maudioObject = this;
	var loaded = false;
	var sasTimer = -1;
	if (flags.on("--debug")) console.log(">>create");
	
	audio.preload = 'auto';

	this.play = function(){
		state = 0;
		if (!loaded) { 
			//audio.load();
	        LoadedTimer = setInterval(function(){
	        	if (audio.readyState==4){
	        		maudioObject.loadProgress();
	        		$(".progressbar").attr("max",audio.duration);
	        	}
	        },350);				
			loaded = true;
		}		
		audio.play();				
	};

	
	this.setMedia = function(data){
		audio.src = data.toString();
	};
	
	this.stop = function(){
		audio.pause();
		//audio.currentTime = 0;
		loaded = false;
		state = 3;
	};
	
	this.pause = function(){
		audio.pause();
		state = 2;
	};
	
	this.seek = function(val){
		this.pause();
		if (val>audio.buffered.end(0)) return;
		audio.currentTime = val;
		setTimeout(function(){audio.play(0)},700);// hack for smooth seek
	};
	
	this.volume = function(val){
		if (val>0) {audio.volume = val/100;} else audio.volume = 0;
		$(".volumebar").attr("value",val);
		if (flags.on("--debug")) console.log(">>set volume to "+val);
	};

	this.setLoadProgress = function(pr){
		$('.progressbar').css("background","-webkit-gradient(linear, left top, right top, color-stop(0%,#5C7A99), color-stop("+pr+"%,#5C7A99), color-stop("+pr+"%,#D8DEE4), color-stop(100%,#D8DEE4))");
	};
	this.loadProgress = function(){
		var loaded = (audio.buffered.end(0)/audio.duration)*100;
		this.setLoadProgress(loaded);
		if (loaded==100) {
			clearInterval(LoadedTimer);
			if (flags.on("--debug")) console.log(">> download ended ...");
		}
	};
	this.timeLeft = function(){
		return secondsToHms(audio.duration-audio.currentTime);
	};
	this.curTime = function(){
		return secondsToHms(audio.currentTime);
	};
	this.duration = function(){
		return secondsToHms(audio.duration);
	};
	audio.addEventListener("timeupdate",function(){
		curtime = parseInt(audio.currentTime, 10);
		$(".progressbar").attr("value", curtime);
		$("#timeleft .time").html("-"+maudioObject.timeLeft());
	});
	this.setTrack = function(track){
		this.setMedia(track.url);
		currentTrack = track.___id;
		$(".bars span.artist").html(track.artist);
		$(".bars span.title").html(track.title);
		$(".bars span.artist").html(track.artist);
		state = 1;
	};
	this.slowAudioSwitch = function(){
		var startval = $(".volumebar").val();
		if (flags.on("--debug")) console.log(">>slow audio switch");
		sasTimer = setInterval(function(){
			maudioObject.volume(startval);
			//if (flags.on("--debug")) console.log(">> set volume to"+startval);			
			startval = startval-1;
			if (startval<1) {
				clearInterval(sasTimer);
				//next track
			} 
		},30);
	}
};

song = new maudio();

