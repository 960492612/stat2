<template>
  <!-- <div class="countryLogisticsFee">
    
    <div class="selectCountry">
      <el-tag type="primary">查看国家：</el-tag>
      <el-select v-model="selectedContry" placeholder="选择国家" filterable @change="loadChart" size="medium">
        <el-option v-for="(contry, index) in contrys" :key="index" :value="contry" :label="contry"></el-option>
      </el-select>
    </div>
    <div class="echart-wrapper" ref="echart"></div>
  </div> -->
  <div></div>
</template>
<script>
// import echarts from "echarts/lib/echarts";
// import "echarts/lib/chart/scatter";
// import "echarts/lib/chart/map";
// import "echarts/lib/component/visualMap";
// import "echarts/lib/component/tooltip";
// import "echarts/lib/component/title";
// import "echarts/lib/component/legend";
// import "echarts/lib/component/toolbox";
// import "echarts/lib/component/legendScroll";
// import "echarts/lib/component/dataZoom";
// import "common/js/macarons";
// import "echarts/extension/bmap/bmap";
// import "echarts/map/js/world"
// import { formatTime, toDecimal } from "common/js/util";

// export default {
//   props: {
//     data: {
//       type: Array,
//       default: () => {
//         return [];
//       }
//     }
//   },
//   data() {
//     return {
//       myChart: null,
//       legends: [],
//       xAxis: null,
//       legends: [],
//       series: [],
//       contrys: [],
//       selectedContry: null,
//       prev: 0
//     };
//   },
//   computed: {
//     dataInContry() {
//       if (!this.selectedContry) {
//         return [];
//       }
//       let ret = [];
//       this.data.forEach(item => {
//         if (item["国家"] == this.selectedContry) {
//           ret.push(item);
//         }
//       });
//       ret.sort((a, b) => {
//         return a["月份"] - b["月份"];
//       });
//       return ret;
//     }
//   },
//   mounted() {
//     // this.xAxis = this.setxAxis();
//     // this.legends = this.setLegends();
//     this.loadChart();
//     if (this.data && this.data.length > 0) {
//       let byContry = {};
//       this.data.forEach(item => {
//         if (byContry[item["国家"]] == undefined) {
//           byContry[item["国家"]] = 1;
//         }
//       });
//       this.contrys = Object.keys(byContry);
//       this.loadChart();
//     }
//   },
//   watch: {
//     data(val) {
//       if (val.length > 0) {
//         this.loadChart();
//       }
//     }
//   },
//   methods: {
//     // getCountrys(){
//     //   let byCountry = {}
//     //   if(byCountry[this.data['国家']])
//     // },
//     loadChart() {
//       this.prev = 0;
//       this.myChart ||
//         (this.myChart = echarts.init(this.$refs.echart, "macarons"));
//       // 加载图表
//       // this.series = this.setSeries();
//       let option = {
//         title: {
//           text: "各国销量",
//           subtext:
//             "from United Nations, Total population, both sexes combined, as of 1 July (thousands)",
//           sublink: "http://esa.un.org/wpp/Excel-Data/population.htm",
//           left: "center",
//           top: "top"
//         },
//         tooltip: {
//           trigger: "item",
//           formatter: function(params) {
//             var value = (params.value + "").split(".");
//             value =
//               value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") +
//               "." +
//               value[1];
//             return params.seriesName + "<br/>" + params.name + " : " + value;
//           }
//         },
//         toolbox: {
//           show: true,
//           orient: "vertical",
//           left: "right",
//           top: "center",
//           feature: {
//             mark: { show: true },
//             dataView: { show: true, readOnly: false },
//             restore: { show: true },
//             saveAsImage: { show: true }
//           }
//         },
//         visualMap: {
//           type: "continuous",
//           min: 0,
//           max: 1000000,
//           text: ["High", "Low"],
//           realtime: false,
//           calculable: true,
//           color: ["orangered", "yellow", "lightskyblue"]
//         },
//         series: [
//           {
//             name: "World Population (2010)",
//             type: "map",
//             mapType: "world",
//             roam: true,
//             itemStyle: {
//               emphasis: { label: { show: true } }
//             },
//             nameMap:{
//               'China': '中国'
//             },
//             data: [
//               { name: "Afghanistan", value: 28397.812 },
//               { name: "Angola", value: 19549.124 },
//               { name: "Albania", value: 3150.143 },
//               { name: "United Arab Emirates", value: 8441.537 },
//               { name: "Argentina", value: 40374.224 },
//               { name: "Armenia", value: 2963.496 },
//               { name: "French Southern and Antarctic Lands", value: 268.065 },
//               { name: "Australia", value: 22404.488 },
//               { name: "Austria", value: 8401.924 },
//               { name: "Azerbaijan", value: 9094.718 },
//               { name: "Burundi", value: 9232.753 },
//               { name: "Belgium", value: 10941.288 },
//               { name: "Benin", value: 9509.798 },
//               { name: "Burkina Faso", value: 15540.284 },
//               { name: "Bangladesh", value: 151125.475 },
//               { name: "Bulgaria", value: 7389.175 },
//               { name: "The Bahamas", value: 66402.316 },
//               { name: "Bosnia and Herzegovina", value: 3845.929 },
//               { name: "Belarus", value: 9491.07 },
//               { name: "Belize", value: 308.595 },
//               { name: "Bermuda", value: 64.951 },
//               { name: "Bolivia", value: 716.939 },
//               { name: "Brazil", value: 195210.154 },
//               { name: "Brunei", value: 27.223 },
//               { name: "Bhutan", value: 716.939 },
//               { name: "Botswana", value: 1969.341 },
//               { name: "Central African Republic", value: 4349.921 },
//               { name: "Canada", value: 34126.24 },
//               { name: "Switzerland", value: 7830.534 },
//               { name: "Chile", value: 17150.76 },
//               { name: "中国", value: 1359821.465 },
//               { name: "Ivory Coast", value: 60508.978 },
//               { name: "Cameroon", value: 20624.343 },
//               { name: "Democratic Republic of the Congo", value: 62191.161 },
//               { name: "Republic of the Congo", value: 3573.024 },
//               { name: "Colombia", value: 46444.798 },
//               { name: "Costa Rica", value: 4669.685 },
//               { name: "Cuba", value: 11281.768 },
//               { name: "Northern Cyprus", value: 1.468 },
//               { name: "Cyprus", value: 1103.685 },
//               { name: "Czech Republic", value: 10553.701 },
//               { name: "Germany", value: 83017.404 },
//               { name: "Djibouti", value: 834.036 },
//               { name: "Denmark", value: 5550.959 },
//               { name: "Dominican Republic", value: 10016.797 },
//               { name: "Algeria", value: 37062.82 },
//               { name: "Ecuador", value: 15001.072 },
//               { name: "Egypt", value: 78075.705 },
//               { name: "Eritrea", value: 5741.159 },
//               { name: "Spain", value: 46182.038 },
//               { name: "Estonia", value: 1298.533 },
//               { name: "Ethiopia", value: 87095.281 },
//               { name: "Finland", value: 5367.693 },
//               { name: "Fiji", value: 860.559 },
//               { name: "Falkland Islands", value: 49.581 },
//               { name: "France", value: 63230.866 },
//               { name: "Gabon", value: 1556.222 },
//               { name: "United Kingdom", value: 62066.35 },
//               { name: "Georgia", value: 4388.674 },
//               { name: "Ghana", value: 24262.901 },
//               { name: "Guinea", value: 10876.033 },
//               { name: "Gambia", value: 1680.64 },
//               { name: "Guinea Bissau", value: 10876.033 },
//               { name: "Equatorial Guinea", value: 696.167 },
//               { name: "Greece", value: 11109.999 },
//               { name: "Greenland", value: 56.546 },
//               { name: "Guatemala", value: 14341.576 },
//               { name: "French Guiana", value: 231.169 },
//               { name: "Guyana", value: 786.126 },
//               { name: "Honduras", value: 7621.204 },
//               { name: "Croatia", value: 4338.027 },
//               { name: "Haiti", value: 9896.4 },
//               { name: "Hungary", value: 10014.633 },
//               { name: "Indonesia", value: 240676.485 },
//               { name: "India", value: 1205624.648 },
//               { name: "Ireland", value: 4467.561 },
//               { name: "Iran", value: 240676.485 },
//               { name: "Iraq", value: 30962.38 },
//               { name: "Iceland", value: 318.042 },
//               { name: "Israel", value: 7420.368 },
//               { name: "Italy", value: 60508.978 },
//               { name: "Jamaica", value: 2741.485 },
//               { name: "Jordan", value: 6454.554 },
//               { name: "Japan", value: 127352.833 },
//               { name: "Kazakhstan", value: 15921.127 },
//               { name: "Kenya", value: 40909.194 },
//               { name: "Kyrgyzstan", value: 5334.223 },
//               { name: "Cambodia", value: 14364.931 },
//               { name: "South Korea", value: 51452.352 },
//               { name: "Kosovo", value: 97.743 },
//               { name: "Kuwait", value: 2991.58 },
//               { name: "Laos", value: 6395.713 },
//               { name: "Lebanon", value: 4341.092 },
//               { name: "Liberia", value: 3957.99 },
//               { name: "Libya", value: 6040.612 },
//               { name: "Sri Lanka", value: 20758.779 },
//               { name: "Lesotho", value: 2008.921 },
//               { name: "Lithuania", value: 3068.457 },
//               { name: "Luxembourg", value: 507.885 },
//               { name: "Latvia", value: 2090.519 },
//               { name: "Morocco", value: 31642.36 },
//               { name: "Moldova", value: 103.619 },
//               { name: "Madagascar", value: 21079.532 },
//               { name: "Mexico", value: 117886.404 },
//               { name: "Macedonia", value: 507.885 },
//               { name: "Mali", value: 13985.961 },
//               { name: "Myanmar", value: 51931.231 },
//               { name: "Montenegro", value: 620.078 },
//               { name: "Mongolia", value: 2712.738 },
//               { name: "Mozambique", value: 23967.265 },
//               { name: "Mauritania", value: 3609.42 },
//               { name: "Malawi", value: 15013.694 },
//               { name: "Malaysia", value: 28275.835 },
//               { name: "Namibia", value: 2178.967 },
//               { name: "New Caledonia", value: 246.379 },
//               { name: "Niger", value: 15893.746 },
//               { name: "Nigeria", value: 159707.78 },
//               { name: "Nicaragua", value: 5822.209 },
//               { name: "Netherlands", value: 16615.243 },
//               { name: "Norway", value: 4891.251 },
//               { name: "Nepal", value: 26846.016 },
//               { name: "New Zealand", value: 4368.136 },
//               { name: "Oman", value: 2802.768 },
//               { name: "Pakistan", value: 173149.306 },
//               { name: "Panama", value: 3678.128 },
//               { name: "Peru", value: 29262.83 },
//               { name: "Philippines", value: 93444.322 },
//               { name: "Papua New Guinea", value: 6858.945 },
//               { name: "Poland", value: 38198.754 },
//               { name: "Puerto Rico", value: 3709.671 },
//               { name: "North Korea", value: 1.468 },
//               { name: "Portugal", value: 10589.792 },
//               { name: "Paraguay", value: 6459.721 },
//               { name: "Qatar", value: 1749.713 },
//               { name: "Romania", value: 21861.476 },
//               { name: "Russia", value: 21861.476 },
//               { name: "Rwanda", value: 10836.732 },
//               { name: "Western Sahara", value: 514.648 },
//               { name: "Saudi Arabia", value: 27258.387 },
//               { name: "Sudan", value: 35652.002 },
//               { name: "South Sudan", value: 9940.929 },
//               { name: "Senegal", value: 12950.564 },
//               { name: "Solomon Islands", value: 526.447 },
//               { name: "Sierra Leone", value: 5751.976 },
//               { name: "El Salvador", value: 6218.195 },
//               { name: "Somaliland", value: 9636.173 },
//               { name: "Somalia", value: 9636.173 },
//               { name: "Republic of Serbia", value: 3573.024 },
//               { name: "Suriname", value: 524.96 },
//               { name: "Slovakia", value: 5433.437 },
//               { name: "Slovenia", value: 2054.232 },
//               { name: "Sweden", value: 9382.297 },
//               { name: "Swaziland", value: 1193.148 },
//               { name: "Syria", value: 7830.534 },
//               { name: "Chad", value: 11720.781 },
//               { name: "Togo", value: 6306.014 },
//               { name: "Thailand", value: 66402.316 },
//               { name: "Tajikistan", value: 7627.326 },
//               { name: "Turkmenistan", value: 5041.995 },
//               { name: "East Timor", value: 10016.797 },
//               { name: "Trinidad and Tobago", value: 1328.095 },
//               { name: "Tunisia", value: 10631.83 },
//               { name: "Turkey", value: 72137.546 },
//               { name: "United Republic of Tanzania", value: 44973.33 },
//               { name: "Uganda", value: 33987.213 },
//               { name: "Ukraine", value: 46050.22 },
//               { name: "Uruguay", value: 3371.982 },
//               { name: "United States of America", value: 312247.116 },
//               { name: "Uzbekistan", value: 27769.27 },
//               { name: "Venezuela", value: 236.299 },
//               { name: "Vietnam", value: 89047.397 },
//               { name: "Vanuatu", value: 236.299 },
//               { name: "West Bank", value: 13.565 },
//               { name: "Yemen", value: 22763.008 },
//               { name: "South Africa", value: 51452.352 },
//               { name: "Zambia", value: 13216.985 },
//               { name: "Zimbabwe", value: 13076.978 }
//             ]
//           }
//         ]
//       };
//       this.myChart.setOption(option, true, true);
//     },
//     convertData(data) {
//       var res = [];
//       for (var i = 0; i < data.length; i++) {
//         var geoCoord = geoCoordMap[data[i].name];
//         if (geoCoord) {
//           res.push({
//             name: data[i].name,
//             value: geoCoord.concat(data[i].value)
//           });
//         }
//       }
//       return res;
//     },
//     setSeries() {
//       let serie = {};
//       let Series = [];
//       this.xAxis = this.dataInContry.map(item => {
//         // console.log(item["月份"]);
//         return `${(item["月份"] + "").substr(0, 4)}年${(
//           item["月份"] + ""
//         ).substr(4, 2)}月`;
//       });

