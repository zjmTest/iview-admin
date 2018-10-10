<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import {mapActions} from 'vuex'

  export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo',
      'getRoutersConfig'
    ]),
    handleSubmit ({ userName, password }) {

      // 登录
      this.handleLogin({ userName, password }).then(res => {
        // 获取用户信息
        this.getUserInfo().then(user => {
          // 加载菜单
          this.getRoutersConfig().then(conf => {
            // 注册新路由配置
            this.$router.addRoutes(conf);
            this.$router.push({
              name: 'home'
            })
          })
        })

        // Promise.all([this.getUserInfo(),this.getRoutersConfig()]).then(res => {
        //   // 注册新路由配置
        //   this.$router.addRoutes(res[0]);
        //   this.$router.push({
        //     name: 'home'
        //   })
        // })
      })
    }
  }
}
</script>

<style>

</style>
