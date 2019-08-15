import Vue from 'vue'
import Router from 'vue-router'
import defaultPage from '@/layout/default' 
import Recommend from '@/components/recommend/recommend'
import Rank from '@/components/rank/rank'
import Songs from '@/components/songs/songs'
import Singer from '@/components/singer/singer'
import SongPageList from '@/components/songPageList/songPageList'
import Demo from '@/components/demo/demo'


Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path:'/',
      name:'defaultPage',
      component:defaultPage,
      redirect:'/recommend',
      children:[
        {
          path:'/recommend',
          name:'recommend',
          meta:{
            index:0,
            keepAlive: true
          },
          component:Recommend
        },
        {
          path:'/rank',
          name:'rank',
          meta:{
            index:1,
            keepAlive: true
          },
          component:Rank
        },
        {
          path:'/songs',
          name:'songs',
          meta:{
            index:2,
            keepAlive: true
          },
          component:Songs
        },
         {
          path:'/singer',
          name:'singer',
          meta:{
            index:3,
            keepAlive: true
          },
          component:Singer
        },
        {
          path:'/songPageList',
          name:'songPageList',
          component:SongPageList
        },
        {
          path:'/demo',
          name:'demo',
          component:Demo
        }
      ]
    },
    
  ]
})
