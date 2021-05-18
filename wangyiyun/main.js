var app =new Vue({
    el:"#main",
    data:{
        query:'',
        musicList:[],
        musicUrl:'',
        musicCover:'',
        name:'',
        comment:[],
    },
    mounted:function(){
        this.query='薛之谦'
        this.searchMusic()

    },
    methods:{
        searchMusic(){
            var that=this;
            axios.get("https://autumnfish.cn/search?keywords=" + this.query)
                .then(function (response) {
                   that.musicList=response.data.result.songs

                },function (err) {})
        },
        playMusic:function(musicId){
            var that = this;
            // https://autumnfish.cn/song/url?id=536570450
            axios.get("https://autumnfish.cn/song/url?id=" + musicId)
                .then(function(respones){
                    that.musicUrl = respones.data.data[0].url
                },function(err){
                    console.log(err)
                })
            axios.get("https://autumnfish.cn/song/detail?ids=" + musicId)
                .then(function(respones){
                    that.musicCover = respones.data.songs[0].al.picUrl
                    that.name = respones.data.songs[0].name
                },function(err){
                    console.log(err)
                })
            axios.get("https://autumnfish.cn/comment/hot?type=0&id=" + musicId)
                .then(function(respones){
                    that.comment = respones.data.hotComments
                },function(err){
                    console.log(err)
                })

            /*点击歌名开始播放*/
            $(function(){
                $('#play_btn').addClass("on");
                var audio = $('audio').get(0);
                var totalWidth = $("#pgs").width();  //进度条长度
                function startAudio(){
                    audio.play();
                    $("#play_btn").addClass("on");
                }
                function endAudio(){
                    audio.pause();
                    $("#play_btn").removeClass("on");
                }
                /*在调用 Audio 的 play() 方法之后就立即被之后一次调用 pause() 方法中断了。
                错误提示中明确指出了调用 play 方法是返回了一个Promise对象。
                那么上述的问题就有了解决方法： 在 play() 执行成功后，播放音频，然后执行后续操作*/
                var playPromise;
                playPromise = audio.play();
                if (playPromise) {
                    playPromise.then(() => {
                        // 音频加载成功
                        // 音频的播放需要耗时
                        setTimeout(() => {
                            // 后续操作
                            console.log("done.");
                        }, audio.duration * 1000); // audio.duration 为音频的时长单位为秒


                    }).catch((e) => {
                        // 音频加载失败
                    });
                }
                /**
                 * 获取音频总时长，并转化为 00:00格式
                 */
                $('#audio').on("loadedmetadata",function () {
                    $('#totalTime').text(transTime(this.duration));
                });


                /**
                 * 开始/暂停按钮点击事件
                 */
                $('#play_btn').click(function(e){
                    if(audio.paused ){
                        startAudio();
                    }else{
                        endAudio();
                    }
                });
                /**
                 * 播放进度
                 */
                audio.addEventListener('timeupdate',updateProgress,false);
                //更新进度条
                function updateProgress() {
                    var value = Math.round((Math.floor(audio.currentTime) / Math.floor(audio.duration)) * 100, 0);
                    $('.pgs-play').css('width', value + '%');
                    $("#circle").css({"left":(audio.currentTime/audio.duration)*totalWidth-1+"px"});
                    $("#playedTime").html(transTime(audio.currentTime));
                }

                $("#pgs").click(function(e){
                    var startX = $(this).offset().left;  //进度条开始的x坐标
                    var endX = e.clientX;  //点击事件的x坐标
                    rate = (endX - startX) / totalWidth;
                    $("#circle").css({"left":(endX-startX-1)+"px"});
                    audio.currentTime = rate*audio.duration;
                    updateProgress();
                });

                /**
                 * 播放结束
                 */
                audio.addEventListener('ended',endAudio,false);

                $("#circle").on("touchstart",function(e){
                    endAudio();
                });
                $("#circle").on("touchmove",function(e){
                    e.preventDefault();
                    var startX = $("#pgs").offset().left;  //进度条开始的x坐标
                    var endX = e.originalEvent.touches[0].clientX;  //点击事件的x坐标
                    if((endX+1) > startX && endX < (startX+totalWidth)){  //触摸范围大于进度条起点，小于进度条终点
                        $("#circle").css({"left":(endX-startX-1)+"px"});
                        rate = (endX - startX) / totalWidth;
                        audio.currentTime = rate*audio.duration;
                        updateProgress();
                    }
                });
                $("#circle").on("touchstart",function(e){
                    startAudio();
                });


                //转换音频时长显示
                function transTime(time) {
                    var duration = parseInt(time);
                    var minute = parseInt(duration/60);
                    var sec = duration%60+'';
                    var isM0 = ':';
                    if(minute == 0){
                        minute = '00';
                    }else if(minute < 10 ){
                        minute = '0'+minute;
                    }
                    if(sec.length == 1){
                        sec = '0'+sec;
                    }
                    return minute+isM0+sec
                }

            });
        },
        next:function (){
            console.log(this.musicList[2].id)
            this.playMusic(this.musicList[2])

        }
    }
})


