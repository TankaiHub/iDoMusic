<template>
    <div class="base-playerBar">
        <div class="bar-box">
            <div class="img-text" @click='showPlayer'>
                <img :class="{ rotate: isRotate }" :src="picUrl" alt="">
                <div class="text">
                    <span>{{songName}}</span>
                    <span v-if='songName'>{{singerName}}</span>
                </div>
            </div>
            <div class="icon-box">
                <img src="@/assets/play2.png" v-show='!isPlay' alt="" @click='play'>
                <img src="@/assets/pause2.png" alt="" v-show='isPlay' @click='play'>
                <img src="@/assets/list2.png" alt="" @click='showList'>
            </div>
        </div>

        <div class="songListPage-wrap" v-show='isShow'>
            <img :src="picUrl" v-if='picUrl' alt="" class='blurImg'>
            <div class="detail">
                <!-- back -->
                <div class="song-back" @click.stop='hidePlayer'>
                    <img src="@/assets/downWhite.png" alt="">
                </div>

                <!-- title 歌曲名称 -->
                <div class="song-title">
                    <div class="music-name">{{songName}}</div>
                </div>

                <!-- img 歌手图片 -->
                <div class="song-img">
                    <img :class="{ rotate: isRotate }" :src="picUrl" alt="">
                </div>

                <!-- music-info 歌手信息 -->
                <div class="song-info">
                    <div class="singer-ablum">{{singerName}}</div>
                </div>

                <!-- progress-wrap 进度条 -->
                <div class="progress-wrap">
                    <div class="progress">
                        <span class='runTimer'>{{handleTime(currentTime)}}</span>
                        <div class='progress-box' ref='Probar'>
                            <div class="top-progress">
                                <div class="progress-bar" ref='bar' @mousedown='move'>
                                    <div class="slider"></div>
                                </div>
                            </div>
                        </div>
                        <span class='total-time'>{{handleTime(duration)}}</span>
                    </div>
                </div>
            </div>
            <!-- controls 控制区 -->
            <div class="controls-wrap">
                <div class="controls">
                    <img src="@/assets/sequence.png" v-show="mode == 'loop'" @click='changeMode' alt="">
                    <img src="@/assets/random.png" v-show="mode == 'random'" @click='changeMode' alt="">
                    <img src="@/assets/loop.png" v-show="mode == 'sequence'" @click='changeMode' alt="">
                    <img src="@/assets/previous.png" @click='prev' alt="">
                    <img src="@/assets/play.png" v-show='!isPlay' @click='play' alt="">
                    <img src="@/assets/pause.png" v-show='isPlay' @click='play' alt="">
                    <img src="@/assets/next.png" @click='next' alt="">
                    <img src="@/assets/list.png" @click='showList' alt="">
                </div>

            </div>
        </div>
        <PlayList :title='playTitle' :hint='playHint' :playListData='playListData' class='playList'
            :style='{left:playLeft+ "px"}' :show='true' @down='down' @getProp='getProp' @deleteProp='deleteProp'
            @clearProp='clearProp' />
        <audio ref='audio' :src="musicUrl" @timeupdate='timeupdate' @ended='ended' @error='error'></audio>
        <!-- <div class='lyricBox' v-show='isShow'>
            <div :class=' {lyricBtn:true, up:isUp }' @click.stop='butIsUP'></div>
            <div class="lyric" v-show='isUp'>
                <div v-if='lyricArray.length == 0' style="font-size: 16px; margin-top:150px;">{{noLyc}}</div>
                <my-scroll style='height:300px;' ref='scorllLyc'>
                    <div ref='lyricList'>
                        <div class="lyric-temp" 
                             ref='lyricLine'
                             :class='{ active:currentLineNum === index }'
                             v-for="(item, index) in lyricArray.lines" 
                             :key='index'>{{item.txt}}</div>
                    </div>
                </my-scroll>
                
            </div>


        </div> -->
    </div>
