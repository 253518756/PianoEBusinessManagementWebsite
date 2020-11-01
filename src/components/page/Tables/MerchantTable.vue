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
                <el-table-column width="80" label="商户余额">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="scope.row.thumb"
                            :preview-src-list="[scope.row.thumb]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="phoneNo" label="电话"></el-table-column>
                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getMerchantOrders(scope.$index)"
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
                            @click="deleteBtnOnClick(scope.$index)"
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
import { deleteRequest, searchRequest } from '../../../requests/MerchantRequests';
export default {
    name: 'MerchantTable',
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
        this.merchantListUpdate();
    },
    methods: {
        addMerchant(){
            this.$router.push({path: '/add_merchant_form'})
        },
        // 触发搜索按钮
        handleSearch() {
            this.tableData = [];
            this.$set(this.query, 'pageIndex', 1);
            this.merchantListUpdate();
        },


        merchantListUpdate(){
            let params;
            if(this.query.name === ''){
                params = {
                    PageNum: this.query.pageIndex
                };
            }else if(this.query.name !== ''){
                params = {
                    PageNum: this.query.pageIndex,
                    mName: this.query.name
                };
            }
            searchRequest(params,this.searchRequestCallback);
        },


        searchRequestCallback(response){
            this.tableData = [];
            // this.pageTotal = response.data.tatal;
            this.pageTotal = 200;
            console.log(this.pageTotal);
            const length = response.data.dataList.length;
            for (let i = 0; i < length; i++) {
                let data = {
                    id: response.data.dataList[i].mid,
                    account: response.data.dataList[i].maccount,
                    name: response.data.dataList[i].mname,
                    phoneNo: response.data.dataList[i].mphoneno,
                    money: response.data.dataList[i].mbalance,
                    address: response.data.dataList[i].maddress,
                    thumb: response.data.dataList[i].mimage,
                };
                this.tableData = this.tableData.concat(data);
            }
        },


        // 删除操作
        deleteBtnOnClick(index) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        mId: this.tableData[index].id
                    };
                    deleteRequest(params,this.deleteRequestCallback,index)
                })
                .catch(() => {});
        },


        deleteRequestCallback: async function (index,response){
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.tableData.splice(index, 1);
                this.merchantListUpdate();
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
                    phoneNo: this.tableData[index].phoneNo,
                    money: this.tableData[index].money,
                    address: this.tableData[index].address,
                    imageUrl: this.tableData[index].thumb
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            console.log(`当前页: ${val}`);
            this.$set(this.query, 'pageIndex', val);
            this.tableData = [];
            this.merchantListUpdate();
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
        getMerchantOrders: async function(index){
            this.$router.push({
                path: '/order_table',
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
