<template>
  <el-footer class="footer">
    <div class="footer-divider"></div>
    <div class="footer-content">
      <div class="footer-section">
        <h4>图书馆</h4>
        <p>新加坡南洋理工大学</p>
        <p>© 2024 Library System. All rights reserved.</p>
      </div>
      <div class="footer-section">
        <h4>快速链接</h4>
        <router-link to="/about">关于我们</router-link>
        <router-link to="/help">帮助中心</router-link>
        <router-link to="/books">馆藏资源</router-link>
      </div>
      <div class="footer-section">
        <h4>联系我们</h4>
        <p>电话：+65 1234 5678</p>
        <p>邮箱：library@example.com</p>
      </div>
    </div>
  </el-footer>
</template>

<style scoped>
.footer {
  padding: 40px 20px;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  color: #333;
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
}

.footer-section h4 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #303133;
}

.footer-section p {
  color: #606266;
  margin: 0;
}

.footer-section a {
  color: #606266;
  text-decoration: none;
  margin-bottom: 8px;
}

.footer-section a:hover {
  color: #409EFF;
}
</style> 