function separate_elements(text){
  if(!text) return ""

  let r = /\d \w+/g
  let a = [...text.match(r)]
  return a
}

Vue.createApp({
  data() {
    return {
      characters: [],
      EA: false,
      FI: false,
      ME: false,
      MO: false,
      ST: false,
      SU: false,
      WA: false,
      WO: false,
      name: "",
      spread_target: "Solo",
      spread_p0: "",
      spread_p1: "",
      spread_p2: "",
      spread_p3: "",
      focus_target: "Solo",
      focus_p0: "",
      focus_p1: "",
      focus_p2: "",
      focus_p3: "",
      SC1_target: "Solo",
      SC1_p0: "",
      SC1_p1: "",
      SC1_p2: "",
      SC1_p3: "",
      SC2_target: "Solo",
      SC2_p0: "",
      SC2_p1: "",
      SC2_p2: "",
      SC2_p3: "",
      LW_target: "Solo",
      LW_p0: "",
      LW_p1: "",
      LW_p2: "",
      LW_p3: "",
    }
  },
  methods: {
    add_character() {
      this.characters.push({
        "name": this.name,
        "attacks": [
          {
            "target": this.spread_target,
            "boost": [this.spread_p0, separate_elements(this.spread_p1), separate_elements(this.spread_p2), separate_elements(this.spread_p3)]
          },
          {
            "target": this.focus_target,
            "boost": [this.focus_p0, separate_elements(this.focus_p1), separate_elements(this.focus_p2), separate_elements(this.focus_p3)]
          },
          {
            "target": this.SC1_target,
            "boost": [this.SC1_p0, separate_elements(this.SC1_p1), separate_elements(this.SC1_p2), separate_elements(this.SC1_p3)]
          },
          {
            "target": this.SC2_target,
            "boost": [this.SC2_p0, separate_elements(this.SC2_p1), separate_elements(this.SC2_p2), separate_elements(this.SC2_p3)]
          },
          {
            "target": this.LW_target,
            "boost": [this.LW_p0, separate_elements(this.LW_p1), separate_elements(this.LW_p2), separate_elements(this.LW_p3)]
          }
        ],
      })
      this.reset()
    },
    highlight(raw_elem) {
      let element = raw_elem.substring(2,4)
      if(this[element]) return element
    },
    toggleWeakElement(element) {
      this[element] = !this[element]
    },
    reset(){
      this.name = ""
      this.spread_target = "Solo"
      this.spread_p0 = ""
      this.spread_p1 = ""
      this.spread_p2 = ""
      this.spread_p3 = ""
      this.focus_target = "Solo"
      this.focus_p0 = ""
      this.focus_p1 = ""
      this.focus_p2 = ""
      this.focus_p3 = ""
      this.SC1_target = "Solo"
      this.SC1_p0 = ""
      this.SC1_p1 = ""
      this.SC1_p2 = ""
      this.SC1_p3 = ""
      this.SC2_target = "Solo"
      this.SC2_p0 = ""
      this.SC2_p1 = ""
      this.SC2_p2 = ""
      this.SC2_p3 = ""
      this.LW_target = "Solo"
      this.LW_p0 = ""
      this.LW_p1 = ""
      this.LW_p2 = ""
      this.LW_p3 = ""
    },
    save(){
      let a = document.createElement("a")
      let file = new Blob([JSON.stringify(this.characters)], {type: "text/plain"})
      a.href = URL.createObjectURL(file)
      a.download = "character_elements.json"
      a.click()
    }
  },
  created() {
    fetch("https://kazahara.github.io/character_elements.json")
      .then(response => response.json())
      .then(characters => {
        this.characters = characters
      })
  }
}).mount("#app")