import Vue from 'vue'
import Router from 'vue-router'
//import GrabStorage from '@/components/GrabStorage'
//import Published from '@/components/Published'
//抓取池
import GrabStorage from '@/components/grab/GrabStorage'
import GrabStoragePreview from '@/components/grab/Preview'
import GrabStorageEdit from '@/components/grab/Edit'

import GrabStoragePublish from '@/components/grab/publish'

import Published from '@/components/published/Published'
import PublishedPreview from '@/components/published/Preview'
import PublishedEdit from '@/components/published/Edit'
import PublishedPublish from '@/components/published/Publish'
//运营池
import OperationStorage from '@/components/opetation/OperationStorage'
import OperationPreview from '@/components/opetation/Preview'
import OperationEdit from '@/components/opetation/Edit'
import OperationPublish from '@/components/opetation/Publish'
import OperationTextAdd from '@/components/opetation/TextAdd'
import OperationVideoAdd from '@/components/opetation/VideoAdd'
//标签
import Tag from '@/components/tag/Tag'
//评论
import Comment from '@/components/Comment'
//登陆
import Login from '@/pages/Login'

//框架

//内容审核
import contentApproval from '@/components/contentApproval/Index'
import PublishingPool from '@/components/contentApproval/PublishingPool'
import PublishingPoolEdit from '@/components/contentApproval/PublishingPoolEdit'
import HotpostList from '@/components/contentApproval/HotpostList'
import HotpostListEdit from '@/components/contentApproval/HotpostListEdit'

import Wrap from '@/components/_common/Wrap'

//版本管理
import Versions from '@/components/versions/Index'
import VersionsAdd from '@/components/versions/Add'
import VersionsEdit from '@/components/versions/Edit'


//推送管理
import pushIndex from '@/components/push/index'
import pushReply from '@/components/push/reply'
import pushAdd from '@/components/push/add'
import pushEdit from '@/components/push/edit'

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
          path: 'contentApproval/index',
          name: 'contentApproval',
          component: contentApproval
        },
        {
          path: 'contentApproval/PublishingPool',
          name: 'PublishingPool',
          component: PublishingPool
        },
        {
          path: 'contentApproval/PublishingPoolEdit/:id',
          name: 'PublishingPoolEdit',
          component: PublishingPoolEdit
        },
        {
          path: 'contentApproval/HotpostList',
          name: 'HotpostList',
          component: HotpostList
        },
        {
          path: 'contentApproval/HotpostListEdit/:id',
          name: 'HotpostListEdit',
          component: HotpostListEdit
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
          path: 'push/index',
          name: 'pushIndex',
          component: pushIndex
        },
        {
          path: 'push/reply',
          name: 'pushReply',
          component: pushReply
        },
        {
          path: 'push/add',
          name: 'pushAdd',
          component: pushAdd
        },
        {
          path: 'push/edit',
          name: 'pushEdit',
          component: pushEdit
        },
        {
          path: 'versions',
          name: 'versions',
          component: Versions
        },
        {
          path: 'versionsEdit/:id',
          name: 'versionsEdit',
          component: VersionsEdit
        },
        {
          path: 'versionsAdd',
          name: 'versionsAdd',
          component: VersionsAdd
        },
      ]
    }


  ]
})
