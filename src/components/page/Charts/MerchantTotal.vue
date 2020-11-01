<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-pie-chart"></i> 订单信息统计
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container handle-box">

            <div class="content-title">订单统计[时间筛选]</div>

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
                <el-button type="primary" icon="el-icon-search" @click="setTimeOnClick(query.minTime1, query.maxTime1)" class="handle-del mr10">订单时间筛选</el-button>
            </div>


            <div class="form-box">
                <el-form ref="form" :model="form" label-width="140px">
                    <el-form-item label="该时间段内订单数量">
                        <div class="content-title">{{form.timeOrderTotalQuantity}}</div>
                    </el-form-item>
                    <el-form-item label="该时间段内订单金额">
                        <div class="content-title">{{form.timeOrderTotalPrice}}</div>
                    </el-form-item>
                </el-form>
            </div>

        </div>



        <div class="container">

            <div class="content-title">订单统计[商品类别筛选]</div>
            <div class="handle-box">
                <el-select v-model="type" placeholder="商品类别" class="handle-select mr10" @change="setTypeOnClick(type)">
                    <el-option key="1" label="键盘乐器" value="KeyBoard"></el-option>
                    <el-option key="2" label="弦乐器" value="StringInstrument"></el-option>
                    <el-option key="3" label="管乐器" value="WindInstrument"></el-option>
                    <el-option key="4" label="打击乐器" value="percussionInstrument"></el-option>
                </el-select>
            </div>

            <div class="form-box">
                <el-form ref="form" :model="form" label-width="110px">
                    <el-form-item label="该类别订单数量">
                        <div class="content-title">{{form.typeOrderTotalQuantity}}</div>
                    </el-form-item>
                    <el-form-item label="该类别订单金额">
                        <div class="content-title">{{form.typeOrderTotalPrice}}</div>
                    </el-form-item>
                </el-form>
            </div>
        </div>





        </div>
</template>

<script>
import Schart from 'vue-schart';
import { totalRequest } from '../../../requests/StatisticRequests';
export default {
    name: 'basecharts',
    components: {
        Schart
    },
    data() {
        return {
            type:'',
            query: {
                minTime: '',
                maxTime: '',
            },

            form: {
                timeOrderTotalQuantity: '未知',
                timeOrderTotalPrice: '未知',
                typeOrderTotalQuantity: '未知',
                typeOrderTotalPrice: '未知',
            }

        };
    },

    methods: {
        setTypeOnClick(type){
            let params = {
                pType: type,
                mId: sessionStorage.getItem('ms_userId'),
            };
            totalRequest(params,this.setTypeRequestCallback)

        },

        setTypeRequestCallback(response){
            if(response.data.data.orderQuantity === null)  this.form.typeOrderTotalQuantity = 0;
            else this.form.typeOrderTotalQuantity = response.data.data.orderQuantity;

            if(response.data.data.totalMoney === null) this.form.typeOrderTotalPrice = 0;
            else this.form.typeOrderTotalPrice = response.data.data.totalMoney;
        },

        setTimeOnClick(minTime, maxTime){
            let params;
            if(minTime === undefined || minTime === null || minTime === '' || maxTime === undefined || maxTime === null || maxTime === ''){
                params = {
                    mId: sessionStorage.getItem('ms_userId'),
                };
            }else {
                params = {
                    minTime: minTime,
                    maxTime: maxTime,
                    mId: this.mId,
                };
            }
            totalRequest(params,this.setTimeRequestCallback)
        },

        setTimeRequestCallback(response){
            if(response.data.data.orderQuantity === null)  this.form.timeOrderTotalQuantity = 0;
            else this.form.timeOrderTotalQuantity = response.data.data.orderQuantity;

            if(response.data.data.totalMoney === null) this.form.timeOrderTotalPrice = 0;
            else this.form.timeOrderTotalPrice = response.data.data.totalMoney;
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
    width: 600px;
    height: 400px;
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
    margin-bottom: 20px;
}
</style>
