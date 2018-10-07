<template>
  <div class="spinner"></div>
</template>

<script>
export default {
  name: 'Loader'
}
</script>
<style scoped>

.spinner {
  width: 40px;
  height: 40px;

  background-color: #333;
  border-radius: 100%;

  animation: sk-scaleout 1.0s infinite ease-in-out;

  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
}

@-webkit-keyframes sk-scaleout {
  0% { -webkit-transform: scale(0) }
  100% {
    -webkit-transform: scale(1.0);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
  } 100% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
    opacity: 0;
  }
}
</style>
