import Vue from 'vue';
import Router from 'vue-router';





Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/DashBoards/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/merchant_dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/DashBoards/MerchantDashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/admin_dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/DashBoards/AdminDashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Tables/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/product_table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Tables/ProductTable.vue'),
                    meta: { title: '商品管理' }
                },
                {
                    path: '/order_table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Tables/OrderTable.vue'),
                    meta: { title: '订单管理' }
                },
                {
                    path: '/merchant_table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Tables/MerchantTable.vue'),
                    meta: { title: '商家管理' }
                },
                {
                    path: '/user_table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/Tables/UserTable.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    path: '/add_user_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/UserForms/AddUserForm.vue'),
                    meta: { title: '添加新用户' }
                },
                {
                    path: '/modify_user_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/UserForms/ModifyUserForm.vue'),
                    meta: { title: '修改用户信息' }
                },
                {
                    path: '/add_merchant_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/MerchantForms/AddMerchantForm.vue'),
                    meta: { title: '添加新商户' }
                },
                {
                    path: '/modify_merchant_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/MerchantForms/ModifyMerchantForm.vue'),
                    meta: { title: '修改商户信息' }
                },
                {
                    path: '/modify_order_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/OrderForms/ModifyOrderForm.vue'),
                    meta: { title: '修改订单信息' }
                },
                {
                    path: '/merchant_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/MerchantForms/MerchantForm.vue'),
                    meta: { title: '商户表单' }
                },
                {
                    path: '/order_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/OrderForms/OrderForm.vue'),
                    meta: { title: '订单表单' }
                },
                {
                    path: '/product_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/ProductForms/ProductForm.vue'),
                    meta: { title: '产品表单' }
                },
                {
                    path: '/add_product_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/ProductForms/AddProductForm.vue'),
                    meta: { title: '添加新产品' }
                },
                {
                    path: '/modify_product_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/ProductForms/ModifyProductForm.vue'),
                    meta: { title: '修改产品' }
                },
                {
                    path: '/add_user_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/UserForms/AddUserForm.vue'),
                    meta: { title: '添加新用户' }
                },
                {
                    path: '/modify_user_form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/Forms/UserForms/ModifyUserForm.vue'),
                    meta: { title: '修改用户信息' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },

                {
                    // vue-schart组件
                    path: '/admin_month_charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Charts/AdminMonthCharts.vue'),
                    meta: { title: '管理员月度订单统计' }
                },

                {
                    // vue-schart组件
                    path: '/admin_topten_charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Charts/AdminToptenCharts.vue'),
                    meta: { title: '管理员前十名数据统计' }
                },

                {
                    // vue-schart组件
                    path: '/admin_total',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Charts/AdminTotal.vue'),
                    meta: { title: '管理员前十名数据统计' }
                },
                {
                    // vue-schart组件
                    path: '/merchant_topten_charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Charts/MerchantToptenCharts.vue'),
                    meta: { title: '商家前十名数据统计' }
                },
                {
                    // vue-schart组件
                    path: '/merchant_total',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/Charts/MerchantTotal.vue'),
                    meta: { title: '商家前十名数据统计' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
