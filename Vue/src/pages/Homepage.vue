<template>
  <div class="Homepage">
    <!-- 搜索栏 -->
    <div class="hero-section">
      <h1>欢迎来到图书馆</h1>
      <p class="subtitle">发现知识的海洋</p>
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="搜索书籍、作者或关键词..."
          class="search-input"
        >
          <template #append>
            <el-button @click="searchBooks">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <el-main>
      <!-- 近期活动 -->
      <section class="recent-events">
        <h2>近期活动</h2>
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item v-for="event in recentEvents" :key="event.id">
            <div class="event-card" :style="{ backgroundImage: `url(${event.image})` }">
              <div class="event-content">
                <h3>{{ event.title }}</h3>
                <p>{{ event.description }}</p>
                <span class="event-date">{{ event.date }}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 热门书籍 -->
      <section class="popular-books">
        <div class="section-header">
          <h2>热门书籍</h2>
        </div>
        <el-scrollbar>
          <div class="books-container">
            <el-card v-for="book in popularBooks" :key="book.id" 
              :body-style="{ padding: '0px' }" 
              class="book-card" 
              @click="viewBookDetails(book.id)"
            >
              <img :src="book.cover" class="book-cover"/>
              <div class="book-info">
                <h3>{{ book.title }}</h3>
                <p>{{ book.author }}</p>
                <div class="book-rating">
                  <el-rate v-model="book.rating" disabled show-score />
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </section>

      <!-- 为你推荐 -->
      <section class="recommended-books">
        <div class="section-header">
          <h2>为你推荐</h2>
        </div>
        <el-scrollbar>
          <div class="books-container">
            <el-card v-for="book in recommendedBooks" :key="book.id" 
              :body-style="{ padding: '0px' }" 
              class="book-card" 
              @click="viewBookDetails(book.id)"
            >
              <img :src="book.cover" class="book-cover"/>
              <div class="book-info">
                <h3>{{ book.title }}</h3>
                <p>{{ book.author }}</p>
                <div class="book-rating">
                  <el-rate v-model="book.rating" disabled show-score />
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </section>

      <!-- 新书上架 -->
      <section class="new-books">
        <div class="section-header">
          <h2>新书上架</h2>
        </div>
        <el-scrollbar>
          <div class="books-container">
            <el-card v-for="book in newBooks" :key="book.id" 
              :body-style="{ padding: '0px' }" 
              class="book-card" 
              @click="viewBookDetails(book.id)"
            >
              <img :src="book.cover" class="book-cover"/>
              <div class="book-info">
                <h3>{{ book.title }}</h3>
                <p>{{ book.author }}</p>
                <div class="book-rating">
                  <el-rate v-model="book.rating" disabled show-score />
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </section>
    </el-main>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue'
import BookRecommendations from '@/components/BookRecommendations.vue'

