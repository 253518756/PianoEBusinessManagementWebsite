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
                    <el-form-item label="商家ID">
                        <div>{{id}}</div>
                    </el-form-item>
                    <el-form-item label="商家账户">
                        <div>{{account}}</div>
                    </el-form-item >
                    <el-form-item label="密码">
                        <el-button type="primary" icon="el-icon-search"  @click="">重置密码</el-button>
                    </el-form-item>

                    <el-form-item label="商家姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="商家余额">
                        <div>{{balance}}</div>
<!--                        <el-input v-model="form.balance"></el-input>-->
                    </el-form-item>
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
import { updateRequest } from '../../../../requests/MerchantRequests';

export default {
    name: 'userform',
    data() {
        return {
            id: this.$route.query.id,
            account: this.$route.query.account,
            balance: this.$route.query.money,
            form: {
                name: this.$route.query.name,
                address: this.$route.query.address,
                phoneNo: this.$route.query.phoneNo,
            },
            cropImg: this.$route.query.imageUrl,
        };
    },
    methods: {
        updateBtnOnClick: async function (){
            let params = {
                mId: this.$route.query.id,
                mPassword: '123123',
                mName: this.form.name,
                mAddress: this.form.address,
                mPhoneNo: this.form.phoneNo,
                mImage: this.cropImg,
            };
            await updateRequest(params, this.updateRequestCallback);
        },


        updateRequestCallback(response){
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
            }
        },



        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
};
</script>


<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
