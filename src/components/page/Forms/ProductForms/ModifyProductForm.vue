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
                    <el-form-item label="商品ID">
                        <div>{{id}}</div>
                    </el-form-item>

                    <el-form-item label="商品名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="商品分类">
                        <el-select v-model="form.type" placeholder="商品类别" class="handle-select mr10">
                            <el-option key="1" label="键盘乐器" value="KeyBoard"></el-option>
                            <el-option key="2" label="弦乐器" value="StringInstrument"></el-option>
                            <el-option key="3" label="管乐器" value="WindInstrument"></el-option>
                            <el-option key="4" label="打击乐器" value="percussionInstrument"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  label="商品价格">
                        <el-input v-model="form.price"></el-input>
                    </el-form-item>

                    <el-form-item  label="颜色">
                        <el-input v-model="form.color"></el-input>
                    </el-form-item>

                    <el-form-item  label="库存量">
                        <el-input v-model="form.inventoryQuantity"></el-input>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input type="textarea" rows="5" v-model="form.comment"></el-input>
                    </el-form-item>

                    <el-form-item label="产品图片">
                        <div class="crop-demo">
                            <img :src="cropImg" class="pre-img" height="100" width="100">
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change=""/>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="getMerchant">所属商家</el-button>
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
import { updateRequest } from '../../../../requests/ProductRequests';

export default {
    name: 'userform',
    data() {
        return {
            id: this.$route.query.id,
            form: {
                name: this.$route.query.name,
                type: this.$route.query.type,
                price: this.$route.query.money,
                color: this.$route.query.color,
                inventoryQuantity: this.$route.query.inventoryQuantity,
                comment: this.$route.query.comment,
            },
            cropImg: this.$route.query.image,
            merchantId: this.$route.query.mId,

        };
    },
    methods: {
        updateBtnOnClick: async function (){
            let params = {
                pId: this.id,
                pName: this.form.name,
                pType: this.form.type,
                pPrice: this.form.price,
                pColor: this.form.color,
                pInventoryQuantity: this.form.inventoryQuantity,
                pImage: this.cropImg,
                pComment: this.form.comment,
                mId: this.merchantId
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

        getMerchant: async function(){
            let params = {
                PageNum: 1,
                mId: this.merchantId,
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
    }
};
</script>
