<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="账单ID">
                        <div>{{id}}</div>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select v-model="form.state" placeholder="请选择" >
                            <el-option key="1" label="待发单" value="Ordered"></el-option>
                            <el-option key="2" label="已发单" value="Delivered"></el-option>
                            <el-option key="3" label="已完成" value="Finished"></el-option>
                            <el-option key="4" label="已取消" value="Canceled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单金额">
                        <div>{{money}}</div>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <div>{{quantity}}</div>
                    </el-form-item>
                    <el-form-item label="账单时间">
                        <div>{{time}}</div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="getUser">所属用户</el-button>
                        <el-button type="primary" @click="getProduct">所属商品</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateBtnOnClick">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import http from '../../../../utils/http';
import api from '../../../../utils/api';
import { updateRequest } from '../../../../requests/OrderRequests';

export default {
    name: 'userform',
    data() {
        return {
            id: this.$route.query.id,
            form: {
                state: this.$route.query.state,
            },
            money: this.$route.query.money,
            quantity: this.$route.query.quantity,
            time: this.$route.query.time,

            pId: this.$route.query.pId,
            uId: this.$route.query.uId,

        };
    },
    methods: {
        updateBtnOnClick: async function (){
            let params = {
                oId: this.id,
                oState: this.form.state,
            }
            await updateRequest(params, this.updateRequestCallback);
        },


        updateRequestCallback(response){
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
            }
        },

        getUser: async function(){
            let params = {
                PageNum: 1,
                uId: this.uId,
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



        getProduct: async function(){
            let params = {
                PageNum: 1,
                pId: this.pId,
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
    }
};
</script>
