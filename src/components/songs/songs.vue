<template>
    <div class='page-songs'>
        <category :categoryData='categoryData' @select='select' v-if='isData' />
        <Song-list :listData='songListData' />
        <div class='load-wrap' v-if='isLoading'>
            <Loading class='load' />
        </div>
    </div>
</template>
<script>
    import SongList from '@/base/songList'
    import category from '@/base/category'
    import Loading from '@/components/loading/Loading'
    import { STATUS_TEXT } from '@/api/config.js'
    import { getPlaylistCatlist, getTopPlaylist } from '@/api/songs.js'
    import { CreateListData } from '@/common/createDataList.js'
    import { getStorage, setStorage } from '@/storage/storage.js'
    import { mapState } from 'vuex'
    export default {
        name: 'songs',
        data() {
            return {
                categoryData: {},
                songListData: [],
                oldType: '',
                isLoading: true,
                isData: false
            }
        },
        computed: {
            ...mapState(['songsType']),
        },
        components: {
            category,
            SongList,
            Loading
        },
        watch: {

        },
        mounted() {
            // this.getCategoryData();
        },
        created() {
            this.$watch(function () { this.songsType; });
            this.getCategoryData();
            console.log(this.songsType, 'songs---->')
        },
      
        methods: {
            getCategoryData() {
                //发送数据获取全部信息  全部歌单 
                getPlaylistCatlist().then(res => {
                    if (res.statusText == STATUS_TEXT) {
                        let father = [{ fatherName: '全部歌单' }];
                        let data = res.data;
                        let categories = data.categories;
                        for (let prop in categories) {
                            father.push({ fatherName: categories[prop] });
                        }
                        this.categoryData.father = father;
                        this.categoryData.children = data.sub;
                        this.isData = true;
                        // console.log(this.categoryData)
                    }
                }, err => {
                    console.log('err---> songs--> 歌单导航');
                });

                this.getPlayListData(this.songsType);
            },
            getPlayListData(name) {
                // let songsStorage = JSON.parse(getStorage('songsAll')) || {}
                this.songListData = [];
                getTopPlaylist(name).then(res => {
                    if (res.statusText == STATUS_TEXT) {
                        let data = res.data.playlists;
                        this.renderSongsData(data);
                    }
                }, err => {
                    console.log('err---> songs--->歌单')
                });
            },

            renderSongsData(data) {
                data.forEach((item, index) => {
                    this.songListData.push(new CreateListData("SINGER", item.id, false, item.coverImgUrl, item.name, item.playCount, item.creator.nickname));
                });
                this.isLoading = false;
            },
            select(name) {
                console.log(name)
                if (this.oldType != name) {
                    this.isLoading = true;
                    //请求数据  数据请求回来 之后 isLoading = false
                    this.getPlayListData(name);
                    this.oldType = name;
                    this.$store.commit('set_songsType', name);
                }
                // 
                // console.log(this.oldType == opts.name)
            }
        },
    }
</script>
<style lang="less">
    .page-songs {
        .load-wrap {
            position: fixed;
            top: 0;
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
    }
</style>