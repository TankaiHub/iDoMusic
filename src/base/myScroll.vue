<template>
    <div ref="myScroll">
        <slot></slot>
    </div>
</template>
<script >
    import BScroll from 'better-scroll';

    export default {
        mounted() {
            this._initScroll();
        },
        methods: {
            _initScroll() {
                this.scroll = new BScroll(this.$refs.myScroll, {
                    click: true,
                    scrollX: true
                });
            }
        },
    }
</script>
<style>

</style>