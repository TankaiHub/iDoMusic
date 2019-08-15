<template>
    <div class='page-search'>
        <div class="input-wrapper">
            <!--input 框-->
            <img src="" alt="" class='logo'>
            <div class="input">
                <input v-model='value' placeholder="搜索歌曲/歌手/ 歌单" @focus='myFocus' @input='myInput'>
                <img src="@/assets/search.png" alt="" @click='myFocus'>
            </div>
        </div>
        <div class="view-content" v-show="viewShow" ref='viewContent'>
            <!--热搜榜  ---  历史记录-->
            <img src="@/assets/down.png" alt="" class='down' @click='viewClear'>
            <div class="hot-wrapper">
                <!--热搜榜-->
                <dl v-if='hotSearchRank'>
                    <dt>热搜榜</dt>
                    <dd v-for="(item, index) in hotSearchRank" :key='index' @click='selectHotSearch(item.first, index)'>{{item.first}}</dd>
                </dl>
            </div>
            <!--历史记录-->
            <play-list :title='historyTitle' :playListData='historyData' :hint='historyHint' @getProp='selectHotSearch'
                @deleteProp='deleteHistory' @clearProp='clearHistory' />
            <div class="search-list-wrapper" v-show='musicListShow' ref='searchList'>
                <!--歌曲  歌手  歌单-->
                <div class="type-wrapper">
                    <div :class=" {'type-name':true, active:currentType == index }" v-for="(item, index) in titleTypes"
                        :key='index' @click='changeType(index)'>
                        {{item}}
                    </div>
                </div>
                <music-list :songListData='searchListData' @onClick='onClick' />
                <Loading v-if='isLoad' class='load' />
            </div>
        </div>
        <div class="resSearch-wrap" v-if='resSearch'>
            <!-- 搜索返回数据列表 -->
            <search-result :allMatchList='allMatch' @selectPlayList='selectHotSearch' />
        </div>
    </div>
</template>
<script>
    import PlayList from '@/base/playList'
    import MusicList from '@/base/musicList'
    import searchResult from '@/base/searchResult'
    import Loading from '@/components/loading/Loading'
    import { STATUS_TEXT } from '@/api/config.js'
    import { getSearchHot, search, searchData } from '@/api/search.js'
    import { CreateListData } from '@/common/createDataList.js'
    import { getStorage ,setStorage, clearStorage, deleteStorage} from '@/storage/storage.js'
    import { mapState } from 'vuex'
    export default {
        
        data() {
            return {
                value: '',//input value
                viewShow: false,//是否显示热搜及历史记录
                musicListShow: false,//是否显示 歌曲  歌手  歌单 tab
                isLoad: false,  //是否显示加载组件
                resSearch: false,//是否显示搜索结果
                hotSearchRank: [],//热搜
                historyTitle: '历史搜索',
                historyData: [],//历史
                titleTypes: ['歌 曲', '歌 手', '歌 单'],
                historyHint: '暂无历史记录',
                searchListData: [],
                currentType: 0,//当前type
                allMatch: [],//input 框接收的数据
                timer: null,//防抖
                noMore: true //没有搜索的数据

            }
        },
        components: {
            PlayList,
            MusicList,
            searchResult,
            Loading
        },
        computed: {
            ...mapState(['musicId'])
        },
        mounted() {
            let self = this;
            document.addEventListener('click', function (e) {
                if (e.target.className != 'resSearch-wrap') {
                    self.resSearch = false;
                }
            })
            
        },
        created() {
            this._initData();
            this.historyData = getStorage();
        },
        methods: {
            _initData() {
                getSearchHot().then(res => {
                    if (res.statusText == STATUS_TEXT) {
                        this.hotSearchRank = res.data.result.hots;
                    }
                });
            },

            storage() {

            },

            myInput(e) {//input框输入
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    if (this.value == '') {
                        return;
                    }
                    let word = this.value;
                    searchData(this.value).then(res => {
                        this.historyData = setStorage(word);
                        if (res.statusText == STATUS_TEXT) {
                            this.allMatch = res.data.result.songs;
                            console.log(this.allMatch == undefined)
                            if (!res.data.result.songs) {
                                this.resSearch = false;
                            }else {
                                this.resSearch = true;
                            }
                        
                            console.log(this.resSearch, '==来自search--myInput--==')
                        }
                    });
                }, 1000);
            },


            myFocus() {//聚焦在input框时
                this.viewShow = true;
                setTimeout(() => {
                    this.$refs.viewContent.style.top = '50px';
                }, 20);
            },

            selectHotSearch() {//选择热搜和历史搜索
                let text;
                if (arguments.length == 1) {
                    if (arguments[0].item) {
                        text = arguments[0].item;
                    }else if (arguments[0].name) {
                        text = arguments[0].name;
                    } 
                }else if (arguments.length == 2) {
                    text = arguments[0]
                }
                // console.log(arguments)
                this.value = text;
                this.isLoad = true;
                this.resSearch = false;
                this.newArr = [];
                this.searchListData = [];
                search(this.value, 20, 1).then(res => {
                    
                    if (res.statusText == STATUS_TEXT) {
                        // this.searchListData
                        let data = res.data.result.songs;
                        data.forEach((item, index) => {
                            this.searchListData.push(new CreateListData('SINGER', item.id, item.artists[0].name, false, item.name, false));
                        });
                        this.newArr = this.searchListData;
                        this.musicListShow = true;
                        this.isLoad = false;
                    }

                })

                this.$refs.searchList.style.top = '40px';
                this.currentType = 0;

            },

            viewClear() {//点击向下按钮
                this.$refs.viewContent.style.top = '500px';
                setTimeout(() => {
                    this.viewShow = false;
                    this.value = '';
                    this.musicListShow = false;
                }, 200);
            },

            deleteHistory(index) {//删除历史记录
                this.historyData = deleteStorage(index);
            },
            clearHistory() {//清空历史记录
                this.historyData = clearStorage();
            },

            changeType(index) {//选择类型
                // console.log(index)
               
                this.currentType = index;
                this.isLoad = true;
                
                
                if (index == 1) {
                    if (this.searchListData.length > 0 && this.searchListData[0].album == false) {
                        this.isLoad = false;
                        return;
                    };
                    this.searchListData = [];
                    search(this.value, 20, 100).then(res => {
                        if (res.statusText == STATUS_TEXT) {
                            // this.searchListData
                            let data = res.data.result.artists;
                            data.forEach((item, index) => {
                                this.searchListData.push(new CreateListData('RECOMMEND', item.id, false, item.picUrl, item.name, false));
                            });
                            console.log(this.searchListData[0].album )
                            this.isLoad = false;
                        }

                    })
                }
                if (index == 2) {
                    if (this.searchListData.length > 0 && this.searchListData[0].album !== false) {
                        this.isLoad = false;
                        return;
                    };
                    this.searchListData = [];
                    search(this.value, 20, 1000).then(res => {
                        if (res.statusText == STATUS_TEXT) {
                            let data = res.data.result.playlists;
                            data.forEach((item, index) => {
                                let name = `by:${item.creator.nickname}-${item.playCount}次播放`
                                this.searchListData.push(new CreateListData('RECOMMEND', item.id, name, item.coverImgUrl, item.name, false));
                            });
                            this.isLoad = false;
                        }

                    })
                } else if (index == 0) {
                    this.searchListData = this.newArr;
                    this.isLoad = false;
                }
            },



            onClick(opts) { //music-list 组件自定义事件
                let type = ["RECOMMEND", "SINGER"];
                let index = type.findIndex(item => {
                    return item === opts.type
                });
               console.log(index)
                if (opts.type == 'SINGER' && index == 1) {
                   
                     this.$store.commit('set_isClick', true);
                     this.$store.commit('set_musicId', opts.id);
                }
                if (opts.type == 'RECOMMEND' && index == 0) {
                    console.log('i am coming')
                    this.$router.push({
                        name: 'songPageList',
                        query: {
                            dataType: opts.type,
                            id: opts.id
                        }
                    });
                }
                // console.log(index, '====index====')

            }



        },
    }
