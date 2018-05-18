

import { formatTime, toDecimal } from "common/js/util";
import { mapGetters } from "vuex";
export const logisticsMixin = {
    data() {
        return {
            data: null,
            origin: null,
            activeTab: "first",
            loadStatus: -1
        }
    },
    computed: {
        loadingText() {
            return this.loadStatus == 1
                ? this.$t("data.loading")
                : this.$t("data.none");
        },
        ...mapGetters("logistics", ["begin", "end"])
    },
    mounted() {
        this.searchDataByDate();
        // console.log(this['begin']);
    },
    activated() {
        this.searchDataByDate();
    },
    watch: {
        begin() {
            this.searchDataByDate();
        },
        end() {
            this.searchDataByDate();
        }
    },
    methods: {
        transformDate() {
            if (!this.begin) {
                return false;
            }
            let beginDate = this.begin
                ? Number(formatTime(this.begin.getTime(), "yyyyMM"))
                : null;
            let endDate = this.end
                ? Number(formatTime(this.end.getTime(), "yyyyMM"))
                : null;

            if (endDate && beginDate > endDate) {
                this.$message.error("起始日期不可大于结束日期");
                // this.loading = 0;
                return false;
            }
            return { beginDate, endDate }
        },
    }
}