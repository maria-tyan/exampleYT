var project = {
    init: function() {
        this.initCache();
        this.initYouTube();
    },

    initCache: function() {
        this.$body = $('body');
        this.$loadVideo = $('.js-loadVideoById-video');
        this.$cueVideo = $('.js-cueVideoById-video');
        this.$playVideo = $('.js-play-video');
        this.$stopVideo = $('.js-stop-video');
        this.$forwardVideo = $('.js-forward-video');
        this.$backwardVideo = $('.js-backward-video');
        this.$videoImg = $('.js-img');
        
    },
    initYouTube: function () {
        var tag = document.createElement('script'); 
        tag.src = "https://www.youtube.com/iframe_api"; 
        var firstScriptTag = document.getElementsByTagName('script')[0]; 
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        var player; 
        var playerBg;
        var domen = window.location.hostname;
        var videoID = $('#video-player').attr('data-id');

        window.onYouTubeIframeAPIReady = function() {
            player = new YT.Player('video-player', { 
                height: '360', 
                width: '640', 
                videoId: videoID, 
                events: { 
                    'onReady': onPlayerReady
                } 
            }); 

            playerBg = new YT.Player('video-bg', { 
                height: '1240', 
                width:  '2200', 
                playerVars: {
                    'rel': 0, 
                    'controls': 0, 
                    'showinfo': 0, 
                    'autoplay': 1, 
                    'origin': domen
                },
                videoId: 'HtBEf2D0x5Y', 
                events: { 
                    'onStateChange': onPlayerStateChange
                }
            });            
        }

        function  onPlayerStateChange(event) {
            if (event.data == 1) {
                playerBg.mute();
                project.$videoImg.hide();
            }
            if (event.data == 0) {
                playerBg.seekTo(0);
                playerBg.playVideo();
            }
        }

        function onPlayerReady(event) {
            // event.target.playVideo();
        }

        

        this.$loadVideo.click(function () {
            videoID = $(this).attr('data-id');
            player.loadVideoById(videoID);
        });

        this.$cueVideo.click(function () {
            videoID = $(this).attr('data-id');
            player.cueVideoById(videoID);
        });

        this.$playVideo.click(function () {
            player.playVideo();
        });

        this.$stopVideo.click(function () {
            player.stopVideo();
        });

        this.$backwardVideo.click(function () {
            var time = player.getCurrentTime();
            player.seekTo(time - 10);
        });

        this.$forwardVideo.click(function () {
            var time = player.getCurrentTime();
            player.seekTo(time + 10);
        });
    }

};

$(document).ready(function () {
    project.init();
});


