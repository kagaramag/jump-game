import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    // GAME_SPEED: 0, // 0: initial(8s), 1:(4s) , 2:(500ms)
    // GAME_LEVEL: 2,
    gameConfig: {
      GAME_SPEED: 5,
      GAME_LEVEL: 1,
    },
  },
  getters: {
    getGameConfig: (state) => {
      return state.gameConfig;
    },
  },

  mutations: {
    SET_LEVEL(state, payload) {
      switch (payload) {
        case 1:
          state.gameConfig = {
            GAME_SPEED: 5,
            GAME_LEVEL: 1,
          };
          break;
        case 2:
          state.gameConfig = {
            GAME_SPEED: 10,
            GAME_LEVEL: 2,
          };
          break;
        case 3:
          state.gameConfig = {
            GAME_SPEED: 20,
            GAME_LEVEL: 3,
          };
          break;
        default:
          break;
      }
      // state.GAME_LEVEL = payload;
    },
  },

  actions: {
    updateGameLevel({ commit }, payload) {
      commit("SET_LEVEL", payload);
    },
  },
});

export default store;
