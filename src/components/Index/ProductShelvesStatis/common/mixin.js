import { getInfoByWeek, getGroupList, getInfoByMonth } from "api/productShelves";
import { getPlatforms, findStores } from "api/store";
import { mapGetters } from "vuex";
import myTable from "../common/table";
import myChart from "../common/chart";
import { getProducts } from "api/product";
import { formatTime, formatWeek } from "common/js/util";
import { roles, transformTypes } from "common/js/config";
import JsonExcel from "vue-json-excel";
export const mixin = {
    data() {
        return {
            datas: null,
            datas1: null,
            activeName: "first",
            date: new Date(),
            beginTime: null,
            endTime: null,
            platforms: [],
            product: null,
            jmProducts: [],
            selectedPlatform: null,
            fields: [
                { name: "全平台", value: null },
                { name: "以平台分组", value: "platform_id" },
                { name: "以店铺分组", value: "store_id" }
            ],
            groupField: null,
            groupValue: null,
            selectedPlatform1: null,
            selectedStore: null,
            stores: [],
            transformType: 0,
            json_fields: {
              店铺: "store",
              价格: "price",
              推广费用: "fee",
              曝光量: "views", //曝光量
              页面访问量: "pv",
              访问客户数: "uv",
              收藏量: "collection",
              订单量: "orderNumber",
              '转化率(%)': "transform",
              销售数量: "saleNumber",
              累计销量: "totalSale",
              刷单量: "scalp", //刷单量
              主要国家: "contry",
              备注: "remark" //备注
            }
        };
    },
    created() {
        if (this.isShow1) {
            this.selectedPlatform = [];
        } else {
            this.selectedPlatform = [this.platform];
        }
        this._getPlatforms();
        this._getProduct();
      
        if (!this.isShow1) {
            this.fields.splice(0, 1);
            this.fields[0].name = "本平台";
            this.groupField = "platform_id";
            this.groupValue = this.selectedPlatform1 = this.platform;
            this._getStores(this.platform);
        }
    },
    computed: {
        isShow1() {
            return this.role != roles["平台管理员"] 
        },
        transformTypeText() {
            return transformTypes[this.transformType];
        },
        
        ...mapGetters(["platform", "role"])
    },
    components: {
        myTable,
        myChart,
        JsonExcel
      },
    methods: {
        selectSingle() {
          if (!this.date) {
            this.$message.info("请选择时间");
            return;
          }
          if (!this.product) {
            this.$message.info("请选择产品");
            return;
          }
          
          let api = this.type == 0 ? getInfoByWeek : getInfoByMonth
          api(this.params).then(res => {
            if (res.code == 1 && res.data.length>0) {
              this.datas = this._transformFormatInTable(res.data);
            }else{
              this.datas = []
            }
          });
        },
        _getPlatforms() {
          getPlatforms().then(res => {
            if (res.code == 1) {
              this.platforms = res.data;
              if (this.isShow1) {
                this.selectedPlatform = this.platforms.map(item => {
                  return item.id;
                });
              }
            }
          });
        },
        _getStores(platform) {
          findStores({ platform }).then(res => {
            if (res.code == 1) {
              this.stores = res.data;
            }
          });
        },
        changeGroupField() {
          if (this.isShow1) {
            this.selectedPlatform1 = null;
          }
          this.selectedStore = null;
        },
        changePlatform1(val) {
          this._getStores(val);
        },
        _getProduct() {
          getProducts().then(res => {
            if (res.code == 1) {
              if (res.data.length == 0) {
                return;
              }
              this.jmProducts = res.data;
            }
          });
        },
        selectMutiple() {
          if (!this.product) {
            this.$message.info("请选择产品");
            return;
          }
          this.datas1 = []
          getGroupList(this.params1).then(res => {
            if (res.code == 1) {
              this.datas1 = this._transformFormatInChart(res.data);
              // console.log(res.data);
            }
          });
        },
        _transformFormatInChart(data) {
          let ret = [];
          if (!this.groupField) {
            this.transformType = 0; //无转化率计算
            ret = data.map(item => {
              item.transform = 0;
              return item;
            });
            return ret;
          }
          if (data.every(item => !!item.transformByUv)) {
            this.transformType = 1; //uv计算的
            ret = data.map(item => {
              item.transform = Number(item.transformByUv) * 100;
              return item;
            });
            return ret;
          }
          if (data.every(item => !!item.transformByPv)) {
            this.transformType = 2; //pv计算的
            ret = data.map(item => {
              item.transform = Number(item.transformByPv) * 100;
              return item;
            });
            return ret;
          }
          if (data.every(item => !!item.transformByViews)) {
            this.transformType = 3; //曝光量计算的
            ret = data.map(item => {
              item.transform = Number(item.transformByViews) * 100;
              return item;
            });
            return ret;
          }
          this.transformType = 0; //无转化率计算
          return data.map(item => {
            item.transform = 0;
            return item;
          });
        },
        _transformFormatInTable(data) {
          return data.map(item => {
            if (item.transformByUv) {
              item.transformType = transformTypes["1"];
              item.transform = item.transformByUv;
            } else if (item.transformByPv) {
              item.transformType = transformTypes["2"];
              item.transform = item.transformByPv;
            } else {
              item.transformType = transformTypes["3"];
              item.transform = item.transformByViews;
            }
            item.transform = Number(item.transform) * 100;
            return item
          });
        },
        changePlatformMethod() {}
      }
}