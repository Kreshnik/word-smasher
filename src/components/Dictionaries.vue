<template>
  <div class="dictionaries">
    <div class="logo__container">
      <h1 class="logo">WordSmasher</h1>
    </div>
    <h1>Select the dictionary file you want to exercise (keys: tab, arrows)</h1>
    <h2>Press enter to play</h2>
    <ul>
      <li v-for="dictionary in dictionaries" :key="dictionary.name" class="dictionary">
        <span :class="{ 'selected': dictionary.selected }">
          <span v-if="dictionary.selected">[x]</span>
          <span v-if="!dictionary.selected">[ ]</span>
          {{ dictionary.name }} <span class="yellow">[{{ dictionary.numberOfWords }} words]</span>
        </span>
      </li>
    </ul>
    <h3 class="credits">
      WordSmasher version 1.0 by Wallfacer Kreshnik (https://github.com/Kreshnik/word-smasher)
    </h3>
  </div>
</template>
<script>
export default {
  name: 'Dictionaries',
  mounted(){
      this.$nextTick(() => {
        this.loadDictionaryList();
        this.addDocumentEventHandler();
      });
  },
  destroyed() {
    this.removeDocumentEventHandler();
  },
  data(){
    return {
      store: window.store,
      dictionaries:[]
    }
  },
  methods: {
    addDocumentEventHandler(){
      document.addEventListener("keydown", this.handleKey);
    },
    removeDocumentEventHandler(){
      document.removeEventListener("keydown", this.handleKey);
    },
    handleKey(event){
      switch(event.which){
        case 9:
          this.down();
        break;
        case 38:
          this.up();
          break;
        case 40:
          this.down();
          break;
        case 13:
          this.select();
          break;
      }
    },
    down(){
      for (const [index, dictionary] of this.dictionaries.entries()) {
        if(dictionary.selected && index < (this.dictionaries.length-1) ){
          dictionary.selected = false;
          this.dictionaries[index+1].selected = true;
          break;
        } else if(dictionary.selected && index === (this.dictionaries.length-1)) {
          dictionary.selected = false;
          this.dictionaries[0].selected = true;
          break;
        }
      }
    },
    up(){
      for (const [index, dictionary] of this.dictionaries.entries()) {
        if(dictionary.selected && index > 0){
          dictionary.selected = false;
          this.dictionaries[index-1].selected = true;
          break;
        } else if(dictionary.selected && index === 0) {
          dictionary.selected = false;
          this.dictionaries[(this.dictionaries.length-1)].selected = true;
          break;
        }
      }
    },
    select(){
      for (const [index] of this.dictionaries.entries()) {
        if(this.dictionaries[index].selected){
          this.loadDictionary(this.dictionaries[index]);
          break;
        }
      }
    },
    loadDictionaryList(){
      fetch('dictionaries.json').then((response) => response.json()).then((dictionaries) => {
        dictionaries[0].selected = true;
        this.dictionaries = dictionaries;
      });
    },
    loadDictionary(dictionary){
      fetch(`dictionaries/${dictionary.file}`).then((response) => response.json()).then((words) => {
        dictionary.words.push(...words);
        this.store.dictionary = dictionary;
        window.EventBus.fire('dictionary.loaded');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/assets/scss/variables.scss';
  .logo__container{
    text-align: center;
  }
  h1{
    text-align: center;
    background:white;
    color: black;
    &.logo{
      display: inline-block;
      padding: 10px;
    }
  }
  h2{
    text-align: center;
    background-color: $blue;
  }
  h3{
    &.credits{
      display: block;
      align-self: center;
      background-color: lightgray;
      color: black;
      padding: 0 10px;
      text-align: center;
      font-size: 14px;
      position: absolute;
      width: 100%;
      bottom: 0;
    }
  }
  .dictionaries{
    background-color: black;
    height: 100vh;
    ul{
      color: white;
      list-style: none;
      padding:0;
      li{
        > span{
          display: inline-block;
          &.selected{
            background-color: $blue;
          }
        }
      }
    }
}
</style>
