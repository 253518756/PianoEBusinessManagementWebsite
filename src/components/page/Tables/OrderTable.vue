<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div >
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="起始时间"
                                v-model="query.minTime"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="终止时间"
                                v-model="query.maxTime"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                </div>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch" class="handle-del mr10">订单时间筛选</el-button>
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

                <el-table-column prop="time" label="订单时间" align="center"></el-table-column>
                <el-table-column label="总价格" align="center">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getUser(scope.$index)"
                        >所属用户</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getProduct(scope.$index)"
                        >订单商品</el-button>
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
import { fetchData } from '../../../api';
import http from '../../../utils/http';
import api from '../../../utils/api';
import { searchRequest } from '../../../requests/OrderRequests';
import { getLocalTime } from '../../../utils/parse';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                minTime: '',
                maxTime: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [

            ],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,


            userId: '',
            productId: '',
            merchantId: ''
        };
    },

    created() {
        if(sessionStorage.getItem('ms_userIdentity') === 'Merchant'){
            this.merchantId = sessionStorage.getItem('ms_userId');
        }else if(typeof (this.$route.query.merchantId) !== "undefined"){
            this.merchantId = this.$route.query.merchantId;
        }

        if(typeof (this.$route.query.userId) !== "undefined"){
            this.userId = this.$route.query.userId;
        }

        if(typeof (this.$route.query.productId) !== "undefined"){
            this.productId = this.$route.query.productId;
        }

        this.orderListUpdate()
    },

    updated() {
        // if(sessionStorage.getItem('ms_userIdentity') === 'Merchant'){
        //     this.merchantId = sessionStorage.getItem('ms_userId');
        // }else if(typeof (this.$route.query.merchantId) !== "undefined"){
        //     this.merchantId = this.$route.query.merchantId;
        // }
        //
        // if(typeof (this.$route.query.userId) !== "undefined"){
        //     this.userId = this.$route.query.userId;
        // }
        //
        // if(typeof (this.$route.query.productId) !== "undefined"){
        //     this.productId = this.$route.query.productId;
        // }

        // this.orderListUpdate()
    },
    methods: {

        // 触发搜索按钮
        handleSearch() {
                this.tableData = []
                this.$set(this.query, 'pageIndex', 1);
                this.orderListUpdate()
        },



        orderListUpdate(){
            let params;
            if(this.userId !== ''){
                if (this.query.minTime !== '' && this.query.maxTime !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        uId: this.userId,
                        minTime: this.query.minTime,
                        maxTime: this.query.maxTime,
                    };
                }else{
                    params = {
                        PageNum: this.query.pageIndex,
                        uId: this.userId,
                    };
                }
            }
            else if(this.productId !== '') {
                if (this.query.minTime !== '' && this.query.maxTime !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pId: this.productId,
                        minTime: this.query.minTime,
                        maxTime: this.query.maxTime,
                    };
                }else{
                    params = {
                        PageNum: this.query.pageIndex,
                        pId: this.productId,
                    };
                }
            }else{
                if(this.merchantId !== ''){
                    if (this.query.minTime !== '' && this.query.maxTime !== '') {
                        params = {
                            PageNum: this.query.pageIndex,
                            mId: this.merchantId,
                            minTime: this.query.minTime,
                            maxTime: this.query.maxTime,
                        };
                    }else{
                        params = {
                            PageNum: this.query.pageIndex,
                            mId: this.merchantId,
                        };
                    }
                }else{
                    if (this.query.minTime !== '' && this.query.maxTime !== '') {
                        params = {
                            PageNum: this.query.pageIndex,
                            minTime: this.query.minTime,
                            maxTime: this.query.maxTime,
                        };
                    }else{
                        params = {
                            PageNum: this.query.pageIndex,
                        };
                    }
                }
            }
            searchRequest(params,this.searchRequestCallback);
        },

        searchRequestCallback(response){
            this.tableData = [];
            this.pageTotal = response.data.tatal;
            const length = response.data.dataList.length;
            for (let i = 0; i < length; i++) {
                var stateName
                if(response.data.dataList[i].ostate === 'Ordered') stateName = '待发单'
                else  if(response.data.dataList[i].ostate === 'Delivered') stateName = '已发单'
                else  if(response.data.dataList[i].ostate === 'Finished') stateName = '已完成'
                else  if(response.data.dataList[i].ostate === 'Canceled') stateName = '已取消'

                let data = {
                    id: response.data.dataList[i].oid,
                    money: response.data.dataList[i].ocost,
                    quantity: response.data.dataList[i].oquantity,
                    state: stateName,
                    time: getLocalTime(response.data.dataList[i].ocreatetime),
                    uId: response.data.dataList[i].uId,
                    pId: response.data.dataList[i].pId,
                }

                this.tableData = this.tableData.concat(data);
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

            var stateName
            if(this.tableData[index].state === '待发单') stateName = 'Ordered'
            else  if(this.tableData[index].state === '已发单') stateName = 'Delivered'
            else  if(this.tableData[index].state === '已完成') stateName = 'Finished'
            else  if(this.tableData[index].state === '已取消') stateName = 'Canceled'


            this.$router.push({path: '/modify_order_form',
                query:{
                    id: this.tableData[index].id,
                    money: this.tableData[index].money,
                    quantity: this.tableData[index].quantity,
                    state: stateName,
                    time: this.tableData[index].time,
                    uId: this.tableData[index].uId,
                    pId: this.tableData[index].pId,
                }
            });
        },


        getUser: async function(index){
            let params = {
                PageNum: 1,
                uId: this.tableData[index].uId,
            }

            var response = await http.post(api.user_search,params);

            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
            await this.$router.push({
                path: '/modify_user_form',
                query: {
                    id: response.data.dataList[0].uid,
                    account: response.data.dataList[0].uaccount,
                    name: response.data.dataList[0].uname,
                    sex: response.data.dataList[0].usex,
                    phoneNo: response.data.dataList[0].uphoneno,
                    balance: response.data.dataList[0].ubalance,
                    address: response.data.dataList[0].uaddress,
                    birthDate: response.data.dataList[0].ubirthdate,
                    age: response.data.dataList[0].uage,
                    image: response.data.dataList[0].uimage,
                }
            });
        },



        getProduct: async function(index){
            let params = {
                PageNum: 1,
                pId: this.tableData[index].pId,
            }

            var response = await http.post(api.product_search,params);

            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
            await this.$router.push({
                path: '/modify_product_form',
                query: {
                    id: response.data.dataList[0].pid,
                    name: response.data.dataList[0].pname,
                    type: response.data.dataList[0].ptype,
                    money: response.data.dataList[0].pprice,
                    color: response.data.dataList[0].pcolor,
                    image: response.data.dataList[0].pimage,
                    inventoryQuantity: response.data.dataList[0].pinventoryquantity,
                    comment: response.data.dataList[0].pcomment,
                    mId: response.data.dataList[0].merchantinfoMid
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            console.log(`当前页: ${val}`);
            this.$set(this.query, 'pageIndex', val);
            this.orderListUpdate();
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
