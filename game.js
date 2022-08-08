const startButton = document.querySelector(`button`)

const startScreen = document.getElementById('startPage')
const gameScreen = document.getElementById(`gameScreen`)
const scoreScreen = document.getElementById(`scoreScreen`)

startButton.addEventListener('click', startGame)

class GameBoard {
    constructor(height, width) {
      this.height = height
      this.width = width
      this.gameScreen = gameScreen
      this.gridArray = []
      this.cells = this.buildGameBoard()
    }
  
    buildGameBoard () {
      //builds square gameboard based on width/height arguments
      for (let i = 0; i < this.height * this.width; i++) {
          const cell = document.createElement(`div`)
          cell.classList.add(`gridSquare`)
          cell.dataset.index = i
          this.gridArray.push(cell)
          this.gameScreen.append(cell)
      }
    }
  }

const board = new GameBoard(10, 10);

const game = {
  isStarted: false,
  level: 1,
}


const player = {
  className: `player`,
  lives: 3,
  cell: spawnPlayerBasedOnLevel(game.level),

  show(){
  this.cell.classList.add(this.className)
  },
  hide() {
    this.cell.classList.remove(this.className)
  },
  move(direction) {

    if (!this.canMove(direction)) {
      return
    }

    this.hide()
    const currentIndex = parseInt(this.cell.dataset.index)
    let newIndex

    switch (direction) {
      case 'up':
        newIndex = currentIndex - board.width
        break
      case 'down':
        newIndex = currentIndex + board.width
        break
      case 'right':
        newIndex = currentIndex + 1
        break
      case 'left':
        newIndex = currentIndex - 1
        break
    }
    this.cell = board.gridArray[newIndex]
    this.show()
    this.detectEggCollision()
  },
  canMove(direction) {
    const currentIndex = parseInt(this.cell.dataset.index)
    const column = currentIndex % board.width

    switch (direction) {
      case 'up':
        return currentIndex >= board.width
      case 'down':
        const boardSize = board.width * board.height
        return currentIndex < boardSize - board.width
      case 'right':
        return column < board.width -1
      case 'left':
        return column > 0
    }
  },
  detectEggCollision(){
    if (this.cell.dataset.index === egg.cell.dataset.index){
      console.log(`collected`)
      egg.collect()
    }
  }
  
}

const egg = {
  className: `egg`,
  cell: spawnEggBasedOnLevel(game.level),
  show(){
    this.cell.classList.add(this.className)
    },
  hide(){
    this.cell.classList.remove(this.className)
  },
  collect(){
    this.hide()
    game.level = game.level+1
    this.cell = spawnEggBasedOnLevel(game.level)
    this.show()
  }
}


function moveToGameScreen(){
  startScreen.classList.toggle(`hidden`)
  gameScreen.classList.toggle(`hidden`)
}

function moveToScoreAndNextLevel(){
  gameScreen.classList.toggle(`hidden`)
  scoreScreen.classList.toggle(`hidden`)
}

function returnToStartScreen(){
  startScreen.classList.toggle(`hidden`)
  scoreScreen.classList.toggle(`hidden`)
}

function startGame(){
  moveToGameScreen()
  player.show()
  egg.show()
  game.isStarted = true
}

function spawnPlayerBasedOnLevel(level){
  switch (level) {
    case 1:
      return board.gridArray[90]
      break;
    case 2:
      return board.gridArray[9]
      break;
      default:
        break;
  }
}

function spawnEggBasedOnLevel(level){
  switch (level) {
    case 1:
      return board.gridArray[0]
      break;
    case 2:
      return board.gridArray[75]
      break;
      default:
        break;
  }
}

document.addEventListener('keydown', (event) => {
  if (!game.isStarted) {
    return
  }

  switch (event.code) {
    case 'ArrowUp':
      player.move('up')
      break
    case 'ArrowDown':
      player.move('down')
      break
    case 'ArrowLeft':
      player.move('left')
      break
    case 'ArrowRight':
      player.move('right')
      break
  }
})

// class Fox {
//   constructor(path) {
//     this.path = path;

//   }
// }

// class Wolf extends Fox {
//   constructor(){

//   }
// }

// class Worm {
//   constructor(points) {
//     this.points = points
//   }

// }

