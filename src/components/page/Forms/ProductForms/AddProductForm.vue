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
                        <el-button type="primary" @click="addBtnOnClick">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import api from '../../../../utils/api';
import http from '../../../../utils/http';
import { insertRequest } from '../../../../requests/ProductRequests';

export default {
    name: 'userform',
    data() {
        return {
            form: {
                name: '',
                type: '',
                price: '',
                color: '',
                inventoryQuantity: '',
                comment: '',
            },
            cropImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594460135282&di=895ab57446104a343ec82fee8024a406&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201808%2F11%2F20180811164818_V5VS5.thumb.700_0.jpeg',
            merchantId: '',
        };
    },
    methods: {
        addBtnOnClick: async function (){
            if(sessionStorage.getItem('ms_userIdentity') === 'Merchant'){
                this.merchantId = sessionStorage.getItem('ms_userId');
                let params = {
                    pName: this.form.name,
                    pType: this.form.type,
                    pPrice: this.form.price,
                    pColor: this.form.color,
                    pInventoryQuantity: this.form.inventoryQuantity,
                    pImage: this.cropImg,
                    pComment: this.form.comment,
                    mId: this.merchantId
                };
                await insertRequest(params, this.insertRequestCallback);
            }else{
                this.$message.error("管理员不可以添加产品哦");
            }
        },

        insertRequestCallback(response){
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
            }
        },

    }
};
</script>
