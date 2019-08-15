<template>
    <div class="base-playList" ref='basePlayListWidth'>
        <div class="icon-down" @click='down' v-if='show'>
            <img src="@/assets/down.png" alt="">
        </div>

        <div class='list-title-box'>
            <div class='list-title'>
                <span>{{title}} ( {{playListData.length}} )</span>
                <img @click.stop='clearProp' src="@/assets/clear.png" alt="">
            </div>
            <my-scroll style='height:300px;overflow: hidden;' v-show='playListData.length > 0'>
                <div>
                    <div class='list-box' v-for="(item, index) in playListData" :key='index'>
                        <span @click.stop='getProp(item,index)' :class='{ active: index == currentIndex }'>{{item}}
                        </span>
                        <img @click.stop='deleteProp(index)' src="@/assets/delete.png" alt="">
                    </div>
                </div>
            </my-scroll>
        </div>

        <div class="noMore" v-if='playListData.length==0'>{{hint}}</div>
    </div>
</template>
<script>
    import myScroll from '@/base/Scroll'
    import { mapState } from 'vuex'
    export default {
        name: 'playList',
        props: {
            title: String,
            hint: String,
            playListData: Array,
            show: {
                type: Boolean,
                default: false
            }
        },
        components:{
            myScroll
        },
        computed: {
            ...mapState(['currentIndex', 'isClick'])
        },
        watch: {
            isClick() {
                if (this.isClick) {
                    console.log(this.playListData.length, '=== base--playlist ===')
                }
            }
        },
        created() {
            this.$watch(function () { this.playListData; this.currentIndex });
        },
        methods: {
            clearProp() {
                this.$emit('clearProp');
            },
            getProp(item, index) {

                this.$emit('getProp', { item, index });
            },
            deleteProp(index) {
                console.log(11, 'play-list')
                this.$emit('deleteProp', index);
            },
            down() {
                let l = this.$refs.basePlayListWidth.clientWidth;
                this.$emit('down', l);
            }
        },
    }
</script>
<style lang="less">
    .base-playList {
        width: 100%;
        overflow: hidden;

        .icon-down {
            width: 100%;
            height: 30px;
            text-align: center;

            img {
                width: 30px;
                height: 30px;
            }
        }

        .list-title-box {
            padding: 20px;

            .list-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ec3a3e;

                span {
                    line-height: 30px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #ec3a3e;
                }

                img {
                    width: 25px;
                }
            }

            .list-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 10px;
                line-height: 30px;
                border-bottom: 1px solid #999;
                cursor: pointer;

                span {
                    display: block;
                    width: 90%;
                    font-size: 16px;
                    font-weight: 500;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                span.active {
                    color: #ec3a3e;
                }

                img {
                    width: 18px;
                }
            }
        }

        .noMore {
            width: 100%;
            height: 35px;
            text-align: center;
            font-size: 15px;
            color: #aaa;
        }
    }
</style>