//       serie = {
//         type: "bar",
//         label: {
//           normal: {
//             show: true,
//             formatter: params => {
//               let append = "";
//               if (this.prev != 0) {
//                 let delta = params.value - this.prev;
//                 if (delta > 0) {
//                   append = `  变化:增长${(delta * 100).toFixed(2)}%`;
//                 } else {
//                   append = `  变化:减少${(delta * 100).toFixed(2)}%`;
//                 }
//               }
//               this.prev = params.value;
//               // console.log(params);
//               return (params.value * 100).toFixed(2) + "%" + append;
//             },
//             position: "top"
//           }
//         },
//         // symbolSize: 10,
//         legendHoverLink: true,
//         smooth: true,
//         // name: this,
//         // stack: 'tiled',
//         barMaxWidth: 50,
//         data: this.dataInContry.map(item => {
//           return Number((item["物流费"] / item["营业额"]).toFixed(4));
//         })
//       };
//       Series.push(serie);

//       return Series;
//     },
//     setChartOptions() {
//       return {
//         title: {
//           left: "center",
//           top: "20px",
//           text:
//             (this.selectedContry ? this.selectedContry : "某国") +
//             "物流费占比其营业额的变化折线图"
//         },
//         tooltip: {
//           trigger: "axis",
//           axisPointer: {
//             type: "cross",
//             label: {
//               show: true,
//               precision: 0
//             }
//           },
//           formatter: params => {
//             let html = `<p>${params[0].name}</p>`;
//             params.forEach(item => {
//               html += `<p style="line-height:24px;"><span style="display: inline-block;width:12px;height:12px;border-radius:50%;background: ${
//                 item.color
//               }"></span>
//               ${(item.value * 100).toFixed(2)}%</p>`;
//               // console.log(this.prev);
//             });

