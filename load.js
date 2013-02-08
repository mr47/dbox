var gui = require("nw.gui");
var fs = require("fs");
var req = require('request');
var qs = require('querystring');

var settings = localStorage;
var token = $.parseJSON(settings['user']);
var Update = -1;
var song = new maudio();
var playlist = {};

var state = -1;
// state -1 first launch
// state 0 played track
// state 1 playing
// state 2 stoped
// state 3 paused

var currentTrack = {};

get_access_token(function(){
 /*   if (typeof settings['pl']==undefined){*/
        load_vk_playlist();
        if (flags.on("--debug")) console.log(">>loaded from vk.com")
/*    } else {
        playlist = TAFFY(settings['pl']);
        render_playlist();
        if (flags.on("--debug")) console.log(">>loaded from store")
    }*/
});
function toggle_view(div){
    $(div).toggleClass("hide");
}
$(document).ready(function(){
	gui.Window.get().show();
    song.volume(1);
    $(".button").on('click',function(e){
    	e.preventDefault();
    });

    $(".play-btn").on('click',function(){
		$(".pause-btn").toggleClass('hide');
		$(".play-btn").toggleClass('hide');    
        var $track =  $("div[data-id='"+currentTrack+"']");
        $track.addClass("selected-track");  
        $track.find("#pause-pl").toggleClass('hide');
        $track.find("#play-pl").toggleClass('hide');
        song.play();
    });
    $(".pause-btn").on('click',function(){
        var $track =  $("div[data-id='"+currentTrack+"']");
		$(".play-btn").toggleClass('hide');
		$(".pause-btn").toggleClass('hide'); 
        $track.find("#play-pl").removeClass('hide').next().addClass('hide');
        $track.toggleClass('selected-track'); 
        song.pause(); 

    });
    $(".progressbar").bind("change",function(){
        song.seek($(this).val());
    });
    $(".volumebar").bind("change",function(){
        song.volume($(this).val());
    });
});



