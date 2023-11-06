<template>
  <button
    type="button"
    :disabled="disabled"
    class="button"
    :class="[
      { disabled: disabled },
      { primary: type === 'primary' },
      { secondary: type === 'secondary' },
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
<script>
export default {
  name: "CustomButton",
  props: ["disabled", "type"],
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit("click");
      }
    },
  },
};
</script>

<style lang="scss">
.button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 18px;
}
.primary {
  background: #3f86ff;
  border: 2px solid #3f86ff;
  color: #ffffff;
}
.secondary {
  background: #FFFFFF;
  color: #3f86ff;
  border: 2px solid #3f86ff;
}
.disabled {
  background: #FEFEFE;
  color: #ADADAD;
  border: 2px solid #CDCDCD;
}
</style>