//             // console.log(params);
//             return html;
//           }
//         },
//         xAxis: {
//           type: "category",
//           name: "日期",
//           data: this.xAxis
//           // boundaryGap: false
//         },
//         grid: [
//           {
//             top: 100,
//             width: "80%",
//             // bottom: "45%",
//             left: "center",
//             containLabel: true
//           }
//         ],
//         // legend: {
//         //   type: "scroll",
//         //   data: this.legends,
//         //   orient: "vertical",
//         //   right: 10,
//         //   top: 20,
//         //   bottom: 20,
//         //   icon: "stack",
//         //   width: 100
//         //   //   selected: this.setLegendSelected()
//         // },
//         yAxis: {
//           type: "value",
//           splitLine: { show: false },
//           // minInterval: 0.01,
//           // maxInterval: 0.01,
//           name: "物流费占比其营业额",
//           axisLabel: {
//             formatter: (value, index) => {
//               return (value * 100).toFixed(0) + "%";
//             }
//           },
//           axisPointer: {
//             snap: true,
//             label: {
//               precision: 2,
//               formatter: params => {
//                 return (params.value * 100).toFixed(2) + "%";
//               }
//             }
//           }
//         },
//         dataZoom: [
//           // {
//           //   type: "slider",
//           //   show: true,
//           //   // xAxisIndex: [0],
//           //   start: 0
//           //   // end: this.xAxis.length > 10 ? 50 : 100
//           // },
//           {
//             type: "inside",
//             show: true,
//             // xAxisIndex: [0],
//             start: 0
//             // end: this.xAxis.length > 10 ? 50 : 100
//           }
//         ],
//         series: this.series
//       };
//     }
//   }
// };
// </script>
// <style lang="scss" scoped>
// .echart-wrapper {
//   height: 750px;
// }
// .countryLogisticsFee {
//   .selectCountry {
//     margin-top: 20px;
//     text-align: center;
//   }
// }
// </style>
