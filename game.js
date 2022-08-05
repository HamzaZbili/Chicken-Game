const grid = document.getElementById(`grid`)

class Player {
    // The constructor is the method triggered with the `new` keyword
    constructor(name, color) {
      this.name = name;
      this.color = color;
      this.position = 0;
      this.cash = 1000;
    }
}