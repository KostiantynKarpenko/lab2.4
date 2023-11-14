import Vue from 'vue'
import Vuex from 'vuex'

import { initializeApp } from 'firebase/app'
import { 
  // getDoc, 
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

// function getDocFromDB(c, d){
//   return getDoc(doc(DB, c, d));
// }
function getCollectionFromDB(c){
  return getDocs(collection(DB, c));
}
  
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    notes:[],
    categories:[]
  },
  getters: {
    getNotes(state){
      return state.notes;
    },
    getCategories(state){
      return state.categories;
    }
  },
  actions: {
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
    },
    addNote(context, note){
      context.state.notes.push(note);
      return setDoc(doc(DB, 'Notes', note.id), note)
    },
    updateNote(context, note){
      return setDoc(doc(DB, 'Notes', note.id), note)
    },
    setCategory(context, data) {
      const index = context.state.notes.findIndex(note => note.id == data.note.id);
      if (index != -1) {
        context.state.notes[index].category = data.category;
        console.log('category has changed to ' + data.category);
        return setDoc(doc(DB, 'Notes', data.note.id), data.note)
      }
    },
    removeNote(context, id) {
      deleteDoc(doc(DB, 'Notes', id));
    }
  }
})
