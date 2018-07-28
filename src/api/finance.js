import axios from "axios";
import { apiBaseUrl } from "@/config";
axios.defaults.withCredentials = true;
let url = apiBaseUrl + "finance/";
// 上传资金数据
export function upload1(data) {
  return axios.post(url + "upload1", data).then(res => {
    return Promise.resolve(res.data);
  });
}
export function upload2(data) {
  return axios.post(url + "upload2", data).then(res => {
    return Promise.resolve(res.data);
  });
}
// 查询资金汇总表
export function getZiJinHuiZong(data) {
  return axios.get(url + "getZiJinHuiZong", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

// 查询放款汇总表
export function getFangkuanHuiZong(data) {
  return axios.get(url + "getFangkuanHuiZong", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
// 查询放款汇总表(不匹配的)
export function getFangkuanHuiZong_no_matched(data) {
  return axios.get(url + "getFangkuanHuiZong_no_matched", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
// 查询null业务汇总表
export function getNullTotal(data) {
  return axios.get(url + "getNullTotal", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
export function getTuikuan(data) {
  return axios.get(url + "getTuikuan", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
export function getYunfei(data) {
  return axios.get(url + "getYunfei", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
export function getZijinMonth() {
  return axios.get(url + "getZijinMonth").then(res => {
    return Promise.resolve(res.data);
  });
}

export function getFangkuanMonth(data) {
  return axios.get(url + "getFangkuanMonth").then(res => {
    return Promise.resolve(res.data);
  });
}

export function destroyZijin(data) {
  return axios.post(url + "destroyZijin", data).then(res => {
    return Promise.resolve(res.data);
  });
}
export function destroyFangkuan(data) {
  return axios.post(url + "destroyFangkuan", data).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getNoMatchInZijin(data) {
  return axios.get(url + "getNoMatchInZijin", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
export function getNoMatchInFangkuan(data) {
  return axios.get(url + "getNoMatchInFangkuan", { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}