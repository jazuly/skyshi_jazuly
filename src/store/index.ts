import { createStore } from "vuex";
import { config } from "vuex-module-decorators";
import ActivityModule from "./modules/ActivityModule";

config.rawError = true;

const store = createStore({
  modules: {
    ActivityModule
  },
});

export default store;
