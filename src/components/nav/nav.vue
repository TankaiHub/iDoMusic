<template>
    <div class='page-nav'>
        <ul class="title clearfix">
            <router-link tag="li" to="/recommend">推荐 </router-link>
            <router-link tag="li" to="/songs">歌单</router-link>
            <router-link tag="li" to="/rank">排行榜</router-link>
            <router-link tag="li" to="/singer">歌手</router-link>         
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'MyNav'
    }
</script>
<style lang="less">
    .page-nav {
        width:100%;
        background-color: #EC3A3E;
        .title {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: 45px;
         

            li {
                cursor: pointer;
                padding: 8px 15px;
                font-size: 16px;
                color: #fff;

                /* .logo {
                    width: 176px;
                    height: 45px;
                    text-indent: -999px;
                    white-space: nowrap;
                    overflow: hidden;
                    background-position: 0 -12px;
                    background-image: url('../../assets/topbar.png');
                } */
            }

            .router-link-active {

                border-radius: 16px;
                background-color: #fff;
                color: #EC3A3E;

            }


        }
    }
</style>