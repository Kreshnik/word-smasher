<template>
  <div class="score__board">
    <h1>Score Board</h1>
    <form @submit.prevent="save" v-if="showForm">
      <fieldset>
        <label class="inline-block">Name</label>
        <input type="text" v-model="name">
        <button type="submit" :disabled="name === ''" class="btn">Save</button>
      </fieldset>
    </form>
    <table class="table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Dictionary</th>
        <th>Scored</th>
        <th>Time</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(score, index) in scoreBoard" :key="index">
        <td>{{ score.name }}</td>
        <td>{{ score.dictionary.name }} <span class="yellow">{{ score.dictionary.numberOfWords }}</span></td>
        <td><span class="yellow">{{ score.scored }}</span></td>
        <td><span class="yellow">{{ score.time }}s</span></td>
      </tr>
      </tbody>
    </table>
    <div>
      <button class="btn btn-delete" @click="flush">Clear</button>
      <button class="btn" @click="play" v-if="!showForm">Play again</button>
    </div>
  </div>
</template>
<script>
  const _ = require('lodash');
  const storeJS = require('store');
  const operationsPlugin = require('store/plugins/operations');
  storeJS.addPlugin(operationsPlugin);

  export default {
  name: 'ScoreBoard',
  mounted(){
      this.$nextTick(() => {
        this.loadScores();
      });
  },
  data(){
    return {
      store: window.store,
      name: "",
      scoreBoard: null,
      showForm: true
    }
  },
  methods: {
    loadScores(){
      this.scoreBoard = _.orderBy(storeJS.get('scoreBoard'), ['scored', 'time'], ['desc', 'asc']);
    },
    save(){
        let score = {
          name: this.name,
          dictionary: {
            name: this.store.dictionary.name,
            numberOfWords: this.store.dictionary.numberOfWords
          },
          scored: this.store.statistics.scored.length,
          time: this.store.timer.elapsedTime
        };
      storeJS.push('scoreBoard', score);
        this.showForm = false;
        this.loadScores();
    },
    flush(){
      storeJS.remove('scoreBoard');
      this.scoreBoard = [];
    },
    play(){
      window.EventBus.fire('game.restart');
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/scss/style.scss';
  .score__board{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    height: 100vh;
  }
</style>
