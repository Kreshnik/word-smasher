<template>
  <div class="stats">
    <div>
      <div class="text-left">
        Typed word:<span class="yellow">[{{ store.wordTyped }}]</span>
      </div>
      <div class="text-left">
        Traffic:<span class="yellow">[{{ store.wordsOnScreen.length }}/{{ store.dictionary.numberOfWords }}]</span>
      </div>
      <div class="text-left">
        Scored:<span class="yellow">[{{ store.statistics.scored.length }}]</span>
      </div>
    </div>
    <div>
      <div class="text-right warning">
        Missed:<span>[{{ store.statistics.missed.length }}]</span>
      </div>
      <div class="text-right warning">
        Mistyped:<span>[{{ store.statistics.mistyped.length }}]</span>
      </div>
      <div  class="text-right">
        Time elapsed:<time  class="yellow">{{ store.timer.elapsedTime }}s</time>
      </div>
    </div>
  </div>
</template>

<script>
import {Howl} from 'howler';
const successMusic = new Howl({
  src: ['sounds/coin.mp3'],
  volume: 0.2
});
const missedMusic = new Howl({
  src: ['sounds/explode.mp3'],
  volume: 0.2
});
const MAX_MISSED = 10;
export default {
  name: 'Stats',
  mounted(){
      this.$nextTick(() => {
        this.store.statistics.scored = [];
        this.store.statistics.mistyped = [];
        this.store.statistics.missed = [];
         window.EventBus.listen('scored', this.handleScored);
         window.EventBus.listen('missed', this.handleMissed);
         window.EventBus.listen('mistyped', this.handleMisTyped);
         window.EventBus.listen('game.play', this.starTimer);
         window.EventBus.listen('game.won', this.stopTimer);
      });
  },
  beforeDestroy() {
    window.EventBus.stop('scored');
    window.EventBus.stop('missed');
    window.EventBus.stop('mistyped');
  },
  data(){
    return {
      store: window.store,
      timerHandle: null
    }
  },
  methods: {
    handleScored(word){
      this.store.statistics.scored.push(word);
      successMusic.play();
    },
    handleMissed(word){
      this.store.statistics.missed.push(word);
      missedMusic.play();
      if(this.store.statistics.missed.length >= MAX_MISSED){
        window.EventBus.fire('game.over');
        this.stopTimer();
      }
    },
    handleMisTyped(word){
      this.store.statistics.mistyped.push(word);
    },
    starTimer(){
      this.store.timer.startTime = Date.now();
      this.timerHandle = setInterval(function() {
          let elapsedTime = Date.now() - this.store.timer.startTime;
          this.store.timer.elapsedTime = (elapsedTime/1000).toFixed(2);
      }, 100);
    },
    stopTimer(){
      clearInterval(this.timerHandle);
    }
  }
}
</script>

<style lang="scss" scoped>
.stats{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 8vh;
  padding: 5px;
  > div{
    flex-grow: 1;
    text-align:center;
    > div{
      padding: 0 5px;
      flex-grow: 1;
      text-align:center;
    }
  }
}
</style>
