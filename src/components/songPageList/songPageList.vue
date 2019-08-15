<template>
    <div class='page-songPageList'>
        <div class="songPageList-wrapper">
            <div class="header-container">
                <div class="icon-back">
                    <img src="@/assets/back.png" alt="" @click='onBack'>
                </div>
                <div class="title">{{type}}</div>
            </div>
            <div class="introduce-box">
                <div class="introduce">
                    <div class="img-box">
                        <img :src="imgUrl" alt="" class='imgUrl'>
                        <div class="cover-count">
                            <img src="@/assets/playcount.png" alt="">
                            <span v-if='playCount'>{{ count(playCount)}}</span>
                        </div>
                    </div>
                    <div class="desc-box">
                        <div class="name">{{descName}}</div>
                        <div class="desc" v-show='desc'>{{desc}}</div>
                    </div>
                </div>
                <div class="border"></div>
            </div>
            <div class='list-box'>
                <music-list :songListData='songListData' @onClick='onClick' />
            </div>
        </div>
        <div class='load-wrap' v-if='isLoad'>
            <Loading class='load' />
        </div>
    </div>
</template>
<script>
    import musicList from '@/base/musicList'
    import Loading from '@/components/loading/Loading'
    import { STATUS_TEXT } from '@/api/config.js'
    import { getRecommendListData, getSingerListData } from '@/api/songPage.js'
    import { CreateListData } from '@/common/createDataList.js'
    import { mapState, mapMutations } from 'vuex'


    export default {
        name: 'songPageList',
        data() {
            return {
                isLoad: true,
                songListData: [],
                type: '',
                id: '',
                dot: '',
                imgUrl: '',
                descName: '',
                desc: '',
                playCount: '',
                getDataArray: [getRecommendListData, getSingerListData]
            }
        },
        components: {
            musicList,
            Loading
        },
        watch: {

        },
        // beforeRouteLeave(to, from, next) {
        //     // // ...
        //     console.log(to, from)
        //     to.meta.keepAlive = false;
        //     next();
        // },
        computed: {
            ...mapState(['isClick', 'currentIndex'])
        },
        created() {
            console.log(this.$route.query, 'songPageList')
            if (this.$route.query) {
                this.type = this.$route.query.dataType
                this.id = this.$route.query.id;  //根据id 发送数据
                if (this.$route.query.dot) this.dot = this.$route.query.dot
                this.songListData = [];
                this.imgUrl = '';
                this.descName = '';
                this.desc = '';
                this.playCount = '';
                this._initData(this.id, this.type, this.$route.query.currType);
            }
        },
      
        methods: {
            _initData(id, type, currType) {
                let typeArray = ['RECOMMEND', 'RANK', 'SINGER'];
                let index = typeArray.findIndex((ele) => {
                    return ele == type;
                });
                if (index == 2 && this.dot) {
                    index = 1;
                } else {
                    if (index == 1) index = 0;
                    if (index == 2) index = 0;

                }
                this.getDataArray[index](id).then(res => {
                    if (res.statusText == STATUS_TEXT) {
                        // console.log(res.data)

                        if (res.data.playlist) {
                            let data = res.data.playlist;
                            this.imgUrl = data.coverImgUrl;
                            this.descName = data.name;
                            this.desc = data.description;
                            this.playCount = data.playCount;
                            data.tracks.forEach((item, index) => {
                                this.songListData.push(new CreateListData('', item.id, item.ar[0].name, item.al.picUrl, item.name, false));
                            });
                        } else if (res.data.hotSongs) {
                            let data = res.data.hotSongs;
                            this.imgUrl = res.data.img1v1Url;
                            this.descName = res.data.artist.alias[0];
                            this.desc = res.data.briefDesc;
                            this.playCount = false;
                            data.forEach((item, index) => {//歌手
                                let arr = [];
                                (item.ar).forEach((item1, index1) => {
                                    arr.push(item1.name);
                                });

                                let temp = arr.join('/ ') + "--" + item.al.name;
                                this.songListData.push(new CreateListData('', item.id, temp, item.al.picUrl, item.al.name, false));
                            });
                        }
                        this.isLoad = false;
                    }
                })

            },

            count(num) {
                return num = num > 10000 ? parseInt(num / 10000) + '万' : num
            },
            onClick(opts) {
                console.log(opts)  //根据type进行操作  -播放 
                this.$store.commit('set_currentIndex', opts.index);
                this.$store.commit('set_isClick', true);
                this.$store.commit('set_musicId', opts.id);
            },
            onBack() {
                this.$router.go(-1);
                this.isLoad = true;
                this.$store.commit('set_isClick', false);
            }
        },
    }
</script>
<style lang="less">
    .page-songPageList {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9991;
        width: 100%;
        height: 100%;
        background-color: #777;

        .songPageList-wrapper {
            position: relative;
            width: 100%;

            .header-container {
                position: relative;
                width: 100%;
                height: 35px;
                background-color: #777;
                opacity: .8;

                .icon-back {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    padding: 5px 10px;
                    width: 20px;
                    height: 20px;

                    img {
                        width: 100%;
                    }
                }

                .title {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                    font-size: 18px;
                    font-weight: 800
                }
            }

            .introduce-box {
                width: 100%;
                background-color: #ec3a3e;

                .introduce {
                    padding: 10px;
                    display: flex;
                    align-items: center;

                    .img-box {
                        position: relative;
                        width: 110px;
                        flex-shrink: 0;

                        .imgUrl {
                            width: 100%
                        }

                        .cover-count {
                            position: absolute;
                            top: 3px;
                            width: 100%;
                            text-align: right;

                            img {
                                width: 15px;
                            }

                            span {
                                color: #fff;
                            }
                        }
                    }

                    .desc-box {
                        flex-grow: 1;
                        margin-left: 10px;
                        background-color: #fff;
                        opacity: .8;
                        padding: 5px 10px;
                        border-radius: 10px;

                        .name {
                            color: #ec3a3e;
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 20px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                        }

                        .desc {
                            height: 60px;
                            line-height: 20px;
                            font-size: 12px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                        }
                    }
                }

                .border {
                    content: '';
                    display: block;
                    width: 100%;
                    height: 30px;
                    border-top-left-radius: 50%;
                    border-top-right-radius: 50%;
                    background: #fff;
                }
            }
        }

        .load-wrap {
            position: fixed;
            top: 35px;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;

            .load {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
        }

        .list-box {
            /* position: fixed;
            top:100px; */
            overflow-y: scroll;
            width: 100%;
        }
    }
</style>