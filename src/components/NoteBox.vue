<template>
    <div class="note">
        <div class="move-trigger">
            <div class="remove" @click="removeNote(notes[noteIndex].id)">🗑</div>
            <select v-model="category">
                <option v-for="(category,index) in categories" :key="index" :value="category.id">{{ category.name }}</option>
            </select>
        </div>
        <textarea placeholder="Enter your text" v-model="text"></textarea>
    </div>
</template>

<script>
export default {
    props: ['noteIndex'],
    data(){
        return{
            notes: '',
            text: '',
            category: ''
        }   
    },
    methods: {
        removeNote(id){
            this.$store.dispatch('removeNote', id);
            this.$store.dispatch('fetchNotes');
        }
    },
    watch: {
        text() {
            if(this.text){
                this.notes[this.noteIndex].text = this.text
                this.$store.dispatch('updateNote', this.notes[this.noteIndex]);
            }
        },
        category(){
            this.notes[this.noteIndex].category = this.category
            this.$store.dispatch('updateNote', this.notes[this.noteIndex]);
        }
    },
    created(){
        this.notes = this.$store.getters['getNotes'];
        this.categories = this.$store.getters['getCategories'];
        this.text = this.notes[this.noteIndex].text;
        this.category = this.notes[this.noteIndex].category;
    }
}
</script>
