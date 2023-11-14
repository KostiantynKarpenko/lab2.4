<template>
  <div id="app">
    <div class="filtering">
        <div class="filter-by-category">
          <a>Filter by category:</a>
          <div class="drop-list">
            <ul class="filters-list">
              <li class="filters-item" v-for="(category, index) in categories" :key="index">
                <input type="checkbox" :id="'fc' + category.id" @input="filterTrigger({id: category.id, name: category.name})">
                <label :for="'fc' + category.id">{{ category.name }}</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    <div class="area" @mousedown="mousedown" @mousemove="mousemove" @mouseup="mouseup">
      <NoteBox v-for="(note, index) in filteredNotes" :key="index" :note-index="index" :noteIndex="index" :style="'left: ' + note.coords.x + 'px; top: ' + note.coords.y + 'px;'"/>
    </div>
    <div class="actions">
      <button class="btn" @click=addNote()>Add note</button>
    </div>
  </div>
</template>

<script>

import NoteBox from './components/NoteBox.vue'

export default{
  data(){
    return {
      startCoords: {
        x: 0,
        y: 0
      },
      currentCoords: {
        x: 0,
        y: 0
      },
      currentNoteIndex: null,
      action: false,
      selectedFilters: []
    }
  },
  components:{
    NoteBox
  },
  computed:{
    notes() {
      return this.$store.getters['getNotes']
    },
    categories(){
      return this.$store.getters['getCategories']
    },
    filteredNotes() {
      return (this.selectedFilters.length)
        ? this.notes.filter(note => {
          return ~this.selectedFilters.indexOf(note.category.toLowerCase());
        })
        : this.notes;
      }
  },
  methods:{
    addNote() {
      this.$store.dispatch('addNote', {
        coords: {
          x: 0,
          y: 0
        },
        text: '',
        id: Date.now().toString(),
        category: "0001"
      })
    },
    mousedown(event){
      if (event.target.classList.contains('move-trigger')){
        this.action = true;
        this.currentNoteIndex = event.target.parentNode.getAttribute('note-index')
        this.startCoords.x = event.pageX;
        this.startCoords.y = event.pageY;
      }
    },
    mouseup(){
      if (this.action) {
        this.action = false;
        this.notes[this.currentNoteIndex].coords.x = this.currentCoords.x
        this.notes[this.currentNoteIndex].coords.y = this.currentCoords.y
        this.$store.dispatch('updateNote', this.notes[this.currentNoteIndex])
      }
    },
    mousemove(event){
      if (this.action){
        this.currentCoords.x = this.notes[this.currentNoteIndex].coords.x + (event.pageX - this.startCoords.x)
        this.currentCoords.y = this.notes[this.currentNoteIndex].coords.y + (event.pageY - this.startCoords.y)

        if (this.currentCoords.x <= 0) this.currentCoords.x = 0;
        if (this.currentCoords.y <= 0) this.currentCoords.y = 0;
        
        document.querySelector('.note[note-index="' + this.currentNoteIndex + '"]').style.left = this.currentCoords.x + 'px';
        document.querySelector('.note[note-index="' + this.currentNoteIndex + '"]').style.top = this.currentCoords.y  + 'px';
      }
    },
    filterTrigger(category){
      let elIndex = this.selectedFilters.indexOf(category.id);

      if (elIndex != (-1)) {
        this.selectedFilters.splice(elIndex, 1);
        document.querySelector('#fc' + category.id).checked = false;
      } else {
        this.selectedFilters.push(category.id)
      }
    }
  },
  created(){
    this.$store.dispatch('fetchCategories');
    this.$store.dispatch('fetchNotes');
  }
}
</script>


<style lang="less">
  @import './assets/less/index.less';
</style>
