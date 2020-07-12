import api from '../utils/api';
import http from '../utils/http';

/**
 * 用于登录请求
 * @param params
 * @returns {Promise<void>}
 */
export async function loginRequest(params) {
    let response;

    // 打印请求消息内容
    console.log(params);

    // 根据不同用户身份
    if (sessionStorage.getItem('ms_userIdentity') === 'Merchant') {
        // 商户登录请求
        response = await http.post(api.merchant_login, params);

        // 打印服务器返回消息内容
        console.log(response);

        // 验证
        if (response.data.status === 0) {
            this.$message.success('登录成功');
            sessionStorage.setItem('ms_username', response.data.data.name);
            sessionStorage.setItem('ms_username', response.data.data.name)
            await this.$router.push('/merchant_dashboard');
        } else {
            this.$message.error('请输入正确的账号和密码');
            console.log('error submit!!');
        }
    } else if (sessionStorage.getItem('ms_userIdentity') === 'Admin') {
        response = await http.post(api.admin_login, params);
        console.log(response);
        // 验证
        if (response.data.status === 0) {
            this.$message.success('登录成功');
            sessionStorage.setItem('ms_username', response.data.data.name);
            await this.$router.push('/admin_dashboard');
        } else {
            this.$message.error('请输入正确的账号和密码');
            console.log('error submit!!');
        }
    }
}