</script>
<style lang="less">
    .page-search {
        position: relative;
        width: 100%;

        .input-wrapper {
            display: flex;
            align-items: center;
            width: 100%;
            height: 45px;

            .logo {
                display: block;
                margin-left: 30px;
                width: 60px;
                height: 24px;
                background-color: #ccc;
            }

            .input {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-grow: 1;
                margin: 0 30px;
                height: 70%;
                overflow: hidden;
                border-radius: 20px;
                border: 2px solid #EC3A3E;

                input {
                    width: 90%;
                    height: 100%;
                    margin-left: 12px;
                    border: none;
                    outline: none;
                    flex-grow: 1;
                }

                img {
                    margin: 0 10px;
                    height: 70%;
                }
            }
        }

        .view-content {
            position: absolute;
            width: 100%;
            padding-top: 20px;
            background-color: #fafafa;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
            transition: all .3s;
            z-index: 99;

            .down {
                position: absolute;
                top: 0;
                right: 10px;
                width: 23px;
                height: 23px;
            }

            .hot-wrapper {
                padding: 20px;

                dl {
                    dt {
                        line-height: 30px;
                        font-size: 18px;
                        font-weight: 600;
                        color: #ec3a3e;
                        border-bottom: 1px solid #ec3a3e;
                    }

                    dd {
                        display: inline-block;
                        font-size: 16px;
                        padding: 4px 10px;
                        background-color: #eee;
                        margin: 7px 5px 5px;
                        border-radius: 16px;
                        cursor: pointer;
                    }
                }
            }

            .search-list-wrapper {
                position: absolute;
                top: 100%;
                left: 0;
                bottom: 0;
                width: 100%;
                background-color: #fff;

                .type-wrapper {
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    line-height: 28px;
                    box-sizing: border-box;
                    background-color: #f0f0f0;

                    .type-name {
                        padding: 0 10px;
                        cursor: pointer;
                    }

                    .type-name.active {
                        color: #EC3A3E;
                        border-bottom: 1.5px solid #EC3A3E;
                    }
                }

                .load {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translateX(-50%) translateY(-50%);
                }
            }
        }

        .resSearch-wrap {
            position: absolute;
            top: 50px;
            left: 0;
            width: 100%;
            z-index: 1000;
        }
    }
</style>