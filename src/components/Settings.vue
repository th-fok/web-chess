<template>
  <div class="settings-container">
    <h1>Настройки</h1>
    <form @submit.prevent class="settings-form">
      <div class="form-group">
        <Switch
          ref="visuallyImpairedSwitch"
          id="Impaired"
          label="Режим для дальтоников"
          :checked="visuallyImpairedMode"
          @update:checked="updateVisuallyImpairedMode"
        />
      </div>
      <div class="form-group">
        <Switch
          ref="darkSwitch"
          id="Dark"
          label="Темная тема"
          :checked="selectedTheme === 'dark'"
          @update:checked="updateTheme"
        />
      </div>
    </form>
    <button @click="saveSettings" type="submit" class="save-button">Сохранить настройки</button>
  </div>
</template>

<script>
import Switch from './microComps/switch.vue';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    Switch,
  },
  computed: {
    ...mapState(['visuallyImpairedMode', 'selectedTheme']),
  },
  methods: {
    ...mapMutations(['setSettings', 'toggleVisuallyImpairedMode']),

    updateVisuallyImpairedMode(checked) {
      this.toggleVisuallyImpairedMode(); // Переключаем режим
      this.saveSettings();
    },

    updateTheme(checked) {
      const newTheme = checked ? 'dark' : 'light';
      this.setSettings({ selectedTheme: newTheme });
      this.saveSettings();
      this.applyTheme();
    },

    saveSettings() {
      const settings = {
        visuallyImpairedMode: this.visuallyImpairedMode,
        selectedTheme: this.selectedTheme,
      };
      this.setSettings(settings);
      localStorage.setItem('userSettings', JSON.stringify(settings));
    },
  },

  mounted() {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      this.setSettings(savedSettings);
    }
  },
};
</script>

<style scoped>
select {
  appearance: none;
}

.settings-container {
  display: flex;
  min-width: 320px;
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  padding: 5%;
  border: 1px solid var(--border-color);
  border-radius: 3vmin;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: var(--background-color-dark);
}
.settings-container h1{
  background-color: var(--background-color-dark);
}

.settings-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color-dark);
  border-radius: 3vw;
}

.form-group {
  padding: 3%;
  background-color: transparent;
  border-bottom: 1 solid var(--border-color-light);
}

.language-select {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 3vmin;
  font-size: 1em;
  background-color: var(--background-color);
  transition: border-color 0.3s;
}

.language-select:focus {
  border-color: var(--button-background);
  outline: none;
}

.save-button {
  padding: 10px;
  background-color: var(--button-background);
  color: var(--background-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
  max-width: 200px;
  margin: 20px auto;
}

.save-button:hover {  
  background-color: var(--button-background-hover);
}
</style>