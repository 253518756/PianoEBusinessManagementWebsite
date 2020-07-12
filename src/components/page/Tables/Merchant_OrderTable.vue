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
                <div >
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="起始时间"
                                v-model="query.date1"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="终止时间"
                                v-model="query.date2"
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
                <el-table-column prop="time" label="订单时间" align="center"></el-table-column>
                <el-table-column label="总价格" align="center">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
                <el-table-column label="操作" width="360" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >所属用户</el-button>
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="getProductOrders(scope.$index)"
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
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
                date1: '',
                date2: '',
                name: '',
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
            userIdList:[]
        };
    },
    created() {
        this.orderListInitRequest()
    },
    methods: {

        // 触发搜索按钮
        handleSearch() {
            if(this.query.name === ''){
                this.$message.error('请添加筛选条件');
            }else{
                this.tableData = []
                this.$set(this.query, 'pageIndex', 1);
                this.searchOrderRequest()
            }
        },

        searchOrderRequest: async function (index){
            var params = {
                name: this.query.name,
                eachPage: this.query.pageIndex
            };
            var response = await http.post(api.product_search,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
        },

        updateList(response){
            this.pageTotal = response.data.tatal;
            const length = response.data.dataList.length;
            for (let i = 0; i < length; i++) {
                let data = {
                    id: response.data.dataList[i].orderid,
                    time: response.data.dataList[i].time,
                    money: response.data.dataList[i].cost,
                }
                this.userIdList = this.userIdList.concat(response.data.dataList[i].userId)
                this.tableData = this.tableData.concat(data)
            }
        },
        getMyDate(str) {
            var oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth() + 1,
                oDay = oDate.getDate(),
                oHour = oDate.getHours(),
                oMin = oDate.getMinutes(),
                oSen = oDate.getSeconds(),
                oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay) + ' ' + this.addZero(oHour) + ':' +
                    this.addZero(oMin) + ':' + this.addZero(oSen);
            return oTime;
        },

        addZero(num) {
            if (parseInt(num) < 10) {
                num = '0' + num;
            }
            return num;
        },




        /**
         * 所有订单
         * @returns {Promise<void>}
         */
        orderListInitRequest: async function (){
            let params = {
                eachPage: this.query.pageIndex
            }
            var response = await http.post(api.order_show,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.updateList(response)
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
        },

        /**
         * 特定玩家的订单
         * @returns {Promise<void>}
         */
        userOrderListInitRequest: async function (){
            let params = {
                userId: this.$route.query.userId,
                eachPage: this.query.pageIndex
            }
            var response = await http.post(api.product_show,params);
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

            if(this.tableData[index].type === '键盘乐器') {
                this.typeName[0] = 'Instrument'
                this.typeName[1] = 'KeyBoard'
            }else if(this.tableData[index].type === '弦乐器') {
                this.typeName[0] = 'Instrument'
                this.typeName[1] = 'StringInstrument'
            }else if(this.tableData[index].type === '管乐器') {
                this.typeName[0] = 'Instrument'
                this.typeName[1] = 'WindInstrument'
            }else if(this.tableData[index].type === '打击乐器') {
                this.typeName[0] = 'Instrument'
                this.typeName[1] = 'percussionInstrument'
            }
            this.$router.push({path: '/modify_product_form',
                query:{
                    id: this.tableData[index].id,
                    name: this.tableData[index].name,
                    type: this.typeName,
                    money: this.tableData[index].money,
                    comment: this.tableData[index].comment,
                    merchantId: this.merchantIdList[index]
                }
            });
        },
        getProductOrders: async function(index){
            await this.$router.push({
                path: '/admin_productOrder_table',
                query: {
                    orderId: this.tableData[index].id
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            console.log(`当前页: ${val}`);
            this.$set(this.query, 'pageIndex', val);
            this.tableData = []
            if(this.query.name === ''){
                this.productListInitRequest();
            }
            else{
                this.searchProductRequest();
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
