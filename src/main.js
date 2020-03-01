import Vue from 'vue'
import Scene from './Scene.vue'

Vue.config.productionTip = false;

window.createStore = function(){
    return {
      statistics: {
        scored: [],
        missed: [],
        mistyped: []
      },
      configuration: {
        musicFile: "/music/background.mp3",
      },
      dictionary: {},
      timer: {
        startTime: 0.0,
        endTime: 0.0,
        elapsedTime: 0.0
      },
      game: {
        started: false,
        won: false,
        over: false
      },
      wordTyped: "",
      wordsOnScreen: []
    }
};

window.store = window.createStore();


window.EventBus = new class {
  constructor() {
    this.vue = new Vue();
  }

  listen(event, callback) {
    if (typeof callback === 'function') this.vue.$on(event, callback);
  }

  stop(event) {
    this.vue.$off(event);
  }

  fire(event, data) {
    this.vue.$emit(event, data);
  }
}();


new Vue({
  render: h => h(Scene),
}).$mount('#scene');