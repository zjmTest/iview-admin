<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import {getTableData} from '@/api/data'

  export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {title: 'Name', key: 'name', sortable: true},
        {title: 'Email', key: 'email', editable: true},
        {title: 'Create-Time', key: 'createTime'},
        {
          title: 'Handle',
          key: 'handle',
          /// options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params);
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '自定义删除')
              ])
            }
          ]
        },
        {
          title: 'otherSelect', key: 'otherSelect',
          render: (h, params) => {
            return h('Select', {
                props: {
                  value: '',
                },
                on: {
                  'on-change': (event) => {
                    alert(1111);
                  }
                },
              },
              [
                h('Option', {
                  props: {
                    value: '1'
                  }
                }, 'option1'),
                h('Option', {
                  props: {
                    value: '2'
                  }
                }, 'option2'),

                //动态生成
                this.volumeTypes.map(function (type) {
                  return h('Option', {
                    props: {value: type}
                  }, type);
                })
              ]
            );
          },


        },

        {

          title: '品种',
          width: 100,
          align: 'center',
          key: 'varieties',
          render: (h, params) => {
            return h('Dropdown', {
              props: {
                trigger: "click"
              },
              on: {
                'on-click': (value) => {
                  alert(value);//value和下面选项的name对应
                }
              } //iview组件内部的属性定义在其标签的对象里
            }, [//盒子内部其他标签元素放入数组中
              h('a', [//创建一个a标签,a标签里面又有元素,继续放入后面数组
                h('span', '更多'),//span中的内容
                h('Icon', {
                  props: {
                    type: 'md-arrow-dropdown',
                    size: '18'
                  }
                })
              ]),
              h('DropdownMenu', {//创建一个和a标签同级的标签
                  slot: "list"//iview组件内部的属性定义在其标签的对象里
                },
                this.dropdownItems.map(function (type) {//把map看作循环,type看作循环的每一项
                  return h('DropdownItem', {
                    props: {
                      name: type.val
                    }
                  }, type.val)
                })
              )
            ]);
          }
        }

      ],
      tableData: [],
      volumeTypes: ['Option4', 'Option3'],
      dropdownItems: [{val: 'Option4'}, {val: 'Option3'}],
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res
    })
  }
}
</script>

<style>

</style>