export default {
  name: "Homepage",
  components: {
    Search,
    BookRecommendations
  },
  data() {
    return {
      searchQuery: '',
      recentEvents: [
        {
          id: 1,
          title: "读书分享会：《百年孤独》",
          description: "本周六下午2点，我们将举办加西亚·马尔克斯《百年孤独》读书分享会...",
          date: "2024-03-23",
          image: "/events/event1.jpg"
        },
        {
          id: 2,
          title: "儿童故事会",
          description: "每周日上午10点，带领孩子们一起探索故事的世界...",
          date: "2024-03-24",
          image: "/events/event2.jpg"
        },
        {
          id: 3,
          title: "作家见面会",
          description: "著名作家王小波作品研讨会，探讨《黄金时代》...",
          date: "2024-03-30",
          image: "/events/event3.jpg"
        },
        {
          id: 4,
          title: "科技讲座",
          description: "人工智能与未来图书馆发展专题讲座...",
          date: "2024-04-05",
          image: "/events/event4.jpg"
        }
      ],
      popularBooks: [
        {
          id: 1,
          title: "三体",
          author: "刘慈欣",
          cover: "/book-covers/1.jpg",
          rating: 4.8
        },
        {
          id: 2,
          title: "百年孤独",
          author: "加西亚·马尔克斯",
          cover: "/book-covers/2.jpg",
          rating: 4.9
        },
        {
          id: 3,
          title: "人类简史",
          author: "尤瓦尔·赫拉利",
          cover: "/book-covers/3.jpg",
          rating: 4.7
        },
        {
          id: 4,
          title: "活着",
          author: "余华",
          cover: "/book-covers/4.jpg",
          rating: 4.9
        },
        {
          id: 5,
          title: "1984",
          author: "乔治·奥威尔",
          cover: "/book-covers/5.jpg",
          rating: 4.8
        },
        {
          id: 6,
          title: "动物农场",
          author: "乔治·奥威尔",
          cover: "/book-covers/6.jpg",
          rating: 4.7
        },
        {
          id: 7,
          title: "围城",
          author: "钱钟书",
          cover: "/book-covers/7.jpg",
          rating: 4.8
        }
      ],
      recommendedBooks: [
        {
          id: 1,
          title: "三体",
          author: "刘慈欣",
          cover: "/book-covers/1.jpg",
          rating: 4.8
        },
        {
          id: 2,
          title: "百年孤独",
          author: "加西亚·马尔克斯",
          cover: "/book-covers/2.jpg",
          rating: 4.9
        },
        {
          id: 3,
          title: "人类简史",
          author: "尤瓦尔·赫拉利",
          cover: "/book-covers/3.jpg",
          rating: 4.7
        },
        {
          id: 4,
          title: "活着",
          author: "余华",
          cover: "/book-covers/4.jpg",
          rating: 4.9
        },
        {
          id: 5,
          title: "1984",
          author: "乔治·奥威尔",
          cover: "/book-covers/5.jpg",
          rating: 4.8
        },
        {
          id: 6,
          title: "动物农场",
          author: "乔治·奥威尔",
          cover: "/book-covers/6.jpg",
          rating: 4.7
        },
        {
          id: 7,
          title: "围城",
          author: "钱钟书",
          cover: "/book-covers/7.jpg",
          rating: 4.8
        }
      ],
      newBooks: [
        {
          id: 1,
          title: "三体",
          author: "刘慈欣",
          cover: "/book-covers/1.jpg",
          rating: 4.8
        },
        {
          id: 2,
          title: "百年孤独",
          author: "加西亚·马尔克斯",
          cover: "/book-covers/2.jpg",
          rating: 4.9
        },
        {
          id: 3,
          title: "人类简史",
          author: "尤瓦尔·赫拉利",
          cover: "/book-covers/3.jpg",
          rating: 4.7
        },
        {
          id: 4,
          title: "活着",
          author: "余华",
          cover: "/book-covers/4.jpg",
          rating: 4.9
        },
        {
          id: 5,
          title: "1984",
          author: "乔治·奥威尔",
          cover: "/book-covers/5.jpg",
          rating: 4.8
        },
        {
          id: 6,
          title: "动物农场",
          author: "乔治·奥威尔",
          cover: "/book-covers/6.jpg",
          rating: 4.7
        },
        {
          id: 7,
          title: "围城",
          author: "钱钟书",
          cover: "/book-covers/7.jpg",
          rating: 4.8
        }
      ]
    };
  },
  methods: {
    searchBooks() {
      // 实现搜索功能
      console.log('搜索:', this.searchQuery);
      // 跳转到搜索结果页面
      this.$router.push({
        path: '/books',
        query: { search: this.searchQuery }
      });
    },
    viewBookDetails(bookId) {
      // 跳转到书籍详情页
      this.$router.push(`/book/${bookId}`);
    }
  }
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.Homepage {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

header {
  background-color: #004d40;
  color: white;
  padding: 15px 0;
}

header h1 {
  margin: 0;
}

nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
}

nav ul li {
  display: inline;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

footer {
  background-color: #f1f1f1;
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/library-bg.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 20px;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 24px;
  margin-bottom: 40px;
}

.search-section {
  max-width: 800px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-all {
  color: #409EFF;
  text-decoration: none;
}

.event-card {
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  position: relative;
}

.event-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  border-radius: 0 0 8px 8px;
}

.book-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  aspect-ratio: 37/52; /* 设置图片比例 */
  object-fit: cover;
}

.book-info {
  padding: 15px;
}

.book-info h3 {
  margin: 0;
  font-size: 16px;
}

.book-info p {
  color: #666;
  margin: 5px 0;
}

.event-date {
  color: #666;
  font-size: 14px;
}

.books-container {
  display: flex;
  gap: 20px;
  padding: 20px 0;
}

.book-card {
  flex: 0 0 200px;
  margin-bottom: 0;
}
</style>