<template>
  <div class="center-title">
    <div>Mmmmm you probably want to checkout</div>
    <router-link class="cta" to="/decks/banana">this deck</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style>
.center-title {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 300px;
}
.cta {
  margin-top: 10px;
}
</style>
