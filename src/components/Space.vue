<template>
    <div id="space" ref="space">
      <div id="stars"></div>
        <span :key="word.value" :style="word.style" class="word" v-for="word in store.wordsOnScreen">{{ word.value }}</span>
    </div>
</template>
<script>
const ENTER = 13;
const SPEED = 0.5;
const FONT_SIZE = 18;
export default {
  name: 'Space',
  components: {},
  props: {},
  data(){
    return {
      store: window.store,
      wordAddingIntervalHandle: null,
      animations: {
          movingWords: false
      }
    }
  },
    mounted(){
        this.$nextTick(() => {
            this.addDocumentEventHandler();
            window.EventBus.listen('game.play', this.play);
        });
      },
    beforeDestroy(){
        clearInterval(this.wordAddingIntervalHandle);
        window.EventBus.stop('game.play');
        this.removeDocumentEventHandler();
        this.store.wordsOnScreen = [];
        this.animations.movingWords = false;
    },
  methods: {
    addDocumentEventHandler(){
        document.addEventListener("keydown", this.handleKey);
    },
    removeDocumentEventHandler(){
      document.removeEventListener("keydown", this.handleKey);
    },
    play(){
        this.wordAddingIntervalHandle = setInterval(()=> {
            this.addWords(1)
        }, 2000);
        setTimeout(() => {
            this.animations.movingWords = true;
            this.animateWords();
        }, 2100);
    },
    handleKey(event){
      if (event.which === ENTER){
            if(this.store.wordTyped==="")return;
            if ( this.store.wordsOnScreen.find( word => word.value === this.store.wordTyped ) ){
                window.EventBus.fire('scored', this.store.wordTyped);
                this.removeWord(this.store.wordTyped);
                if(this.store.dictionary.words.length === 0 && this.store.wordsOnScreen.length === 0){
                    window.EventBus.fire('game.won');
                } else {
                    this.addWords(1);
                }
            } else {
                window.EventBus.fire('mistyped', this.store.wordTyped);
            }
            this.store.wordTyped = "";
        } else {
            if (
                (event.which >= 65 && event.which <= 90) // Uppercase A-Z
                || (event.which >= 97 && event.which <= 122) // Lowercase a-z
                || (event.which >= 48 && event.which <= 57) // 0-9
                || (event.which == 32) // SPACE
            ){
                this.store.wordTyped += event.key;
            } else if (event.which === 8) {
                this.store.wordTyped = this.store.wordTyped.substr(0, this.store.wordTyped.length - 1);
            }
        }
    },
    addWords(numberOfWords){
        let _words = this.store.dictionary.words.slice(0, numberOfWords);
        this.store.dictionary.words.splice(0, numberOfWords);
        _words.forEach((word) => {
            let top = Math.floor(Math.random() * Math.floor(this.$refs['space'].offsetHeight-FONT_SIZE));
            let left = word.length * (FONT_SIZE/2);
            this.store.wordsOnScreen.push({
              value: word,
              style: {
                left:`-${left}px`,
                offsetLeft:-left,
                top: `${top}px`,
                color: `greenyellow`
              }
            });
        });
    },
    removeWord(word){
      this.store.wordsOnScreen = this.store.wordsOnScreen.filter( wordItem => wordItem.value !== word );
    },
    animateWords(){
        const spaceOffsetWidth = this.$refs['space'].offsetWidth;
        let animationHandle = requestAnimationFrame(() => {
            this.store.wordsOnScreen.forEach((word) => {
                let value = word.style.offsetLeft + this.speed;
                word.style.offsetLeft = value;
                word.style.left = `${value}px`;
                if(word.style.offsetLeft > spaceOffsetWidth){
                    window.EventBus.fire('missed', word.value);
                    this.removeWord(word.value);
                } else if(word.style.offsetLeft > (spaceOffsetWidth - (FONT_SIZE * word.value.length))) {
                    word.style.color = "#D14";
                }
            });
            if(this.animations.movingWords){
                this.animateWords();
            } else {
                cancelAnimationFrame(animationHandle);
            }
        });
    }
  },
  computed: {
    speed(){
      return (SPEED + ( 1 * (this.store.statistics.scored.length/100) ));
    }
  }
}
</script>
<style scoped>
#space{
    min-height: 92vh;
    color: #ffffff;
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    overflow: hidden;
}
.word{
    position: absolute;
    display: block;
    color: greenyellow;
    font-weight: bold;
}
</style>
