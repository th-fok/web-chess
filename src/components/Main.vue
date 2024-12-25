<template>
  <body>
    <div class="main-area">
      <div class="content">
        <h1 style="padding-left: 20px;">Быстрый старт</h1>
        <div class="scheduled">
          <a v-for="game in games" :key="game.id" href="" class="game-link">
            <div class="game-icon" :style="{ backgroundImage: 'url(' + game.icon + ')' }"></div>
            <h2 class="game-name" style="font-weight: bold;">{{ game.name }}
              <span class="game-time" title="">{{ game.time }}</span>
            </h2>
          </a>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      games: [
        { id: 1, name: "Пуля", time: "1 минута", type: "Bullet", icon: this.getIcon('bullet') },
        { id: 2, name: "Блиц", time: "5 минут", type: "Blitz", icon: this.getIcon('flash') },
        { id: 3, name: "Рапид", time: "15 минут", type: "Rapid", icon: this.getIcon('stopwatch') },
      ],
    };
  },
  mounted() {
    this.games = Array.from(document.querySelectorAll('.game-link')).map((gameLink, index) => ({
      id: index + 1,
      name: gameLink.querySelector('.game-name').textContent,
      time: gameLink.querySelector('.game-time').textContent,
      icon: gameLink.querySelector('.game-icon').style.backgroundImage.slice(5, -2),
    }));
  },
  methods: {
    getIcon(gameType) {
      const theme = this.$store.state.selectedTheme;
      return theme === 'dark' ? `/src/ico/${gameType}-dark.png` : `/src/ico/${gameType}-light.png`;
    },
  },
};
</script>

<style scoped>
.main-area {
  display: flex;
  margin-right: 7.5vw;
  height: 100%;
}

.content {
  background-color: var(--background-color); /* Используем переменную для светлого фона */
  border-radius: 2em;
  max-width: 90vw;
  width: -webkit-fill-available;
}

li {
  list-style-type: none;
  margin-bottom: 10px;
}

.scheduled span {
  display: block;
}

a {
  text-decoration: none;
  color: var(--text-color); /* Используем переменную для цвета текста */
  padding-inline-start: 2.7em;
  padding-inline-end: 0;
  line-height: 1.2;
  transition: all 150ms;
}

.game-link {
  position: relative;
  display: flex;
  padding: 10px;
  padding-right: 1em;
  border: 1px solid var(--border-color); /* Используем переменную для цвета границы */
  border-radius: 1em;
  background-color: var(--background-color); /* Используем переменную для фона кнопки */
  margin: 1vh;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.game-icon {
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 10px;
  display: inline-block;
}

.scheduled {
  display: flex;
  flex-direction: column;
  padding: 1em;
}

.game-name {
  align-self: center;
  margin: 0 auto 0 0;
  margin-left: 50px;
  font-size: 1.2em;
  color: var(--text-color); /* Используем переменную для цвета текста */
}

.game-time {
  font-weight: normal;
  color: var(--text-color-light); /* Используем переменную для светлого цвета текста */
}
</style>