<template>
  <div class="book-recommendations">
    <h3>{{ title }}</h3>

    <el-row :gutter="20">
      <el-col
        :span="6"
        v-for="book in recommendations"
        :key="book.id"
      >
        <el-card
          :body-style="{ padding: '0px' }"
          class="book-card"
          @click="viewBookDetails(book.id)"
        >
          <img :src="book.cover" class="book-cover"/>
          <div class="book-info">
            <h4>{{ book.title }}</h4>
            <p class="author">{{ book.author }}</p>
            <div class="rating">
              <el-rate
                v-model="book.rating"
                disabled
                :size="12"
              />
              <span class="rating-score">{{ book.rating }}</span>
            </div>
            <p class="reason" v-if="book.reason">
              {{ book.reason }}
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BookRecommendations',
  props: {
    title: {
      type: String,
      default: 'Recommended Books'
    },
    type: {
      type: String,
      default: 'similar', // similar, popular, personalized
      validator: value => ['similar', 'popular', 'personalized'].includes(value)
    },
    bookId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      recommendations: [
        {
          id: 1,
          title: 'The Three-Body Problem',
          author: 'Cixin Liu',
          cover: '/book-covers/1.jpg',
          rating: 4.5,
          reason: 'Similar to the sci-fi novels you like'
        }
        // More recommended books...
      ]
    }
  },
  methods: {
    viewBookDetails(bookId) {
      this.$router.push(`/book/${bookId}`)
    },
    async fetchRecommendations() {
      try {
        // Call different recommendation APIs based on type
        switch (this.type) {
          case 'similar':
            // await getSimilarBooksApi(this.bookId)
            break
          case 'popular':
            // await getPopularBooksApi()
            break
          case 'personalized':
            // await getPersonalizedBooksApi()
            break
        }
      } catch (error) {
        console.error('Failed to fetch recommended books:', error)
      }
    }
  },
  created() {
    this.fetchRecommendations()
  }
}
</script>

<style scoped>
.book-recommendations {
  margin: 20px 0;
}

.book-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.book-info {
  padding: 14px;
}

.book-info h4 {
  margin: 0;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.author {
  font-size: 12px;
  color: #606266;
  margin: 5px 0;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
}

.rating-score {
  font-size: 12px;
  color: #ff9900;
}

.reason {
  font-size: 12px;
  color: #909399;
  margin: 5px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>