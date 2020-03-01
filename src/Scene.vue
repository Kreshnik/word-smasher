<template>
  <div id="scene">
    <Dictionaries ref="dictionaries" v-if="!store.game.started"/>
    <Space ref="space" v-if="isPlaying"/>
    <Stats ref="stats" v-if="isPlaying"/>
    <ScoreBoard ref="scoreBoard" v-if="store.game.over || store.game.won"/>
  </div>
</template>

<script>
import Space from './components/Space.vue'
import Stats from './components/Stats.vue'
import Dictionaries from './components/Dictionaries.vue'
import ScoreBoard from "./components/ScoreBoard.vue";
import {Howl} from 'howler';
export default {
  name: 'Scene',
  components: {
    Space,
    Stats,
    Dictionaries,
    ScoreBoard
  },
  data(){
    return {
      store: window.store
    }
  },
  mounted() {
    this.$nextTick(() => {
      const backgroundMusic = new Howl({
        src: [this.store.configuration.musicFile],
        loop: true,
        volume: 0.2
      });
      window.EventBus.listen('dictionary.loaded',() => {
        this.store.game.started = true;
        setTimeout(() => {
          backgroundMusic.play();
          window.EventBus.fire('game.play');
        } , 200);
      });
      window.EventBus.listen('game.over',() => {
        backgroundMusic.stop();
        this.store.game.over = true;
      });
      window.EventBus.listen('game.won',() => {
        backgroundMusic.stop();
        this.store.game.won = true;
      });
      window.EventBus.listen('game.restart',() => {
          this.restart();
      });
    });
  },
  methods: {
    restart(){
      this.store = window.createStore();
    }
  },
  computed: {
    isPlaying(){
      return this.store.game.started && !this.store.game.over && !this.store.game.won;
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/scss/style.scss';
#scene{
    display: flex;
    flex-flow: column;
    flex-wrap: wrap;
    min-height: 100vh;
    margin:0;
}
</style>
