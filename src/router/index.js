import Vue from 'vue'
import Router from 'vue-router'
//import GrabStorage from '@/components/GrabStorage'
//import Published from '@/components/Published'
//抓取池
import GrabStorage from '@/components/grab/GrabStorage'
import GrabStoragePreview from '@/components/grab/Preview'
import GrabStorageEdit from '@/components/grab/Edit'
import GrabStoragePublish from '@/components/grab/Publish'
//已发布
import Published from '@/components/published/Published'
import PublishedPreview from '@/components/published/Preview'
import PublishedEdit from '@/components/published/Edit'
import PublishedPublish from '@/components/published/publish'
//运营池
import OperationStorage from '@/components/opetation/OperationStorage'
import OperationPreview from '@/components/opetation/Preview'
import OperationEdit from '@/components/opetation/Edit'
import OperationPublish from '@/components/opetation/publish'
import OperationTextAdd from '@/components/opetation/textAdd'
import OperationVideoAdd from '@/components/opetation/videoAdd' 
//标签
import Tag from '@/components/tag/tag'
//评论
import Comment from '@/components/Comment'
//登陆
import Login from '@/pages/Login'
//框架
import Wrap from '@/components/_common/wrap'
//内容审核
import contentApproval from '@/components/contentApproval/Index' 

//import Preview from '@/components/Preview'
//import Edit from '@/components/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Wrap,
      children: [
        {
          path: '/',
          name: 'grabStorage',
          component: GrabStorage
        },
        {
          path: 'comment',
          name: 'comment',
          component:Comment
        },
        {
          path: 'operationStorage',
          name: 'operationStorage',
          component: OperationStorage
        },
        {
          path: 'published',
          name: 'published',
          component: Published
        },
        {
          path: 'tag',
          name: 'tag',
          component: Tag
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: GrabStorageEdit
        },
        {
          path: 'preview/:id',
          name: 'preview',
          component: GrabStoragePreview
        },
        {
          path: 'publish/:id',
          name: 'publish',
          component: GrabStoragePublish
        },
        {
          path: 'published/edit/:id',
          name: 'publishedEdit',
          component: PublishedEdit
        },
        {
          path: 'published/preview/:id',
          name: 'publishedPreview',
          component: PublishedPreview
        },
      {
        path: 'published/publish/:id',
          name: 'PublishedPublish',
        component: PublishedPublish
      },
        {
          path: 'operationEdit/:id',
          name: 'OperationEdit',
          component: OperationEdit
        },
        {
          path: 'operationPreview/:id',
          name: 'OperationPreview',
          component:OperationPreview
        },
        {
          path: 'operationPublish/:id',
          name: 'OperationPublish',
          component: OperationPublish
        },
        {
          path: 'add',
          name: 'add',
          component: OperationTextAdd
        },
        {
          path: 'video',
          name: 'video',
          component: OperationVideoAdd
        },
        {
          path:'contentApproval/index',
          name:'contentApproval',
          component:contentApproval
        }




      ]
    }


  ]
})
