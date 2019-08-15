<template>
    <div class='base-category'>
        <div class="category-wrapper">
            <div class="category">
                <span v-for="(item, index) in categoryData.father" :key='index'
                    :class="{  active:currentIndex == index }" @click='changeFather(index, item)'>{{item.fatherName}}</span>
            </div>
            <div class="children" v-show='typeShow'>
                <div class="types-wrap">
                    <span v-for='(item, index) in categoryData.children' :key='index' class="type"
                        :class="{ select:item.name == currentName }" v-show='(currentIndex - 1) == item.category'
                        @click='changeChild(item.name)'>{{item.name}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name:'category',
        props: {
            categoryData: Object
        },
        data() {
            return {
                currentIndex: 0,
                currentName: null,
                typeShow: true

            }
        },
        mounted() {
            let self = this;
            document.addEventListener('click', function (e) {
                if (e.target.className != 'active') {
                    self.typeShow = false;
                }
            })
        },
        created() {
            // console.log(this.categoryData, '=============')
        },
        methods: {
            changeFather(k, v) {
                this.currentIndex = k;
                this.typeShow = true;
                if (this.currentIndex == 0) {
                    this.currentName = null;
                    this.changeType(v.fatherName);
                }
            },
            changeChild(name) {
                this.currentName = name;
                this.changeType(name);
                setTimeout(() => {
                    this.typeShow = false
                }, 200);
            },
            changeType(name) {
                this.$emit('select', name);
            }
        },
    }
</script>
<style lang="less">
    .base-category {
        width: 100%;
        background-color: #fff;

        .category-wrapper {
            position: relative;

            .category {
                display: flex;
                justify-content: space-around;
                align-items: center;
                line-height: 30px;
                font-size: 14px;
                border-bottom: 1px solid #EC3A3E;

                span {
                    padding: 0 10px;
                }

                span.active {
                    color: #EC3A3E;
                }
            }

            .children {
                position: absolute;
                top: 31px;
                left: 0;
                width: 100%;
                z-index: 999;
                background-color: #fafafa;
                opacity: 0.8;

                .types-wrap {
                    width: 100%;

                    .type {
                        display: inline-block;
                        width: 33.3%;
                        text-align: center;
                        padding: 10px 20px;
                        border: 1px solid #ccc;
                        border-top: none;
                        font-size: 14px;
                        box-sizing: border-box;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .type.select {
                        position: relative;
                        border-color: #EC3A3E;
                    }

                    .type.select::after {
                        position: absolute;
                        right: 10px;
                        bottom: 10px;
                        content: '';
                        width: 5px;
                        height: 5px;
                        background-color: #EC3A3E;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
</style>