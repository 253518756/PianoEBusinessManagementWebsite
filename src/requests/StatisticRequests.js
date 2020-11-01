import api from '../utils/api';
import http from '../utils/http';

/**
 * 用于商户搜索请求
 * @param params
 * @param callback
 * @returns {Promise<void>}
 */
export async function totalRequest(params,callback) {
    // 打印请求消息内容
    console.log(params);

    // 商户登录请求
    let response = await http.post(api.statistic_total, params);

    // 打印服务器返回全部内容
    console.log(response);

    callback(response);
}


export async function toptenRequest(params,callback) {
    // 打印请求消息内容
    console.log(params);

    // 商户登录请求
    let response = await http.post(api.statistic_topten, params);

    // 打印服务器返回全部内容
    console.log(response);

    callback(response,params.targetType);
}


export async function monthRequest(params,callback) {
    // 打印请求消息内容
    console.log(params);

    // 商户登录请求
    let response = await http.post(api.statistic_month, params);

    // 打印服务器返回全部内容
    console.log(response);

    callback(response);
}

