import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import { NAME } from "./enums";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "index" */ "../components/Main.vue"),
  },
  {
    path: "/detail/:id",
    name: NAME.DETAIL,
    component: () =>
      import(/* webpackChunkName: "detail" */ "../components/Detail.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to) => {
    if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: "smooth",
            top: 120,
          });
        }, 50);
      });
    }
  },
});

export default router;
