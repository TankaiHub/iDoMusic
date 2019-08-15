<template>
    <div class="base-searchResult">
        <div class="wrapper">
            <ul>
                <li v-for='(item, index) in allMatchList' 
                    :key='index'
                    @click.stop='onClick(item.name, index)'>
                    <img src="@/assets/search.png" alt="">
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </div>

</template>
<script>
    export default {
        name:'searchResult',
        props:{
            allMatchList:Array
        },
        methods: {
            onClick(name, index) {
                this.$emit('selectPlayList', {name, index});
            }
        },

    }
</script>
<style lang="less">
    .base-searchResult{
        width:90%;
        margin:0 auto;
        background-color: #fff;
        box-shadow: 0 0 4px 2px #ccc;
        border-radius: 10px;
        .wrapper{
            padding:10px;
            ul{
                li{
                    font-size:16px;
                    padding-bottom:10px;
                    border-bottom:1px solid #ccc;
                    img{
                        width:20px;
                        height:20px;
                        margin-right:10px;
                    }
                }
            }
        }
    }
</style>