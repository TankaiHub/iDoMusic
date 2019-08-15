<template>
    <div class='page-default'>

        <header>
            <Search class='search' />
            <play-nav />
        </header>
        <main>
            <transition :name='myFade'>
                <keep-alive exclude='songPageList'>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </main>
        <footer>
            <playerBar />
        </footer>
    </div>
</template>
<script>
    import playerBar from '@/base/playerBar'
    import playNav from '@/components/nav/nav'
    import Search from '@/components/search/search'
    export default {
        // name:'layout',
        data() {
            return {
                myFade: ''
            }
        },
        watch: {
            $route(to, from) {
                if (to.meta.index > from.meta.index) {
                    this.myFade = 'slide-left';
                } else {
                    this.myFade = 'slide-right';
                }
            }
        },
        created() {

        },
        components: {
            playNav,
            Search,
            playerBar
        }


    }   
</script>
<style lang="less">
    body {
        overflow-x: hidden;

        .page-default {
            width: 100%;

            header {
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9990;
                width: 100%;

                .search {
                    width: 100%;
                    background-color: #fff;
                }
            }

            main {
                margin-top: 90px;
                padding-bottom: 40px;

                .slide-right-enter-active,
                .slide-right-leave-active,
                .slide-left-enter-active,
                .slide-left-leave-active {
                    will-change: transform;
                    transition: all 400ms;
                    position: fixed;
                }

                .slide-right-enter {
                    opacity: 0;
                    transform: translate3d(-100%, -0, 0);
                }

                .slide-right-leave-active {
                    opacity: 0;
                    transform: translate3d(100%, 0, 0);
                }

                .slide-left-enter {
                    opacity: 0;
                    transform: translate3d(100%, 0, 0);
                }

                .slide-left-leave-active {
                    opacity: 0;
                    transform: translate3d(-100%, -0, 0);
                }

            }

            footer {
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                z-index: 9999;
            }


        }
    }
</style>