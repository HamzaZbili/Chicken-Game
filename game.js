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



// const levelCheck = {
//   lvl1 : true,
//   lvl2 : false,
//   lvl3 : false,
//   lvl4 : false,
//   lvl5 : false,
// }

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
  }
  // moveDirection(){

  // }
  
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

