Vue.createApp({
  data() {
    return {
      characters: [],
      ownedCharacterNames: new Set(),
      displayAllCharacters: false,
      showOnlyOwnedCharacters: false,
      displayNamesOnly: false,
      isModalVisible: false,
      isNotFiltered: true,
      weakElements: {
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
    filteredCharacters(){
      if(this.isNotFiltered) {
        if(this.displayAllCharacters) return this.sortedCharacters
        return this.ownedCharacters
      }
      
      if(this.displayAllCharacters) return this.highlightedCharacters
      return this.highlightedOwnedCharacters
    },
    highlightedCharacters(){
      return this.sortedCharacters.filter(character => character.isHighlighted)
    },
    highlightedOwnedCharacters(){
      return this.ownedCharacters.filter(character => character.isHighlighted)
    },
    ownedCharacters() {
      return this.sortedCharacters.filter(character => character.owned)
    },
    sortedCharacters(){
      return this.characters.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    }
  },
  methods: {
    highlight(rawElement) {
      let element = rawElement.substring(2,4)
      if(this.weakElements[element]) return element
    },
    toggleWeakElement(key) {
      this.weakElements[key] = !this.weakElements[key]

      this.characters.forEach(character => {
        let isHighlighted = false
        character.elements.forEach(element => {
          if(this.weakElements[element]) isHighlighted = true
        })
        character.isHighlighted = isHighlighted
      })

      if(Object.values(this.weakElements).filter(e => e).length == 0) this.isNotFiltered = true
      else this.isNotFiltered = false
    },
    toggleOwnedCharacterNames(name, index){
      let isOwned = this.characters[index].owned
      this.characters[index].owned = !isOwned

      if(isOwned) this.ownedCharacterNames.delete(name)
      else this.ownedCharacterNames.add(name)

      this.saveOwnedCharacterNames()
    },
    saveOwnedCharacterNames(){
      const parsed = JSON.stringify([...this.ownedCharacterNames])
      localStorage.setItem("ownedCharacterNames", parsed)
    },
    showModal() {
      this.isModalVisible = true
    },
    closeModal() {
      this.isModalVisible = false
    }
  },
  mounted() {
    fetch("https://kazahara.github.io/touhou-character-elements/character_elements.json")
      .then(response => response.json())
      .then(characters => {
        if(localStorage.getItem("ownedCharacterNames")){
          try {
            this.ownedCharacterNames = new Set(JSON.parse(localStorage.getItem("ownedCharacterNames")))
          } catch (e) {
            localStorage.removeItem("ownedCharacterNames")
          }
        }

        characters.forEach(character => {
          let isOwned = false
          if(this.ownedCharacterNames.has(character.name)) isOwned = true
          character.owned = isOwned

          let elements = new Array(5)
          character.attacks.forEach(attack => elements.push(attack.boost))
          elements = new Set(elements.flat(2).filter(a => a).map(element => element.substring(2, 4)))
          character.elements = elements

          character.isHighlighted = false
        })

        if(this.ownedCharacterNames.size == 0) this.isModalVisible = true

        this.characters = characters
      })
  }
}).mount("#app")