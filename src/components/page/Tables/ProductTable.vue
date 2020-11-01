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

                <el-select v-model="query.type" placeholder="商品类别" class="handle-select mr10">
                    <el-option key="1" label="键盘乐器" value="KeyBoard"></el-option>
                    <el-option key="2" label="弦乐器" value="StringInstrument"></el-option>
                    <el-option key="3" label="管乐器" value="WindInstrument"></el-option>
                    <el-option key="4" label="打击乐器" value="percussionInstrument"></el-option>
                </el-select>

                <el-select v-model="query.ordered" placeholder="升降序" class="handle-select mr10">
                    <el-option key="1" label="升序" value="1"></el-option>
                    <el-option key="2" label="降序" value="0"></el-option>
                </el-select>

                <el-input v-model="query.name" placeholder="商品名" class="handle-select mr10"></el-input>


                <el-col :span="3">
                    <el-input v-model="query.minPrice" placeholder="最小价格" class="handle-select mr10"></el-input>
                </el-col>
                <el-col class="line" :span="1" align="center">-</el-col>
                <el-col :span="3">
                    <el-input v-model="query.maxPrice" placeholder="最大价格" class="handle-select mr10"></el-input>
                </el-col>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

                <el-button
                        type="primary"
                        icon="el-icon-delete"
                        class="handle-del mr10"
                        @click="delAllSelection"
                >批量删除</el-button>

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
                <el-table-column prop="color" label="颜色"></el-table-column>
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
import http from '../../../utils/http';
import api from '../../../utils/api';
import { deleteRequest, searchRequest } from '../../../requests/ProductRequests';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                type: '',
                name: '',
                ordered: '',
                minPrice: '',
                maxPrice: '',
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
            typeName:[],
            merchantId: '',
        };
    },

    created() {
        if(sessionStorage.getItem('ms_userIdentity') === 'Merchant'){
            this.merchantId = sessionStorage.getItem('ms_userId');
        }else if(typeof (this.$route.query.merchantId) !== "undefined"){
            this.merchantId = this.$route.query.merchantId;
        }

        this.productListUpdate()
    },
    updated() {
        // if(sessionStorage.getItem('ms_userIdentity') === 'Merchant'){
        //     this.merchantId = sessionStorage.getItem('ms_userId');
        // }else if(typeof (this.$route.query.merchantId) !== "undefined"){
        //     this.merchantId = this.$route.query.merchantId;
        // }

        // this.productListUpdate()
    },
    methods: {


        addProduct(){
            if(sessionStorage.getItem('ms_userIdentity') === 'Merchant') {
                this.$router.push({ path: '/add_product_form' })
            }else{
                this.$message.error("管理员不可以添加产品哦");
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.tableData = []
            this.$set(this.query, 'pageIndex', 1);
            this.productListUpdate()
        },

        productListUpdate(){
            let params;
            if(this.merchantId !== '') {
                if (this.query.name !== '' && this.query.type !== '' && this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '' && this.query.type !== '' && this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '' && this.query.type !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '' && this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.type !== '' && this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.type !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.type !== '' && this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '' && this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        ascending: this.query.ordered,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '' && this.query.type !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        mId: this.merchantId
                    };
                } else if (this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                        mId: this.merchantId
                    };
                } else if (this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        ascending: this.query.ordered,
                        mId: this.merchantId
                    };
                } else if (this.query.type !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        mId: this.merchantId
                    };
                } else if (this.query.name !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        mId: this.merchantId
                    };
                } else {
                    params = {
                        PageNum: this.query.pageIndex,
                        mId: this.merchantId
                    };
                }
            }else{
                if (this.query.name !== '' && this.query.type !== '' && this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                    };
                } else if (this.query.name !== '' && this.query.type !== '' && this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                    };
                } else if (this.query.name !== '' && this.query.type !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                    };
                } else if (this.query.name !== '' && this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                    };
                } else if (this.query.type !== '' && this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                    };
                } else if (this.query.ordered !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        ascending: this.query.ordered,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                    };
                } else if (this.query.type !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice,
                    };
                } else if (this.query.type !== '' && this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                        ascending: this.query.ordered,
                    };
                } else if (this.query.name !== '' && this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice
                    };
                } else if (this.query.name !== '' && this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        ascending: this.query.ordered,
                    };
                } else if (this.query.name !== '' && this.query.type !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                        pType: this.query.type,
                    };
                } else if (this.query.minPrice !== '' && this.query.maxPrice !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        minPrice: this.query.minPrice,
                        maxPrice: this.query.maxPrice
                    };
                } else if (this.query.ordered !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        ascending: this.query.ordered,
                    };
                } else if (this.query.type !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pType: this.query.type,
                    };
                } else if (this.query.name !== '') {
                    params = {
                        PageNum: this.query.pageIndex,
                        pName: this.query.name,
                    };
                } else {
                    params = {
                        PageNum: this.query.pageIndex,
                    };
                }
            }
            searchRequest(params,this.searchRequestCallback);
        },


        // 删除操作
        deleteBtnOnClick(index) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        pId: this.tableData[index].id
                    };
                    deleteRequest(params,this.deleteRequestCallback,index)
                })
                .catch(() => {});
        },


        deleteRequestCallback: async function (index,response){
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
                this.tableData.splice(index, 1);
                this.productListUpdate();
            }else{
                this.$message.error(response.data.msg);
            }
        },


        searchRequestCallback(response){
            this.tableData = [];
            this.pageTotal = response.data.tatal;
            const length = response.data.dataList.length;
            for (let i = 0; i < length; i++) {

                var typeName
                if(response.data.dataList[i].ptype === 'KeyBoard') typeName = '键盘乐器'
                else  if(response.data.dataList[i].ptype === 'StringInstrument') typeName = '弦乐器'
                else  if(response.data.dataList[i].ptype === 'WindInstrument') typeName = '管乐器'
                else  if(response.data.dataList[i].ptype === 'percussionInstrument') typeName = '打击乐器'
                let data = {
                    id: response.data.dataList[i].pid,
                    name: response.data.dataList[i].pname,
                    type: typeName,
                    money: response.data.dataList[i].pprice,
                    color: response.data.dataList[i].pcolor,
                    image: response.data.dataList[i].pimage,
                    inventoryQuantity: response.data.dataList[i].pinventoryquantity,
                    comment: response.data.dataList[i].pcomment,
                    mId: response.data.dataList[i].merchantinfoMid
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
            let typeName
            if (this.tableData[index].type === '键盘乐器') {
                typeName = 'KeyBoard'
            } else if (this.tableData[index].type === '弦乐器') {
                typeName = 'StringInstrument'
            } else if (this.tableData[index].type === '管乐器') {
                typeName = 'WindInstrument'
            } else if (this.tableData[index].type === '打击乐器') {
                typeName = 'percussionInstrument'
            }

            this.$router.push({
                path: '/modify_product_form',
                query: {
                    id: this.tableData[index].id,
                    name: this.tableData[index].name,
                    type: typeName,
                    money: this.tableData[index].money,
                    color: this.tableData[index].color,
                    image: this.tableData[index].image,
                    inventoryQuantity: this.tableData[index].inventoryQuantity,
                    comment: this.tableData[index].comment,
                    mId: this.tableData[index].mId
                }
            });


        },
        getMerchant: async function(index){
            let params = {
                PageNum: 1,
                mId: this.tableData[index].id,
            }

            var response = await http.post(api.merchant_search,params);

            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
                console.log(response);
            }
            await this.$router.push({
                path: '/modify_merchant_form',
                query: {
                    id: response.data.dataList[0].mid,
                    account: response.data.dataList[0].maccount,
                    name: response.data.dataList[0].mname,
                    phoneNo: response.data.dataList[0].mphoneno,
                    money: response.data.dataList[0].mbalance,
                    address: response.data.dataList[0].maddress,
                    imageUrl: response.data.dataList[0].mimage
                }
            });
        },

        getProductOrders: async function(index){
            await this.$router.push({
                path: '/order_table',
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
            this.productListUpdate()
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
