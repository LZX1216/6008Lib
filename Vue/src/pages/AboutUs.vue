<template>
  <div class="about-us">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="intro-section">
          <h2>关于我们</h2>
          <p class="intro-text">
            我们是一家现代化的图书馆，致力于为读者提供优质的阅读体验和知识服务。
            成立于2020年，我们不断创新服务模式，融合传统与现代化的管理方式。
          </p>
          
          <h3>我们的使命</h3>
          <p>传播知识，促进学习，服务社会，推动文化发展。</p>
          
          <h3>我们的愿景</h3>
          <p>成为最受欢迎的现代化智慧图书馆，为读者提供优质的阅读体验和知识服务。</p>
        </el-card>

        <el-card class="features-section">
          <h3>我们的特色</h3>
          <el-row :gutter="20">
            <el-col :span="8" v-for="feature in features" :key="feature.title">
              <div class="feature-item">
                <el-icon :size="40" class="feature-icon">
                  <component :is="feature.icon" />
                </el-icon>
                <h4>{{ feature.title }}</h4>
                <p>{{ feature.description }}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="stats-section">
          <h3>图书馆概况</h3>
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>

        <el-card class="contact-section">
          <h3>联系方式</h3>
          <div class="contact-info">
            <p><el-icon><Location /></el-icon> 地址：新加坡南洋理工大学</p>
            <p><el-icon><Phone /></el-icon> 电话：+65 1234 5678</p>
            <p><el-icon><Message /></el-icon> 邮箱：library@example.com</p>
            <div class="opening-hours">
              <h4>开放时间</h4>
              <p>周一至周五：8:00 - 22:00</p>
              <p>周六至周日：9:00 - 21:00</p>
              <p>法定节假日：9:00 - 17:00</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { 
  Collection, 
  Reading, 
  Service,
  Location,
  Phone,
  Message
} from '@element-plus/icons-vue'

export default {
  name: 'AboutUs',
  components: {
    Collection,
    Reading,
    Service,
    Location,
    Phone,
    Message
  },
  data() {
    return {
      features: [
        {
          icon: 'Collection',
          title: '丰富馆藏',
          description: '超过10万册图书和丰富的电子资源'
        },
        {
          icon: 'Reading',
          title: '智能借阅',
          description: '24小时自助借还，线上预约服务'
        },
        {
          icon: 'Service',
          title: '专业服务',
          description: '专业馆员提供参考咨询服务'
        }
      ],
      stats: [
        { label: '馆藏图书', value: '100,000+' },
        { label: '注册读者', value: '50,000+' },
        { label: '年借阅量', value: '200,000+' },
        { label: '电子资源', value: '30,000+' }
      ]
    }
  }
}
</script>

<style scoped>
.about-us {
  padding: 20px;
}

.intro-section {
  margin-bottom: 20px;
}

.intro-text {
  line-height: 1.8;
  color: #666;
}

.features-section {
  margin-bottom: 20px;
}

.feature-item {
  text-align: center;
  padding: 20px;
}

.feature-icon {
  color: #409EFF;
  margin-bottom: 15px;
}

.feature-item h4 {
  margin: 10px 0;
  color: #303133;
}

.feature-item p {
  color: #666;
  font-size: 14px;
}

.stats-section {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-value {
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
}

.stat-label {
  color: #666;
  margin-top: 5px;
}

.contact-section {
  margin-bottom: 20px;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  color: #666;
}

.contact-info .el-icon {
  color: #409EFF;
}
</style> 