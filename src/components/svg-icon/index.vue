<template>
  <svg
    :class="['icon', $attrs.class, props.spin && 'svg-icon-spin']"
    :style="getStyle"
    @click="onClickIcon"
  >
    <use :href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 16,
  },
  spin: {
    type: Boolean,
    default: false,
  },
});

const symbolId = computed(() => `#icon-${props.type}`);

const getStyle = computed(() => {
  const { size } = props;
  let s = `${size}`;
  s = `${s.replace("px", "")}px`;
  return {
    width: s,
    height: s,
  };
});

const emits = defineEmits(["click"]);

const onClickIcon = () => {
  emits("click");
};
</script>

<style lang="less" scoped>
.icon {
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
.svg-icon-spin {
  animation: loadingCircle 1s infinite linear;
}
</style>
