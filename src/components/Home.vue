<template>
  <div class="home">
    <div class="center-title">
      <div>Mmmmm you probably want to checkout</div>
      <router-link class="cta" to="/decks/banana">this deck</router-link>
    </div>

    <md-button href="#/decks/new" class="md-fixed md-fab md-fab-bottom-right">
        <md-icon>add</md-icon>
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style>
.home {
  height: 100%;
  display: flex;
  position: relative;
}
.center-title {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 300px;
  height: 100%;
  margin: 0 auto;
}
.cta {
  margin-top: 10px;
}
.btn-add {
  position: absolute;
  bottom: 32px;
  right: 32px;
}
.icon--plus {
  width: 64px;
  height: 64px;
  opacity: .7;
}
</style>
