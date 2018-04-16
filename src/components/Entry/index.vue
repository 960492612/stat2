<template>
    <div class="entry">
        <el-container class="container">

            <el-header class="header" height="85px">
                <div class="content">
                    <div class="logo"><img src="../../assets/logo3.0.png" alt="zastone"></div>
                    <div class="right">
                        <change-lang/>
                    </div>
                </div>

            </el-header>

            <el-main class="main">
                <div class="banner">
                </div>
                <div class="login-wrap">
                    <login class="login" />
                </div>

            </el-main>
            <el-footer class="footer">
                <div class="links">
                    <a href="http://www.zastone.com">即时通 |</a>
                    <a href="http://www.meisort.com">美讯捷</a>
                </div>
                <div class="info">
                    <a href="http://www.firebee.net.cn">Copyright 2018@深圳市火蜂网络技术发展有限公司</a>
                </div>
            </el-footer>
        </el-container>
    </div>
</template>
<script>
import ChangeLang from 'base/ChangeLang'
import Login from "components/Login";
export default {
  
  components: {
    Login,
    ChangeLang
  }
};
</script>
<style lang="scss">
$header-height: 90px;
$main-height: 550px;
.entry {
  height: 100%;
  .header {
    height: $header-height;
    padding: 5px 0;
    .content {
      width: 1200px;
      height: $header-height;
      margin: 0 auto;
      .logo {
        float: left;
        height: $header-height;
        img {
          width: 100%;
          height: 75px;
        }
      }
      .right {
        float: right;
        margin-top: 33px;
        cursor: pointer;
      }
    }
  }
  .main {
    height: $main-height;
    width: 100%;
    position: relative;
    .banner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: $main-height;
      background: url(../../assets/banner.jpg) no-repeat center;
    }
    .login-wrap {
      position: absolute;
      top: 0;
      left: 0;
      width: 1200px;
      height: $main-height;
      left: 50%;
      margin-left: -600px;
      .login {
        float: right;
        margin-top: 100px;
        background: #fff;
      }
    }
    // @media screen(min-height:) {

    // }
  }
  .footer {
    margin-top: 100px;
    width: 100%;
    //   bottom: 20px;
    //   left: 50%;
    //   padding-top: 20px;
    .links{
      a{
        color: #777;
        font-size: 14px;
      }
    }
    .info {
      a {
        color: #777;
        font-size: 14px;
        &:hover {
          color: #000;
        }
      }

      margin-top: 10px;
    }
  }
}
</style>

