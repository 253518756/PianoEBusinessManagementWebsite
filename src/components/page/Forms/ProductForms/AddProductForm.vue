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
                    <el-form-item label="商品名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="商品分类">
                        <el-cascader :options="options" v-model="form.type"></el-cascader>
                    </el-form-item>

                    <el-form-item  label="商品价格">
                        <el-input v-model="form.price"></el-input>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input v-model="form.comment"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addProductRequest">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import api from '../../../../utils/api';
import http from '../../../../utils/http';

export default {
    name: 'userform',
    data() {
        return {
            form: {
                // name: this.$route.query.name,
                // type: this.$route.query.type,
                // price: this.$route.query.money,
                // comment: this.$route.query.comment,
                name: '',
                type: '',
                price: '',
                comment: '',
            },
            options: [
                {
                    value: 'Instrument',
                    label: '乐器',
                    children: [
                        {
                            value: 'KeyBoard',
                            label: '键盘乐器',
                        },
                        {
                            value: 'StringInstrument',
                            label: '弦乐器',
                        },
                        {
                            value: 'WindInstrument',
                            label: '管乐器',
                        },
                        {
                            value: 'percussionInstrument',
                            label: '打击乐器',
                        }
                    ]
                },
            ],
        };
    },
    methods: {
        addProductRequest: async function (){
            console.log(this.form.type[1])
            let params = {
                name: this.form.name,
                price: this.form.price,
                type: this.form.type[1],
                comment: this.form.comment,
                merchantId: '1'
            }
            console.log(params)
            var response = await http.post(api.product_insert, params);
            if (response.data.status === 0) {
                this.$message.success(response.data.msg);
            }else{
                this.$message.error(response.data.msg);
                console.log(response)
            }
        },

    }
};
</script>
