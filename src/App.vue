<template>
  <div class="app">

    <navbar></navbar>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  components: {
    Navbar
  },
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
