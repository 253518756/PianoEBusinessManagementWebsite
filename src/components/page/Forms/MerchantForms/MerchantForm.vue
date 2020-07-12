<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>商家表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="商家ID">
                        <div>{{id}}</div>
                    </el-form-item>
                    <el-form-item label="商家账户">
                        <div>{{account}}</div>
                    </el-form-item >
                    <el-form-item label="密码">
                        <el-button type="primary" icon="el-icon-search"  @click="">重置密码</el-button>
                    </el-form-item>

                    <el-form-item label="商家姓名">
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
                    <el-form-item label="商家余额">
                        <el-input v-model="form.balance"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="form.phoneNo"></el-input>
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
