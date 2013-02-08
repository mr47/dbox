function get_access_token(callback){
 if (!token){
        var wndLogin = gui.Window.open('https://oauth.vk.com/authorize?client_id='
            +vk_app.app_id
            +'&redirect_uri='
            +vk_app.redirect_uri
            +'&scope='
            +vk_app.scope
            +'&response_type=token&display='
            +vk_app.display_type,{
                position: 'center',
                width: 400,
                height: 400,
                toolbar: false,
                show: false,
                frame:true
            });
        wndLogin.on('loaded',function(){
            wndLogin.show();
            var test_str = this.window.location.toString().indexOf(vk_app.redirect_uri);
            if (test_str==0){
                var tmp_token = qs.parse(this.window.location.hash.toString().replace('#',''));
                settings['user'] = JSON.stringify(tmp_token);
                token = tmp_token; 
                callback();
                this.close(true);
            }       
        });
    } else {
       callback(); 
    }
}

function call_api_pl(method,params){
    $(document).ready(function(){
        if (flags.off("--true-loading")) $("#loading").removeClass("hide");
    });
    return $.post("https://api.vk.com/method/"+method+"?"+"access_token="+token.access_token,params).done(function(){
        if (flags.off("--true-loading")) {
            setTimeout(function(){
                $("#loading").fadeOut('fast');
                $("#playlist").fadeIn("fast");
            },1000);      
        }
    });
}
function call_api(method,params){
    return $.post("https://api.vk.com/method/"+method+"?"+"access_token="+token.access_token,params);
}
function convert_to_taffyF(data){
    var items = [];
    settings['user-info'] = JSON.stringify(data.response[0]);
    for(var i=1;i<data.response.length;i++){
        items.push(data.response[i]);
    }
    return items;
}
function load_vk_playlist(){
    call_api_pl("audio.get",{
        need_user:1
    }).done(function(data){
        if (flags.on("--debug")) console.log(">>loaded objs : "+data);
        if (data.error){
            delete settings['token'];
            delete token;
            if (flags.on("--debug")) console.log(data.error);
            if (data.error.error_code==5){
                get_access_token(function(){
                    load_vk_playlist();
                });
            }
        }
        var cdata = convert_to_taffyF(data);
        playlist = TAFFY(cdata);
        settings['pl'] = JSON.stringify(cdata);
        render_playlist();
    });
}
function next_track(){
    var next = $(".selected-track").next().attr("data-id");
    if (currentTrack==playlist(currentTrack).last().___id)
    song.setTrack();
}
function render_playlist(){
    if (flags.on("--debug")) if (flags.on("--debug")) console.log(">>rendering playlist");
    $(document).ready(function(){
        $("#track-tpl").tmpl(playlist().limit(15).get()).appendTo("#playlist");
        song.setTrack(playlist().first());
        $(".track #play-pl").on('click',function(){
            var $tracks = $(".track");
            $tracks.removeClass('selected-track').find("#play-pl").removeClass('hide').next().addClass('hide');
            
            if (state==0) song.stop();
            
            var $track = $(this).parent().parent();
            var $pauseBtn = $(this).next()
            $track.toggleClass('selected-track');
            $(this).toggleClass('hide');
            $pauseBtn.removeClass('hide');

            if (flags.on("--debug")) console.log(">>set track "+$track.attr('data-id').toString());
            if (flags.on("--debug")) console.log(playlist($track.attr('data-id')).first());
            
            song.setTrack(playlist($track.attr('data-id')).first());
            currentTrack = $track.attr('data-id');
            $("div[data-id='"+currentTrack+"']").addClass("selected-track");
            song.play();

            $(".pause-btn").toggleClass('hide');
            $(".play-btn").toggleClass('hide'); 
        });
        $(".track #pause-pl").on('click',function(){
            var $track = $(this).parent().parent();
            $(this).addClass('hide');
            song.pause();
            $(this).prev().removeClass(hide);   
            $track.toggleClass('selected-track'); 
            $(".pause-btn").toggleClass('hide');
            $(".play-btn").toggleClass('hide');
            state = 0;
        });
    });
}

function secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
}