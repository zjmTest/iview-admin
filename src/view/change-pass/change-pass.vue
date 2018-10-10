<style lang="less">
  @import "./change-pass.less";
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="key"></Icon>
        修改密码
      </p>
      <div>
        <Form
          ref="editPasswordForm"
          :model="editPasswordForm"
          :label-width="100"
          label-position="right"
          :rules="passwordValidate"
          style="width:450px"
        >
          <FormItem label="原密码" prop="oldPass">
            <Input type="password" v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPass">
            <Input type="password" v-model="editPasswordForm.newPass"
                   placeholder="请输入新密码，密码至少8位且同时包含数字、字母、特殊符号"></Input>
          </FormItem>
          <FormItem label="确认新密码" prop="rePass">
            <Input type="password" v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width: 100px;margin-right:5px" :loading="savePassLoading"
                    @click="saveEditPass">保存
            </Button>
            <Button @click="cancelEditPass">取消</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
import { changePassord } from '@/api/user'
import { mapActions } from 'vuex'

export default {
  name: 'change_pass',
  data () {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      id: '', // 登录用户的userId
      savePassLoading: false,
      editPasswordForm: {
        oldPass: '',
        newPass: '',
        rePass: ''
      },
      passwordValidate: {
        oldPass: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPass: [
          { required: true, message: '请输入新密码,密码至少8位且同时包含数字、字母、特殊符号', trigger: 'blur' },
          { min: 8, message: '请至少输入8个字符', trigger: 'blur' },
          { max: 16, message: '最多输入16个字符', trigger: 'blur' }
        ],
        rePass: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: valideRePassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    init () {
      this.userId = this.$store.state.user.userId
    },
    saveEditPass () {
      let params = {
        userId: this.userId,
        password: this.editPasswordForm.oldPass,
        newPass: this.editPasswordForm.newPass
      }
      this.$refs['editPasswordForm'].validate(valid => {
        if (valid) {
          this.savePassLoading = true
          changePassord(params).then(res => {
            this.savePassLoading = false
            if (res.success === true) {
              this.$Modal.success({
                title: '修改密码成功',
                content: '修改密码成功，需重新登录',
                onOk: () => {
                  Promise.all([this.handleLogOut()]).then(res => {
                    this.$router.push({
                      name: 'login'
                    })
                  })
                }
              })
            }
          }).catch(err => {
            this.savePassLoading = false
          })
        }
      })
    },
    cancelEditPass () {
      this.$store.commit('closeTag', {
        name: 'changePass'
      })
    }

  },
  mounted () {
    this.init()
  }
}
</script>
