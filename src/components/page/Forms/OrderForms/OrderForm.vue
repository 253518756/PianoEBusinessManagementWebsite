<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="账单ID">
                        <div>{{id}}</div>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select v-model="form.state" placeholder="请选择" >
                            <el-option key="1" label="待发单" value="Ordered"></el-option>
                            <el-option key="2" label="已发单" value="Delivered"></el-option>
                            <el-option key="3" label="已完成" value="Finished"></el-option>
                            <el-option key="4" label="已取消" value="Canceled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单金额">
                        <div>{{money}}</div>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <div>{{quantity}}</div>
                    </el-form-item>
                    <el-form-item label="账单时间">
                        <div>{{time}}</div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateOnClick">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import { updateRequest } from '../../../../requests/OrderRequests';

export default {
    name: 'baseform',
    data() {
        return {
            id: this.$route.query.id,
            form: {
                state: this.$route.query.state,
            },
            money: this.$route.query.money,
            quantity: this.$route.query.quantity,
            time: this.$route.query.time,

            pId: this.$route.query.pId,
            uId: this.$route.query.uId,
        };
    },
    methods: {
        updateOnClick: async function (){
            let params = {
                oId: this.id,
                oState: this.form.state,
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
