<style lang="less">
  @import "./userManage.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>

            <!-- 查询条件 from-->
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="登录名" prop="loginId">
                <Input type="text" v-model="searchForm.loginId" clearable placeholder="请输入登录名" :maxlength="20"
                       style="width: 200px"
                />
              </Form-item>
              <Form-item label="用户名称" prop="userName">
                <Input type="text" v-model="searchForm.userName" clearable placeholder="请输入用户名" :maxlength="20"
                       style="width: 200px"
                />
              </Form-item>
              <Form-item label="用户状态" prop="status">
                <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                  <Option value="00">正常</Option>
                  <Option value="01">禁用</Option>
                </Select>
              </Form-item>

              <Form-item label="手机号" prop="mobile">
                <Input type="text" v-model="searchForm.mobile" clearable placeholder="请输入手机号" :maxlength="11"
                       style="width: 200px"/>
              </Form-item>
              <Form-item label="邮箱" prop="email">
                <Input type="text" v-model="searchForm.email" clearable placeholder="请输入邮箱" :maxlength="50"
                       style="width: 200px"/>
              </Form-item>

              <Form-item style="margin-left:-35px;" class="br">
                <Button @click="handleSearch" type="primary" icon="ios-search" class="btnType">查询</Button>
                <Button @click="handleReset" class="btnType">重置</Button>
                <Button @click="add" type="primary" icon="md-add" class="btnType">添加用户</Button>
                <Button @click="delAll" icon="md-trash" class="btnType">批量删除</Button>

                <!--
                <Dropdown @on-click="handleDropdown">
                  <Button>更多操作
                    <Icon type="md-arrow-dropdown"/>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem name="exportData">导出所选数据</DropdownItem>
                    <DropdownItem name="exportAll">导出全部数据</DropdownItem>
                  </DropdownMenu>
                </Dropdown>-->
              </Form-item>
            </Form>
          </Row>

          <!-- 明细数据table-->
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom"
                   @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
            <Table :columns="exportColumns" :data="exportData" ref="exportTable" style="display:none"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize"
                  @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                  size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>

    <!-- 新增、编辑页面-->
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">
      <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">
        <FormItem label="登录名" prop="loginId">
          <Input v-model="userForm.loginId" :maxlength=20 autocomplete="off" clearable
                 placeholder="非空字母或数字,长度最大20字符,不可重复"/>
        </FormItem>
        <FormItem label="用户名" prop="userName">
          <Input v-model="userForm.userName" :maxlength=20 autocomplete="off" clearable/>
        </FormItem>
        <FormItem label="密码" prop="loginPwd" v-if="modalType===0" :error="errorPass">
          <Input type="password" v-model="userForm.loginPwd" autocomplete="off" :maxlength="100" clearable
                 placeholder="密码至少8位且同时包含数字、字母、特殊符号"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="userForm.email" :maxlength="50" clearable/>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="userForm.mobile" :maxlength="11" clearable/>
        </FormItem>

        <FormItem label="角色分配" prop="roles">
          <Select v-model="userForm.roles" multiple>
            <Option v-for="item in roleList" :value="item.roleId" :key="item.roleId" :label="item.roleName">
              <!-- <div style="display:flex;flex-direction:column"> -->
              <span style="margin-right:10px;">{{ item.roleName }}</span>
              <span style="color:#ccc;">{{ item.description }}</span>
              <!-- </div> -->
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>

    <Modal
      v-model="modalExportAll"
      title="确认导出"
      :loading="loadingExport"
      @on-ok="exportAll">
      <p>您确认要导出全部 {{total}} 条数据？</p>
    </Modal>
  </div>
</template>

<script>
import { addUser, deleteUser, disableUser, editUser, enableUser, getAllUserData, getUserListData } from '@/api/user'
import { getAllRoleList } from '@/api/system/role'
import { getToken, setToken } from '@/libs/util'

