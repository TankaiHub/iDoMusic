<template>
    <div class='page-singer'>
        <category :categoryData='singerTypeList' @select='selectTopType' />

        <div class='address-list-wrapper'>
            
                <div class="singer-container">
                        <my-scroll style='height:470px;overflow: hidden;' ref='scrollList'>
                    <div class="singer-list-box">
                        <div class="singer-item" v-for='(item, index) in singerArray' :key='index'>
                            <span class='letter-box' :ref='item.name'>{{item.name}}</span>
                            <div class="item" v-for='(item1, index1) in item.detail' @click='onClick(item1.id)'>
                                <img v-lazy="item1.imgUrl" alt="">
                                <span class='singer-name'>{{item1.name}}</span>
                            </div>
                        </div>
                    </div>
                </my-scroll>
                </div>
           

            <div class="letter-container">
                <div :class=" {letterStr:true, active:index == currentIndex }"
                    v-for='(item, index) in letter' :key='index' @click='changeLettar(index, item)'>{{item}}</div>
            </div>
        </div>
        <div class='load-wrap' v-if='isLoad'>
            <Loading class='load' />
        </div>
    </div>
</template>
<script>
    import Loading from '@/components/loading/Loading'
    import category from '@/base/category'
    import myScroll from '@/base/Scroll'
    import { _singerTypeData } from '@/common/singerTypeList.js'
    import getFirstLetter from '@/common/getFirstLetter.js'
    import { STATUS_TEXT } from '@/api/config.js'
    import { getHotSinger, getSingerList } from '@/api/singer.js'

    export default {
        name: 'singer',


        data() {
            return {
                singerTypeList: _singerTypeData,
                letter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ~',
                singerArray: '',
                currentIndex: -1,
                isLoad: true,
                timer: null
            }
        },
        components: {
            category,
            Loading,
            myScroll
        },
        created() {
            this._initData();
        },

        methods: {
            _initData() {
                this.getHotData();
            },

            getHotData() {

                getHotSinger(100).then(res => {
                    if (res.statusText == STATUS_TEXT) {
                        let data = res.data.artists;
                        this.singerArray = this.handleData(data);
                        this.isLoad = false;
                    }
                });


            },
            handleData(data) {
                let box = [];
                for (let i = 0; i < this.letter.length; i++) {
                    let a = this.letter[i];
                    box.push({ name: a, detail: [] })
                }
                let arr = [];
                data.forEach((item, index) => {
                    let temp = this.handleName(item.name);
                    arr.push({ id: item.id, name: item.name, imgUrl: item.picUrl, firstLetter: temp });
                });
                if (arr.length > 0) {
                    box.forEach((item, index) => {
                        arr.forEach((item1, index1) => {
                            if (item.name == item1.firstLetter) {
                                item.detail.push(item1);
                            }
                        });
                    });
                    return box;
                    // console.log(this.singerArray)
                }
            },
            handleName(str) {
                return getFirstLetter(str).substring(0, 1)
            },
            changeLettar(index, item) {
                this.currentIndex = index;
                let el = this.$refs[item][0];
                this.$refs.scrollList.scrollToElement(el, {});
            },
            onClick(id) {
                this.$router.push({
                    name: 'songPageList',
                    query: {
                        dataType: 'SINGER',
                        dot: 1,
                        id
                    }
                });
            },
            selectTopType(name) {//category 组件 事件

                if (name == this.singerTypeList.father[0].fatherName) {
                    clearTimeout(this.timer)
                    this.timer = setTimeout(() => {
                        this.getHotData();
                    }, 1000);
                }
                this.singerTypeList.children.forEach((item, index) => {
                    if (name == item.name) {
                        this.isLoad = true;
                        getSingerList(item.resourceType).then(res => {
                            let data = res.data.artists
                            this.singerArray = this.handleData(data)
                            this.isLoad = false;
                        });
                    }
                });
            }
        },
    }
</script>
<style lang="less">
    .page-singer {
        width: 100%;

        .address-list-wrapper {
            position: relative;
            width: 100%;

            .singer-container {
                width: 100%;

                .singer-list-box {
                    .singer-item {
                        width: 90%;
                        margin: 0 auto;

                        .letter-box {
                            display: block;
                            width: 100%;
                            line-height: 30px;
                            color: red;
                            background-color: #ddd;
                        }

                        .item {
                            display: flex;
                            align-items: center;
                            line-height: 40px;

                            img {
                                display: block;
                                width: 30px;
                                height: 30px;
                                border-radius: 50%;
                                margin-right: 10px;

                                .singer-name {}
                            }
                        }
                    }
                }
            }

            .letter-container {
                position: fixed;
                top: 120px;
                right: 5px;
                padding: 10px 0;
                text-align: center;
                line-height: 15px;
                font-size: 12px;
                border-radius: 10px;
                background: #ddd;

                .letterStr {
                    display: block;
                    color: #000;
                    padding: 1px 5px;
                    cursor: pointer;
                }

                .letterStr.active {
                    color: red;
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