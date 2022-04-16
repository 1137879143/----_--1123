<template>
  <div>
    <div class="block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-eleme" />
          <span>我要登记</span>
          <el-button style="float: right;" type="text" icon="el-icon-plus" @click="onAddPeoplediag">新增人员信息</el-button>
        </div>
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="零件二维码">
            <el-input id="qrcode" v-model="form.qrCode" autofocus clearable placeholder="扫码枪输入零件二维码或者输入4位数的零件编号" @input="read_prtnum" />
          </el-form-item>
          <el-form-item label="零件项目">
            <el-input v-model="form.project" />
          </el-form-item>
          <el-form-item label="零件编号">
            <el-input v-model="form.number" />
          </el-form-item>
          <el-form-item label="零件版本">
            <el-input v-model="form.version" />
          </el-form-item>
          <el-form-item label="零件名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="零件数量">
            <el-input v-model="form.count" />
          </el-form-item>

          <el-form-item label="目的">
            <el-radio-group v-model="form.target">
              <el-radio label="全检" />
              <el-radio label="抽检" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.state">
              <el-radio label="成品" />
              <el-radio label="半成品" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="送检人">
            <el-input id="peopleName" v-model="form.people" placeholder="输入3位数的代号,会转换成姓名" @keydown.enter.native="onSubmit" @input="onchangepepole" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" placeholder="重要:如首件或某个尺寸" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即登记</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="max-height:800px">
        <div slot="header" class="clearfix">
          <el-badge type="warning" :value="todayList.count" class="item">
            <el-tag>
              <i class="el-icon-s-opportunity" />
              <span>24小时内登记消息</span>
            </el-tag>
          </el-badge>
          <el-button style="float: right;" type="text" icon="el-icon-refresh-right" @click="read_today">刷新</el-button>
        </div>
        <div
          :style="{'max-height': timeLineHeight + 'px' }"
          style="overflow-y:scroll;"
        >
          <div v-for="(item,index) in todayList.rows" :key="index" class="read_yoday">
            <i class="el-icon-time" />
            <span style="color:#66667F">{{ item.createdAt }}</span> <span style="color:#599230 ;font-size :9px;">{{ item.people }} 登记了 {{ item.count }} 件 <span><el-button style="fontSize:12px" type="text" @click="on_repeat(index)"> <i class="el-icon-setting" />{{ item.parts_number }} ({{ item.version }})</el-button></span> <span style="color:#599230; font-size :9px;"> {{ item.parts_name }}</span> {{ item.target }} 的 {{ item.parts_state }}</span>
          </div>
        </div>
        <div />
      </el-card>
      <el-card style="max-height:800px">
        <div slot="header">
          <i class="el-icon-s-marketing" />
          <span>历史登记数据报告</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-refresh-right" @click="get_analysis">刷新</el-button>
        </div>
        <span class="heardTime">
          <i class="el-icon-s-marketing" />
          数据更新至: {{ Date.now()| dateFormat }}
        </span>
        <!-- 数据记录 -->
        <div class="dataRecordBox">
          <div class="daraRecordBox_contet">今日记录
            <div class="daraRecordBox_contet_num">{{ analysisList.today_count }}</div>
            <div v-if="analysisList.yesterday_count>0" class="daraRecordBox_contet_text"><span style="color: #9195A3">较昨日</span> <span style="color: #E83132;">+{{ analysisList.yesterday_count }}</span></div>
            <div v-else class="daraRecordBox_contet_text"><span style="color: #9195A3">较昨日</span> {{ analysisList.yesterday_count }}</div>
          </div>
          <div class="daraRecordBox_contet">本周记录
            <div class="daraRecordBox_contet_num">{{ analysisList.thisweek_start }}</div>
            <div v-if="analysisList.thisweek_count>0" class="daraRecordBox_contet_text"><span style="color: #9195A3">较上周</span> <span style="color: #E83132;">+{{ analysisList.thisweek_count }}</span></div>
            <div v-else class="daraRecordBox_contet_text"><span style="color: #9195A3">较上周</span> {{ analysisList.thisweek_count }}</div>
          </div>
          <div class="daraRecordBox_contet">本月记录

            <div class="daraRecordBox_contet_num">{{ analysisList.thismonth_start }}</div>
            <div v-if="analysisList.thismonth_count>0" class="daraRecordBox_contet_text"><span style="color: #9195A3">较上月</span> <span style="color: #E83132;">+{{ analysisList.thismonth_count }}</span></div>
            <div v-else class="daraRecordBox_contet_text"><span style="color: #9195A3">较上月</span>  {{ analysisList.thismonth_count }}</div>
          </div>
          <div class="daraRecordBox_contet">累计记录
            <div class="daraRecordBox_contet_num" style="color:#10AEB5;font-size:20px">{{ analysisList.total_count }}</div>
          </div>
        </div>
        <!-- 图表 -->
        <div id="About">
          <div id="main" style="width:500px;height:500px" />
        </div>
      </el-card>
    </div>
    <!-- 弹出框 -->
    <el-dialog
      title="新增人员信息"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >

      <el-form ref="addPeople" :model="addPeople" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="addPeople.name" style="width:200px" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="addPeople.worknumber" style="width:200px" />
        </el-form-item>
        <el-form-item label="岗位">
          <el-radio-group v-model="addPeople.jobs">
            <el-radio label="CNC_A组" />
            <el-radio label="CNC_B组" />
            <el-radio label="CNC_C组" />
            <el-radio label="CNC_D组" />
            <el-radio label="线切割组" />
            <el-radio label="放电组" />
            <el-radio label="车床组" />
            <el-radio label="后处理组" />
            <el-radio label="工艺组" />
            <el-radio label="编程组" />
            <el-radio label="其它" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onAddPeople">立即创建</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table
        :data="pepoleList"
        style="width: 100%"
        border
        stripe
        highlight-current-row
        max-height="500"
      >
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="Work_number"
          label="工号"
        />
        <el-table-column
          prop="jobs"
          label="岗位"
        />
      </el-table>

    </el-dialog>
  </div>
