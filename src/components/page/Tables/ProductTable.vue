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
                <el-cascader :options="options" v-model="query.type"class="handle-select mr10"></el-cascader>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-lx-roundadd" @click="addProduct">添加商品</el-button>
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
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="type" label="商品类别"></el-table-column>
                <el-table-column width="80" label="商品价格">
                    <template slot-scope="scope">￥{{scope.row.money}}</template>
                </el-table-column>
<!--                <el-table-column label="商品图片" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-image-->
<!--                            class="table-td-thumb"-->
<!--                            :src="scope.row.thumb"-->
<!--                            :preview-src-list="[scope.row.thumb]"-->
<!--                        ></el-image>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column prop="comment" label="备注"></el-table-column>
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
                                @click="getMerchant(scope.$index)"
                        >所属商家</el-button>
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
            merchantIdList: [],
            options: [
                {
                    value: 'Instrument',
                    label: '乐器',
                    children: [
                        {
                            value: 'KeyBoard',
                            label: '键盘乐器',
                        },
                        {
                            value: 'StringInstrument',
                            label: '弦乐器',
                        },
                        {
                            value: 'WindInstrument',
                            label: '管乐器',
                        },
                        {
                            value: 'percussionInstrument',
                            label: '打击乐器',
                        }
                    ]
                },
            ],
            typeName:[]
        };
    },
    mounted() {
        if(typeof (this.$route.query.merchantId) !== "undefined"){
            this.merchantProductListInitRequest();
        }else {
            this.productListInitRequest();
        }

    },
    methods: {


        addProduct(){
            this.$router.push({path: '/add_product_form'})
        },
        // 触发搜索按钮
        handleSearch() {
            if(this.query.name === '' && this.query.type === ''){
                this.$message.error('请添加筛选条件');
            }else{
                this.tableData = []
                this.merchantIdList = []
                this.$set(this.query, 'pageIndex', 1);
                this.searchProductRequest()
            }
        },
        // 删除操作
        handleDelete(index) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.deleteProductRequest(index)
                })
                .catch(() => {});
        },

        searchProductRequest: async function (index){
            var params = {
                name: this.query.name,
                type: this.query.type[1],
                eachPage: this.query.pageIndex
            };
            if(this.query.name === ''){
                params = {
                    type: this.query.type[1],
                    eachPage: this.query.pageIndex
                }
            }
            else if (this.query.type === '') {
                params = {
                    name: this.query.name,
                    eachPage: this.query.pageIndex
                };
            }
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
            console.log(response)
            this.pageTotal = response.data.tatal;
            const length = response.data.dataList.length;
            for (let i = 0; i < length; i++) {
                var typeName
                if(response.data.dataList[i].type === 'KeyBoard') typeName = '键盘乐器'
                else  if(response.data.dataList[i].type === 'StringInstrument') typeName = '弦乐器'
                else  if(response.data.dataList[i].type === 'WindInstrument') typeName = '管乐器'
                else  if(response.data.dataList[i].type === 'percussionInstrument') typeName = '打击乐器'
                let data = {
                    id: response.data.dataList[i].productid,
                    name: response.data.dataList[i].name,
                    type: typeName,
                    money: response.data.dataList[i].price,
                    comment: response.data.dataList[i].comment,
                }
                this.merchantIdList = this.merchantIdList.concat(response.data.dataList[i].merchantMerchantid)
                console.log(this.merchantIdList)
                this.tableData = this.tableData.concat(data)
            }
        },

        deleteProductRequest: async function (index){
            let params = {
                productId: this.tableData[index].id
            }
            var response = await http.post(api.product_delete,params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.tableData.splice(index, 1);
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
        },

        productListInitRequest: async function (){
            let params = {
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

        merchantProductListInitRequest: async function (){
            let params = {
                merchantId: this.$route.query.merchantId,
                eachPage: this.query.pageIndex
            }
            var response = await http.post(api.product_merchantFind,params);
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

        getProductOrders: async function(index){
            await this.$router.push({
                path: '/admin_productOrder_table',
                query: {
                    productId: this.tableData[index].id
                }
            });
        },

        // 分页导航
        handlePageChange(val) {
            console.log(`当前页: ${val}`);
            this.$set(this.query, 'pageIndex', val);
            this.tableData = []
            this.merchantIdList = []
            if(typeof (this.$route.query.merchantId) !== "undefined"){
                this.merchantProductListInitRequest();
            }else {
                this.productListInitRequest();
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
