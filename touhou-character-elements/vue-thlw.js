Vue.createApp({
  data() {
    return {
      characters: [],
      owned_character_names: new Set(),
      displayAllCharacters: false,
      showOnlyOwnedCharacters: false,
      displayNamesOnly: false,
      isModalVisible: false,
      isNotFiltered: true,
      weak_elements: {
        EA: false,
        FI: false,
        ME: false,
        MO: false,
        ST: false,
        SU: false,
        WA: false,
        WO: false
      }
    }
  },
  computed: {
    filtered_characters(){
      if(this.isNotFiltered) {
        if(this.displayAllCharacters) return this.sorted_characters
        return this.owned_characters
      }
      
      if(this.displayAllCharacters) return this.highlighted_characters
      return this.highlighted_owned_characters
    },
    highlighted_characters(){
      return this.sorted_characters.filter(character => character.isHighlighted)
    },
    highlighted_owned_characters(){
      return this.owned_characters.filter(character => character.isHighlighted)
    },
    owned_characters() {
      return this.sorted_characters.filter(character => character.owned)
    },
    sorted_characters(){
      return this.characters.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    }
  },
  methods: {
    highlight(raw_element) {
      let element = raw_element.substring(2,4)
      if(this.weak_elements[element]) return element
    },
    toggle_weak_element(key) {
      this.weak_elements[key] = !this.weak_elements[key]

      this.characters.forEach(character => {
        let isHighlighted = false
        character.elements.forEach(element => {
          if(this.weak_elements[element]) isHighlighted = true
        })
        character.isHighlighted = isHighlighted
      })

      if(Object.values(this.weak_elements).filter(e => e).length == 0) this.isNotFiltered = true
      else this.isNotFiltered = false
    },
    toggle_owned_character_names(name, index){
      this.characters[index].owned = !this.characters[index].owned

      if(this.owned_character_names.has(name)) this.owned_character_names.delete(name)
      else this.owned_character_names.add(name)
      
      this.save_owned_character_names()
    },
    save_owned_character_names(){
      const parsed = JSON.stringify([...this.owned_character_names])
      localStorage.setItem("owned_character_names", parsed)
    },
    show_modal() {
      this.isModalVisible = true;
    },
    close_modal() {
      this.isModalVisible = false;
    }
  },
  mounted() {
    fetch("https://kazahara.github.io/touhou-character-elements/character_elements.json")
      .then(response => response.json())
      .then(characters => {
        if(localStorage.getItem("owned_character_names")){
          try {
            this.owned_character_names = new Set(JSON.parse(localStorage.getItem("owned_character_names")))
          } catch (e) {
            localStorage.removeItem("owned_character_names")
          }
        }

        characters.forEach(character => {
          let isOwned = false
          if(this.owned_character_names.has(character.name)) isOwned = true
          character.owned = isOwned

          let elements = new Array(5)
          character.attacks.forEach(attack => elements.push(attack.boost))
          elements = new Set(elements.flat(2).filter(a => a).map(element => element.substring(2, 4)))
          character.elements = elements

          character.isHighlighted = false
        })

        if(this.owned_character_names.size == 0) this.isModalVisible = true

        this.characters = characters
      })
  }
}).mount("#app")