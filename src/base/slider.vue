<template>
    <div class='base-container'>
        <div class='sliderWrap' ref='slider'>
            <div class="slider-group" ref='sliderGroup'>
                <slot></slot>
            </div>
            <div class="dots">
                <span class="dot" :class="{active:currentIndex == index}" v-for="(item, index) in dots" :key='index'
                    @click='change'></span>
            </div>
        </div>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    import { addClass } from '@/common/addClass.js'
    export default {
        name:'slider',
        props: {
            bannerData: Array,
            params: {
                type: Object,
                default: {
                    loop: {
                        type: Boolean, //默认循环播放
                        default: true
                    },
                    autoPlay: {
                        type: Boolean, //默认自动轮播
                        default: true
                    },
                    interval: {
                        type: Number, //默认轮播切换时间
                        default: 3000
                    }
                }
            }
        },
        data() {
            return {
                currentIndex: 0, // 当前索引
                dots: [],//当前小圆点
            }
        },
        // watch: {
        //     bannerData() {
        //         this._sliderInit();  //有数据的时候才初始化，因为以下初始化极度依赖dom。没有数据就没有dom
        //     }
        // },
        mounted() {
            this._setSliderWidth()
            setTimeout(() => {
                this._initDots()
                this._initSlider()
                if (this.params.autoPlay) {
                    this._play()
                }
            }, 20) //保证DOM被渲染，做了20ms的延时(*为何值为20？？* 因为浏览器刷新时间一般为17ms一次)

            window.addEventListener('resize', () => {        //监听窗口改变事件，解决当窗口改变时，图片的宽度未发生改变的问题
                if (!this.slider) {
                    return
                }
                this._setSliderWidth(true)
                this.slider.refresh()
            })
        },
        methods: {

            _setSliderWidth(isResize) {
                if (!this.$refs.sliderGroup) return;
                this.children = this.$refs.sliderGroup.children;

                let width = 0
                let slideWidth = this.$refs.slider.clientWidth

                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i]
                    addClass(child, 'slider-item') //为每一个子元素添加类名
                    child.style.width = slideWidth + 'px'
                    width += slideWidth        //容器的总宽度
                }
                if (this.params.loop && !isResize) {
                    width += 2 * slideWidth    //如果轮播，左右会各增加一个，所以要加上两张图片的宽度
                }
                this.$refs.sliderGroup.style.width = width + 'px'        //为元素设置容器的总宽度
            },
            _initSlider() {
                this.slider = new BScroll(this.$refs.slider, {
                    scrollX: true,    //横向滚动
                    scrollY: false,    //不允许纵向滚动
                    momentum: false,    //关闭动量动画，能提升效能
                    snap: {            //新版本将snap的属性都当成一个对象来书写
                        loop: this.params.loop,    //循环
                        threshold: 0.3,
                        speed: 400        //轮播间隔
                    },
                    click: true
                })

                this.slider.on('scrollEnd', () => {
                    this.currentIndex = this.slider.getCurrentPage().pageX //轮播到下一张，获取当前的index

                    if (this.params.autoPlay) {
                        clearTimeout(this.timer)    //如果设置额自动轮播就清除轮播再重新启动
                        this._play()
                    }
                })
            },
            _initDots() {
                this.dots = new Array(this.children.length)
            },
            _play() {
                this.timer = setTimeout(() => {
                    this.slider.next()
                }, this.params.interval)
            },
            destroyed() {
                clearTimeout(this.timer)
            },
            change() {
            }

        },

    }
</script>
<style lang="less">
    .base-container {
        .sliderWrap {
            min-height: 1px;
            width: 95%;
            margin: 0 auto;
            overflow: hidden;
            border-radius: 10px;

            .slider-group {
                position: relative;
                overflow: hidden;
                white-space: nowrap;
                border-radius: 10px;

                .slider-item {
                    float: left;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-align: center;
                    border-radius: 10px;

                    a {
                        display: block;
                        width: 100%;
                        overflow: hidden;
                        border-radius: 10px;
                        text-decoration: none;

                        img {
                            display: block;
                            width: 100%;
                            border-radius: 10px;
                        }
                    }
                }

            }

            .dots {
                position: relative;
                left: 50%;
                bottom: 20px;
                transform: translateX(-50%);
                display: inline-block;
                margin: 0 4px;
                border-radius: 50%;

                .dot {
                    margin: 0 5px;
                    display: inline-block;
                    vertical-align: middle;
                    background: #000;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .active {
                    border-radius: 5px;
                    background: red;
                }
            }
        }
    }
</style>