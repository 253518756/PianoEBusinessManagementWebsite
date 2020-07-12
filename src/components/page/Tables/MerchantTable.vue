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
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-roundadd" @click="addMerchant">添加商家</el-button>
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
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="account" label="商户账号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
<!--                <el-table-column prop="sex" width="55" label="性别"></el-table-column>-->
<!--                <el-table-column width="80" label="商户余额">-->
<!--                    <template slot-scope="scope">￥{{scope.row.money}}</template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="头像(查看大图)" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-image-->
<!--                            class="table-td-thumb"-->
<!--                            :src="scope.row.thumb"-->
<!--                            :preview-src-list="[scope.row.thumb]"-->
<!--                        ></el-image>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="phoneNo" label="电话"></el-table-column>
                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getProductOrders(scope.$index)"
                        >所属订单</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getProducts(scope.$index)"
                        >所属商品</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >更多</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
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
import { fetchData } from '../../../api';
import http from '../../../utils/http';
import api from '../../../utils/api';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [
                // {
                //     id: 3,
                //     account: 253518756,
                //     name: '高物终结者',
                //     sex: '男',
                //     phoneNo: 12323455432,
                //     money: 111,
                //     address: '莲花山东胜区小村子'
                // }
            ],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.merchantListInitRequest();
    },
    methods: {
        addMerchant(){
            this.$router.push({path: '/add_merchant_form'})
        },
        // 触发搜索按钮
        handleSearch() {
            if(this.query.name === ''){
                this.$message.error('请添加筛选条件');
            }else{
                this.tableData = []
                this.$set(this.query, 'pageIndex', 1);
                this.searchMerchantRequest()
            }
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.deleteMerchantRequest(index)
                })
                .catch(() => {});
        },

        searchMerchantRequest: async function (index){
            let params = {
                name: this.query.name,
                eachPage: this.query.pageIndex
            }
            var response = await http.post(api.merchant_search,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
            }
        },

        updateList(response){
            this.pageTotal = response.data.tatal;
            console.log(response.data.tatalPage);
            const length = response.data.dataList.length;
            for (let i = 0; i < length; i++) {
                let sexName = '男'
                if(response.data.dataList[i].sex === 'Male') sexName = '男'
                else if(response.data.dataList[i].sex === 'Female') sexName = '女'
                else sexName = '未知'
                let data = {
                    id: response.data.dataList[i].merchantid,
                    account: response.data.dataList[i].useraccount,
                    name: response.data.dataList[i].name,
                    sex: sexName,
                    phoneNo: response.data.dataList[i].phoneno,
                    money: '未知',
                    address: response.data.dataList[i].address
                }
                this.tableData = this.tableData.concat(data)
            }
        },

        deleteMerchantRequest: async function (index){
            let params = {
                merchantId: this.tableData[index].id
            }
            var response = await http.post(api.merchant_delete,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.tableData.splice(index, 1);
            }else{
                this.$message.error(response.data.msg);
            }
        },

        merchantListInitRequest: async function (){
            let params = {
                eachPage: this.query.pageIndex
            }
            var response = await http.post(api.merchant_show,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                console.log(response)
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
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
            this.$router.push({
                path: '/modify_merchant_form',
                query: {
                    id: this.tableData[index].id,
                    account: this.tableData[index].account,
                    name: this.tableData[index].name,
                    sex: this.tableData[index].sex,
                    phoneNo: this.tableData[index].phoneNo,
                    money: this.tableData[index].money,
                    address: this.tableData[index].address,
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            console.log(`当前页: ${val}`);
            this.$set(this.query, 'pageIndex', val);
            this.tableData = []
            if(this.query.name === ''){
                this.merchantListInitRequest();
            }
            else{
                this.searchMerchantRequest();
            }
        },


        /**
         * 获取所有该商户的商品
         * @param index
         * @returns {Promise<void>}
         */
        getProducts: async function(index){
            this.$router.push({
                path: '/product_table',
                query: {
                    merchantId: this.tableData[index].id
                }
            });
        },

        /**
         *
         * @param index
         * @returns {Promise<void>}
         */
        getProductOrders: async function(index){
            this.$router.push({
                path: '/admin_productOrder_table',
                query: {
                    merchantId: this.tableData[index].id
                }
            });
        },

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
