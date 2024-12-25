<template>
  <body>
    <div class="login-container">
      <h1>Вход в систему</h1>
      <div class="progress-bar">
        <div :style="{ width: progress + '%' }" class="progress"></div>
      </div>
      <form novalidate @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">Имя пользователя</label>
          <input type="text" id="username" v-model="username" @blur="updateProgress" required />
          <span v-if="errors.username" class="error">{{ errors.username }}</span>
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input type="password" id="password" v-model="password" @blur ="updateProgress" required />
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>
        <button type="submit" class="btn">Войти</button>
        <p class="signup-link">
          У вас нет аккаунта? <router-link to="/signup">Зарегистрироваться</router-link>
        </p>
      </form>
      <div v-if="submitted" class="success-message">
        <p>Вы успешно вошли в систему, {{ username }}!</p>
      </div>
    </div>
  </body>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      progress: 0,
      submitted: false,
      errors: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    updateProgress() {
      const filledFields = [
        this.validateName() ? this.username : '',
        this.validatePassword() ? this.password: '',
      ].filter(Boolean).length;
      this.progress = (filledFields / 2) * 100;
      this.validate(filledFields);
    },
    validateName() {
      if (this.username.length === 0) {
        this.errors.username = '';
        return true;
      }
      // Валидация имени пользователя
      if (this.username.length < 3 || this.username.length > 15) {
        this.errors.username = 'Имя пользователя должно содержать минимум 3 символа.';
        return false;
      }
      this.errors.username = '';
      return true;
    },
    validatePassword() {
      if (this.password.length === 0) {
        this.errors.password = '';
        return true;
      }
      // Валидация пароля
      if (this.password.length < 6) {
        this.errors.password = 'Пароль должен содержать минимум 6 символов.';
        return false;
      }
      this.errors.password = '';
      return true;
    },
    validate(filledFields) {
      let isValid = true;
      this.errors = {
        username: '',
        email: '',
        password: '',
      };

      isValid = this.validatePassword(filledFields) + this.validateName(filledFields);  

      return isValid;
    },
    handleSubmit() {
      if (this.validate()) {
        this.submitted = true;
        console.log('Вход с именем пользователя:', this.username);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 calc(50% - 400px);
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: var(--background-color); /* Используем переменную для фона */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in;
}

h1 {
  text-align: center;
}

.progress-bar {
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  height: 10px;
  margin-bottom: 20px;
}

.progress {
  background-color: var(--button-background); /* Используем переменную для цвета прогресса */
  height: 100%;
  transition: width 0.3s ease;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: -webkit-fill-available;
  padding: 10px;
  border: 1px solid var(--border-color); /* Используем переменную для цвета границы */
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--focus-color); /* Используем переменную для цвета фокуса */
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: var(--button-background); /* Используем переменную для фона кнопки */
  color: var(--button-text-color); /* Используем переменную для цвета текста кнопки */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: var(--button-background-hover); /* Используем переменную для цвета фона кнопки при наведении */
}

.signup-link {
  text-align: center;
  margin-top: 10px;
}

.success-message {
  margin-top: 20px;
  text-align: center;
  color: green;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>