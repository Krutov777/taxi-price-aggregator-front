<template>
    <!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/">Home</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/about">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/categories">Categories</a>
              </li>
            </ul>
          </div>
        </div>
    </nav> -->
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" />   Aggregator-prices-taxi
          </router-link>
        </li>
        <li v-if="showAdminBoard" class="nav-item">
          <router-link to="/admin" class="nav-link">Admin Board</router-link>
        </li>
        <li v-if="showModeratorBoard" class="nav-item">
          <router-link to="/mod" class="nav-link">Moderator Board</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="currentUser" to="/user" class="nav-link">User</router-link>
        </li>
      </div>

      <div v-if="!currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Регистрация
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Авторизация
          </router-link>
        </li>
      </div>

      <div v-if="currentUser" class="navbar-nav ml-auto">
        <li class="nav-item">
          <router-link to="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{ currentUser.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" href @click.prevent="logOut">
            <font-awesome-icon icon="sign-out-alt" /> Выход
          </a>
        </li>
      </div>
    </nav>
  </template>
  
  <script>
  import EventBus from "@/common/EventBus";
  
  export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_ADMIN');
      }

      return false;
    },
    showModeratorBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes('ROLE_MODERATOR');
      }

      return false;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeDestroy() {
    EventBus.remove("logout");
  }
};
  </script>
  
  <style>
  .navbar {
    height: 50px;
    box-shadow: 2px 2px 4px gray;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }
  </style>