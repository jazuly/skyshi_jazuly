import { createStore } from "vuex";
import { config } from "vuex-module-decorators";
import ActivityModule from "./modules/ActivityModule";
import ToDoModule from "./modules/ToDoModule";

config.rawError = true;

const store = createStore({
  modules: {
    ActivityModule,
    ToDoModule
  },
});

export default store;
