<template>
    <div class="loadingContainer">

        <div class="circle"></div>
        <div class="circle delay"></div>

    </div>
</template>
<script>
    export default {
        name:'loading'
    }
</script>

<style scoped>
    .loadingContainer{
        width:50px;
        height:50px;
        position: relative;
    }
    .loadingContainer .circle{
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        border-radius: 50%;
        background-color:#f00;
        animation: run 2s infinite;
    }
    .circle.delay{
        animation-delay: -1s;
    }
    @keyframes run {
        0%{
            transform: scale(0);
        }
        50%{
            transform: scale(1);
        }
        100%{
            transform: scale(0);
        }
    }
</style>