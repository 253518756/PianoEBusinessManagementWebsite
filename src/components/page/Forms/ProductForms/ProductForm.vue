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
                    <el-form-item label="商品ID">
                        <div>{{id}}</div>
                    </el-form-item>

                    <el-form-item label="商品名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <el-form-item label="商品分类">
                        <el-cascader :options="options" v-model="form.options"></el-cascader>
                    </el-form-item>

                    <el-form-item  label="商品价格">
                        <el-input v-model="form.price"  :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input v-model="form.comment"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

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
                balance: this.$route.query.money,
                phoneNo: this.$route.query.phoneNo,
            }
        };
    },
    methods: {
        onSubmit() {
            this.$message.success('提交成功！');
        }
    }
};
</script>
