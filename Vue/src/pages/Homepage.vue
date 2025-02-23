<template>
  <div class="Homepage">
    <!-- Hero section -->
    <section
      data-index="0"
      class="animate-section"
      :class="{ 'is-visible': visibleSections.includes(0) }"
    >
      <div class="hero-section">
        <h1 class="hero-title">{{ $t('homepage.welcomeToTheLibrary') }}</h1>
        <p class="hero-subtitle">{{ $t('homepage.discoverKnowledge') }}</p>
        <div class="search-section">
          <el-input
            v-model="searchQuery"
            :placeholder="inputPlaceholder"
            class="search-input"
            @keyup.enter="searchBooks"
            clearable
            @clear="clearSearch"
          >
            <template #append>
              <div class="filter-and-button-wrapper">
                <el-select
                  v-model="selectedFilter"
                  placeholder="Filter by"
                  class="filter-select"
                  @change="updatePlaceholder"
                >
                  <el-option :label="$t('book.title')" value="title" />
                  <el-option :label="$t('book.author')" value="author" />
                  <el-option :label="$t('book.isbn')" value="isbn" />
                </el-select>
                <el-button @click="searchBooks" class="search-button">
                  <el-icon class="search-icon">
                    <Search />
                  </el-icon>
                </el-button>
              </div>
            </template>
          </el-input>
        </div>
      </div>
    </section>

    <!-- Recent events -->
    <section
        data-index="1"
        class="animate-section"
        :class="{ 'is-visible': visibleSections.includes(1) }"
    >
      <div class="recent-events">
        <h2 class="section-title">{{ $t('homepage.recentEvents') }}</h2>
        <el-carousel :interval="4000" type="card" height="300px" :autoplay="true" arrow="always">
          <el-carousel-item v-for="event in recentEvents" :key="event.id">
            <div class="event-card" @click="openEventDialog(event)">
              <img :src="event.image" :alt="event.title" class="event-image">
              <div class="event-content">
                <h3 class="event-title">{{ event.title }}</h3>
                <p class="event-description">{{ event.description }}</p>
                <span class="event-date">{{ event.date }}</span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </section>

    <!-- Popular books -->
    <section
        data-index="2"
        class="animate-section"
        :class="{ 'is-visible': visibleSections.includes(2) }"
    >
      <div class="book-section">
        <h2 class="section-title">{{ $t('homepage.popularBooks') }}</h2>
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
                  <el-rate v-model="book.rating" disabled show-score/>
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
    </section>

    <!-- New arrivals -->
    <section
        data-index="3"
        class="animate-section"
        :class="{ 'is-visible': visibleSections.includes(3) }"
    >
      <div class="book-section">
        <h2 class="section-title">{{ $t('homepage.newArrivals') }}</h2>
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
                  <el-rate v-model="book.rating" disabled show-score/>
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
    </section>

    <!-- Recommended for you -->
    <section
        data-index="4"
        class="animate-section"
        :class="{ 'is-visible': visibleSections.includes(4) }"
    >
      <div class="book-section">
        <h2 class="section-title">{{ $t('homepage.recommendedForYou') }}</h2>
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
                  <el-rate v-model="book.rating" disabled show-score/>
                </div>
              </div>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
    </section>

    <!-- Event Details Dialog -->
    <el-dialog
      v-model="eventDialogVisible"
      :title="selectedEvent.title"
      width="50%"
      class="event-dialog"
    >
      <div class="event-dialog-content">
        <img :src="selectedEvent.image" class="event-dialog-image" alt="Event Image"/>
        <p><strong>Date:</strong> {{ selectedEvent.date }}</p>
        <p><strong>Description:</strong> {{ selectedEvent.description }}</p>
      </div>
      <template #footer>
        <el-button @click="eventDialogVisible = false">{{ $t('common.close') }}</el-button>
      </template>
    </el-dialog>
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
      visibleSections: [],
      observer: null,
      sections: 5,
      searchQuery: '',
      selectedFilter: 'title',
      inputPlaceholder: this.$t('search.searchBooks'),
      searchFieldMap: {
        title: ['title'],
        author: ['author'],
        isbn: ['isbn']
      },
      recentEvents: [
        {
          id: 1,
          title: "Book Sharing: 'Introduction to Algorithms'",
          description: "This Saturday at 2 PM, we will host a book sharing event for Thomas H. Cormen's 'Introduction to Algorithms'. Join us to explore the fundamentals of algorithms and data structures.",
          date: "2025-03-23",
          image: "https://th.bing.com/th/id/OIP.L4zAEMAUAMRYfzS1RxDw_wAAAA?rs=1&pid=ImgDetMain"
        },
        {
          id: 2,
          title: "Children's Coding Workshop",
          description: "Every Sunday at 10 AM, join us for a coding workshop designed for children. Learn the basics of programming in a fun and interactive environment.",
          date: "2025-03-24",
          image: "https://th.bing.com/th/id/OIP.MROTK3JQC-vSgQO2l5EZXAAAAA?rs=1&pid=ImgDetMain"
        },
        {
          id: 3,
          title: "Author Meet and Greet: 'Clean Code'",
          description: "A discussion on Robert C. Martin's 'Clean Code'. Explore principles of writing maintainable and readable code.",
          date: "2025-03-30",
          image: "https://th.bing.com/th/id/OIP.pbmYQaK93LlRoo1xKMPl4AAAAA?rs=1&pid=ImgDetMain"
        },
        {
          id: 4,
          title: "Technology Lecture: 'Artificial Intelligence'",
          description: "Special lecture on Stuart Russell and Peter Norvig's 'Artificial Intelligence: A Modern Approach'. Dive into the future of AI and its applications.",
          date: "2025-04-05",
          image: "https://th.bing.com/th/id/OIP.TbC8N4t5N_yZRm8RJ-ck_wAAAA?rs=1&pid=ImgDetMain"
        }
      ],
      popularBooks: [
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
      newBooks: [
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
      eventDialogVisible: false,
      selectedEvent: {}
    };
  },
  created() {
    this.fetchBooks();
  },
  mounted() {
    this.setupIntersectionObserver();
  },
  methods: {
    clearSearch() {
    this.searchQuery = '';
    },
    updatePlaceholder() {
      switch (this.selectedFilter) {
        case 'title':
          this.inputPlaceholder = this.$t('search.searchByTitle');
          break;
        case 'author':
          this.inputPlaceholder = this.$t('search.searchByAuthor');
          break;
        case 'isbn':
          this.inputPlaceholder = this.$t('search.searchByISBN');
          break;
        default:
          this.inputPlaceholder = this.$t('search.searchBooks');
      }
    },
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
    },
    openEventDialog(event) {
      this.selectedEvent = event;
      this.eventDialogVisible = true;
    },
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            if (!this.visibleSections.includes(index)) {
              this.visibleSections.push(index);
            }
          }
        });
      }, {
        rootMargin: '0px',
        threshold: 0.1,
      });

      document.querySelectorAll('.animate-section').forEach((section) => {
        this.observer.observe(section);
      });
    }
  },
  computed: {
    filteredPopularBooks() {
      return this.popularBooks.filter(book => {
        const searchFields = this.searchFieldMap[this.selectedFilter] || ['title'];
        return this.searchQuery === '' ||
          searchFields.some(field =>
            String(book[field]).toLowerCase()
          .includes(this.searchQuery.toLowerCase()));
      });
    },
    filteredNewBooks() {
      return this.newBooks.filter(book => {
        const searchFields = this.searchFieldMap[this.selectedFilter] || ['title'];
        return this.searchQuery === '' ||
          searchFields.some(field =>
            String(book[field]).toLowerCase()
          .includes(this.searchQuery.toLowerCase()));
      });
    },
    filteredRecommendedBooks() {
      return this.recommendedBooks.filter(book => {
        const searchFields = this.searchFieldMap[this.selectedFilter] || ['title'];
        return this.searchQuery === '' ||
          searchFields.some(field =>
            String(book[field]).toLowerCase()
          .includes(this.searchQuery.toLowerCase()));
      });
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
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn.thespaces.com/wp-content/uploads/2023/03/Bibliothe-que-nationale-de-france_HERO.jpg');
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
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.filter-select {
  width: 120px;
  margin-right: 16px;
}

.search-input {
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
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
  position: absolute;
  right: 14px;
  top: 15px;
  transform: translateY(-50%);
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

.search-button:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-50%) scale(1.05);
}

.search-icon {
  margin-left: 0px;
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

:deep(.el-carousel__container) {
  height: 340px !important;
}

:deep(.el-carousel-item) {
  overflow: visible !important;
  transform-origin: center center;
  transition: transform 0.3s ease;
}

.event-card {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transform-origin: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  clip-path: inset(0 round 15px);
  border-radius: 15px;
}

.event-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  clip-path: inset(0 round 15px);
  border-radius: 15px;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

:deep(.el-carousel__arrow--left, .el-carousel__arrow--right) {
  color: white;
}

.event-content {
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
}

.event-description {
  font-size: 14px;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: white;
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
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  min-height: 120px;
}

.book-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.book-author {
  font-size: 14px;
  color: #7f8c8d;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: auto;
}

.book-rating {
  display: flex;
  justify-content: center;
  margin-top: 10px;
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
  .el-dialog {
    width: 90%;
  }

  .event-dialog-content {
    padding: 15px;
  }

  .event-dialog-image {
    margin-bottom: 15px;
  }

  .el-button {
    padding: 8px 15px;
    font-size: 14px;
  }
}

.event-dialog-image {
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-dialog-content {
  text-align: left;
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.el-dialog__title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.event-date {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}


.el-button {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #2563eb;
}

.animate-section {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Animation delay for different sections */
.animate-section[data-index="0"].is-visible { transition-delay: 0.2s; }
.animate-section[data-index="1"].is-visible { transition-delay: 0.4s; }
.animate-section[data-index="2"].is-visible { transition-delay: 0.6s; }
.animate-section[data-index="3"].is-visible { transition-delay: 0.8s; }
.animate-section[data-index="4"].is-visible { transition-delay: 1s; }
</style>