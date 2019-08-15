<template>
    <div class='base-musicList'>
        <keep-alive>
            <div class="wrapper">
                <div class="title" v-if='title'>{{title}}</div>
                <my-scroll style='height:460px;overflow: hidden;' ref='scorllLyc'>
                    <div>
                        <ul>
                            <li class='item' v-for="(item, index) in songListData" :key='index'
                                @click.stop='onClick(item.id, item.type, item.name, index)'>
                                <div class="cover-img">
                                    <img v-show='item.picUrl' v-lazy="`${item.picUrl}`" alt="">
                                </div>
                                <div class="song-info">
                                    <div class="song-name">{{item.name}}</div>
                                    <div v-show='item.album' class="singer-list">{{item.album}}</div>
                                </div>
                                <img class='icon-play' src="@/assets/listPlayIcon.png" alt="">
                            </li>
                        </ul>
                    </div>
                </my-scroll>
            </div>
        </keep-alive>
    </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex'
    import myScroll from '@/base/Scroll'
    export default {
        name: 'musicList',
        props: {
            songListData: Array,
            title: String
        },
        components: {
            myScroll
        },
        computed: {
            ...mapState(['musicPlayList', 'isClick', 'musicId'])
        },
        mounted() {

        },
        created() {
            this.$watch(function () { this.songListData });
        },
        methods: {
            onClick(id, type, name, index) {
                this.$store.commit('set_musicPlayList', this.songListData);
                this.$emit('onClick', { id, type, name, index });
            }
        },
    }
</script>
<style lang="less">
    .base-musicList {
        width: 100%;
        background-color: #fff;

        .wrapper {
            padding: 20px;

            ul {
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    height: 50px;
                    border-bottom: 1px solid #ccc;
                    cursor: pointer;

                    .cover-img {

                        flex-shrink: 0;

                        img {
                            width: 50px;
                            height: 50px;
                        }
                    }

                    .song-info {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        flex-grow: 1;
                        width: 50%;
                        height: 100%;
                        margin-left: 10px;

                        .song-name {
                            font-size: 15px;
                            width: 50%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        .singer-list {
                            width: 50%;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            margin-top: 6px;
                            color: #888;
                        }
                    }

                    .icon-play {
                        width: 20px;
                        height: 20px;
                    }
                }
            }

            .title {
                margin-left: 13px;
                font-size: 16px;
                font-weight: 800;
                line-height: 30px;
                color: #000;
            }
        }

    }
</style>