<template>
    <div class='page-rank'>
        <div class="rank-wrapper">
            <dl>
                <dt>官方榜</dt>
                <dd class='item' v-for="(item, index) in rankDataDetail" :key='index' @click='onClick(item.id)'>
                    <div class="cover-img">
                        <img v-lazy="item.coverImgUrl" alt="">
                        <span>{{item.updateFrequency}}</span>
                    </div>
                    <div class="item-content">
                        <div class="content" v-for="(ele, i) in item.tracks" :key='i'>
                            {{i+1}}.{{ele.first}}-{{ele.second}}
                        </div>
                    </div>
                </dd>
            </dl>
            <Song-list :listData='songsListData' :title='title' />
        </div>
        <div class='load-wrap' v-if='isLoad'>
            <Loading class='load' />
        </div>
    </div>
</template>
<script>
    import SongList from '@/base/songList'
    import Loading from '@/components/loading/Loading'
    import { STATUS_TEXT } from '@/api/config.js'
    import { getRankList } from '@/api/rank.js'
    import { CreateListData } from '@/common/createDataList.js'
    import { getStorage, setStorage } from '@/storage/storage.js'

    export default {
        name: 'rank',
        data() {
            return {
                isLoad: true,
                rankDataDetail: [],
                title: '全球榜',
                songsListData: []
            }
        },
        components: {
            SongList,
            Loading
        },
        created() {

            this._initData();
        },
        methods: {
            _initData() {
                // let storageData = JSON.parse(getStorage('rankData')) || {};

                getRankList().then(res => {
                    if (res.statusText == STATUS_TEXT) {
                        let data = res.data.list;
                        // setStorage('rankData', JSON.stringify(data));
                        this.renderRankData(data);
                    }
                });
                // this.renderRankData(storageData);
            },

            renderRankData(data) {
                this.rankDataDetail = data.splice(0, 4);
                data.forEach((item, index) => {
                    this.songsListData.push(new CreateListData("RANK", item.id, item.updateFrequency, item.coverImgUrl, item.name, item.playCount, false));
                });
                this.isLoad = false;
            },

            onClick(id) {
                this.$router.push({
                    name: 'songPageList',
                    query: {
                        id,
                        dataType: "RANK"
                    }
                });
            }
        },
    }
</script>
<style lang="less">
    .page-rank {
        margin-top: 10px;
        width: 100%;

        .rank-wrapper {
            padding: 10px;

            dl {
                dt {
                    margin-left: 10px;
                    margin-bottom: 10px;
                    font-size: 16px;
                    font-weight: 700;
                }

                .item {
                    position: relative;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    border-bottom: 1px solid #ccc;

                    .cover-img {

                        width: 26%;
                        border-radius: 10px;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                        }

                        span {
                            position: absolute;
                            left: 3px;
                            bottom: 15px;
                            font-size: 14px;
                            color: #fff;
                        }
                    }

                    .item-content {
                        width: 70%;
                        line-height: 30px;
                        color: #666;
                        font-size: 14px;
                        margin-left: 10px;

                        .content {
                            width: 70%;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                    }

                }

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