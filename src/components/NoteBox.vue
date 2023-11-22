<template>
    <div class="note">
        <div class="move-trigger">
            <div class="remove" @click="deleteNote(note)">🗑</div>
            <select @change="updateNoteCategory">
                <option v-for="category in categories" 
                :key="category.id" 
                :value="category.id" 
                :selected="category.id === note.category"> {{ category.name }}</option>
            </select>
        </div>
        <textarea
        placeholder="Enter your text"
        :value="note.text"
        @input="updateNoteText"></textarea>
    </div>
</template>

<script>
export default {
    props: {
        note: {
            type: Object,
            required: true,
        },
    },
    methods: {
        deleteNote(data)
        {
            this.$store.dispatch("deleteNote", data);
        },
        updateNoteText(e){
            const updatableNote = {...this.note, text: e.target.value}
            this.$store.dispatch("updateNote", updatableNote)
        },
        updateNoteCategory(e){
            const updatableNote = {...this.note, category: e.target.value}
            this.$store.dispatch("updateNote", updatableNote)
        }
        
    },
    watch: {
        // text() {
        //     if(this.text){
        //         this.notes[this.noteIndex].text = this.text
        //         this.$store.dispatch('updateNote', this.notes[this.noteIndex]);
        //     }
        // },
        category(){
            this.notes[this.noteIndex].category = this.category;
            this.$store.dispatch('updateNote', this.notes[this.noteIndex]);
        }
    },
    mutations:{
        

    },
    computed: {
        categories() {
            return this.$store.state.categories;
        },
    },
    created(){
        this.notes = this.$store.getters['getNotes'];
        this.filteredNotes = this.$store.getters['filteredNotes'];
        this.category = this.note.category;
        this.id = this.note.id;
        
        // this.text = this.note.text;
    }
}
</script>
