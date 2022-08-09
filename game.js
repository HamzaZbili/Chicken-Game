const startButton = document.getElementById(`start`)
const restartButton = document.getElementById(`restart`)

const startScreen = document.getElementById('startPage')
const gameScreen = document.getElementById(`gameScreen`)
const scoreScreen = document.getElementById(`scoreScreen`)

let clock = document.querySelector(`.clock`)
const levelCount = document.querySelector(`h2`)

// function setTimer() {
  
//   time = setInterval(function () {
//     time ++;
//   }, 400)}

// setTimer()

let timeLeft = 15;
let timerId;
function startTime () {
if (timerId) {
  clearTimeout(timerId);
}

  timerId = setInterval(countdown, 1000);

}
function countdown() {
  if (timeLeft === -1) {
    clearTimeout(timerId);
  } else {
    clock.textContent = 'HATCHING IN ' + timeLeft + '!';
    timeLeft--;
}
}


const levelOneArray = [
0,1,2,3,4,5,6,7,8,9,10,
19,20,21,22,23,24,25,26,
27,29,30,37,39,40,42,43,
44,45,47,49,50,52,53,54,
55,57,59,60,62,63,64,65,
67,69,70,72,77,79,80,82,
83,84,85,89,90,91,92,93,
94,95,96,97,98,99]
const levelTwoArray = [
10,11,12,13,14,15,16,17,18]
const levelThreeArray = [10,11,12,13,14,15,16,17,18]
const levelFourArray = [10,11,12,13,14,15,16,17,18]
const levelFiveArray = [10,11,12,13,14,15,16,17,18]
const levelSixArray = [10,11,12,13,14,15,16,17,18]
const arrayOfLevels = [levelOneArray, levelTwoArray, levelThreeArray,
  levelFourArray, levelFiveArray, levelSixArray]



const game = {
  isStarted: false,
  isGameOver: false,
  level: 1,

  startGame(){
    moveToGameScreen()
    player.show()
    egg.show()
    game.isStarted = true
  },
  displayWalls(){
    const currentLevel = arrayOfLevels.at(this.level-1)
    for (let i = 0; i < currentLevel.length; i++){
      board.gridArray[currentLevel[i]].classList.add(`levelWalls`)
    }
  },
  clearBoard(){
    for (const cell of board.gridArray) {
      cell.classList.remove(`levelWalls`)
    }
  },
  levelUp(){
    levelCount.textContent = `Level ${game.level}`
  }
}

startButton.addEventListener('click', startTime)
startButton.addEventListener('click', game.startGame)
startButton.addEventListener('click', game.displayWalls)
startButton.addEventListener('click', spawnFox)
restartButton.addEventListener(`click`, restartGame)

function restartGame() {
  game.isStarted = false
  game.level = 1
  game.startGame()
  game.displayWalls()
}

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

let fox
const board = new GameBoard(10, 10);

class Fox {
  constructor() {
    this.className = 'fox'
    this.cell = spawnFoxBasedOnLevel(game.level)
    this.path = setFoxPath()
    this.show()
    this.patrol()
  }
  show(){
    this.cell.classList.add(this.className)
  }
  hide(){
    this.cell.classList.remove(this.className)
  }
  patrol(){
    setInterval(() => this.move(), 500);
    setInterval(() => this.eatChicken(), 500);
  }
  move() {
    this.hide()
  }
  eatChicken(){
    this.show()
  }
}

function spawnFox(){
  if (fox) {
    fox.cell.classList.toggle('fox')
  }
  fox = new Fox
}

function setFoxPath (){ 
  const path = []
  switch (game.level) {
    case 1:
      path.push(74,75,76)
      break;
  }
  return path
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
    if (this.detectWallCollision(this.cell)){
      this.cell = board.gridArray[currentIndex]
    }
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
      nextLevel()
      this.respawn()
    }
  },
  detectWallCollision(cell){
    if (cell.classList.contains(`levelWalls`)){
      return true
    }
  },
  respawn(){
    this.hide()
    this.cell = spawnPlayerBasedOnLevel(game.level)
    this.show()
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
  }
}

function nextLevel(){
  egg.hide()
  game.level = game.level+1
  egg.cell = spawnEggBasedOnLevel(game.level)
  egg.show()
  game.clearBoard()
  game.displayWalls()
  game.levelUp()
  spawnFox()
  startTime()
  timeLeft = 15
}

function moveToGameScreen(){
  startScreen.classList.toggle(`hidden`)
  gameScreen.classList.toggle(`hidden`)
}

function moveToScoreScreen(){
  gameScreen.classList.toggle(`hidden`)
  scoreScreen.classList.toggle(`hidden`)
}

function returnToStartScreen(){
  startScreen.classList.toggle(`hidden`)
  scoreScreen.classList.toggle(`hidden`)
}

function spawnPlayerBasedOnLevel(level){
  switch (level) {
    case 1:
      return board.gridArray[81]
      break;
    case 2:
      return board.gridArray[9]
      break;
    case 3:
    return board.gridArray[60]
    break;
    case 4:
      return board.gridArray[99]
  break;
    case 5:
        return board.gridArray[7]
    break;
    case 6:
        return board.gridArray[45]
    break;
  default:
    moveToScoreScreen();

  }
}

function spawnEggBasedOnLevel(level){
  switch (level) {
    case 1:
      return board.gridArray[11]
      break;
    case 2:
      return board.gridArray[75]
      break;
    case 3:
      return board.gridArray[4]
      break;
    case 4:
      return board.gridArray[85]
      break;
    case 5:
      return board.gridArray[39]
      break;
    case 6:
      return board.gridArray[21]
      break;
      default:
        moveToScoreScreen();
  }
}

function spawnFoxBasedOnLevel(level){
  switch (level) {
    case 1:
      return board.gridArray[73]
      break;
    case 2:
      return board.gridArray[23]
      break;
    case 3:
      return board.gridArray[40]
      break;
    case 4:
      return board.gridArray[0]
      break;
    case 5:
      return board.gridArray[99]
      break;
    case 6:
      return board.gridArray[21]
      break;
      default:
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





// class Wolf extends Fox {
//   constructor(){

//   }
// }

// class Worm {
//   constructor(points) {
//     this.points = points
//   }

// }

