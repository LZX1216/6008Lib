<template>
  <div class="Homepage">
    <!-- Search bar -->
    <div class="hero-section">
      <h1>Welcome to the Library</h1>
      <p class="subtitle">Discover an Ocean of Knowledge</p>
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search for books, authors, or keywords..."
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
      <!-- Recent events -->
      <section class="recent-events">
        <h2>Recent Events</h2>
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

      <!-- Popular books -->
      <section class="popular-books">
        <div class="section-header">
          <h2>Popular Books</h2>
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

      <!-- Recommended for you -->
      <section class="recommended-books">
        <div class="section-header">
          <h2>Recommended for You</h2>
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

      <!-- New arrivals -->
      <section class="new-books">
        <div class="section-header">
          <h2>New Arrivals</h2>
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
import axios from 'axios'

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
          title: "Book Sharing: 'One Hundred Years of Solitude'",
          description: "This Saturday at 2 PM, we will host a book sharing event for Gabriel García Márquez's 'One Hundred Years of Solitude'...",
          date: "2024-03-23",
          image: "/events/event1.jpg"
        },
        {
          id: 2,
          title: "Children's Story Time",
          description: "Every Sunday at 10 AM, join us to explore the world of stories with your children...",
          date: "2024-03-24",
          image: "/events/event2.jpg"
        },
        {
          id: 3,
          title: "Author Meet and Greet",
          description: "A discussion on famous author Wang Xiaobo's works, exploring 'The Golden Age'...",
          date: "2024-03-30",
          image: "/events/event3.jpg"
        },
        {
          id: 4,
          title: "Technology Lecture",
          description: "Special lecture on Artificial Intelligence and the Future Development of Libraries...",
          date: "2024-04-05",
          image: "/events/event4.jpg"
        }
      ],
      popularBooks: [],
      recommendedBooks: [
        {
          id: 1,
          title: "The Three-Body Problem",
          author: "Cixin Liu",
          cover: "/book-covers/1.jpg",
          rating: 4.8
        },
        {
          id: 2,
          title: "One Hundred Years of Solitude",
          author: "Gabriel García Márquez",
          cover: "/book-covers/2.jpg",
          rating: 4.9
        },
        {
          id: 3,
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          cover: "/book-covers/3.jpg",
          rating: 4.7
        },
        {
          id: 4,
          title: "To Live",
          author: "Yu Hua",
          cover: "/book-covers/4.jpg",
          rating: 4.9
        },
        {
          id: 5,
          title: "1984",
          author: "George Orwell",
          cover: "/book-covers/5.jpg",
          rating: 4.8
        },
        {
          id: 6,
          title: "Animal Farm",
          author: "George Orwell",
          cover: "/book-covers/6.jpg",
          rating: 4.7
        },
        {
          id: 7,
          title: "Fortress Besieged",
          author: "Qian Zhongshu",
          cover: "/book-covers/7.jpg",
          rating: 4.8
        }
      ],
      newBooks: [],
    };
  },
  created() {
    this.fetchBooks();
  },
  methods: {
    fetchBooks() {
      // Fetch popular books
      axios.get('http://localhost:8080/api/popular-books') // Make sure this URL is correct
        .then(response => {
          this.popularBooks = response.data; // Assuming the returned data is an array of books
        })
        .catch(error => {
          console.error('Failed to fetch popular books:', error);
        });

      // Fetch new arrivals
      axios.get('http://localhost:8080/api/new-books') // Replace with the actual backend API address
        .then(response => {
          this.newBooks = response.data; // Assuming the returned data is an array of books
        })
        .catch(error => {
          console.error('Failed to fetch new arrivals:', error);
        });
    },
    searchBooks() {
      // Implement search functionality
      console.log('Searching:', this.searchQuery);
      // Navigate to search results page
      this.$router.push({
        path: '/books',
        query: { search: this.searchQuery }
      });
    },
    viewBookDetails(bookId) {
      // Navigate to book details page
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
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://example.com/hero-image.jpg');
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