<template>
  <el-footer class="footer">
    <div class="footer-divider"></div>
    <div class="footer-content">
      <div class="footer-section">
        <h4>Library</h4>
        <p>Somewhere, Singapore</p>
        <p>© 2025 Library System. All rights reserved.</p>
      </div>
      <div class="footer-section">
        <h4>Quick Links</h4>
        <router-link to="/about">About Us</router-link>
        <router-link to="/help">Help Center</router-link>
      </div>
      <div class="footer-section">
        <h4>Contact Us</h4>
        <p><i class="el-icon-phone"></i> +65 1234 5678</p>
        <p><i class="el-icon-message"></i> library@library.com</p>
      </div>
    </div>
  </el-footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear();
    }
  }
}
</script>

<style scoped>
.footer {
  padding: 40px 20px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  color: #333;
  background-color: #f5f7fa;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.footer-divider {
  border-top: 1px solid #dcdfe6;
  margin-bottom: 40px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 40px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeInUp 0.8s ease-out;
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

.footer-section h4 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
  position: relative;
  padding-bottom: 10px;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background-color: #409EFF;
  transition: width 0.3s ease;
}

.footer-section:hover h4::after {
  width: 50px;
}

.footer-section p {
  color: #606266;
  margin: 0;
  display: flex;
  align-items: center;
}

.footer-section p i {
  margin-right: 10px;
  color: #409EFF;
}

.footer-section a {
  color: #606266;
  text-decoration: none;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-section a:hover {
  color: #409EFF;
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-section {
    text-align: center;
    align-items: center;
  }

  .footer-section h4::after {
    left: 50%;
    transform: translateX(-50%);
  }

  .footer-section a:hover {
    transform: translateX(0) scale(1.05);
  }
}
</style>
