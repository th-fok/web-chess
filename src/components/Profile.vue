<template>
      <div class="main-area">
        <div class="profile-container">
          <div class="profile-content">
            <div class="user-header">
              <img :src="avatar" alt="Avatar" class="avatar" />
              <div class="user-info">
                <h1>{{ username }}</h1>
                <p class="user-title">{{ userTitle }}</p>
                <div class="user-stats">
                  <div class="stat">
                    <span class="stat-value">{{ rating }}</span>
                    <span class="stat-label">Рейтинг</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ gamesPlayed }}</span>
                    <span class="stat-label">Игры</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ wins }}</span>
                    <span class="stat-label">Победы</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div class="game-history">
                <h2 class="games-title">История игр:</h2>
                <div class="games">
                  <a v-for="(game, index) in gameHistory" :key="index" href="#" class="game-link">
                    <div class="game-icon" :style="{ backgroundImage: 'url(' + game.icon + ')' }"></div>
                    <h2 class="game-name">{{ game.name }}
                      <span class="game-time">{{ game.time }}</span>
                    </h2>
                  </a>
                </div>
            </div>
        </div>
      </div>
  </template>
  
  <script>
  
  export default {
    data() {
      return {
        username: 'Ваше имя',
        userTitle: 'Звание игрока',
        avatar: '/src/ico/default-avatar.png',
        rating: 1200,
        gamesPlayed: 150,
        wins: 75,
        gameHistory: [
          { name: 'Игра 1', time: 'Выигрыш против Игрока A', icon: '/src/ico/game1.png' },
          { name: 'Игра 2', time: 'Поражение против Игрока B', icon: '/src/ico/game2.png' },
          { name: 'Игра 3', time: 'Ничья против Игрока C', icon: '/src/ico/game3.png' },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .main-area {
    width: -webkit-fill-available;
    display: flex;
  }
  
  .profile-container {
    padding: 20px;
    flex-grow: 1;
  }
  
  .profile-content, .game-history {
    padding: 5%;
    margin-bottom: 5vh;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .user-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
    border: 2px solid #4CAF50; /* Обрамление для аватара */
  }
  
  .user-info {
    flex-grow: 1;
  }
  
  .user-title {
    font-size: 1.2em;
    color: #666;
  }
  
  .user-stats {
    display: flex;
    gap: 20px;
    margin: 10px 0;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-value {
    font-size: 1.5em;
    font-weight: bold;
    color: #4CAF50; /* Цвет для значений статистики */
  }
  
  .stat-label {
    font-size: 0.9em;
    color: #888;
  }
  
  .games-title {
    margin-top: 5vh; /* Отступ перед заголовком истории игр */
  }
  
  .games {
    margin-top: 20px;
  }
  
  .game-link {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    text-decoration: none;
    color: #333;
  }
  
  .game-icon {
    width: 50px;
    height: 50px;
    background-size: cover;
    margin-right: 10px;
  }
  
  .game-name {
    font-size: 1.1em;
    font-weight: bold;
  }
  
  .game-time {
    font-size: 0.9em;
    color: #888;
  }
  </style>