// import circleLoading from "_c/circle-loading";
export default {
  name: 'user-manage',
  components: {
    // circleLoading
  },
  data () {
    // 定义验证方法，在form表单提交时校验
    // const validatePassword = (rule, value, callback) => {
    //   if (value.length < 6) {
    //     callback(new Error('密码长度不得小于6位'))
    //   } else {
    //     callback()
    //   }
    // };
    const validateMobile = (rule, value, callback) => {
      var reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }

    return {
      accessToken: {},
      loading: false,
      operationLoading: false,
      loadingExport: true,
      modalExportAll: false,
      drop: false,
      dropDownContent: '展开',
      dropDownIcon: 'ios-arrow-down',
      selectCount: 0,
      selectList: [],
      viewImage: false,
      department: [],
      selectDep: [],
      dataDep: [],

      searchForm: {
        userName: '',
        loginId: '',
        mobile: '',
        email: '',
        status: '',
        pageNumber: 1,
        pageSize: 10,
        sort: 'createTime',
        order: 'desc'
      },
      selectDate: null,
      modalType: 0,
      userModalVisible: false,
      modalTitle: '',
      userForm: {
        type: '0',
        roles: [],

        // 测试数据
        loginId: 'test1',
        userName: 'test1',
        loginPwd: 'zjm@123456',
        email: '123456@qq.com',
        mobile: '13888888888'
      },
      userRoles: [],
      roleList: [],
      errorPass: '',

      // 新增、编辑页面form表单提交时校验
      userFormValidate: {
        loginId: [
          { required: true, message: '登录名不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址' },
          { type: 'email', message: '邮箱格式不正确' }
        ]
      },
      submitLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '用户ID',
          key: 'userId',
          width: 100,
          sortable: true,
          fixed: 'left'
        },

        {
          title: '用户名称',
          key: 'userName',
          width: 145,
          sortable: true,
          fixed: 'left'
        },
        {
          title: '登录名',
          key: 'loginId',
          width: 145,
          sortable: true,
          fixed: 'left'
        },
        {
          title: '手机',
          key: 'mobile',
          width: 120,
          sortable: true
        },
        {
          title: '邮箱',
          key: 'email',
          width: 230,
          sortable: true
        },
        {
          title: '状态',
          key: 'status',
          align: 'center',
          width: 150,
          render: (h, params) => {
            let re = ''
            if (params.row.status === '00') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: {
                      type: 'dot',
                      color: 'success'
                    }
                  },
                  '启用'
                )
              ])
            } else if (params.row.status === '01') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: {
                      type: 'dot',
                      color: 'error'
                    }
                  },
                  '禁用'
                )
              ])
            }
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          sortable: true,
          sortType: 'desc',
          width: 180
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            if (params.row.status === '00') {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.disable(params.row)
                      }
                    }
                  },
                  '禁用'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            } else {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'success',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.enable(params.row)
                      }
                    }
                  },
                  '启用'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        }
      ],
      exportColumns: [
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '头像',
          key: 'avatar'
        },
        {
          title: '所属部门ID',
          key: 'departmentId'
        },
        {
          title: '所属部门',
          key: 'departmentTitle'
        },
        {
          title: '手机',
          key: 'mobile'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '性别',
          key: 'sex'
        },
        {
          title: '用户类型',
          key: 'type'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '删除标志',
          key: 'delFlag'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
        {
          title: '更新时间',
          key: 'updateTime'
        }
      ],
      data: [],
      exportData: [],
      total: 0
    }
  },
  methods: {
    init () {
      this.accessToken = {
        accessToken: getToken()
      }
      this.getUserList()
    },

    changePage (v) {
      this.searchForm.pageNumber = v
      this.getUserList()
      this.clearSelectAll()
    },
    changePageSize (v) {
      this.searchForm.pageSize = v
      this.getUserList()
    },

    getUserList () {
      // 多条件搜索用户列表
      this.loading = true
      getUserListData(this.searchForm).then(res => {
        this.loading = false
        if (res.success === true) {
          this.data = res.data.list
          this.total = res.data.count
        }
      })
    },
    handleSearch () {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getUserList()
    },
    handleReset () {
      this.$refs.searchForm.resetFields()
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10

      // 重新加载数据
      this.getUserList()
    },
    changeSort (e) {
      // this.searchForm.sort = e.key
      // this.searchForm.order = e.order
      // if (e.order === 'normal') {
      //   this.searchForm.order = ''
      // }
      // this.getUserList()
    },
    getRoleList () {
      getAllRoleList().then(res => {
        if (res.success === true) {
          this.roleList = res.data
        }
      })
    },
    handleDropdown (name) {
      if (name === 'exportData') {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要导出的数据')
          return
        }
        this.$Modal.confirm({
          title: '确认导出',
          content: '您确认要导出所选 ' + this.selectCount + ' 条数据?',
          onOk: () => {
            this.$refs.exportTable.exportCsv({
              filename: '用户数据'
            })
          }
        })
      } else if (name === 'exportAll') {
        this.modalExportAll = true
      } else if (name === 'importData') {
        this.$Modal.info({
          title: '当前功能开发中...',
          content: ''
        })
      }
    },
    exportAll () {
      getAllUserData().then(res => {
        this.modalExportAll = false
        if (res.success) {
          this.exportData = res.data
          setTimeout(() => {
            this.$refs.exportTable.exportCsv({
              filename: '用户全部数据'
            })
          }, 1000)
        }
      })
    },
    cancelUser () {
      this.userModalVisible = false
    },
    submitUser () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.modalType === 0) {
            // 添加用户 避免编辑后传入id
            delete this.userForm.userId
            delete this.userForm.status
            if (
              this.userForm.loginPwd == '' ||
                this.userForm.loginPwd == undefined
            ) {
              this.errorPass = '密码不能为空'
              return
            }
            if (this.userForm.loginPwd.length < 6) {
              this.errorPass = '密码至少8位且同时包含数字、字母、特殊符号'
              return
            }
            this.submitLoading = true
            addUser(this.userForm).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getUserList()
                this.userModalVisible = false
              }
            }).catch(err => {
              this.submitLoading = false
            })
          } else {
            // 编辑
            editUser(this.userForm).then(res => {
              this.submitLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getUserList()
                this.userModalVisible = false
              }
            }).catch(err => {
              this.submitLoading = false
            })
          }
        }
      })
    },

    handleSuccess (res, file) {
      if (res.success === true) {
        file.url = res.data
        this.userForm.avatar = res.data
      } else {
        this.$Message.error(res.message)
      }
    },
    handleError (error, file, fileList) {
      this.$Message.error(error.toString())
    },
    add () {
      this.modalType = 0
      this.modalTitle = '添加用户'
      this.$refs.userForm.resetFields()
      this.userModalVisible = true
    },
    edit (v) {
      this.modalType = 1
      this.modalTitle = '编辑用户'
      this.$refs.userForm.resetFields()
      // 转换null为""
      for (let attr in v) {
        if (v[attr] === null) {
          v[attr] = ''
        }
      }
      let str = JSON.stringify(v)
      let userInfo = JSON.parse(str)
      this.userForm = userInfo
      let selectRolesId = []
      this.userForm.roles.forEach(function (e) {
        selectRolesId.push(e.roleId)
      })
      this.userForm.roles = selectRolesId
      this.userModalVisible = true
    },

    enable (v) {
      this.$Modal.confirm({
        title: '确认启用',
        content: '是否确认要启用用户 ' + '[' + v.userId + ' ' + v.userName + '] ',
        onOk: () => {
          this.operationLoading = true
          enableUser(v.userId).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('操作成功')
              this.getUserList()
            }
          })
        }
      })
    },
    disable (v) {
      this.$Modal.confirm({
        title: '确认禁用',
        content: '是否确认要禁用用户 ' + '[' + v.userId + ' ' + v.userName + '] ',
        onOk: () => {
          this.operationLoading = true
          disableUser(v.userId).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('操作成功')
              this.getUserList()
            }
          })
        }
      })
    },
    remove (v) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '是否确认要删除用户 ' + '[' + v.userId + ' ' + v.userName + '] ',
        onOk: () => {
          this.operationLoading = true
          deleteUser(v.userId).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('删除成功')
              this.getUserList()
            }
          })
        }
      })
    },
    dropDown () {
      if (this.drop) {
        this.dropDownContent = '展开'
        this.dropDownIcon = 'ios-arrow-down'
      } else {
        this.dropDownContent = '收起'
        this.dropDownIcon = 'ios-arrow-up'
      }
      this.drop = !this.drop
    },
    showSelect (e) {
      this.exportData = e
      this.selectList = e
      this.selectCount = e.length
    },
    clearSelectAll () {
      this.$refs.table.selectAll(false)
    },
    delAll () {
      if (this.selectCount <= 0) {
        this.$Message.warning('您还未选择要删除的数据')
        return
      }
      this.$Modal.confirm({
        title: '确认删除',
        content: '您确认要删除所选的 ' + this.selectCount + ' 条数据?',
        onOk: () => {
          let ids = ''
          this.selectList.forEach(function (e) {
            ids += e.userId + ','
          })
          ids = ids.substring(0, ids.length - 1)
          this.operationLoading = true
          deleteUser(ids).then(res => {
            this.operationLoading = false
            if (res.success === true) {
              this.$Message.success('删除成功')
              this.clearSelectAll()
              this.getUserList()
            }
          })
        }
      })
    }
  },
  mounted () {
    this.init()
    this.getRoleList()
  }
}
</script>
