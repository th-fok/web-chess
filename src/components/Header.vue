<template>
  <header class="header">
    <router-link to="/" style="display: flex; align-items: center; text-decoration: none; color: var(--text-color);">
      <img class="icon" :src="getIcon()" style="height: 50px; width: 50px;">
      <h1>Chess</h1>
    </router-link>
    <button class="avatar" @click="toggleAvatarBox">
      <div class="avatar-box" :class="{ logged: isLogged, show: showAvatarBox }">
        <router-link class="btn-logIn" to="/login">
          <span>Log In</span>
        </router-link>
        <template v-if="isLogged">
          <router-link class="btn-profile" to="/profile">
            <span>Profile</span>
          </router-link>
          <button class="btn-logOut" @click="logOut()"><span>Log Out</span></button>
        </template>
      </div>
    </button>
  </header>
</template>

<script>

export default {
  name: 'Header',
  data() {
    return {
      isLogged: false,
      showAvatarBox: false,
    };
  },
  watch: {
    '$store.state.selectedTheme': function(newTheme) {
      console.log('Theme changed to:', newTheme);
    }
  },
  methods: {
    logOut() {
      this.isLogged = false;
    },
    toggleAvatarBox() {
      this.showAvatarBox = !this.showAvatarBox;
    },
    getIcon() {
      const theme = this.$store.state.selectedTheme;
      return theme === 'dark' ? `/src/ico/Header-Icon-dark.png` : `/src/ico/Header-Icon-light.png`;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 10vh;
  padding: 10px;
  padding-left: 20px;
  background-color: var(--background-color); /* Используем переменную для фона */
  color: var(--text-color); /* Используем переменную для цвета текста */
}

.icon {
  margin-right: 10px;
}

.avatar {
  position: relative;
  border-radius: 20px;
  margin-left: auto;
  width: 40px;
  height: 40px;
}

.avatar-box {
  display: none;
  width: fit-content;
  position: absolute;
  top: 105%;
  right: -20%;
  background-color: var(--background-color-dark); /* Используем переменную для фона */
  z-index: 1;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--border-color); /* Используем переменную для цвета границы */
}

.avatar:hover, .avatar:focus {
  .avatar-box {
    display: flex;
  }
}

.avatar-box:hover {
  display: flex;
  justify-content: space-between;
}

.avatar-box.logged {
  display: none;
}

.avatar-box.logged .btn-profile, .avatar-box.logged .btn-logOut {
  display: block;
}

.btn-profile, .btn-logOut, .btn-logIn {
  cursor: pointer;
  min-width: max-content;
  width: 180px;
  padding: 8px 4px;
  margin: 5% 0;
  border-radius: 3vmax;
  color: var(--text-color); /* Используем переменную для цвета текста кнопок */
  span {
    background-color: transparent;
  }
}

.btn-profile:hover, .btn-logOut:hover, .btn-logIn:hover {
  background-color: var(--background-color-light)
}
</style>