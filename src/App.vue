<template>
  <div id="app" class="app-grid" :class="{ 'dark-theme': isDarkTheme, 'visually-impaired': isVisuallyImpairedMode }">
    <Header />
    <div class="content">
      <div style="width: 250px;">
        <SideBar />
      </div>
      <div class="router-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>

.app-grid {
  display: grid;
  grid-template-rows: auto 1fr; /* Заголовок занимает авто-высоту, остальное пространство - 1fr */
  height: 100vh; /* Высота на весь экран */
  background-color: var(--background-color); /* Используем переменную для фона */
  color: var(--text-color); /* Используем переменную для текста */
}

.app-grid * {
  user-select: none
}

.content {
  display: grid;
  grid-template-columns: auto 1fr; /* Фиксированная ширина для SideBar и оставшееся пространство для router-view */
  background-color: var(--background-color); /* Используем переменную для светлого фона */
}

.router-container {
  overflow-y: auto; /* Добавляет прокрутку, если контент превышает высоту */
}

/* Медиазапросы для адаптивности */
@media (max-width: 1080px) {
  .content {
    grid-template-columns: auto 1fr; /* На маленьких экранах SideBar занимает всю ширину */
  }
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr; /* На маленьких экранах SideBar занимает всю ширину */
  }
}

@media (max-width: 480px) {
  body {
    font-size: medium; /* Уменьшаем размер шрифта на очень маленьких экранах */
  }
}
</style>

<script>
import Header from './components/Header.vue';
import SideBar from './components/SideBar.vue';

export default {
  name: 'App',
  components: {
    Header,
    SideBar,
  },
  computed: {
    isDarkTheme() {
      return this.$store.state.selectedTheme === 'dark';
    },
    isVisuallyImpairedMode() {
      return this.$store.state.visuallyImpairedMode === true;
    },
  },
};
</script>