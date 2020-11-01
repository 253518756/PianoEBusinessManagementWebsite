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
                    <el-form-item label="用户ID">
                        <div>{{id}}</div>
                    </el-form-item>
                    <el-form-item label="用户账户">
                        <div>{{account}}</div>
                    </el-form-item >
                    <el-form-item label="密码">
                        <el-button type="primary" icon="el-icon-search"  @click="">重置密码</el-button>
                        <div>用户新密码：123456</div>
                    </el-form-item>

                    <el-form-item label="用户姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select v-model="form.sex" placeholder="请选择" value="Male">
                            <el-option key="Male" label="男" value="Male"></el-option>
                            <el-option key="Female" label="女" value="Female"></el-option>
                            <el-option key="Unknown" label="未知" value="Unknown"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="地址">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="用户余额">
                        <el-input v-model="form.balance"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="form.phoneNo"></el-input>
                    </el-form-item>
                    <el-form-item label="出生日期">
                        <el-col :span="11">
                            <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    v-model="form.birthDate"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="年龄">
                        <el-input v-model="form.age"></el-input>
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
import { updateRequest } from '../../../../requests/UserRequests';
import { getLocalTime } from '../../../../utils/parse';

export default {
    name: 'userform',
    data() {
        return {
            id: this.$route.query.id,
            account: this.$route.query.account,
            form: {
                name: this.$route.query.name,
                sex: this.$route.query.sex,
                address: this.$route.query.address,
                balance: this.$route.query.balance,
                phoneNo: this.$route.query.phoneNo,
                birthDate: getLocalTime(this.$route.query.birthDate),
                age: this.$route.query.age,
            },
            cropImg: this.$route.query.image,
        };
    },


    methods: {
        updateBtnOnClick: async function (){
            let params = {
                uId: this.$route.query.id,
                uPassword: 123456,
                uName: this.form.name,
                uSex: this.form.sex,
                uAddress: this.form.address,
                uPhoneNo: this.form.phoneNo,
                uBalance: this.form.balance,
                uBirthDate: this.form.birthDate,
                uAge: this.form.age,
                uImage: this.cropImg,
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


    }
};
</script>
