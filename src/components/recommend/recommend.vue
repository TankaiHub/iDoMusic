<template>
    <div class='page-recommend'>
        <div class="slider-wrapper">
            <div v-if="banner.length" class="slider-wrapper">
                <Slider :params='bannerParams' :bannerData='banner'>
                    <div v-for="(item, index) in banner" :key="index">
                        <a :href="item.url">
                            <img class="needclick" :src="item.imageUrl">
                        </a>
                    </div>
                </Slider>
            </div>
        </div>
        <Song-list :title='titleTypeName' :listData='songsListData' />
        <Music-list :songListData='hotMusicData' :title='musicTypeName' @onClick='onClick' />
        <div class='load-wrap' v-if='isLoad'>
            <Loading class='load' />
        </div>
    </div>
</template>
<script>
    import Slider from '@/base/slider'
    import MusicList from '@/base/musicList'
    import SongList from '@/base/songList'
    import Loading from '@/components/loading/Loading'
    import { STATUS_TEXT } from '@/api/config.js'
    import { getBanner, getPersonalized, getNewSong } from '@/api/recommend.js'
    import { CreateListData } from '@/common/createDataList.js'
    import { getStorage, setStorage } from '@/storage/storage.js'
    import { mapState, mapActions, mapMutations } from 'vuex'


    export default {
        name: 'recommend',
        data() {
            return {
                isLoad: true,
                banner: [],
                bannerParams: {
                    loop: true,
                    autoPlay: true,
                    interval: 2000
                },
                titleTypeName: '推荐歌单',
                musicTypeName: '推荐热歌',
                hotMusicData: [],
                songsListData: []
            }
        },
        component: {
            ...mapState(['musicPlayList', 'isClick',  'musicId'])
        },
        components: {
            Slider,
            MusicList,
            SongList,
            Loading
        },
        created() {
            this._initDate();
        },
        methods: {
            _initDate() {
                // let recommendSongs = JSON.parse(getStorage('recommendSongs')) || {};

                // let recomendBanner = JSON.parse(getStorage('recommendBanner')) || {};
                // let recommendMusic = JSON.parse(getStorage('recommendMusic')) || {};
                let banner =  getBanner(0);
                let personalized =  getPersonalized();
                let newSong =  getNewSong();
                Promise.all([banner, personalized, newSong]).then(res => {
                    if (res[0].statusText == STATUS_TEXT) {
                        let data = res[0].data.banners
                        this.renderRecomendBanner(data)
                        // setStorage('recommendBanner', JSON.stringify(data));
                    }
                    if (res[1].statusText == STATUS_TEXT) {
                        let data1 = res[1].data.result;
                        // setStorage('recommendSongs', JSON.stringify(data1));
                        this.renderRecomendSongs(data1)

                    }
                    if (res[2].statusText == STATUS_TEXT) {
                        let data2 = res[2].data.result;
                        // setStorage('recommendMusic', JSON.stringify(data2));
                        this.renderRecomendMusic(data2)
                    }
                });
                // this.renderRecomendBanner(recomendBanner)
                // this.renderRecomendSongs(recommendSongs)
                // this.renderRecomendMusic(recommendMusic)
            },

            renderRecomendBanner(data) {
                this.banner = data;
            },
            renderRecomendSongs(data) {
                data.forEach((item, index) => {
                    this.songsListData.push(new CreateListData("RECOMMEND", item.id, false, item.picUrl, item.name, item.playCount, false));
                });
                this.isLoad = false;
            },
            renderRecomendMusic(data) {
                data.forEach((item, index) => {
                    this.hotMusicData.push(new CreateListData("RECOMMEND", item.id, item.song.artists[0].name, item.song.album.picUrl, item.name, false, false));
                });
            },

            onClick(opts) {
                console.log(opts, '来自recommend')
                this.$store.commit('set_isClick', true);
                this.$store.commit('set_musicId', opts.id);
                this.$store.commit('set_currentIndex', opts.index);

            }

        },
    }
</script>
<style lang="less">
    .page-recommend {
        width: 100%;

        .slider-wrapper {
            position: relative;

            .slider-wrapper::before {
                position: absolute;
                content: '';
                width: 100%;
                height: 100px;
                border-bottom-left-radius: 16px;
                border-bottom-right-radius: 16px;
                background-color: #EC3A3E;
            }

        }


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