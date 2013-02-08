var flags = ["--debug","--true-loading","--test"];

var gui = require("nw.gui");
var fs = require("fs");
var req = require('request');
var qs = require('querystring');

var settings = localStorage;
var token = $.parseJSON(settings['user']);
var Update = -1;
var song = {};
var playlist = {};

var state = -1;
// state -1 first launch
// state 0 played track
// state 1 playing
// state 2 stoped
// state 3 paused

var currentTrack = {};

var vk_app = {
    app_id:"1862335",
    redirect_uri:"https://oauth.vk.com/blank.html",
    scope:"audio,offline",
    display_type:"popup"
};

Array.prototype.on = function(fl){
    return (this.indexOf(fl)!==-1);
};
Array.prototype.off = function(fl){
    return (this.indexOf(fl)==-1);
};