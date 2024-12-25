<template>
  <label class="switch">
    <input
      type="checkbox"
      :checked="checked"
      @change="$emit('update:checked', $event.target.checked)"
    />
    <span class="slider"></span>
    <span class="label">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "Switch",
  props: {
    label: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>

<style scoped>
.switch {
  width: fit-content;
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="checkbox"] {
  display: none; /* Скрыть стандартный чекбокс */
}

.slider {
  position: relative;
  width: 60px;
  height: 34px;
  background-color: var(--switch-background-off); /* Используем переменную для фона */
  border: 1px solid var(--border-color);
  border-radius: 34px;
  transition: background-color 0.4s;
  margin-right: 10px; /* Отступ между переключателем и текстом */
}

.slider:before {
  content: "";
  position: absolute;
  width: 26px;
  height: 26px;
  left: 4px;
  bottom: 4px;
  background-color: var(--switch-slider-off); /* Цвет ползунка при выключении */
  border-radius: 50%;
  transition: background-color 0.4s, transform 0.4s;
}

input[type="checkbox"]:checked + .slider {
  background-color: var(--switch-background-on); /* Фон переключателя при включении */
}

input[type="checkbox"]:checked + .slider:before {
  background-color: var(--switch-slider-on); /* Цвет ползунка при включении */
  transform: translateX(26px); /* Перемещение ползунка при включении */
}

.label {
  font-size: 14px; /* Размер шрифта для текста метки */
  color: var(--text-color); /* Цвет текста метки */
}
</style>