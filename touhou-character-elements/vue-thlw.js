Vue.createApp({
  data() {
    return {
      characters: [],
      owned_characters: [],
      display_all_characters: false,
      show_only_owned_characters: false,
      display_names_only: false,
      isModalVisible: false,
      EA: false,
      FI: false,
      ME: false,
      MO: false,
      ST: false,
      SU: false,
      WA: false,
      WO: false,
    }
  },
  computed: {
    filtered_characters(){
      if(this.display_all_characters) return this.sorted_characters
      else return this.filtered_owned_characters
    },
    filtered_owned_characters() {
      return this.sorted_characters.filter(character => character.owned)
    },
    sorted_characters(){
      return this.characters.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
    }
  },
  methods: {
    highlight(raw_elem) {
      let element = raw_elem.substring(2,4)
      if(this[element]) return element
    },
    toggle_weak_element(element) {
      this[element] = !this[element]
    },
    toggle_owned_characters(name, index){
      this.characters[index].owned = !this.characters[index].owned
      if(this.owned_characters.includes(name)) this.owned_characters.splice(this.owned_characters.indexOf(name), 1)
      else this.owned_characters.push(name)
      
      this.save_owned_characters()
    },
    save_owned_characters(){
      const parsed = JSON.stringify(this.owned_characters)
      localStorage.setItem("owned_characters", parsed)
    },
    show_modal() {
      this.isModalVisible = true;
    },
    close_modal() {
      this.isModalVisible = false;
    }
  },
  mounted() {
    // fetch("https://kazahara.github.io/touhou-character-elements/character_elements.json")
    fetch("http://localhost:8000/character_elements.json")
      .then(response => response.json())
      .then(characters => {
        if(localStorage.getItem("owned_characters")){
          try {
            this.owned_characters = JSON.parse(localStorage.getItem("owned_characters"))
          } catch (e) {
            localStorage.removeItem("owned_characters")
          }
        }

        characters.forEach(character => {
          let isOwned = false
          if(this.owned_characters.includes(character.name)) isOwned = true

          character.owned = isOwned
        })

        this.characters = characters
      })
  }
}).mount("#app")