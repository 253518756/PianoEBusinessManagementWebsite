<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.state" placeholder="订单状态" class="handle-select mr10">
                    <el-option key="1" label="待发单" value="Ordered"></el-option>
                    <el-option key="2" label="已发单" value="Delivered"></el-option>
                    <el-option key="3" label="已完成" value="Finished"></el-option>
                    <el-option key="4" label="已取消" value="Canceled"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="state" label="订单状态"  align="center"></el-table-column>
                <el-table-column prop="quantity" label="商品数量" align="center"></el-table-column>

                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getMerchant(scope.$index)"
                        >商品详情</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getMerchant(scope.$index)"
                        >所属用户订单</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getMerchant(scope.$index)"
                        >所属商家</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >更多</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import http from '../../../utils/http';
import api from '../../../utils/api';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                type: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            orderIdList: [],
            productIdList:[],
            typeName:[]
        };
    },
    mounted() {
        if((typeof (this.$route.query.merchantId) !== "undefined")){
            this.merchantOrderProductListInitRequest();
        }else if(typeof(this.$route.query.productId) !== "undefined"){
            this.productOrderProductListInitRequest();
        }else if(typeof(this.$route.query.orderId) !== "undefined"){
            this.orderOrderProductListInitRequest();
        }

    },
    methods: {

        // 触发搜索按钮
        handleSearch() {
            if(this.query.state === ''){
                this.$message.error('请添加筛选条件');
            }else{
                this.tableData = []
                this.merchantIdList = []
                this.$set(this.query, 'pageIndex', 1);
                if((typeof (this.$route.query.merchantId) !== "undefined")){
                    this.merchantOrderProductListInitRequest();
                }else if(typeof(this.$route.query.productId) !== "undefined"){
                    this.productOrderProductListInitRequest();
                }else if(typeof(this.$route.query.orderId) !== "undefined"){
                    this.orderOrderProductListInitRequest();
                }
            }
        },

        updateList(response){
            console.log(response)
            this.pageTotal = response.data.tatal;
            const length = response.data.dataList.length;
            this.orderIdList = []
            this.productIdList = []
            for (let i = 0; i < length; i++) {
                var stateName
                if(response.data.dataList[i].state === 'Ordered') stateName = '待发单'
                else  if(response.data.dataList[i].state === 'Delivered') stateName = '已发单'
                else  if(response.data.dataList[i].state === 'Finished') stateName = '已完成'
                else  if(response.data.dataList[i].state === 'Canceled') stateName = '已取消'
                let data = {
                    id: response.data.dataList[i].orderProductid,
                    state : stateName,
                    quantity: response.data.dataList[i].quantity
                }
                this.orderIdList = this.orderIdList.concat(response.data.dataList[i].orderOrderid)
                this.productIdList = this.productIdList.concat(response.data.dataList[i].productProductid)

                console.log(this.productIdList)
                this.tableData = this.tableData.concat(data)
            }
        },

        merchantOrderProductListInitRequest: async function (){
            var params
            if(this.query.state === ''){
                params = {
                    merchantId: this.$route.query.merchantId,
                    eachPage: this.query.pageIndex
                }
            }else {
                params = {
                    merchantId: this.$route.query.merchantId,
                    state: this.query.state,
                    eachPage: this.query.pageIndex
                }
            }
            console.log(params)
            var response = await http.post(api.product_order_MerchantAndStateFind,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
        },

        productOrderProductListInitRequest: async function (){
            var params
            if(this.query.state === ''){
                params = {
                    productId: this.$route.query.productId,
                    eachPage: this.query.pageIndex
                }
            }else {
                params = {
                    productId: this.$route.query.productId,
                    state: this.query.state,
                    eachPage: this.query.pageIndex
                }
            }
            console.log(params)
            var response = await http.post(api.product_order_ProductAndStateFind,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
        },


        orderOrderProductListInitRequest: async function (){
            var params
            if(this.query.state === ''){
                params = {
                    orderId: this.$route.query.orderId,
                    eachPage: this.query.pageIndex
                }
            }else {
                params = {
                    orderId: this.$route.query.orderId,
                    state: this.query.state,
                    eachPage: this.query.pageIndex
                }
            }
            console.log(params)
            var response = await http.post(api.product_order_OrderAndStateFind,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
        },

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            // 添加多项删除请求
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        getMerchant: async function(index){
            let params = {
                merchantId: this.merchantIdList[index]
            }
            var response = await http.post(api.merchant_idFind,params);

            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
            console.log(response.data.data);
            await this.$router.push({
                path: '/modify_merchant_form',
                query: {
                    id: response.data.data.merchantid,
                    account: response.data.data.useraccount,
                    name: response.data.data.name,
                    sex: 'Male',
                    phoneNo: response.data.data.phoneno,
                    money: '未知',
                    address: response.data.data.address,
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            console.log(`当前页: ${val}`);
            this.$set(this.query, 'pageIndex', val);
            this.tableData = []
            this.merchantIdList = []
            if((typeof (this.$route.query.merchantId) !== "undefined")){
                this.merchantOrderProductListInitRequest();
            }else if(typeof(this.$route.query.productId) !== "undefined"){
                this.productOrderProductListInitRequest();
            }else if(typeof(this.$route.query.orderId) !== "undefined"){
                this.orderOrderProductListInitRequest();
            }
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
