import api from '../utils/api';
import http from '../utils/http';

/**
 * 用于登录请求
 * @param params
 * @param callback
 * @returns {Promise<void>}
 */
export async function loginRequest(params,callback) {
    let response;

    // 打印请求消息内容
    console.log(params);

    // 根据不同用户身份
    if (sessionStorage.getItem('ms_userIdentity') === 'Merchant') {
        // 商户登录请求
        response = await http.post(api.merchant_login, params);

        // 打印服务器返回全部内容
        console.log(response);

        callback(response);
    } else if (sessionStorage.getItem('ms_userIdentity') === 'Admin') {
        // 管理员登录请求
        response = await http.post(api.admin_login, params);

        // 打印服务器返回全部内容
        console.log(response);

        callback(response);
    }
}