</template>
<script>
    import { getUrl, getDetail, getLyric } from '@/api/play.js'
    import { STATUS_TEXT } from '@/api/config.js'
    import PlayList from '@/base/playList'
    import myScroll from '@/base/Scroll'
    import { mapState } from 'vuex'
    import Lyric from "lyric-parser"
    
    export default { 
        name: "playerBar",
        components: {
            PlayList,
            myScroll
        },


        data() {
            return {
                playTitle: '播放列表',
                playHint: '暂无播放',
                playListData: [],//播放列表
                playLeft: 9999,//base-playList 设置页面的left
                isPlay: false, //播放 or 暂停
                isShow: false, //进度条页面
                isBasePlayListShow: false,//base-playList 播放列表是否显示
                isRotate: false,
                isUp: false,//歌词控制

                currentTime: 0,//当前时间
                duration: 0,//总时间
                songName: '播放列表为空啦~~',//歌名
                singerName: '',//歌手名
                picUrl: '',
                lyricArray: [],//歌词
                lyricActive:-1,
                noLyc:'没有歌词',
                currentLineNum:0,

                myPlayListLeft: 0,//base-playList 的left  副本

                musicUrl: '',//audio src
                myMode: ['sequence', 'loop', 'random'],
                currentPlayList: [],//当前播放列表
            }
        },
        watch: {
            percent(newVal) {
                if (newVal > 0 && this.isPlay == true) {
                    const barW = this.$refs.Probar.clientWidth - 10;
                    const offsetW = newVal * barW;
                    this.$refs.bar.style.width = `${offsetW}px`;
                }
            },
            isClick() {
                console.log(this.isClick)
                if (this.isClick) {
                    this.$store.commit('set_sequencePlayList', JSON.parse(JSON.stringify(this.musicPlayList)));
                    this.currentPlayList = this.musicPlayList;
                    this.playListData = this.currentPlayList.map((item) => {
                        return item.name;
                    }); 
                }
            },
            mode() {
                if (this.isClick) {
                    if (this.mode == 'random') {
                        
                        this.currentPlayList = this.sequencePlayList.sort((a, b) => {
                            return Math.random() - 0.5;
                        });
                       
                    } else if (this.mode == 'sequence' || this.mode == 'loop') {
                        // let a = JSON.parse(JSON.stringify(this.musicPlayList));
                        this.currentPlayList = JSON.parse(JSON.stringify(this.musicPlayList));
                        // console.log(a)
                    }
                }
            }

        },
        computed: {
            ...mapState(['musicPlayList', 'sequencePlayList', 'currentIndex', 'musicId', 'mode', 'isClick']),
            percent() {
                return this.currentTime / this.duration
            },

        },
        created() {
            this.$watch(function () { this.musicId; this._initData(); })
            
            
        },
        methods: {
            _initData() {
                this.isPlay = false;
                if (this.musicId) {
                    let _getUrl = getUrl(this.musicId);
                    let _getDetail = getDetail(this.musicId);
                    let _getLyric = getLyric(this.musicId)
                    this.lyricArray = [];
                    Promise.all([_getUrl, _getDetail, _getLyric]).then(res => {
                        if (res[0].statusText == STATUS_TEXT) {
                            this.musicUrl = res[0].data.data[0].url;
                            setTimeout(() => {
                                this.$refs.audio.play()
                                this.isPlay = true;
                                this.isRotate = true;
                            }, 1000)
                        }
                        if (res[1].statusText == STATUS_TEXT) {
                            let data = res[1].data.songs[0];
                            let arr = [];
                            this.duration = data.dt / 1000; //总时间

                            (data.ar).forEach((item, index) => {
                                arr.push(item.name);
                            });//歌手

                            this.singerName = arr.join('/ ') + "--" + data.name;
                            this.songName = data.name//歌名
                            this.picUrl = data.al.picUrl;
                            // blurImg(this.picUrl, this.$refs.songWrap);
                        }
                        if (res[2].statusText == STATUS_TEXT) {
                            if (!res[2].data.nolyric) {
                                let lyric = res[2].data.lrc.lyric;
                                this.lyricArray = new Lyric(lyric, this.hanlder);
                                this.lyricArray.play();
                                if (this.isPlay) {
                                    this.lyricArray.seek(this.$refs.audio.currentTime * 1000);
                                }
                            }
                            
                        }
                    }, err=>{
                        console.log('err--> playerBar');
                    });
                }
            },
            hanlder(opts) {
            
                // this.currentLineNum = opts.lineNum;
                // if (opts.lineNum > 5) {
                //     let lineEl = this.$refs.lyricLine[opts.lineNum - 5];
                //     this.$refs.scorllLyc.scrollToElement(lineEl,500,0,0)// 滚动到元素
                // } else {
                //     this.$refs.scorllLyc.scrollTo(0, 0, 5000)// 滚动到顶部
                // }
                // this.playingLyric = opts.txt;
            },
            // handleLyric(lyric) {
            //     let arr = lyric.split(/\n/);
            //     let lyricArray = [];
            //     // 00:00.000
            //     let lycReg = /\[(\d+\:\d+\.\d+)\]/g;
            //     let timeReg = /\d+\:\d+/g;
            //     for (let i = 0; i < arr.length; i++) {
            //         let lycTemp = arr[i].replace(lycReg, '');
            //         let timeTemp = arr[i].match(timeReg)
                    
            //         if (timeTemp != null) {
            //             lyricArray.push({ lyc: lycTemp, time: this.reverseTime(timeTemp[0]), lineNum:i});
            //         }
                   
            //     }
            //     return lyricArray;
            // },
            play() {
                if (this.musicId) {
                    if (!this.isPlay) {
                        this.isPlay = !this.isPlay;
                        this.duration = this.$refs.audio.duration;
                        this.$refs.audio.play();
                        this.isRotate = true;
                    } else {
                        this.isPlay = !this.isPlay;
                        this.$refs.audio.pause();
                        this.isRotate = false;
                    }
                }
            },
            timeupdate(e) {
                this.currentTime = e.target.currentTime;

            },
            ended(e) {
                if (this.mode == 'loop') {
                    this.next();
                } else {

                    this._initData();
                }
            },
            error() {
                console.log('error -->来自playerBar audio ->error')
            },
            toPlayer(id) {
                this.$router.push();
            },
            showPlayer() {

                this.isShow = true;
            },
            //隐藏进度条页面
            hidePlayer() {
                this.$store.commit('set_isClick', false);
                this.playLeft = -9999;
                this.isShow = false;
            },
            changeMode() {
                //是否循环 单曲  随机  
                let index = this.myMode.findIndex(item => {
                    return item == this.mode;
                });
                index = index === 2 ? 0 : ++index
                this.$store.commit('set_mode', this.myMode[index]);
            },
            //上一曲
            prev() {
                if (this.currentPlayList.length == 0) return;
                let index = this.currentIndex;
                for (let i = 0; i < this.currentPlayList.length; i++) {
                    if (this.currentPlayList[i].id == false) continue
                }
                if (this.currentIndex < 1 || this.currentIndex == -1) {
                    this.$store.commit('set_currentIndex', this.currentPlayList.length - 1);
                } else {
                    this.$store.commit('set_currentIndex', --index);
                }
                this.$store.commit('set_musicId', this.currentPlayList[this.currentIndex].id);
                console.log(this.currentPlayList[this.currentIndex].id)
                // this._initData();
            },
            //下一曲
            next() {
                if (this.currentPlayList.length == 0) return;

                let index = this.currentIndex;
                for (let i = 0; i < this.currentPlayList.length; i++) {
                    if (this.currentPlayList[i].id == false) continue
                }
                if (this.currentIndex == this.currentPlayList.length - 1) {
                    this.$store.commit('set_currentIndex', 0);
                } else {
                    this.$store.commit('set_currentIndex', ++index);
                }
                this.$store.commit('set_musicId', this.currentPlayList[this.currentIndex].id);
                // this._initData();
            },
            showList() {
                this.playLeft = 0;
            },
            down(l) {
                this.myPlayListLeft = l;
                this.playLeft = -l;
            },
            getProp(e) {
                this.isShow = true;
                let text = e.item;
                let name = this.currentPlayList.filter((item, index) => {
                    return text == item.name;
                });
                //
                this.$store.commit('set_musicId', name[0].id);
                this.$store.commit('set_currentIndex', e.index);
                if (this.myPlayListLeft == 0) {
                    this.playLeft = -9999;
                } else {
                    this.playLeft = this.myPlayListLeft;
                }

                this._initData();
            },
            deleteProp(num) {
             
                this.musicPlayList.forEach((item, index) => {
                    if (index == num) {
                        // this.playListData.splice(num, 1);
                        this.currentPlayList.splice(num, 1);
                        this.playListData.splice(num, 1);
                    }
                });
                this.$store.commit('set_musicPlayList', this.currentPlayList);
            },
            clearProp() {
                this.currentTime = 0;
                this.duration = 0;
                this.songName = '暂无';
                this.singerName = '';
                this.picUrl = '';
                this.musicUrl = '';
                this.currentPlayList = [];
                this.playListData = [];
                this.lyricArray = [];
                this.isShow = false;
                this.playLeft = -9999;
            },

            butIsUP() {
                this.isUp = !this.isUp;
                if (this.isUp) {
                  
                }
            },



            handleTime(totalTime) {
                totalTime = Math.round(totalTime);
                let min = Math.floor(totalTime / 60);
                let sec = totalTime - (min * 60);
                return ('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2)
            },
            reverseTime(time) {
                let arr = time.split(':');
                let totalTime = parseInt(arr[0]) * 60 + parseInt(arr[1]);
                return totalTime;
            },
            move(e) {
                let mX;
                let target = e.target;
                let dX = e.x - target.offsetLeft;
                document.onmousemove = e => {
                    mX = e.x - dX;
                    if (mX >= this.$refs.Probar.clientWidth) {
                        mX = this.$refs.Probar.clientWidth;
                    } else if (mX <= 0) {
                        mX = 0;
                    }
                    this.$refs.bar.style.width = mX + 'px';

                }
                document.onmouseup = e => {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    //进度条跳转  时间跳转  歌曲进度跳转 --> 时间跳转
                    let ct = this.$refs.Probar.clientWidth / mX;
                    this.currentTime = this.duration / ct;
                    this.$refs.audio.currentTime = this.currentTime;
                }
            },
        },

    }
</script>
<style lang="less">
    .base-playerBar {
        position: relative;
        /* transform: rotate() */
        width: 100%;
        height: 45px;

        .bar-box {
            display: flex;
            justify-content: space-between;
            box-shadow: 0 0 0 3px #ccc;
            background-color: #fff;

            .img-text {
                position: relative;
                line-height: 45px;
                width: 50%;

                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: block;
                    width: 42px;
                    height: 42px;
                    background: red;
                    border-radius: 50%;
                }


                .text {
                    padding-left: 47px;
                    line-height: 22px;
                    display: flex;
                    flex-direction: column;

                    span {
                        display: block;
                        width: 100%;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }

            .icon-box {
                display: flex;

                img {
                    display: block;
                    width: 45px;
                    height: 45px;
                }
            }
        }

        .songListPage-wrap {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            background-color: #000;
         
            .blurImg{
                position: absolute;
                top:0;
                left:0;
                width:100%;
                height:100%;
                -webkit-filter: blur(10px);
                filter: blur(10px);
            }
            .detail {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 100px;

                .song-back {
                    position: relative;
                    width: 100%;

                    img {
                        width: 30px;
                        height: 30px;
                        padding: 15px;
                    }

                }

                .song-title {
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    font-size: 16px;
                    color: #fff;
                }

                .song-img {
                    position: relative;
                    width: 50%;
                    height: 0;
                    padding-top: 50%;
                    margin: 0 auto;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 8px solid hsla(0, 0%, 78.4%, .3);

                    img {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }
                }

                .song-info {
                    position: absolute;
                    bottom: 150px;
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    font-size: 16px;
                    color: #fff;

                    .singer-ablum {
                        width: 50%;
                        margin: 0 auto;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

                .progress-wrap {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;

                    .progress {
                        display: flex;
                        align-items: center;
                        width: 90%;
                        margin: 10px auto;
                        height: 30px;
                        color: #fff;
                        font-size: 14px;

                        .progress-box {
                            flex: 1;
                            width: 100%;
                            background: #fff;

                            .top-progress {
                                position: relative;
                                width: 100%;
                                height: 3px;

                                .progress-bar {
                                    position: absolute;
                                    width: 0;
                                    height: 3px;

                                    .slider {
                                        position: absolute;
                                        top: 50%;
                                        right: -10px;
                                        transform: translateY(-50%);
                                        width: 10px;
                                        height: 10px;
                                        background: #fff;
                                        border-radius: 50%;
                                    }
                                }
                            }
                        }

                        .runTimer {
                            margin-right: 15px;
                        }

                        .total-time {
                            margin-left: 15px;
                        }
                    }
                }

            }

            .controls-wrap {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;


                .controls {
                    display: flex;
                    width: 90%;
                    height: 60px;
                    justify-content: space-around;
                    align-items: center;
                    margin: 20px auto;

                    img {
                        width: 13%;
                    }
                }
            }


        }

        img.rotate {
            animation: rotate 20s infinite ease-in;
        }

        @keyframes rotate {
            0% {
                transform: rotateZ(0)
            }

            100% {
                transform: rotateZ(1turn)
            }
        }

        .playList {
            position: fixed;
            left: 0;
            top: 265px;
            transition: all .5s;
            background: #fff;
            z-index: 999;
        }

        .lyricBox {
            position: absolute;
            top: -538px;
            right: 0;
            z-index: 99;

            .lyricBtn {
                position: absolute;
                top: 20px;
                right: 15px;
                width: 0;
                height: 0;
                border-width: 15px;
                border-style: solid;
                border-color: #fff transparent transparent transparent;
                
            }

            .lyricBtn.up {
                top: 5px;
                border-color: transparent transparent #fff transparent;
            }

            .lyric {
                position: absolute;
                top: 35px;
                right: 0;
                width: 200px;
                height: 300px;
                text-align: center;
                background-color: #fff;
                opacity: 0.8;
                overflow: hidden;

                .lyric-temp {
                    line-height: 30px;
                }
                .lyric-temp.active{
                    color:red;
                }
            }
           
        }
    }
</style>