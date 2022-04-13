<template>
  <div>
    <div class="block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-edit" />
          <span>我要登记</span>

        </div>
        <el-form ref="form" :model="form" label-width="90px">
          <el-form-item label="零件二维码">
            <el-input v-model="form.name" clearable autofocus placeholder="输入零件二维码或者输入4位数的零件编号" />
          </el-form-item>
          <el-form-item label="零件项目">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="零件编号">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="零件版本">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="零件名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="零件数量">
            <el-input v-model="form.name" />
          </el-form-item>

          <el-form-item label="目的">
            <el-radio-group v-model="form.resource">
              <el-radio label="全检" />
              <el-radio label="抽检" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="成品">
            <el-radio-group v-model="form.resource">
              <el-radio label="成品" />
              <el-radio label="半成品" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="送检人">
            <el-input v-model="form.name" placeholder="输入工号时会转换成姓名" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即登记</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="max-height:800px">
        <div slot="header" class="clearfix">
          <span>今日登记记录</span>
          <el-button style="float: right; padding: 3px 0" type="text">清空</el-button>
        </div>
        <i class="el-icon-time" />
        刚刚:刘旭登记了1件 <span><el-tag> 02-62-3369-00-01(A)</el-tag></span> 大底座 全检 的 成品
        <div />

      </el-card>
    </div>

  </div>
</template>
<script>

export default ({
  data() {
    return {
      input_coment: '',
      Parts_project: '',
      Parts_numbers: '',
      Parts_name: '',
      Parts_count: '',
      select: '1',
      delivery: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }

    }
  },
  computed: {

  },
  methods: {
    onSubmit() {
      console.log('submit!')
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
  .clearfix{
    width: 480px;
  }
</style>
