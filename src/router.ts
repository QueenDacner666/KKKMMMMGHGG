import Vue from 'vue'
import Router from 'vue-router'
const Root = () => import('./routers/root.vue')
const Company = () => import('./routers/company.vue')
const Category = () => import('./routers/category.vue')
const Share = () => import('./routers/share.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Root',
      component: Root,
    },
    {
      path: '/share',
      name: 'Share',
      component: Share,
    },
    {
      path: '/:company?',
      component: Company,
      children: [
        {
          path: 'category/:category',
          name: 'Category',
          component: Category
        }
      ],
    },
  ]
})
