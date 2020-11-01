import api from '../utils/api';
import http from '../utils/http';

/**
 * 用于商户搜索请求
 * @param params
 * @param callback
 * @returns {Promise<void>}
 */
export async function searchRequest(params,callback) {
    // 打印请求消息内容
    console.log(params);

    // 商户登录请求
    let response = await http.post(api.order_search, params);

    // 打印服务器返回全部内容
    console.log(response);

    callback(response);
}


// export async function insertRequest(params,callback) {
//     // 打印请求消息内容
//     console.log(params);
//
//     // 商户登录请求
//     let response = await http.post(api.user_insert, params);
//
//     // 打印服务器返回全部内容
//     console.log(response);
//
//     callback(response);
// }


export async function updateRequest(params,callback) {
    // 打印请求消息内容
    console.log(params);

    // 商户登录请求
    let response = await http.post(api.order_update, params);

    // 打印服务器返回全部内容
    console.log(response);

    callback(response);
}

// export async function deleteRequest(params,callback,index) {
//     // 打印请求消息内容
//     console.log(params);
//
//     // 商户登录请求
//     let response = await http.post(api.user_delete, params);
//
//     // 打印服务器返回全部内容
//     console.log(response);
//
//     callback(index,response);
// }
