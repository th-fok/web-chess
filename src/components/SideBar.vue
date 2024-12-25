<template>
  <div class="sideBar" :class="{ expanded: isExpanded }">
    <button class="btn side expand-btn" @click="expandSideBar">
      <img :src="getIcon('menu-burger')" alt="Menu">
    </button>
    <div class="siders" v-for="item in sideBarItems" :key="item.id">
      <router-link :to="item.route" class="btn side">
        <img :src="item.icon" :alt="item.name">
        <span>{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isExpanded: false,
      sideBarItems: this.initializeSideBarItems(),
    };
  },
  methods: {
    getIcon(gameType) {
      const theme = this.$store.state.selectedTheme;
      return theme === 'dark' ? `/src/ico/${gameType}-dark.png` : `/src/ico/${gameType}-light.png`;
    },
    initializeSideBarItems() {
      return [
        { id: 'btn-HOME', name: 'HOME', icon: this.getIcon('home'), route: '/' },
        { id: 'btn-Find-Game', name: 'Find Game', icon: this.getIcon('find-game'), route: '/play/online' },
        { id: 'btn-Bot', name: 'Bot', icon: this.getIcon('bot'), route: '/play/computer' },
        { id: 'btn-Settings', name: 'Settings', icon: this.getIcon('settings'), route: '/settings' }
      ];
    },
    expandSideBar() {
      this.isExpanded = !this.isExpanded;
    },
    updateIcons() {
      this.sideBarItems.forEach(item => {
        item.icon = this.getIcon(item.name.toLowerCase().replace(' ', '-'));
      });
    }
  },
  watch: {
    '$store.state.selectedTheme': function() {
      this.updateIcons();
    }
  },
}
</script>

<style scoped>
.sideBar {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 40px;
  height: 50vh; /* Фиксированная высота для SideBar */
  border-radius: 20px;
  border-right: 2px solid #ddd;
  border-top: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
  transition: width 0.5s;
}

.sideBar.expanded {
  width: 200px;
  transition: width 0.5s;
}

.sideBar:not(.expanded) {
  width: 40px; /* Минимальная ширина при закрытии */
}

.sideBar :last-child {
  margin-top: auto;
}

.sideBar :first-child {
  margin-bottom: auto;
}

.siders {
  width: 40px;
  height: 40px;
  margin: 12.5px 0 12.5px 0;
}

@keyframes expand {
  0% {
    width: 40px;
  };
  100% {
    width: 180px;
  }
}

.sideBar.expanded .btn.side:not(.expand-btn) {
  width: 180px;
  animation: expand 0.5s forwards;
}

.btn.side {
  border-width: 0px;
  background-color: var(--background-color);
  transition: width 0.5s;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  position: relative; /* Для абсолютного позиционирования текста */
  overflow: visible; /* Позволяет тексту выходить за пределы кнопки */
}

.btn.side span {
  color: var(--text-color);
  background-color: transparent;
  font-size: large;
  opacity: 0; /* Начальная прозрачность для текста */
  transition: opacity 0.5s; /* Плавное изменение прозрачности */
  white-space: nowrap; /* Запрет на перенос текста */
  overflow: hidden; /* Скрыть переполнение */
  margin-left: 10px; /* Отступ от кнопки */
}

.btn.side:hover {
  background-color: var(--background-color-light)
}

.btn.side img {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  background-color: transparent;
}

.sideBar.expanded .btn.side span {
  animation: fadeIn 0.5s forwards; /* Появление текста при открытии */
}

.sideBar:not(.expanded) .btn.side span {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 1080px) {
  .sideBar {
    z-index: 10;
  }
}

@media (max-width: 768px) {
  .sideBar {
    width: 50px; /* Smaller width for mobile */
    height: auto; /* Allow height to adjust */
  }

  .sideBar.expanded {
    width: 100%; /* Full width when expanded */
    height: auto; /* Allow height to adjust */
  }

  .btn.side span {
    display: none; /* Hide text in mobile view */
  }

  .sideBar.expanded .btn.side span {
    display: block; /* Show text when expanded */
  }
}
</style>