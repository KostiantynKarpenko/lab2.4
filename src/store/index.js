import Vue from 'vue'
import Vuex from 'vuex'

import { initializeApp } from 'firebase/app'
import {
  getDocs, 
  collection, 
  doc, 
  getFirestore,
  setDoc,
  deleteDoc
} from 'firebase/firestore'


const APP = initializeApp({
  apiKey: "AIzaSyA84XZnTV_AKDVJ-Y6eYnwR2XH-5RTYXtQ",
  authDomain: "lab4-13860.firebaseapp.com",
  projectId: "lab4-13860",
  storageBucket: "lab4-13860.appspot.com",
  messagingSenderId: "281723150723",
  appId: "1:281723150723:web:8cab763bd8698358cd56b6"
});

const DB = getFirestore(APP)

function getCollectionFromDB(c){
  return getDocs(collection(DB, c));
}
  
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes:[],
    categories:[],
    filteredNotes: []
  },
  getters: {
    getNotes(state){
      return state.notes;
    },
    getCategories(state){
      return state.categories;
    },
    filteredNotes: (state) => (selectedFilters) => {
        return state.notes.filter(note => {
          if (selectedFilters.length > 0){
            return selectedFilters.includes(String(note.category));
          }
         return state.notes;
       })
    },
  },
  actions: {
    addNote(context, note){
      context.state.notes.push(note);
      return setDoc(doc(DB, 'Notes', note.id), note)
    },
    updateNote(context, note){
      const noteIndex = context.state.notes.findIndex(el => { return el.id === note.id; })
      context.state.notes.splice(noteIndex, 1, note);
      setDoc(doc(DB, 'Notes', note.id), note);
    },
    deleteNote(context, note){
      const noteIndex = context.state.notes.findIndex(el => { return el.id === note.id; })
      context.state.notes.splice(noteIndex, 1);
      deleteDoc(doc(DB, 'Notes', note.id));
    },
    fetchNotes(context) {
      getCollectionFromDB('Notes')
        .then(response => {
          context.state.notes = [];
          response.forEach(document => {
            context.state.notes.push(document.data());
        })
      });
    },
    fetchCategories(context) {
      getCollectionFromDB('Categories')
        .then(response => {
          context.state.categories = [];
          response.forEach(document => {
            context.state.categories.push(document.data());
        })
      });
    }
  }
})
