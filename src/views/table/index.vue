<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col
          :span="8"
        >
          <!-- 搜索框 -->
          <div class="grid-content bg-purple-dark" />
          <el-input v-model="searchinput" placeholder="请输入编号搜索" class="input-with-select" @keyup.enter.native="search_button">
            <el-button slot="append" icon="el-icon-search" @click="search_button" />
          </el-input>
        </el-col>
        <!-- <el-date-picker type="date" placeholder="选择日期" /> -->
        <!-- <el-date-picker type="date" placeholder="选择日期" /> -->
        <span>日期筛选 </span>
        <el-date-picker
          v-model="date_picker"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        />

        <el-button icon="el-icon-download" @click="downloadexcel">导出为EXCLE</el-button>
        <el-button icon="el-icon-refresh" @click="fetchData(currentPage, pageSize)" />
      </el-row>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        max-height="700"
      >
        <el-table-column type="selection" width="50" />

        <el-table-column align="left" label="送检人" width="100">
          <template slot-scope="scope">
            <i class="el-icon-user" />
            {{ scope.row.people }}
          </template>
        </el-table-column>
        <el-table-column prop="jobs" label="来源" width="100" />

        <!-- <el-table-column prop="id" label="id" width="50" /> -->

        <el-table-column prop="createdAt" label="登记时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="parts_number" label="零件编号" width="210">
          <template slot-scope="scope">
            <i class="el-icon-mobile" />
            {{ scope.row.parts_number }}
          </template>
        </el-table-column>
        <el-table-column prop="parts_name" label="零件名称" width="180" />
        <el-table-column prop="version" label="版本" width="50" />
        <el-table-column prop="Parts_project" label="项目" width="120" />
        <el-table-column prop="count" label="数量" width="60" />
        <el-table-column prop="target" label="目的" width="60" />

        <el-table-column
          prop="parts_details_list"
          align="center"
          label="零件状态"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              :type="success"
              disable-transitions
            >{{ scope.row.parts_state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" width="100" />

        <el-table-column prop="updatedAt" label="最后更新时间" width="180">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 10px">{{ scope.row.updatedAt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >查看记录</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 底部分页 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[pageSize, pageSize1, pageSize2, pageSize3]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listcount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 提示面板 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      center
    >
      <!-- 内容 -->
      <span slot="title">{{ dialogTitle.parts_number }}  {{ dialogTitle.parts_name }}</span>

      <el-timeline v-for="(item, index) in dialogList" :key="index">
        <el-timeline-item :timestamp="item.updatedAt" placement="top">
          <el-card shadow="hover">
            <h4 style="color:#696969">{{ item.name }}: {{ item.state }} {{ item.chengpin }} 数量:{{ item.count }}件 {{ item.target }} {{ item.note }} </h4>
            <div>
              <el-tag v-for="(itemc, indexc) in item.answer_comments" :key="indexc" size="small" :type="itemc.icon">{{ itemc.name }}: {{ itemc.state }} 备注:{{ itemc.note }}</el-tag>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span></el-dialog>

  </div>
</template>

<script>
// import { getList } from '@/api/table'
import axios from 'axios'
axios.interceptors.request.use(config => {
  config.headers.permission = localStorage.getItem('token')
  return config
})
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listcount: null,
      currentPage: 1, // 初始页
      pageSize: 20, //    每页的数据
      pageSize1: 50, //    每页的数据
      pageSize2: 100, //    每页的数据
      pageSize3: 200, //    每页的数据
      // 搜索框
      searchinput: '',
      // 提示面板
      dialogVisible: false,
      dialogList: '',
      dialogTitle: '',
      date_picker: '', // 日期筛选
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.fetchData(this.currentPage, this.pageSize)
  },
  // 初始化获取数据
  methods: {
    fetchData(currentPage, pageSize) {
      var that = this
      this.listLoading = true

      // console.log(tou)
      axios
        .post('http://127.0.0.1:8080/api/P_inspection', {
          currentPage: currentPage,
          pageSize: pageSize
        })
        .then(function(response) {
          console.log(response.data.data)
          that.listLoading = false
          that.list = response.data.data
          that.listcount = response.data.count
        })
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.fetchData(this.currentPage, val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.fetchData(val, this.pageSize)
    },
    // 搜索文件
    search_button() {
      var that = this
      console.log(this.date_picker)
      that.listLoading = true
      if (that.searchinput) {
        axios
          .post('http://127.0.0.1:8080/api/P_get_title', {
            title: that.searchinput,
            currentPage: that.currentPage,
            pageSize: that.pageSize
          })
          .then(function(response) {
            console.log(response.data.count)

            that.listLoading = false
            that.list = response.data.data
            that.listcount = response.data.count
          })
      } else {
        axios
          .post('http://127.0.0.1:8080/api/P_inspection', {
            currentPage: that.currentPage,
            pageSize: that.pageSize
          })
          .then(function(response) {
            console.log(response.data.count)
            that.listLoading = false
            that.list = response.data.data
            that.listcount = response.data.count
          })
      }
    },
    handleClose() {

    },
    // 删除记录
    handleDelete(index, row) {
      var that = this
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.list.splice(index, 1)
          // console.log(row.id)
          // 发送请求到服务器
          axios
            .post('http://127.0.0.1:8080/api/deleteRecord', {
              id: row.id
            })
            .then(function(response) {
              // console.log(response)
              that.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 查看记录
    handleEdit(index, row) {
      var that = this
      this.dialogVisible = true
      // console.log(row)
      this.dialogTitle = row
      axios.post('http://127.0.0.1:8080/api/getComment', {
        id: row.id
      })
        .then(function(response) {
          console.log(response)
          console.log(response.data[0].comments)

          that.dialogList = response.data[0].comments
        })
    },

    // 下载文件导出excle
    downloadexcel() {
      var that = this

      this.$confirm(`共${that.listcount}条数据, 此操作需要一些时间, 是否继续?`, '导出为EXCLE', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 发送请求到服务器
          axios({
            method: 'post',
            url: 'http://127.0.0.1:8080/api/getAllRecord',
            responseType: 'blob'
          }).then(response => {
            const blob = new Blob([response.data])
            that.download(blob)
          })
        })
        .catch(() => {
        })
    },

    // 封装的下载函数
    download(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'excel.xlsx')

      document.body.appendChild(link)
      link.click()
    }

  }
}

</script>

<style scoped>
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.refresh{
  margin-left: 15px;
}
</style>
