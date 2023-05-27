import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ResetPassword from "@/views/ResetPassword.vue";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: "/taxi-aggregator",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/register",
      component: Register,
    },
    {
      path: "/reset_password",
      component: ResetPassword,
    },
    {
      path: "/profile",
      name: "profile",
      // lazy-loaded
      component: () => import("@/views/Profile.vue"),
    },
  ],
});
