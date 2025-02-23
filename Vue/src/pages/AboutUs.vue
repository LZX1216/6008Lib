<template>
  <div class="about-us">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="intro-section">
          <h2>{{ $t('aboutUs.title') }}</h2>
          <p class="intro-text">{{ $t('aboutUs.introduction') }}</p>

          <h3>{{ $t('aboutUs.missionTitle') }}</h3>
          <p>{{ $t('aboutUs.mission') }}</p>

          <h3>{{ $t('aboutUs.visionTitle') }}</h3>
          <p>{{ $t('aboutUs.vision') }}</p>
        </el-card>

        <el-card class="features-section">
          <h3>{{ $t('aboutUs.featuresTitle') }}</h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="feature in features" :key="feature.Title">
              <div class="feature-item">
                <el-icon :size="40" class="feature-icon">
                  <component :is="feature.icon" />
                </el-icon>
                <h4>{{ $t(feature.Title) }}</h4>
                <p>{{ $t(feature.Description) }}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="stats-section">
          <h3>{{ $t('aboutUs.statsTitle') }}</h3>
          <div class="stat-item" v-for="stat in stats" :key="stat.Label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ $t(stat.Label) }}</div>
          </div>
        </el-card>

        <el-card class="contact-section">
          <h3>{{ $t('aboutUs.contactTitle') }}</h3>
          <div class="contact-info">
            <p>
              <el-icon>
                <Location />
              </el-icon>
              {{ $t('aboutUs.address') }}
            </p>
            <p>
              <el-icon>
                <Phone />
              </el-icon>
              {{ $t('aboutUs.phone') }}
            </p>
            <p>
              <el-icon>
                <Message />
              </el-icon>
              {{ $t('aboutUs.email') }}
            </p>
            <h4>{{ $t('aboutUs.openingHoursTitle') }}</h4>
            <p>
              <el-icon>
                <Calendar />
              </el-icon>
              {{ $t('aboutUs.openingHoursMonFri') }}
            </p>
            <p>
              <el-icon>
                <Clock />
              </el-icon>
              {{ $t('aboutUs.openingHoursSatSun') }}
            </p>
            <p>
              <el-icon>
                <Flag />
              </el-icon>
              {{ $t('aboutUs.openingHoursPublicHolidays') }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Calendar, Clock, Flag, Location, Message, Phone, Collection, Reading, Service } from "@element-plus/icons-vue";

export default {
  name: 'AboutUs',
  components: { Flag, Calendar, Clock, Message, Location, Phone, Collection, Reading, Service },
  data() {
    return {
      features: [
        {
          icon: 'Collection',
          Title: 'aboutUs.featureRichCollection.title',
          Description: 'aboutUs.featureRichCollection.description'
        },
        {
          icon: 'Reading',
          Title: 'aboutUs.featureSmartBorrowing.title',
          Description: 'aboutUs.featureSmartBorrowing.description'
        },
        {
          icon: 'Service',
          Title: 'aboutUs.featureProfessionalService.title',
          Description: 'aboutUs.featureProfessionalService.description'
        }
      ],
      stats: [
        { Label: 'aboutUs.stats.booksInCollection', value: '100,000+' },
        { Label: 'aboutUs.stats.registeredReaders', value: '50,000+' },
        { Label: 'aboutUs.stats.annualLoans', value: '200,000+' },
        { Label: 'aboutUs.stats.electronicResources', value: '30,000+' }
      ]
    };
  }
};
</script>

<style scoped>
.about-us {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.intro-text {
  line-height: 1.8;
  color: #666;
}

.intro-section, .features-section, .stats-section, .contact-section {
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

.contact-info p {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  color: #666;
}

@media (max-width: 768px) {
  .about-us {
    padding: 10px;
  }

  .intro-section h2, .features-section h3, .stats-section h3, .contact-section h3 {
    font-size: 24px;
  }

  .intro-text, .feature-item p, .stat-label, .contact-info p {
    font-size: 14px;
  }

  .stat-value {
    font-size: 20px;
  }

  .feature-item {
    padding: 15px;
  }

  .feature-icon {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .intro-section h2, .features-section h3, .stats-section h3, .contact-section h3 {
    font-size: 20px;
  }

  .intro-text, .feature-item p, .stat-label, .contact-info p {
    font-size: 12px;
  }

  .stat-value {
    font-size: 18px;
  }

  .feature-item {
    padding: 10px;
  }

  .feature-icon {
    font-size: 24px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.about-us {
  animation: fadeIn 0.8s ease-out;
}

.intro-section {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.features-section {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.feature-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.feature-item:nth-child(1) { animation-delay: 0.6s; }
.feature-item:nth-child(2) { animation-delay: 0.8s; }
.feature-item:nth-child(3) { animation-delay: 1s; }

.stats-section {
  animation: fadeInUp 0.8s ease-out 1.2s both;
}

.stat-item {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}

.stat-item:nth-child(1) { animation-delay: 1.4s; }
.stat-item:nth-child(2) { animation-delay: 1.6s; }
.stat-item:nth-child(3) { animation-delay: 1.8s; }
.stat-item:nth-child(4) { animation-delay: 2s; }

.contact-section {
  animation: fadeInUp 0.8s ease-out 2.2s both;
}

.feature-item, .stat-item {
  transition: transform 0.3s ease;
}

.feature-item:hover, .stat-item:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .about-us,
  .intro-section,
  .features-section,
  .feature-item,
  .stats-section,
  .stat-item,
  .contact-section {
    animation-name: fadeIn;
    animation-duration: 0.5s;
    animation-delay: 0s;
  }
}
</style> 