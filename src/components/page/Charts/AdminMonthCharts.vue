<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> schart图表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="schart-box">
                <div class="content-title">管理员月度订单数量统计</div>
                <schart class="schart" canvasId="bar1" :options="option1"></schart>
            </div>


        </div>
        <div class="container">
            <div class="schart-box">
                <div class="content-title">管理员月度订单数量统计</div>
                <schart class="schart" canvasId="bar2" :options="option2"></schart>
            </div>


        </div>


    </div>
</template>

<script>
import Schart from 'vue-schart';
import { monthRequest } from '../../../requests/StatisticRequests';
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            option1: {
                type: 'bar',
                title: {
                    text: '管理员月度订单数量统计'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '订单数量',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: []
                    },
                ]
            },


            option2: {
                type: 'bar',
                title: {
                    text: '管理员月度订单数量统计'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '订单金额（K）',
                        data: []
                    },
                ]
            },

        };
    },


    mounted(){
        this.Init()
    },
    methods: {
        // 删除操作
        Init() {
            let params = {};
            monthRequest(params, this.monthRequestCallback)
        },

        monthRequestCallback: async function (response){
            if (response.data.status === 0) {
                const length = response.data.dataList.length;
                for (let i = 0; i < length; i++) {
                    this.option1.labels.push(response.data.dataList[i].time);
                    this.option1.datasets[0].data.push(response.data.dataList[i].orderQuantity);
                    this.option2.labels.push(response.data.dataList[i].time);
                    this.option2.datasets[0].data.push(response.data.dataList[i].totalMoney);
                }

            }else{
                this.$message.error(response.data.msg);
            }
        },
    }

};
</script>

<style scoped>
.schart-box {
    display: inline-block;
    margin: 20px;
}
.schart {
    width: 1500px;
    height: 600px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
</style>
