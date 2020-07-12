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

                    <el-form-item label="用户账户">
                        <el-input v-model="form.account"></el-input>
                    </el-form-item >

                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
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
                    <el-form-item>
                        <el-button type="primary" @click="addUserRequest">表单提交</el-button>
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

export default {
    name: 'userform',
    data() {
        return {
            form: {
                account:'',
                password:'',
                name: '',
                sex: '',
                address: '',
                balance: '',
                phoneNo: '',
            }

        };
    },


    methods: {
        addUserRequest: async function (){
            let params = {
                userAccount: this.form.account,
                password: this.form.password,
                name: this.form.name,
                sex: this.form.sex,
                address: this.form.address,
                phoneNo: this.form.phoneNo
            }
            var response = await http.post(api.user_insert, params);
            if (response.data.status === 0) {
                this.$message.success('用户添加成功');
            }else{
                this.$message.error(response.data.msg);
            }
        },
    }
};
</script>
