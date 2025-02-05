<template>
  <el-select v-model="currentLocale" class="language-select" @change="handleLanguageChange">
    <el-option
      v-for="locale in availableLocales"
      :key="locale.value"
      :label="locale.label"
      :value="locale.value"
    />
  </el-select>
</template>

<script>
import { ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export default {
  name: 'LanguageSwitch',
  components: {
    ArrowDown
  },
  setup() {
    const i18n = useI18n()
    
    const currentLanguage = computed(() => {
      return i18n.locale.value === 'zh' ? '中文' : 'English'
    })

    const currentLocale = computed(() => i18n.locale.value)

    const availableLocales = [
      { value: 'zh', label: '中文' },
      { value: 'en', label: 'English' }
    ]

    const handleLanguageChange = (locale) => {
      i18n.locale.value = locale
      localStorage.setItem('locale', locale)
    }

    return {
      currentLanguage,
      currentLocale,
      availableLocales,
      handleLanguageChange
    }
  }
}
</script>

<style scoped>
.language-select {
  width: 100px;
}
</style> 