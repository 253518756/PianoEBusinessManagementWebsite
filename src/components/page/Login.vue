<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="loginForm" label-width="0px" class="ms-content">

                <el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="changeLoginMode()">{{loginMode}}</el-button>
                    </div>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="loginBtnOnClick()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="loginBtnOnClick()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import http from '../../utils/http'
import api from '../../utils/api'
import { loginRequest } from '../../requests/LoginRequests';
import { getLocalTime } from '../../utils/parse';

export default {
    data: function() {
        return {
            loginMode: '商家登录',
            param: {
                username: 'bzh',
                password: '123456',
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            },
        };
    },

    beforeCreate(){
        // 默认商家登录
        sessionStorage.setItem('ms_userIdentity','Merchant');
    },
    methods: {

        /**
         * 登录按键回调函数
         */ loginBtnOnClick() {

            this.$refs['loginForm'].validate(valid => {
                if (valid) {
                    let params;
                    // 根据不同用户身份
                    if (sessionStorage.getItem('ms_userIdentity') === 'Merchant') {
                        params = {
                            "mAccount": this.param.username,
                            "mPassword": this.param.password
                        };
                    } else if (sessionStorage.getItem('ms_userIdentity') === 'Admin') {
                        params = {
                            "aAccount": this.param.username,
                            "aPassword": this.param.password
                        };
                    }
                    loginRequest(params, this.loginRequestCallback);
                } else {
                    this.$message.error('列表中存在格式错误！');
                }
            });
        },


        async loginRequestCallback(response) {



            // 验证是否成功
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);



                // 根据不同用户身份
                if (sessionStorage.getItem('ms_userIdentity') === 'Merchant') {
                    // 缓存登录商户用户数据
                    sessionStorage.setItem('ms_username', response.data.data.mname);
                    sessionStorage.setItem('ms_userId', response.data.data.mid);
                    sessionStorage.setItem('ms_userImage', response.data.data.mimage);
                    sessionStorage.setItem('ms_userPhoneNo', response.data.data.mphoneno);
                    sessionStorage.setItem('ms_userAddress', response.data.data.maddress);
                    sessionStorage.setItem('ms_userBalance', response.data.data.mbalance);
                    sessionStorage.setItem('ms_userCreateTime', getLocalTime(response.data.data.mupdatetime));
                    sessionStorage.setItem('ms_userUpdateTime', getLocalTime(response.data.data.mupdatetime));

                    // 跳转商户首页页面
                    await this.$router.push('/merchant_dashboard');
                } else if (sessionStorage.getItem('ms_userIdentity') === 'Admin') {

                    // 缓存登录管理员用户数据
                    sessionStorage.setItem('ms_username', response.data.data.aname);
                    sessionStorage.setItem('ms_userId', response.data.data.aid);

                    // 跳转管理员首页页面
                    await this.$router.push('/admin_dashboard');
                }

            } else {
                this.$message.error(response.data.msg);
            }
        },

        /**
         * 更改登录模式
         */
        changeLoginMode(){
            if('商家登录' === this.loginMode){
                this.loginMode = '管理员登录';
                sessionStorage.setItem('ms_userIdentity','Admin');
            }else{
                this.loginMode = '商家登录';
                sessionStorage.setItem('ms_userIdentity','Merchant');
            }
        }
    },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(50, 50, 50, 0.4);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-identity {
    text-align: center;
    width: 50%;
    height: 36px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>
