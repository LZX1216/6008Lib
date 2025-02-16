<template>
  <div class="about-us">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="intro-section">
          <h2>About Us</h2>
          <p class="intro-text">
            We are a modern library dedicated to providing readers with high-quality reading experiences and knowledge services.
            Founded in 2020, we continuously innovate our service model, integrating traditional and modern management approaches.
          </p>

          <h3>Our Mission</h3>
          <p>Spread knowledge, promote learning, serve society, and advance cultural development.</p>

          <h3>Our Vision</h3>
          <p>To become the most popular modern smart library, providing readers with excellent reading experiences and knowledge services.</p>
        </el-card>

        <el-card class="features-section">
          <h3>Our Features</h3>
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
          <h3>Library Overview</h3>
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>

        <el-card class="contact-section">
          <h3>Contact Information</h3>
          <div class="contact-info">
            <p><el-icon><Location /></el-icon> Address: Nanyang Technological University, Singapore</p>
            <p><el-icon><Phone /></el-icon> Phone: +65 1234 5678</p>
            <p><el-icon><Message /></el-icon> Email: library@example.com</p>
            <div class="opening-hours">
              <h4>Opening Hours</h4>
              <p>Monday to Friday: 8:00 - 22:00</p>
              <p>Saturday and Sunday: 9:00 - 21:00</p>
              <p>Public Holidays: 9:00 - 17:00</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// ... existing code ...

export default {
  name: 'AboutUs',
  // ... existing code ...
  data() {
    return {
      features: [
        {
          icon: 'Collection',
          title: 'Rich Collection',
          description: 'Over 100,000 books and abundant electronic resources'
        },
        {
          icon: 'Reading',
          title: 'Smart Borrowing',
          description: '24-hour self-service borrowing and online reservation'
        },
        {
          icon: 'Service',
          title: 'Professional Service',
          description: 'Professional librarians provide reference consultation services'
        }
      ],
      stats: [
        { label: 'Books in Collection', value: '100,000+' },
        { label: 'Registered Readers', value: '50,000+' },
        { label: 'Annual Loans', value: '200,000+' },
        { label: 'Electronic Resources', value: '30,000+' }
      ]
    }
  }
}
</script>

<style scoped>
.about-us {
  padding: 20px;

  margin: 0 auto;
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

</style> 