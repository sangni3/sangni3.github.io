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
        this.query='华晨宇'
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
        }
    }
})
