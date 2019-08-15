<template>
    <div class='base-songList'>
        <div class='title'>{{title}}</div>
        <div v-for='(item, index) in listData' 
             :key='index' class='item' 
             @click='myInfo(item.id, item.type)'>
            <div class="cover-box">
                <img v-lazy="`${item.picUrl}`" alt="" class='pic'>
                <div class="playCount-box">
                    <img src="@/assets/playcount.png" alt="">
                    <span v-show='item.playCount'>{{count(item.playCount)}}</span>
                </div>
                <div class='cover-album' v-show='item.album'>{{item.album}}</div>
                <div class="cover-nickname" v-show='item.nickname'>{{item.nickname}}</div>
            </div>
            <p class='desc'>{{item.name}}</p>
        </div>

    </div>
</template>
<script>
    export default {
        name:'songList',
        props: {
            title: String,
            listData: Array
        },
        data() {
            return {
                
            }
        },
        created() {
            // console.log(this.listData)
        },
        methods: {
            count(num) {
                return num = num > 10000 ? parseInt(num / 10000) + '万' : num
            },
            myInfo(id, type) {
                // console.log(this.$router)
                this.$router.push({
                    name: 'songPageList',
                    query: {
                        dataType: type,
                        id
                    }
                });
            }
        },
    }
</script>
<style lang="less">
    .base-songList {
        width: 100%;

        .title {
            margin-left: 30px;
            font-size: 16px;
            font-weight: 800;
            line-height: 30px;
            color:#000;
        }

        .item {
            display: inline-block;
            width: 30.33%;
            margin: 5px 1.5%;

            .cover-box {
                position: relative;
                width: 100%;
                padding-top: 100%;

                .pic {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .playCount-box {
                    position: absolute;
                    top: 5px;
                    left: 0;
                    width: 100%;
                    height: 20px;
                    text-align: right;
                    color: #fff;

                    img {
                        top: 0;
                        left: 0;
                        width: 20px;
                        margin-right: 5px;
                    }
                }
                .cover-album{
                    position: absolute;
                    left:5px;
                    bottom:5px;
                    color:#fff;
                }
            }

            .desc {
                padding: 4px 5px 0;
                width: 100%;
                height: 40px;
                line-height: 20px;
                font-size: 14px;
                overflow: hidden;
                display: -webkit-box;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;

            }
        }
    }
</style>