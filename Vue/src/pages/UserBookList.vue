<template>
  <div class="user-booklist">
    <el-tabs v-model="activeTab" class="list-tabs">
      <el-tab-pane label="当前借阅" name="current">
        <el-table :data="currentBorrows" style="width: 100%">
          <el-table-column prop="title" label="书名" />
          <el-table-column prop="author" label="作者" />
          <el-table-column prop="borrowDate" label="借阅日期" />
          <el-table-column prop="dueDate" label="应还日期" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small" 
                @click="renewBook(scope.row.id)"
                :disabled="scope.row.renewCount >= 2"
              >
                续借
              </el-button>
              <el-button 
                type="success" 
                size="small" 
                @click="returnBook(scope.row.id)"
              >
                还书
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="借阅历史" name="history">
        <el-table :data="borrowHistory" style="width: 100%">
          <el-table-column prop="title" label="书名" />
          <el-table-column prop="author" label="作者" />
          <el-table-column prop="borrowDate" label="借阅日期" />
          <el-table-column prop="returnDate" label="归还日期" />
          <el-table-column label="操作">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small" 
                @click="viewBookDetails(scope.row.id)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="我的书单" name="wishlist">
        <div class="wishlist-header">
          <el-input
            v-model="newListName"
            placeholder="输入书单名称"
            style="width: 200px"
          />
          <el-button type="primary" @click="createNewList">
            创建新书单
          </el-button>
        </div>

        <el-collapse v-model="activeWishlist">
          <el-collapse-item 
            v-for="list in wishlists" 
            :key="list.id" 
            :title="list.name"
            :name="list.id"
          >
            <template #extra>
              <el-button 
                type="danger" 
                size="small" 
                @click.stop="deleteList(list.id)"
              >
                删除书单
              </el-button>
            </template>

            <el-table :data="list.books" style="width: 100%">
              <el-table-column prop="title" label="书名" />
              <el-table-column prop="author" label="作者" />
              <el-table-column prop="addDate" label="添加日期" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="viewBookDetails(scope.row.id)"
                  >
                    查看详情
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="removeFromList(list.id, scope.row.id)"
                  >
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'UserBookList',
  data() {
    return {
      activeTab: 'current',
      activeWishlist: ['1'],
      newListName: '',
      currentBorrows: [
        {
          id: 1,
          title: '三体',
          author: '刘慈欣',
          borrowDate: '2024-03-01',
          dueDate: '2024-04-01',
          renewCount: 0
        }
      ],
      borrowHistory: [
        {
          id: 2,
          title: '百年孤独',
          author: '加西亚·马尔克斯',
          borrowDate: '2024-01-01',
          returnDate: '2024-02-01'
        }
      ],
      wishlists: [
        {
          id: '1',
          name: '想读的书',
          books: [
            {
              id: 3,
              title: '球状闪电',
              author: '刘慈欣',
              addDate: '2024-03-15'
            }
          ]
        }
      ]
    }
  },
  methods: {
    async renewBook(bookId) {
      try {
        // 调用续借API
        // await renewBookApi(bookId)
        ElMessage.success('续借成功！')
        // 更新续借次数
        const book = this.currentBorrows.find(b => b.id === bookId)
        if (book) {
          book.renewCount++
          book.dueDate = this.calculateNewDueDate(book.dueDate)
        }
      } catch (error) {
        ElMessage.error('续借失败，请稍后重试')
      }
    },
    async returnBook(bookId) {
      try {
        // 调用还书API
        // await returnBookApi(bookId)
        ElMessage.success('还书成功！')
        // 更新借阅列表
        this.currentBorrows = this.currentBorrows.filter(b => b.id !== bookId)
      } catch (error) {
        ElMessage.error('还书失败，请稍后重试')
      }
    },
    viewBookDetails(bookId) {
      this.$router.push(`/book/${bookId}`)
    },
    async createNewList() {
      if (!this.newListName.trim()) {
        ElMessage.warning('请输入书单名称')
        return
      }
      try {
        // 调用创建书单API
        // const newList = await createWishlistApi(this.newListName)
        const newList = {
          id: String(this.wishlists.length + 1),
          name: this.newListName,
          books: []
        }
        this.wishlists.push(newList)
        this.newListName = ''
        ElMessage.success('创建成功！')
      } catch (error) {
        ElMessage.error('创建失败，请稍后重试')
      }
    },
    async deleteList(listId) {
      try {
        await ElMessageBox.confirm(
          '确定要删除这个书单吗？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        // 调用删除书单API
        // await deleteWishlistApi(listId)
        this.wishlists = this.wishlists.filter(list => list.id !== listId)
        ElMessage.success('删除成功！')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败，请稍后重试')
        }
      }
    },
    async removeFromList(listId, bookId) {
      try {
        // 调用从书单移除图书API
        // await removeFromWishlistApi(listId, bookId)
        const list = this.wishlists.find(l => l.id === listId)
        if (list) {
          list.books = list.books.filter(b => b.id !== bookId)
        }
        ElMessage.success('移除成功！')
      } catch (error) {
        ElMessage.error('移除失败，请稍后重试')
      }
    },
    calculateNewDueDate(currentDueDate) {
      // 简单的日期计算，实际应该根据图书馆政策来定
      const date = new Date(currentDueDate)
      date.setDate(date.getDate() + 30)
      return date.toISOString().split('T')[0]
    }
  }
}
</script>

<style scoped>
.user-booklist {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.list-tabs {
  margin-bottom: 20px;
}

.wishlist-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.el-collapse-item :deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
}

.el-table {
  margin-top: 10px;
}
</style> 