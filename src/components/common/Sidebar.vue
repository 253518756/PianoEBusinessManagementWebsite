<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        if(sessionStorage.getItem('ms_userIdentity') === 'Merchant') {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'merchant_dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-global',
                        index: 'order_table',
                        title: '订单管理',
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'product_table',
                        title: '商品管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'statistic',
                        title: '数据统计',
                        subs: [
                            {
                                index: 'merchant_topten_charts',
                                title: '前十名数据统计'
                            },
                            {
                                index: 'merchant_total',
                                title: '订单信息统计'
                            },
                        ]
                    },
                ]
            };
        }else if(sessionStorage.getItem('ms_userIdentity') === 'Admin'){
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'admin_dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-global',
                        index: 'order_table',
                        title: '订单管理',
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'product_table',
                        title: '商品管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'merchant_table',
                        title: '商家管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'user_table',
                        title: '用户管理'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: 'statistic',
                        title: '数据统计',
                        subs: [
                            {
                                index: 'admin_month_charts',
                                title: '月度订单统计'
                            },
                            {
                                index: 'admin_topten_charts',
                                title: '前十名数据统计'
                            },
                            {
                                index: 'admin_total',
                                title: '订单信息统计'
                            },
                        ]
                    },
                ]
            };
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
