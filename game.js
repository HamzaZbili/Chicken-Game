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

  const levelOneBoard = new GameBoard(10, 10);



// const levelCheck = {
//   lvl1 : true,
//   lvl2 : false,
//   lvl3 : false,
//   lvl4 : false,
//   lvl5 : false,
// }


const player = {
  className: `player`,
  level: 1,
  lives: 3,
  // position: 
  beginLevel(){
    const startPosition = spawnPlayerBasedOnLevel(this.level)
    startPosition.classList.add(this.className)
  }
  // show(){

  // }
  // hide(){

  // }
  // move(){

  // }
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
  player.beginLevel()
}

function spawnPlayerBasedOnLevel(level){
  switch (level) {
    case 1:
      return levelOneBoard.gridArray[90]
      break;
    case 2:
      return levelOneBoard.gridArray[9]
      break;
      default:
        break;
  }
}



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

