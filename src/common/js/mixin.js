import { getAllVisits } from "api/traceStatis";
import { formatTime } from "common/js/util";
import { mapGetters, mapMutations } from "vuex";
import { getAdmins } from "api/account";
import {roles} from 'common/js/config'
// import { baseDate } from "@/config";
import SummaryBottom from "components/SummaryBottom";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/legendScroll";
import "echarts/lib/component/dataZoom";
import "common/js/macarons";

export const statisInfoMixin = {
    data() {
        return {
            datas: [],
            series: [],
            legends: [],
            xAxis: [],
            loading: true,
            type: "pv",
            base: null,
            myChart: null,
            admins: [],
            getAdminOptions: true,
            selectedAdmin: null,
        };
    },
    computed: {
        isPv() {
            return this.type == 'pv'
        },
        params() {
            return {
                owner_id: this.selectedAdmin
            }
        },
        ...mapGetters(["id", "role", "baseDate"])
    },
    created() {
        // 初始化
        this.xAxis = this.setXAxis();
        this.selectedKey = this.$route.params.key;
        this.base = this.baseDate;
        this._getAdmins()
        // 分情况取数据
        this.role == 6 && (this.selectedAdmin = this.id)
        this._getAllVisits()
    },
    methods: {
        _getAdmins() {
            getAdmins({role: roles['推广员']}).then(res => {
                if (res.code == 1) {
                    this.admins = res.data;
                    this.getAdminOptions = false;
                }
            });
        },
        _getAllVisits() {
            getAllVisits(this.params).then(res => {
                if (res.code == 1) {
                    // 序列化数据
                    this.series = this.setSeries(this.groupByKey(res.data));
                    this.loadChart();
                } else {
                    this.$message.error("加载失败");
                }
                this.loading = false;
            })
        },
        groupByKey(data) {
            let ret = {};
            data.forEach(item => {
                if (ret[item.key] === undefined) {
                    ret[item.key] = { key: item.key, datas: [item] };
                } else {
                    ret[item.key].datas.push(item);
                }
            });
            // 返回的数组
            return Object.values(ret);
        },
        //排序
        sortByDate(data) {
            data.sort((a, b) => {
                return a.time - b.time;
            });
        },
        loadChart() {
            this.myChart || (this.myChart = echarts.init(this.$refs.echart, 'macarons'));
            // 加载图表
            this.myChart.setOption(this.setChartOptions(), true, true);
        },
        setChartOptions() {
            return {
                title: {
                    left: "left",
                    top: '20px',
                    text: this.isPv ? "PV每日的访问总量" : "UV每日访问人数(以独立客户端进行计算)"
                },
                tooltip: {
                    trigger: "item",
                    axisPointer: {
                        type: "cross",
                        label: {
                            show: true,
                            precision: 0
                        }
                    },
                    // formatter: (params, ticket, callback)=>{
                    //     console.log(params);
                    //     return 
                    // }
                },
                xAxis: {
                    type: "category",
                    name: "日期",
                    data: this.xAxis,
                    boundaryGap: false
                },
                grid: [
                    {
                        top: 100,
                        width: "80%",
                        // bottom: "45%",
                        left: 10,
                        containLabel: true
                    },

                ],
                legend: {
                    type: "scroll",
                    data: this.legends,
                    orient: "vertical",
                    right: 10,
                    top: 20,
                    bottom: 20,
                    icon: "stack",
                    width: 100,
                    selected: this.setLegendSelected()
                },
                yAxis: {
                    type: "value",
                    splitLine: { show: false },
                    minInterval: 1,
                    name: `访问${this.isPv ? '次' : '人'}数`,
                    axisLabel: {
                        formatter: `\{value\} ${this.isPv ? '次' : '人'}`
                    },
                    axisPointer: {
                        snap: true
                    }
                },
                dataZoom: [
                    {
                        type: "slider",
                        show: true,
                        // xAxisIndex: [0],
                        start: 0,
                        end: this.xAxis.length > 10 ? 50 : 100
                    },
                    {
                        type: "inside",
                        show: true,
                        // xAxisIndex: [0],
                        start: 0,
                        end: this.xAxis.length > 10 ? 50 : 100
                    }
                ],
                series: this.series
            };
        },
        // 默认显示的条目
        setLegendSelected() {
            let ret = {};
            // 不是跳转进来的，全选
            this.legends.forEach(item => {
                ret[item] = this.selectedKey ? item == this.selectedKey : true;
            });
            return ret;
        },

        setXAxis() {
            let oneDay = 24 * 3600 * 1000;
            let base = new Date(this.baseDate).getTime();
            let now = new Date().getTime();
            let delta = now - base;
            let days = Math.ceil(delta / oneDay);
            let xAxis = [];
            // xAxis.push(formatTime(base))
            for (let i = 0; i < days; i++) {
                xAxis.push(formatTime(new Date(base + oneDay * i).getTime()));
            }
            return xAxis;
        },

        _setBaseDate(date) {
            // 更改起始日期，重绘图表
            this.setBaseDate(formatTime(new Date(date).getTime()))
            this.xAxis = this.setXAxis();
            this.myChart.setOption(this.setChartOptions(), true);

        },
        ...mapMutations({
            setBaseDate: 'SET_BASEDATE'
        })

    },
    components: {
        SummaryBottom
    },
    watch: {
        selectedAdmin(newVal) {
            this._getAllVisits()
        }
    }
}