</template>
<script>
import { registration, read_prtnum, read_today, get_InspectionId, get_analysis, getpepoleList, add_user, onchangepepole } from '@/views/I_want_to_register/api'
import * as echarts from 'echarts'
var myChart
export default ({
  data() {
    return {
      timeLineHeight: '',
      select: '1',
      delivery: '',
      form: {
        qrCode: '',
        project: '',
        number: '',
        version: '',
        name: '',
        count: '',
        target: '',
        state: '',
        people: '',
        note: ''
      },
      todayList: '',
      analysisList: '',
      dialogVisible: false, // 弹出框.
      addPeople: {
        name: '',
        worknumber: '',
        jobs: ''

      },
      pepoleList: ''

    }
  },
  computed: {

  },
  created() {
    this.read_today() // 读取今日登记
    this.get_analysis()// 获取分析数据
  },
  mounted() {
    // 调用图表函数
    myChart = echarts.init(document.getElementById('main'))
    // this.myChart()
    this.timeLineHeight = document.documentElement.clientHeight - 250
    window.onresize = () => {
      this.timeLineHeight = document.documentElement.clientHeight - 250
    }
  },
  methods: {

    // 图表
    myChart(data) {
      // 绘制图表
      var option = {
        boom: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'

        },
        legend: {
          top: 'bottom',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            data: [{
              value: data.CNC_A组,
              name: 'CNC_A组'
            },
            {
              value: data.CNC_B组,
              name: 'CNC_B组'
            }, {
              value: data.CNC_C组,
              name: 'CNC_C组'
            },
            {
              value: data.CNC_D组,
              name: 'CNC_D组'
            },
            {
              value: data.线切割组,
              name: '线切割'
            }, {
              value: data.放电组,
              name: '放电'
            },
            {
              value: data.车床组,
              name: '车床'
            },
            {
              value: data.后处理组,
              name: '后处理'
            }, {
              value: data.其它,
              name: '其它'
            }, {
              value: data.工艺组,
              name: '工艺组'
            }, {
              value: data.编程组,
              name: '编程组'
            }

            ],
            roseType: 'area',
            radius: '40%',
            stillShowZeroSum: false,
            label: {
              show: false
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                }
              }
            }

          }
        ]
      }
      myChart.setOption(option)
    },
    // 新增人员信息按钮
    onAddPeople() {
      // 校验表单 不能为空
      if (this.addPeople.name === '') {
        this.$message({
          message: '姓名不能为空',
          type: 'warning'
        })
        return
      }
      if (this.addPeople.worknumber === '') {
        this.$message({
          message: '工号不能为空',
          type: 'warning'
        })
        return
      }
      if (this.addPeople.jobs === '') {
        this.$message({
          message: '岗位不能为空',
          type: 'warning'
        })
        return
      }

      add_user(this.addPeople).then(res => {
        console.log(res)
        var rest = res
        if (rest.code === 100) {
          this.$message({
            type: 'error',
            message: '用户已存在'
          })
        } else {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          // 增加数据
          this.pepoleList.push(this.addPeople)
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
    },

    onSubmit() {
      var that = this
      // 校验表单 不能为空
      if (this.form.project === '') {
        this.$message({
          message: '项目不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.number === '') {
        this.$message({
          message: '编号不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.version === '') {
        this.$message({
          message: '版本不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.name === '') {
        this.$message({
          message: '名称不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.count === '') {
        this.$message({
          message: '数量不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.target === '') {
        this.$message({
          message: '目标不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.state === '') {
        this.$message({
          message: '状态不能为空',
          type: 'warning'
        })
        return
      }
      if (this.form.people === '') {
        this.$message({
          message: '送检人不能为空',
          type: 'warning'
        })
        return
      }

      // 弹出确认框
      this.$confirm('确认提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // 提交数据

        console.log(this.form)
        registration(this.form).then(res => {
          console.log(res)
          that.$message({
            type: 'success',
            message: '新增登记成功!'
          })
          this.read_today() // 读取今日登记
          this.get_analysis()// 获取分析数据

          // qrcode获取焦点
          document.getElementById('qrcode').focus()
          // 清空数据框
          this.form.qrCode = ''
          this.form.project = ''
          this.form.number = ''
          this.form.version = ''
          this.form.name = ''
          this.form.count = ''
          this.form.target = ''
          this.form.state = ''
          this.form.people = ''
        })
      })
    },
    //  4位数代表零件编号查找零件信息
    read_prtnum() {
      if (this.form.qrCode.length === 4) {
        read_prtnum({ qrcode: this.form.qrCode }).then(res => {
          console.log(res)
          if (res.data == null) {
            this.$message({
              type: 'error',
              message: '没有找到该零件!'
            })
            return
          } else {
            this.$message({
              type: 'success',
              message: '数据查找成功!'
            })
            document.getElementById('peopleName').focus()
            this.form.qrCode = res.data.guid
            this.form.project = res.data.project_name
            this.form.number = res.data.Material_code
            this.form.version = res.data.Expected_delivery_date
            this.form.name = res.data.Material_name
            this.form.count = res.data.Purchase_quantity
          // // this.form.target = res.data.target
          // this.form.state = res.data.state
          // this.form.people = res.data.people
          // this.form.note = res.data.note
          }
        })
      } else if (this.form.qrCode.length === 32) {
        undefined
      } else if (this.form.qrCode.length === 0) {
        this.form.qrCode = ''
        this.form.project = ''
        this.form.number = ''
        this.form.version = ''
        this.form.name = ''
        this.form.count = ''
        // this.form.target = ''
        // this.form.state = ''
        // this.form.people = ''
        // this.form.note = ''
      }
    },
    // onchangepepole 3位数代表人员编号查找人员信息
    onchangepepole() {
      if (this.form.people.length === 3) {
        onchangepepole({ Work_number: this.form.people }).then(res => {
          console.log(res)
          if (res.data == null) {
            this.$message({
              type: 'error',
              message: '没有找到该人员!'
            })
            return
          } else {
            this.$message({
              type: 'success',
              message: '数据查找成功!'
            })
            this.form.people = res.data
            //
          }
        })
      }
    },

    // 获取今日登记消息
    read_today() {
      var that = this
      // 去除日期 保留时间
      read_today().then(res => {
        that.todayList = res.data
        console.log(this.todayList.rows)
        for (var i = 0; i < this.todayList.rows.length; i++) {
          var cread = this.todayList.rows[i].createdAt.split(' ')
          that.todayList.rows[i].createdAt = cread[1]
        }
      })
    },
    // 显示弹出框
    onAddPeoplediag() {
      this.dialogVisible = true
      // 获取人员列表
      getpepoleList().then(res => {
        this.pepoleList = res.datas
        // console.log(this.pepoleList)
      })
    },

    // 重复登记
    on_repeat(index) {
      console.log(this.todayList.rows[index].id)
      var _id = this.todayList.rows[index].id
      // 根据零件id查询工艺卡信息
      get_InspectionId({ id: _id }).then(res => {
        console.log(res)
        this.$message({
          type: 'success',
          message: '数据查找成功!'
        })
        this.form.qrCode = res.data.parts_QRCODE
        this.form.project = res.data.Parts_project
        this.form.number = res.data.parts_number
        this.form.version = res.data.version
        this.form.name = res.data.parts_name
        this.form.count = res.data.count
        this.form.target = res.data.target
        this.form.state = res.data.parts_state
        this.form.people = res.data.people
        this.form.note = res.data.note
      })
    },
    // 获取数据分析
    get_analysis() {
      get_analysis().then(res => {
        this.analysisList = res.data
        console.log(this.analysisList)
        this.myChart(this.analysisList.charData)
      })
    }

  }
})
</script>

<style scoped>
.el-card{
    margin: 15px;
}

.el-select{
    width: 130px;
  }
.input-with-select{
    background-color: #fff;
  }
.box-card{
  width: 500px;
}
.block{
    display: flex;
  }
.read_yoday{
  font-size: 14px;
  border-bottom: #f1eded solid 1px;
}
.dataRecordBox{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  width: 400px;
}
.daraRecordBox_contet{
  width: 100px;
  text-align: center;
  border-radius: 15px;
  margin: 5px;
  padding: 5px;
}
.dataRecordBox :hover{
background-color: #F5F5F6;

}
.daraRecordBox_contet_num{
  color: #FF6A57;
  margin-top: 10px;
}
.daraRecordBox_contet_text{
  font-size: 11px;
  margin-top: 8px;
}
.heardTime{
  font-size: 13px;
    color: #9195A3;
    line-height: 23px;
    float: right;
}
</style>
