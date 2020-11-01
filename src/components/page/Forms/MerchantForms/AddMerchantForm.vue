<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>商家表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商家账户">
                        <el-input v-model="form.account"></el-input>
                    </el-form-item >

                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>

                    <el-form-item label="商家姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

<!--                    <el-form-item label="性别">-->
<!--                        <el-select v-model="form.sex" placeholder="请选择" value="Male">-->
<!--                            <el-option key="Male" label="男" value="Male"></el-option>-->
<!--                            <el-option key="Female" label="女" value="Female"></el-option>-->
<!--                            <el-option key="Unknown" label="未知" value="Unknown"></el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->

                    <el-form-item label="地址">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
<!--                    <el-form-item label="商家余额">-->
<!--                        <el-input v-model="form.balance"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item label="电话">
                        <el-input v-model="form.phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="头像修改">
                        <div class="crop-demo">
                            <img :src="cropImg" class="pre-img" height="100" width="100">
                            <div class="crop-demo-btn">选择图片
                                <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
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

import http from '../../../../utils/http';
import api from '../../../../utils/api';
import { insertRequest } from '../../../../requests/MerchantRequests';

export default {
    name: 'userform',
    data() {
        return {
            form: {
                account:'',
                password:'',
                name: '',
                //sex: '',
                address: '',
                // balance: '',
                phoneNo: '',
            },
            cropImg: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1594460135282&di=895ab57446104a343ec82fee8024a406&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201808%2F11%2F20180811164818_V5VS5.thumb.700_0.jpeg'
        };
    },
    methods: {
        addBtnOnClick: async function (){

            let params = {
                mAccount: this.form.account,
                mPassword: this.form.password,
                mName: this.form.name,
                mAddress: this.form.address,
                mPhoneNo: this.form.phoneNo,
                mImage: this.cropImg
            };
            await insertRequest(params, this.insertRequestCallback);
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
