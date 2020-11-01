<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> 前十名数据统计
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container handle-box">
            <div class="handle-box">
                <div>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="起始时间"
                                v-model="query.minTime1"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="终止时间"
                                v-model="query.maxTime1"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="setTimeOnClick(query.minTime1, query.maxTime1, 1)" class="handle-del mr10">订单时间筛选</el-button>
            </div>

            <div class="schart-box">
                <div class="content-title">前十名热销的商品</div>
                <schart class="schart" ref="chart" canvasId="bar1" :options="options1"></schart>
            </div>
        </div>


        <div class="container handle-box">
            <div class="handle-box">
                <div>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="起始时间"
                                v-model="query.minTime2"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="终止时间"
                                v-model="query.maxTime2"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="setTimeOnClick(query.minTime2, query.maxTime2, 2)" class="handle-del mr10">订单时间筛选</el-button>
            </div>

            <div class="schart-box">
                <div class="content-title">销量排名前十名的商家</div>
                <schart class="schart" canvasId="bar2" :options="options2"></schart>
            </div>
        </div>


        <div class="container handle-box">
            <div class="handle-box">
                <div>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="起始时间"
                                v-model="query.minTime3"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker
                                type="date"
                                placeholder="终止时间"
                                v-model="query.maxTime3"
                                value-format="yyyy-MM-dd"
                                style="width: 80%;"
                        ></el-date-picker>
                    </el-col>
                </div>
                <el-button type="primary" icon="el-icon-search" @click="setTimeOnClick(query.minTime3, query.maxTime3, 3)" class="handle-del mr10">订单时间筛选</el-button>
            </div>

            <div class="schart-box">
                <div class="content-title">下单金额前十名的用户</div>
                <schart class="schart" canvasId="bar3" :options="options3"></schart>
            </div>
        </div>




        </div>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import { toptenRequest, totalRequest } from '../../../requests/StatisticRequests';
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            query: {
                minTime1: '2000-10-02',
                maxTime1: '2030-10-02',
                minTime2: '2000-10-02',
                maxTime2: '2030-10-02',
                minTime3: '2000-10-02',
                maxTime3: '2030-10-02',
            },

            options1: {
                type: 'bar',
                title: {
                    text: '前十名热销的商品'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '销售额',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: []
                    },
                ]
            },
            options2: {
                type: 'bar',
                title: {
                    text: '销量排名前十名的商家'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '销售额',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: []
                    },
                ]
            },
            options3: {
                type: 'bar',
                title: {
                    text: '下单金额前十名的用户'
                },
                bgColor: '#fbfbfb',
                labels: [],
                datasets: [
                    {
                        label: '购买额',
                        fillColor: 'rgba(241, 49, 74, 0.5)',
                        data: []
                    },
                ]
            },

        };
    },
    created() {
        this.setTimeOnClick("2000-10-02", "2030-10-02", 1);
        this.setTimeOnClick("2000-10-02", "2030-10-02", 2);
        this.setTimeOnClick("2000-10-02", "2030-10-02", 3);

    },
    methods:{
        setTimeOnClick(minTime, maxTime, targetType){
            let params;
            if(minTime === undefined || minTime === null || minTime === '' || maxTime === undefined || maxTime === null || maxTime === ''){
                this.$message.error('请添加筛选条件！');
                return;
            }else{
                params = {
                    minTime: minTime,
                    maxTime: maxTime,
                    targetType: targetType,
                };
            }
            toptenRequest(params,this.setTimeRequestCallback)
        },

        setTimeRequestCallback(response, targetType){
            switch (targetType) {
                case 1:{

                    let option = {
                        type: 'bar',
                        title: {
                            text: '前十名热销的商品'
                        },
                        bgColor: '#fbfbfb',
                        labels: [],
                        datasets: [
                            {
                                label: '购买额',
                                fillColor: 'rgba(241, 49, 74, 0.5)',
                                data: []
                            },
                        ]
                    };

                    const length = response.data.dataList.length;
                    for (let i = 0; i < length; i++) {
                        option.labels.push(response.data.dataList[i].name);
                        option.datasets[0].data.push(response.data.dataList[i].sumCost);
                    }

                    this.options1 = option;
                    break;
                }
                case 2:{

                    let option = {
                        type: 'bar',
                            title: {
                            text: '销量排名前十名的商家'
                        },
                        bgColor: '#fbfbfb',
                            labels: [],
                            datasets: [
                            {
                                label: '销售额',
                                fillColor: 'rgba(241, 49, 74, 0.5)',
                                data: []
                            },
                        ]
                    };
                    const length = response.data.dataList.length;
                    for (let i = 0; i < length; i++) {
                        option.labels.push(response.data.dataList[i].name);
                        option.datasets[0].data.push(response.data.dataList[i].sumCost);
                    }

                    this.options2 = option;
                    break;
                }
                case 3:{

                    let option = {
                        type: 'bar',
                            title: {
                            text: '下单金额前十名的用户'
                        },
                        bgColor: '#fbfbfb',
                            labels: [],
                            datasets: [
                            {
                                label: '购买额',
                                fillColor: 'rgba(241, 49, 74, 0.5)',
                                data: []
                            },
                        ]
                    };
                    const length = response.data.dataList.length;
                    for (let i = 0; i < length; i++) {
                        option.labels.push(response.data.dataList[i].name);
                        option.datasets[0].data.push(response.data.dataList[i].sumCost);
                    }

                    this.options3 = option;
                    break;
                }
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
    width: 1200px;
    height: 800px;
}
.content-title {
    clear: both;
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.handle-box {

}
</style>
