import { createStore } from 'vuex';

const store = createStore({
  state: {
    selectedTheme: 'light', // или 'dark'
    visuallyImpairedMode: false, // состояние для режима слабовидящих
  },
  mutations: {
    setSettings(state, settings) {
      state.selectedTheme = settings.selectedTheme || state.selectedTheme;
      state.visuallyImpairedMode = settings.visuallyImpairedMode || state.visuallyImpairedMode;
    },
    toggleVisuallyImpairedMode(state) {
      state.visuallyImpairedMode = !state.visuallyImpairedMode; // Переключение состояния
    },
  },
});

export default store;