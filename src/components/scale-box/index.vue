<template>
  <section
    class="screen-box"
    :style="{
      width: props.width + 'px',
      height: props.height + 'px',
      transform: transform,
    }"
  >
    <slot></slot>
  </section>
</template>
<script setup>
import { ref, onMounted } from "vue";

const transform = ref("scale(1, 1)");

const props = defineProps({
  width: {
    type: Number,
    default: 1920,
  },
  height: {
    type: Number,
    default: 1080,
  },
});

const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};

const init = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  transform.value =
    "scale(" + width / props.width + "," + height / props.height + ")";
};

onMounted(() => {
  init();
  window.addEventListener("resize", debounce(init, 500));
});
</script>

<style lang="less">
.screen-box {
  position: absolute;
  overflow: hidden;
  transform-origin: 0 0;
  -moz-transform-origin: 0 0;
  -webkit-transform-origin: 0 0;
  -o-transform-origin: 0 0;
}
</style>
