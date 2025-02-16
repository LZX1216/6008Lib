<template>
  <div class="Homepage">
    <div class="hero-section">
      <h1 class="hero-title">Welcome to the Library</h1>
      <p class="hero-subtitle">Discover an Ocean of Knowledge</p>
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search for books, authors, or keywords..."
          class="search-input"
        >
          <template #append>
            <el-button @click="searchBooks" class="search-button">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <el-main>
      <!-- Recent events -->
      <section class="recent-events">
        <h2 class="section-title">Recent Events</h2>
        <el-carousel :interval="4000" type="card" height="300px" :autoplay="true" arrow="always">
          <el-carousel-item v-for="event in recentEvents" :key="event.id">
            <div class="event-card">
              <img :src="event.image" :alt="event.title" class="event-image">
              <div class="event-content">
                <h3 class="event-title">{{ event.title }}</h3>
                <p class="event-description">{{ event.description }}</p>
                <span class="event-date">{{ event.date }}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- Popular books -->
      <section class="book-section">
        <h2 class="section-title">Popular books</h2>
        <el-scrollbar>
          <div class="books-container">
            <el-card v-for="book in popularBooks" :key="book.id"
              :body-style="{ padding: '0px' }"
              class="book-card"
              @click="viewBookDetails(book.id)"
            >
              <div class="book-cover-container">
                <img :src="book.cover" class="book-cover" loading="lazy"/>
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                <div class="book-rating">
                  <el-rate v-model="book.rating" disabled show-score />
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </section>

      <!-- New arrivals -->
      <section class="book-section">
        <h2 class="section-title">New arrivals</h2>
        <el-scrollbar>
          <div class="books-container">
            <el-card v-for="book in newBooks" :key="book.id"
              :body-style="{ padding: '0px' }"
              class="book-card"
              @click="viewBookDetails(book.id)"
            >
              <div class="book-cover-container">
                <img :src="book.cover" class="book-cover" loading="lazy"/>
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                <div class="book-rating">
                  <el-rate v-model="book.rating" disabled show-score />
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </section>

      <!-- Recommended for you -->
      <section class="book-section">
        <h2 class="section-title">Recommended for you</h2>
        <el-scrollbar>
          <div class="books-container">
            <el-card v-for="book in recommendedBooks" :key="book.id"
              :body-style="{ padding: '0px' }"
              class="book-card"
              @click="viewBookDetails(book.id)"
            >
              <div class="book-cover-container">
                <img :src="book.cover" class="book-cover" loading="lazy"/>
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
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
          image: "https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg"
        },
        {
          id: 2,
          title: "Children's Story Time",
          description: "Every Sunday at 10 AM, join us to explore the world of stories with your children...",
          date: "2024-03-24",
          image: "https://images.pexels.com/photos/2177482/pexels-photo-2177482.jpeg"
        },
        {
          id: 3,
          title: "Author Meet and Greet",
          description: "A discussion on famous author Wang Xiaobo's works, exploring 'The Golden Age'...",
          date: "2024-03-30",
          image: "https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg"
        },
        {
          id: 4,
          title: "Technology Lecture",
          description: "Special lecture on Artificial Intelligence and the Future Development of Libraries...",
          date: "2024-04-05",
          image: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg"
        }
      ],
      popularBooks: [],
      recommendedBooks: [
        {
          id: 1,
          title: "Introduction to Algorithms",
          author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
          cover: "https://m.media-amazon.com/images/I/61Mw06x2XcL._AC_UL320_.jpg",
          rating: 4.5
        },
        {
          id: 2,
          title: "Artificial Intelligence: A Modern Approach",
          author: "Stuart Russell, Peter Norvig",
          cover: "https://m.media-amazon.com/images/I/81CDIGTNNFL._AC_UL320_.jpg",
          rating: 4.6
        },
        {
          id: 3,
          title: "Computer Networks",
          author: "Andrew S. Tanenbaum, David J. Wetherall",
          cover: "https://m.media-amazon.com/images/I/71pIJGRBg7L._AC_UL320_.jpg",
          rating: 4.4
        },
        {
          id: 4,
          title: "Database System Concepts",
          author: "Abraham Silberschatz, Henry F. Korth, S. Sudarshan",
          cover: "https://m.media-amazon.com/images/I/81B3Cv13cYL._AC_UL320_.jpg",
          rating: 4.3
        },
        {
          id: 5,
          title: "Operating System Concepts",
          author: "Abraham Silberschatz, Peter B. Galvin, Greg Gagne",
          cover: "https://m.media-amazon.com/images/I/81SwKCia7VL._AC_UL320_.jpg",
          rating: 4.5
        },
        {
          id: 6,
          title: "Compilers: Principles, Techniques, and Tools",
          author: "Alfred V. Aho, Monica S. Lam, Ravi Sethi, Jeffrey D. Ullman",
          cover: "https://m.media-amazon.com/images/I/71MvtEJneKL._AC_UL320_.jpg",
          rating: 4.4
        },
        {
          id: 7,
          title: "Computer Architecture: A Quantitative Approach",
          author: "John L. Hennessy, David A. Patterson",
          cover: "https://m.media-amazon.com/images/I/71zrCDfb73S._AC_UL320_.jpg",
          rating: 4.7
        },
        {
          id: 8,
          title: "The Elements of Computing Systems: Building a Modern Computer from First Principles",
          author: "Noam Nisan, Shimon Schocken",
          cover: "https://m.media-amazon.com/images/I/71tRTKR3NOL._AC_UL320_.jpg",
          rating: 4.6
        },
        {
          id: 9,
          title: "Clean Code: A Handbook of Agile Software Craftsmanship",
          author: "Robert C. Martin",
          cover: "https://m.media-amazon.com/images/I/51E2055ZGUL._AC_UL320_.jpg",
          rating: 4.7
        },
        {
          id: 10,
          title: "Design Patterns: Elements of Reusable Object-Oriented Software",
          author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
          cover: "https://m.media-amazon.com/images/I/81IGFC6oFmL._AC_UL320_.jpg",
          rating: 4.6
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
  overflow-x: hidden;
}

.Homepage {
  font-family: Arial, sans-serif;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1200px;
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

.main-content {
  display: grid;
  gap: 40px;
}

.section {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

footer {
  background-color: #f1f1f1;
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  max-width: 1200px;
  margin: 30px auto 0;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg');
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 20px;
  border-radius: 15px;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 24px;
  margin-bottom: 40px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.search-section {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-input:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

.search-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.9);
}

.search-button {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
  font-size: 18px;
  padding: 12px 20px;
  transition: all 0.3s ease;
}

.search-button:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-2px);
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2c3e50;
  text-align: center;
}

.recent-events {
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2c3e50;
  text-align: center;
}

.recent-events {
  margin-bottom: 40px;
}

.event-card {
  height: 100%;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-content {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.event-description {
  font-size: 14px;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.event-date {
  font-size: 12px;
  font-style: italic;
}

.book-section {
  margin-bottom: 40px;
}

.books-container {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.book-card {
  flex: 0 0 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
}

.book-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.book-cover-container {
  height: 280px;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.05);
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #2c3e50;
}

.book-author {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.book-rating {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .books-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 15px;
  }

  .section {
    padding: 20px;
  }

  .books-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
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

.hero-section {
  animation: fadeIn 1s ease-out;
}

.hero-title {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-subtitle {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.search-section {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.recent-events {
  animation: fadeInUp 0.8s ease-out 0.8s both;
}

.book-section {
  animation: fadeInUp 0.8s ease-out;
}

.book-section:nth-child(1) {
  animation-delay: 1s;
}

.book-section:nth-child(2) {
  animation-delay: 1.2s;
}

.book-section:nth-child(3) {
  animation-delay: 1.4s;
}

.book-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.event-card {
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: scale(1.03);
}

@media (max-width: 768px) {
  .hero-section,
  .hero-title,
  .hero-subtitle,
  .search-section,
  .recent-events,
  .book-section {
    animation-name: fadeIn;
    animation-duration: 0.5s;
  }
}
</style>